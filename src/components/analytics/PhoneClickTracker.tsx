"use client";

import { useEffect } from "react";

/**
 * One delegated listener on `document`, mounted once for the life of the
 * app, rather than a handler wired onto every `tel:` link individually —
 * this site has upward of a dozen of those spread across layout chrome,
 * page CTAs and content, and they mount and unmount as routes change.
 *
 * Renders nothing; it exists purely for the effect.
 */
export function PhoneClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest('a[href^="tel:"]');
      if (!link) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push([
        "event",
        "phone_click",
        {
          link_url: link.getAttribute("href") ?? "",
          link_text: link.textContent?.trim() || undefined,
        },
      ]);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
