import { cn } from "@/lib/utils";

/**
 * Eyebrow → headline → lede. The eyebrow does real work here: on a page this
 * long it's the scanning anchor that tells someone where they've landed.
 *
 * The on-light eyebrow runs `leaf-600`, not `harbor-600`. It is the single
 * highest-leverage place to give green more territory: this component sets the
 * kicker on nearly every section of every page, so one line here is what makes
 * the site read as blue *and* green rather than blue with green ticks — and it
 * costs nothing structurally, because the eyebrow is a label, never a link or a
 * control that has to be distinguishable by colour alone.
 *
 * `leaf-600` (#2f7f31) specifically: it clears 5:1 against white, which is the
 * contrast floor design.md §4.3 sets for leaf under light text and the one rule
 * about green that does NOT move as green expands. `leaf-500` would land at
 * 3.6:1 and fail. On-dark already ran `leaf-400` and is unchanged.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  onDark = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
            onDark ? "text-leaf-400" : "text-leaf-600",
          )}
        >
          <span
            className={cn("h-px w-6", onDark ? "bg-leaf-400/60" : "bg-leaf-500/60")}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      )}

      <Tag
        className={cn(
          "text-display-sm sm:text-4xl lg:text-5xl",
          onDark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </Tag>

      {lede && (
        <p className={cn("text-lg leading-relaxed", onDark ? "text-ink-200" : "text-ink-500")}>
          {lede}
        </p>
      )}
    </div>
  );
}
