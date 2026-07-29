import type { Testimonial } from "@/content/testimonials";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScrollRail } from "@/components/ScrollRail";
import { Reveal } from "@/components/Reveal";
import { formatDate } from "@/lib/utils";

export function TestimonialCard({ t }: { t: Testimonial }) {
  const city = getLocation(t.citySlug);
  return (
    <figure className="flex h-full flex-col rounded-card bg-white p-6 shadow-card ring-1 ring-ink-900/5">
      <Stars value={t.rating} />
      {/* No clamp: truncating a review reads as hiding something (§2.10) */}
      <blockquote className="mt-3 leading-relaxed text-ink-700">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-3 border-t border-ink-100 pt-4">
          <div>
            <p className="font-bold text-ink-900">{t.name}</p>
            <p className="text-sm text-ink-500">
              {t.neighborhood}
              {city && `, ${city.city}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge tone="neutral">{t.source}</Badge>
            <span className="text-xs text-ink-400">{formatDate(t.date)}</span>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * SECTIONS.md §2.10, as amended by improvement.md Phase 7.
 *
 * `grid` is still the default and is right for pages *about* reviews, all of
 * them, at once, scannable. `carousel` is a CSS scroll-snap rail for pages
 * where reviews are one section among fifteen: it shows more of them in less
 * vertical space, and a peeking next card says "there are more" in a way a
 * truncated 3-up grid does not.
 *
 * The original rule (never carousel this) was written against auto-rotating
 * carousels that mount one slide at a time. Neither applies here: nothing
 * advances on a timer, and every review is in the server-rendered markup where
 * a crawler can read it. Those two properties are the whole justification; if
 * either is ever lost, go back to the grid.
 */
export function Testimonials({
  items,
  heading,
  tone = "light",
  showAllLink = true,
  layout = "grid",
}: {
  items: Testimonial[];
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
  tone?: "light" | "sand";
  showAllLink?: boolean;
  layout?: "grid" | "carousel";
}) {
  const shown = items.slice(0, 6);

  return (
    <Section tone={tone}>
      <Reveal>
        <SectionHeading
          {...(heading ?? {
            eyebrow: "In their words",
            title: "What the neighbors say",
          })}
        />
      </Reveal>
      <Reveal delay={100} className="mt-12 sm:mt-16">
        {layout === "carousel" ? (
          <ScrollRail label="Customer reviews">
            {shown.map((t) => (
              <li
                key={t.id}
                // Basis, not width: flex items must not shrink, or six cards
                // compress to fit instead of overflowing into a scroll.
                className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[31.5%]"
              >
                <TestimonialCard t={t} />
              </li>
            ))}
          </ScrollRail>
        ) : (
          <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t) => (
              <li key={t.id}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        )}
      </Reveal>
      {showAllLink && (
        <div className="mt-10 text-center">
          <Button href="/reviews" variant="ghost">
            Read all reviews
          </Button>
        </div>
      )}
    </Section>
  );
}
