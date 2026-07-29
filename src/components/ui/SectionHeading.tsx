import { cn } from "@/lib/utils";

/**
 * Eyebrow → headline → lede. The eyebrow does real work here: on a page this
 * long it's the scanning anchor that tells someone where they've landed.
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
            onDark ? "text-leaf-400" : "text-harbor-600",
          )}
        >
          <span
            className={cn("h-px w-6", onDark ? "bg-leaf-400/60" : "bg-harbor-500/50")}
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
