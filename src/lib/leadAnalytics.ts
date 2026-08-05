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

/** Fired once a callback request has actually been accepted by `/api/leads`. */
export function trackLeadConversion() {
  pushToDataLayer("event", "generate_lead");
}
