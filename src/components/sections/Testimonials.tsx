import type { Testimonial } from "@/content/testimonials";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export function TestimonialCard({ t }: { t: Testimonial }) {
  const city = getLocation(t.citySlug);
  return (
    <figure className="flex h-full flex-col rounded-card bg-white p-6 shadow-card ring-1 ring-ink-900/5">
      <Stars value={t.rating} />
      {/* No clamp — truncating a review reads as hiding something (§2.10) */}
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

/** SECTIONS.md §2.10 — no carousel, ever. */
export function Testimonials({
  items,
  heading,
  tone = "light",
  showAllLink = true,
}: {
  items: Testimonial[];
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
  tone?: "light" | "sand";
  showAllLink?: boolean;
}) {
  return (
    <Section tone={tone}>
      <SectionHeading
        {...(heading ?? {
          eyebrow: "In their words",
          title: "What the neighbours say",
        })}
      />
      <ul className="mt-12 grid items-stretch gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((t) => (
          <li key={t.id}>
            <TestimonialCard t={t} />
          </li>
        ))}
      </ul>
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
