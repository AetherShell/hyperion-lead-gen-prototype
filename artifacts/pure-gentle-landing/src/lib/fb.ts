// Facebook Pixel browser-side helpers.
// Base script is injected in index.html; these helpers no-op when the pixel ID is unset
// (dev environments, or before FB credentials arrive).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    FB_PIXEL_ID?: string;
  }
}

function pixelEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.fbq !== "function") return false;
  const id = window.FB_PIXEL_ID;
  return Boolean(id && id !== "" && !id.startsWith("%"));
}

export function trackPageView(): void {
  if (!pixelEnabled()) return;
  window.fbq!("track", "PageView");
}

export function trackLead(eventId: string, value?: number): void {
  if (!pixelEnabled()) return;
  const params: Record<string, unknown> = {
    eventID: eventId, // shared with CAPI for deduplication
  };
  if (typeof value === "number") {
    params.value = value;
    params.currency = "USD";
  }
  window.fbq!("track", "Lead", params);
}

export function trackCustom(eventName: string, params: Record<string, unknown> = {}): void {
  if (!pixelEnabled()) return;
  window.fbq!("trackCustom", eventName, params);
}
