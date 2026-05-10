import { useEffect } from "react";

const STORAGE_KEY = "hyperion_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Attribution = {
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
};

export function useUtmCapture(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    captureFromUrl();
  }, []);
}

export function captureFromUrl(): Attribution {
  const existing = readAttribution();
  const params = new URLSearchParams(window.location.search);

  const fresh: Attribution = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) fresh[key] = v;
  }
  const giftcard = params.get("giftcard");
  if (giftcard) fresh.gift_card_variant = giftcard;

  // First-touch wins: only overwrite if URL carries new UTM params.
  // Otherwise preserve whatever was captured on the first hit.
  const hasFreshUtms = UTM_KEYS.some((k) => fresh[k]);
  const merged: Attribution = hasFreshUtms
    ? {
        ...fresh,
        referrer: document.referrer || existing.referrer,
        landing_path: window.location.pathname + window.location.search,
        user_agent: navigator.userAgent,
        captured_at: new Date().toISOString(),
      }
    : {
        ...existing,
        gift_card_variant: fresh.gift_card_variant ?? existing.gift_card_variant,
      };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // sessionStorage can throw in private mode; fail silently
  }
  return merged;
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
