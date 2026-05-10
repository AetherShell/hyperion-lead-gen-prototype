// Server-side Facebook Conversions API (CAPI) relay.
// Receives conversion events from lead-intake (and potentially other sources),
// hashes PII, posts to FB Graph, and records the response on the leads table.
//
// Wired but disabled by default: FB_CAPI_ENABLED must equal "true" to actually POST to Meta.
// While disabled, the full payload is logged so we can verify shape before launch.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FB_PIXEL_ID = Deno.env.get("FB_PIXEL_ID") ?? "";
const FB_CAPI_ACCESS_TOKEN = Deno.env.get("FB_CAPI_ACCESS_TOKEN") ?? "";
const FB_CAPI_ENABLED = Deno.env.get("FB_CAPI_ENABLED") === "true";
const FB_TEST_EVENT_CODE = Deno.env.get("FB_TEST_EVENT_CODE") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ConversionInput {
  leadId: string;
  email?: string;
  phone?: string;
  eventName?: "Lead" | "Subscribe" | "CompleteRegistration";
  eventSourceUrl?: string | null;
  gift_card_variant?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  client_user_agent?: string;
  client_ip_address?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

async function sha256Lower(input: string): Promise<string> {
  const normalized = input.trim().toLowerCase();
  const buf = new TextEncoder().encode(normalized);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(phone: string): string {
  // FB CAPI expects E.164-ish digits, no formatting, no leading +.
  return phone.replace(/\D/g, "");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let input: ConversionInput;
  try {
    input = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!input.leadId) {
    return json({ error: "leadId required" }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [await sha256Lower(input.email)];
  if (input.phone) userData.ph = [await sha256Lower(normalizePhone(input.phone))];
  if (input.client_user_agent) userData.client_user_agent = input.client_user_agent;
  if (input.client_ip_address) userData.client_ip_address = input.client_ip_address;
  // FB attribution fields (fbc/fbp) require browser cookies; we'd need to pass them through
  // from the client. Skipping for v1 since we lack the plumbing; CAPI still works without them
  // but match quality is lower. Worth a follow-up.

  const customData: Record<string, unknown> = {
    currency: "USD",
  };
  if (input.gift_card_variant) customData.gift_card_variant = input.gift_card_variant;
  if (input.utm_source) customData.utm_source = input.utm_source;
  if (input.utm_medium) customData.utm_medium = input.utm_medium;
  if (input.utm_campaign) customData.utm_campaign = input.utm_campaign;
  if (input.utm_content) customData.utm_content = input.utm_content;
  if (input.utm_term) customData.utm_term = input.utm_term;

  const event = {
    event_name: input.eventName ?? "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.leadId, // shared with browser Pixel for dedup
    event_source_url: input.eventSourceUrl ?? undefined,
    action_source: "website",
    user_data: userData,
    custom_data: customData,
  };

  const payload: Record<string, unknown> = { data: [event] };
  if (FB_TEST_EVENT_CODE) payload.test_event_code = FB_TEST_EVENT_CODE;

  let capiStatus = "disabled";
  let capiResponse = "";

  if (!FB_CAPI_ENABLED) {
    console.log("CAPI disabled; payload:", JSON.stringify(payload));
    capiStatus = "disabled";
    capiResponse = JSON.stringify({ note: "FB_CAPI_ENABLED is not 'true'; event logged only" });
  } else if (!FB_PIXEL_ID || !FB_CAPI_ACCESS_TOKEN) {
    capiStatus = "missing_config";
    capiResponse = JSON.stringify({ error: "FB_PIXEL_ID and/or FB_CAPI_ACCESS_TOKEN unset" });
  } else {
    try {
      const url = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${encodeURIComponent(FB_CAPI_ACCESS_TOKEN)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      capiResponse = await resp.text();
      capiStatus = resp.ok ? "success" : `error_${resp.status}`;
    } catch (e) {
      capiStatus = "fetch_error";
      capiResponse = String(e);
    }
  }

  const { error: updateError } = await supabase
    .from("leads")
    .update({
      fb_capi_status: capiStatus,
      fb_capi_response: capiResponse.slice(0, 1000),
    })
    .eq("id", input.leadId);

  if (updateError) console.error("CAPI status update failed:", updateError);

  return json({ ok: capiStatus === "success" || capiStatus === "disabled", capiStatus });
});
