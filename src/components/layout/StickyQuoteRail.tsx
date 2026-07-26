"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Desktop counterpart to `StickyCallBar`, which is mobile-only by design.
 * Once the hero scrolls away a desktop visitor has no persistent conversion
 * path until the footer; this is it — collapsed to icons, expanding on hover
 * or keyboard focus.
 *
 * Two rules shape it:
 *
 * R2 — the rail is `hydro`, never `signal`. Somewhere below the fold there is
 * almost always an in-flow Signal CTA (`CtaBand`, `GuaranteeBand`, a pricing
 * card), and a permanently-visible third orange button would put two primaries
 * in one viewport at some scroll position on nearly every page. Orange stays
 * reserved for the CTA you scrolled to; the rail is the one you didn't.
 *
 * It also hides again near the footer, which has its own conversion band —
 * two competing "get a quote" affordances a hundred pixels apart is worse
 * than one.
 */
export function StickyQuoteRail() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("main > section");
    const footer = document.querySelector("footer");

    // No hero to hide behind (shouldn't happen — every page opens on one) is
    // not a reason to withhold the CTA.
    let pastHero = !hero;
    let atFooter = false;
    const sync = () => setVisible(pastHero && !atFooter);

    const observers: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(
        ([e]) => {
          pastHero = !e.isIntersecting;
          sync();
        },
        { rootMargin: "-80px 0px 0px 0px" },
      );
      io.observe(hero);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(([e]) => {
        atFooter = e.isIntersecting;
        sync();
      });
      io.observe(footer);
      observers.push(io);
    }
    sync();
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      // `inert` while hidden keeps it out of the tab order without giving up
      // the slide-out transition that unmounting would cost.
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block",
        "transition-all duration-300 ease-out",
        visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
      )}
    >
      <div className="group flex flex-col items-end gap-2">
        <Link
          href="/quote"
          className="flex h-14 items-center gap-3 rounded-l-pill bg-hydro-600 pl-5 pr-5 font-semibold text-white shadow-lift transition-colors hover:bg-hydro-500"
        >
          <Icon name="sparkle" className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-within:max-w-[12rem] group-focus-within:opacity-100">
            Get My Free Quote
          </span>
        </Link>
        <a
          href={`tel:${site.contact.phoneHref}`}
          className="flex h-14 items-center gap-3 rounded-l-pill bg-ink-900 pl-5 pr-5 font-semibold text-white shadow-lift transition-colors hover:bg-ink-800"
        >
          <Icon name="phone" className="h-5 w-5 shrink-0 text-hydro-400" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-within:max-w-[12rem] group-focus-within:opacity-100">
            {site.contact.phone}
          </span>
        </a>
      </div>
    </div>
  );
}
