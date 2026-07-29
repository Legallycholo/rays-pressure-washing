"use client";

import { useId, useState } from "react";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

/**
 * Before/after comparison with a draggable divider.
 *
 * Accessibility approach: the control is a real <input type="range"> laid over
 * the image. That gives keyboard support, arrow-key stepping, screen-reader
 * announcement and touch handling for free, all of which a div-with-pointer-
 * events implementation has to reimplement badly.
 *
 * Images are optional. With empty paths it renders labeled placeholder frames,
 * so the interaction can be reviewed and signed off before photography exists.
 */
export function BeforeAfterSlider({
  before,
  after,
  alt,
  label,
  className,
  ratio = "3/2",
}: {
  before?: string;
  after?: string;
  alt: string;
  label?: string;
  className?: string;
  ratio?: "4/3" | "3/2" | "16/9" | "1/1";
}) {
  const [pos, setPos] = useState(50);
  const id = useId();

  const ratios: Record<string, string> = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-video",
  };

  return (
    <figure className={cn("group relative overflow-hidden rounded-card bg-ink-100", ratios[ratio], className)}>
      {/* AFTER: the full-bleed base layer. */}
      <div className="absolute inset-0">
        {after ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={after} alt={`${alt}, after cleaning`} className="h-full w-full object-cover" />
        ) : (
          <Placeholder label={`AFTER: ${alt}`} ratio={ratio} className="h-full w-full rounded-none" />
        )}
      </div>

      {/* BEFORE: clipped from the left edge to the divider position. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {before ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={before} alt={`${alt}, before cleaning`} className="h-full w-full object-cover" />
        ) : (
          <Placeholder
            label={`BEFORE: ${alt}`}
            ratio={ratio}
            tone="dark"
            className="h-full w-full rounded-none"
          />
        )}
      </div>

      {/* Divider: mint, echoing the "clean edge" motif. */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-leaf-400 shadow-[0_0_20px_rgba(63,224,191,0.6)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-leaf-400 text-ink-950 shadow-lift">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-pill bg-ink-950/75 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-pill bg-leaf-400 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-ink-950">
        After
      </span>

      {label && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink-950/85 to-transparent p-4 pt-10 text-sm font-medium text-white">
          {label}
        </figcaption>
      )}

      <label htmlFor={id} className="sr-only">
        Reveal before and after. Drag or use arrow keys
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Before and after comparison for ${alt}`}
        className={cn(
          "absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent",
          // Hide the native track/thumb, the visual divider above is the UI.
          "[&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:opacity-0",
          "[&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:opacity-0",
        )}
      />
    </figure>
  );
}
