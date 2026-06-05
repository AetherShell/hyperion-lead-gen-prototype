// Receives form submissions from the Hyperion landing page,
// stores them in the leads table, and forwards to Five9 web2campaign.

import { createClient } from "jsr:@supabase/supabase-js@2";

const F9_USERNAME = Deno.env.get("F9_USERNAME")!;
const F9_PASSWORD = Deno.env.get("F9_PASSWORD")!;
const F9_DOMAIN = Deno.env.get("F9_DOMAIN")!;
const F9_LIST = Deno.env.get("F9_LIST")!;
const F9_URL = "https://api.five9.com/web2campaign/AddToList?method=post";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby64Dj0LV5gPfVFWOFejUcWsYW4vWoG_ArH4JyfJSYnzyK-fL-_FHhr3rdJHpaoTf4/exec";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const FB_CONVERSION_URL = `${SUPABASE_URL}/functions/v1/fb-conversion`;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gift_card_variant?: string;
  referrer?: string;
  landing_path?: string;
  user_agent?: string;
  captured_at?: string;
}

interface LeadInput {
  name?: string;
  email?: string;
  phone?: string;
  zipCode?: string;
  time?: string;
  waterTest?: boolean | string;
  attribution?: Attribution;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callFive9WithRetry(params: URLSearchParams, auth: string): Promise<{ status: string; body: string }> {
  const delays = [100, 500, 2000];
  let lastBody = "";
  let lastStatus = "unknown";

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(delays[attempt - 1]);
    try {
      const resp = await fetch(F9_URL, {
        method: "POST",
        headers: {
          "Authorization": auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      lastBody = await resp.text();
      if (resp.ok) {
        return { status: "success", body: lastBody };
      }
      lastStatus = `error_${resp.status}`;
      // Retry only on 5xx and 429; bail on 4xx (except 429) since they'll keep failing
      if (resp.status < 500 && resp.status !== 429) {
        return { status: lastStatus, body: lastBody };
      }
    } catch (e) {
      lastStatus = "fetch_error";
      lastBody = String(e);
    }
  }
  return { status: lastStatus === "unknown" ? "retry_exhausted" : lastStatus, body: lastBody };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let lead: LeadInput;
  try {
    lead = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!lead.name || !lead.phone) {
    return json({ error: "name and phone are required" }, 400);
  }

  // AZ-only service area (ZIPs 85001–86556; 865xx is Navajo Nation AZ). Out-of-area
  // leads are stored for the "we'll let you know" list but skip the dialer/CAPI/Sheets fan-out.
  const zip = (lead.zipCode ?? "").trim();
  const outOfArea = /^\d{5}$/.test(zip) && !(Number(zip) >= 85001 && Number(zip) <= 86556);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const attr = lead.attribution ?? {};

  const { data: dbRow, error: dbError } = await supabase
    .from("leads")
    .insert({
      name: lead.name,
      email: lead.email ?? null,
      phone: lead.phone,
      zip_code: lead.zipCode ?? null,
      preferred_time: lead.time ?? null,
      water_test: lead.waterTest === true || lead.waterTest === "true",
      utm_source: attr.utm_source ?? null,
      utm_medium: attr.utm_medium ?? null,
      utm_campaign: attr.utm_campaign ?? null,
      utm_content: attr.utm_content ?? null,
      utm_term: attr.utm_term ?? null,
      gift_card_variant: attr.gift_card_variant ?? null,
      referrer: attr.referrer ?? null,
      user_agent: attr.user_agent ?? null,
      landing_path: attr.landing_path ?? null,
    })
    .select()
    .single();

  if (dbError) console.error("DB insert failed:", dbError);

  if (outOfArea) {
    if (dbRow) {
      await supabase
        .from("leads")
        .update({ five9_status: "skipped_out_of_area" })
        .eq("id", dbRow.id);
    }
    return json({ ok: false, reason: "out_of_area", id: dbRow?.id }, 422);
  }

  const params = new URLSearchParams();
  params.set("F9domain", F9_DOMAIN);
  params.set("F9list", F9_LIST);
  params.set("F9CallASAP", "on");
  params.set("first_name", lead.name);
  if (lead.email) params.set("email", lead.email);
  params.set("number1", lead.phone);
  if (lead.zipCode) params.set("zip", lead.zipCode);

  const noteParts: string[] = [];
  if (lead.time) noteParts.push(`Preferred time: ${lead.time}`);
  if (lead.waterTest) noteParts.push("Wants water test");
  if (attr.gift_card_variant) noteParts.push(`Variant: ${attr.gift_card_variant}`);
  if (attr.utm_campaign) noteParts.push(`Campaign: ${attr.utm_campaign}`);
  if (noteParts.length > 0) params.set("notes", noteParts.join("; "));

  const auth = "Basic " + btoa(`${F9_USERNAME}:${F9_PASSWORD}`);

  const f9 = await callFive9WithRetry(params, auth);

  if (dbRow) {
    await supabase
      .from("leads")
      .update({ five9_status: f9.status, five9_response: f9.body.slice(0, 1000) })
      .eq("id", dbRow.id);
  }

  // Fire-and-forget: notify CAPI edge function. Failure must not block the response.
  // Fires whenever we have a phone (email is optional); fb-conversion hashes whatever
  // identifiers are present and FB Graph matches on phone alone fine.
  if (dbRow && lead.phone) {
    fetch(FB_CONVERSION_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        leadId: dbRow.id,
        email: lead.email,
        phone: lead.phone,
        eventName: "Lead",
        eventSourceUrl: `https://bookmywatertest.com${attr.landing_path ?? "/"}`,
        gift_card_variant: attr.gift_card_variant,
        utm_source: attr.utm_source,
        utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign,
        utm_content: attr.utm_content,
        utm_term: attr.utm_term,
        client_user_agent: attr.user_agent,
      }),
    }).catch((e) => console.error("CAPI fan-out failed:", e));
  }

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      zipCode: lead.zipCode,
      time: lead.time,
      waterTest: lead.waterTest,
      attribution: attr,
    }),
  }).catch((e) => console.error("Apps Script notify failed:", e));

  // Lead capture is the primary goal. Return 200 if the DB row exists,
  // even when Five9 fails, so the form shows success and we don't lose the lead.
  return json(
    { ok: !!dbRow, id: dbRow?.id, f9Status: f9.status },
    dbRow ? 200 : 502,
  );
});
