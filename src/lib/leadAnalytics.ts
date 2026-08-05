declare global {
  interface Window {
    dataLayer?: unknown[][];
  }
}

/**
 * `gtag` isn't called through `window.gtag` here: that function is only
 * defined by the inline script in `layout.tsx`, and depending on it would
 * race client component hydration against that script's `afterInteractive`
 * load. Pushing to `dataLayer` directly is the same mechanism `gtag()` uses
 * internally and needs nothing to have loaded yet — gtag.js drains whatever
 * is already sitting in the array once it arrives.
 */
function pushToDataLayer(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * `ContactForm` fires `trackLeadConversion` directly on a successful POST,
 * then client-navigates to `/thank-you`, which mounts a safety-net tracker
 * for arrivals that skip the form entirely (bookmarked URL, back button).
 * Without this flag both call sites fire on the same submission — the
 * redirect lands on the safety net a beat after the form's own call — and
 * every real lead gets counted twice. It's sessionStorage, not a permanent
 * flag: a second genuine submission in the same tab sets and clears it
 * again, so repeat leads still count once each.
 */
const LEAD_CONVERSION_FLAG = "ray-lead-conversion-fired";

/** Fired once a callback request has actually been accepted by `/api/leads`. */
export function trackLeadConversion() {
  pushToDataLayer("event", "generate_lead");
  try {
    sessionStorage.setItem(LEAD_CONVERSION_FLAG, "1");
  } catch {
    // Storage unavailable (private browsing, disabled cookies): the event
    // above still fired, only the thank-you page's dedupe check is skipped.
  }
}

/**
 * Thank-you page safety net. Skips firing if `trackLeadConversion` already
 * ran for this submission (the flag it just set), otherwise treats this as
 * a direct/bookmarked/back-button arrival and fires the conversion itself.
 */
export function trackLeadConversionOnce() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(LEAD_CONVERSION_FLAG) === "1") {
      sessionStorage.removeItem(LEAD_CONVERSION_FLAG);
      return;
    }
  } catch {
    // Fall through and fire — no way to tell it already ran.
  }
  trackLeadConversion();
}
