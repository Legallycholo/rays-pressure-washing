import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-amber-400", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          filled
          className={cn("h-4 w-4", i < Math.round(value) ? "opacity-100" : "opacity-25")}
        />
      ))}
    </span>
  );
}

/** Compact social-proof chip used in the header, hero and CTA bands. */
export function RatingBadge({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm",
        onDark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-sand-100 text-ink-700",
        className,
      )}
    >
      <Stars value={site.rating.value} />
      <span className="font-semibold">{site.rating.value.toFixed(1)}</span>
      <span className={onDark ? "text-ink-200" : "text-ink-500"}>
        ({site.rating.count} reviews)
      </span>
    </span>
  );
}
