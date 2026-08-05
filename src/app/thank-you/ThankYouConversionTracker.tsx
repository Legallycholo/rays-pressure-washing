"use client";

import { useEffect, useRef } from "react";
import { trackLeadConversionOnce } from "@/lib/leadAnalytics";

/**
 * `ContactForm` already fires `generate_lead` the moment its POST succeeds,
 * before it redirects here — this is the backstop for arrivals that skip
 * that: a bookmarked URL, a back button, someone reopening the tab.
 * `trackLeadConversionOnce` checks the flag `ContactForm`'s call just set
 * and no-ops when it finds one, so a normal submit-then-redirect doesn't
 * double-count. The `useRef` guard is for React StrictMode's double-invoked
 * effect in dev, not a real double-render risk in production; without it a
 * dev session would double-count every landing.
 */
export function ThankYouConversionTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackLeadConversionOnce();
  }, []);

  return null;
}
