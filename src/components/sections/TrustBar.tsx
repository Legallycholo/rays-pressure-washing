import type { CredentialBadge } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { RatingBadge } from "@/components/ui/Rating";
import { Reveal } from "@/components/Reveal";

/** SECTIONS.md §2.3 — answers "are these people legitimate" in the first scroll. */
export function TrustBar({
  items,
  badges,
  showRating = true,
}: {
  items: readonly string[];
  /**
   * Optional richer form of the same credentials. Each entry renders as its
   * issuer's badge art when `logoSrc` is filled in, and falls back to the
   * plain text chip when it isn't — which is the state everything ships in,
   * because a fabricated trust mark is worse than no trust mark.
   */
  badges?: readonly CredentialBadge[];
  showRating?: boolean;
}) {
  const withArt = badges?.filter((b) => b.logoSrc) ?? [];

  return (
    <Section tone="light" size="flush" className="border-y border-ink-100" innerClassName="py-5">
      <Reveal>
        <div className="flex flex-wrap items-center justify-center gap-3 gap-y-2 md:justify-between">
          {showRating && <RatingBadge />}
          {withArt.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.label}
              src={b.logoSrc}
              alt={`${b.label} — ${b.issuer}`}
              className="h-9 w-auto max-w-[9rem] object-contain"
            />
          ))}
          {/* Anything without art keeps the original text treatment. Filtering
              on `withArt` rather than swapping wholesale means a half-supplied
              set of badges still renders a complete row. */}
          {items
            .filter((c) => !withArt.some((b) => b.label === c))
            .map((c) => (
              <span key={c} className="inline-flex items-center gap-2 text-sm font-medium text-ink-600">
                <Icon name="check" className="h-4 w-4 text-mint-500" />
                {c}
              </span>
            ))}
        </div>
      </Reveal>
    </Section>
  );
}
