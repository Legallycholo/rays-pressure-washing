"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance reveal, the site's one general-purpose scroll animation.
 *
 * Deliberately the *only* client boundary a section needs to opt in. Almost
 * every section here is a Server Component; wrapping a group in `<Reveal>`
 * keeps it that way, because its children arrive already rendered and this
 * component never touches them, it only observes its own wrapper element and
 * toggles a class. No section has to become a client component to fade in.
 *
 * Progressive enhancement is the whole design (STRUCTURE.md §10.4): the hidden
 * base state lives behind `[data-reveal-ready]`, which only exists once the
 * bootstrap in `layout.tsx` has run. No JS means no attribute means no hiding,
 * the content is plainly visible, just without the fade. See `globals.css`.
 *
 * Usage: wrap 2–4 *groups* per section, not every card. Staggering fifteen
 * cards individually reads as a slot machine, not as polish.
 */

/**
 * One observer for the whole page, created on first mount. Per-element
 * observers would be N instances doing N times the same intersection
 * bookkeeping against identical options; the browser dedupes none of that.
 */
let shared: IntersectionObserver | undefined;

function sharedObserver() {
  shared ??= new IntersectionObserver(
    (entries, io) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        // Reveals are one-way. Re-running them on scroll-back is what makes
        // this class of animation feel like a toy instead of a transition.
        io.unobserve(entry.target);
      }
    },
    // Start slightly before the element is fully in view so the transition is
    // already underway when it lands, anticipatory rather than laggy.
    { rootMargin: "0px 0px -10% 0px" },
  );
  return shared;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger in ms. 80–120 between sibling groups; more reads as a queue. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Claim the pre-paint bootstrap: tells it hydration got far enough that
    // the observer is now responsible for revealing, so its safety timer
    // doesn't need to fall back to showing everything.
    document.documentElement.setAttribute("data-reveal-live", "");

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }

    const io = sharedObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
