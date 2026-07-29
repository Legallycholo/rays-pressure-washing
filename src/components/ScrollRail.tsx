"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap rail with prev/next buttons.
 *
 * Zero dependencies, matching how the rest of this site does interaction:
 * `Accordion` is a `<details>`, `CoverageMap` is raw SVG, `GalleryLightbox` is
 * a `<dialog>`. The scrolling here is the browser's; all this component adds
 * is two buttons that call `scrollBy`.
 *
 * Children are rendered by the *server* and passed through, the client
 * boundary is this shell only, so the cards themselves cost nothing on the
 * wire beyond their HTML.
 *
 * Accessibility: the rail is `tabindex=0` with a role and a label. A scrollable
 * region that keyboard users can't reach is a WCAG 2.1.1 failure, and Chrome
 * (unlike Firefox) does not make overflow containers focusable on its own.
 */
export function ScrollRail({
  children,
  label,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  /** Names the region for screen readers, e.g. "Customer reviews". */
  label: string;
  className?: string;
  onDark?: boolean;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // 2px of slack: fractional layout widths mean scrollLeft rarely lands
    // exactly on the maximum, and a next button you can never disable looks
    // broken.
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 2);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduced ? "auto" : "smooth" });
  };

  const btn = (disabled: boolean) =>
    cn(
      "grid h-11 w-11 place-items-center rounded-full ring-1 transition-colors",
      onDark
        ? "bg-white/10 text-white ring-white/20 hover:bg-white/20"
        : "bg-white text-ink-700 ring-ink-900/10 shadow-card hover:bg-sand-50",
      disabled && "pointer-events-none opacity-35",
    );

  return (
    // The label lives on the wrapper, not on the `<ul>`.
    //
    // It used to be `role="group" aria-label` on the list itself, which reads
    // as the right thing and isn't: an explicit role REPLACES the implicit one,
    // so the `<ul>` stopped being a list in the accessibility tree and every
    // `<li>` inside it became an orphan. Screen readers lost "list, 6 items"
    // and the item count with it, the one piece of information a rail of
    // horizontally-scrolled cards most needs to convey, since you can't see
    // how many there are. Lighthouse flags it as `listitem`.
    //
    // `group` on the wrapper keeps the labeled, non-landmark region the
    // focusable scroller wants, and hands the list its semantics back.
    <div className={className} role="group" aria-label={label}>
      <ul
        ref={railRef}
        tabIndex={0}
        className={cn(
          "flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2",
          // Bleed to the container edges so a partially-visible next card
          // signals "there is more", then pad the ends back in.
          "-mx-5 px-5 sm:-mx-8 sm:px-8",
          // scroll-padding must match that padding. Without it `snap-start`
          // aligns the first card to the *padding box*, so the rail rests at
          // scrollLeft: 20 instead of 0 and the Previous button can never
          // report itself as being at the start.
          "scroll-px-5 sm:scroll-px-8",
          // The rail itself is the scroller, hide its bar, the buttons and the
          // peeking card are the affordance.
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </ul>

      {/* Only shown when there is actually something to scroll to. */}
      {overflows && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label={`Previous: ${label}`}
            className={btn(atStart)}
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label={`Next: ${label}`}
            className={btn(atEnd)}
          >
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
