"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked stacking deck — cards pin one after another, each new card
 * sliding over the last while the one underneath recedes.
 *
 * Not scroll-jacking (STRUCTURE.md §10.4). Nothing here intercepts wheel or
 * touch events, and scroll position and speed are never remapped: the cards
 * are ordinary siblings in normal document flow that happen to be
 * `position: sticky`, and the only thing JS contributes is reading where they
 * currently are and writing a 0–1 progress number back as a CSS custom
 * property. Take the JS away and you still have a readable, correctly spaced
 * list of cards — it just stops receding as it stacks.
 *
 * That also means the section's height is reserved by the document itself
 * before any JS runs, so there is no layout shift when the effect initialises.
 *
 * ── Markup contract ────────────────────────────────────────────────────────
 * Each card is two elements:
 *
 *   <li data-stack-card class="stack-card" style={{ "--i": i }}>   ← sticky shell
 *     <div class="stack-card__inner"> …visible card… </div>       ← scales/fades
 *
 * The split is load-bearing, not decoration. The scrub reads each shell's
 * `getBoundingClientRect()`; if the transform were on that same element, its
 * own displacement would feed straight back into the next frame's
 * measurement. Keeping the shell untransformed makes the calculation a pure
 * function of scroll position.
 *
 * `--i` drives the cascading pin offset in CSS, so it has to be inline on each
 * card — it must be correct on first paint, before this component mounts.
 * ───────────────────────────────────────────────────────────────────────────
 */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function StackingCards({
  children,
  className,
  as = "div",
  step,
}: {
  children: React.ReactNode;
  className?: string;
  /** `ol` when the cards are a numbered sequence, which is the usual case. */
  as?: "div" | "ol" | "ul";
  /** Scroll distance between one card pinning and the next arriving, e.g. "50dvh". */
  step?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const desktop = window.matchMedia("(min-width: 64rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let cards: HTMLElement[] = [];
    let written: number[] = [];
    let frame = 0;
    let running = false;

    const measure = () => {
      frame = 0;
      // The last card has nothing stacking over it, so it never recedes.
      for (let i = 0; i < cards.length - 1; i++) {
        const card = cards[i];
        const rect = card.getBoundingClientRect();
        const next = cards[i + 1].getBoundingClientRect();

        // Progress runs over the final card-height of the next card's
        // approach: 0 while it's still a full card below, 1 once it has come
        // to rest exactly on top of this one. Before that window the cards are
        // a whole `--stack-step` apart and nothing should be moving yet.
        const travel = rect.height || 1;
        const p = Math.round(clamp01(1 - (next.top - rect.top) / travel) * 1000) / 1000;

        if (written[i] !== p) {
          written[i] = p;
          card.style.setProperty("--p", String(p));
        }
      }
    };

    // One calculation per frame, never per scroll event — a trackpad can fire
    // scroll far faster than the compositor paints.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const start = () => {
      if (running) return;
      running = true;
      cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-card]"));
      written = new Array(cards.length).fill(-1);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      measure();
    };

    const stop = () => {
      if (!running) return;
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const card of cards) card.style.removeProperty("--p");
      cards = [];
    };

    /**
     * Below `lg` the deck isn't a deck — it's the plain list the CSS falls back
     * to — and under reduced motion it's plain flow at every width. In both
     * cases the listener has to genuinely not exist rather than merely have no
     * visible effect: an attached handler still costs work on every scroll
     * event, which on the phones this site is mostly read on is battery spent
     * on nothing.
     */
    const sync = () => (desktop.matches && !reduced.matches ? start() : stop());

    sync();
    desktop.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      stop();
      desktop.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  // The tag is dynamic but the ref type can't be; every branch is an HTML
  // element and nothing here touches tag-specific API.
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={cn("stack", className)}
      style={step ? ({ "--stack-step": step } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
