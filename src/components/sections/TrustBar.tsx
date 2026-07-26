import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { RatingBadge } from "@/components/ui/Rating";

/** SECTIONS.md §2.3 — answers "are these people legitimate" in the first scroll. */
export function TrustBar({ items, showRating = true }: { items: readonly string[]; showRating?: boolean }) {
  return (
    <Section tone="light" size="flush" className="border-y border-ink-100" innerClassName="py-5">
      <div className="flex flex-wrap items-center justify-center gap-3 gap-y-2 md:justify-between">
        {showRating && <RatingBadge />}
        {items.map((c) => (
          <span key={c} className="inline-flex items-center gap-2 text-sm font-medium text-ink-600">
            <Icon name="check" className="h-4 w-4 text-mint-500" />
            {c}
          </span>
        ))}
      </div>
    </Section>
  );
}
