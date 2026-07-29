import type { Metadata } from "next";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { Hero } from "@/components/sections/Hero";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { Section } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: `${site.rating.value} stars across verified customer reviews. Read what ${site.serviceRegion} homeowners and businesses say about ${site.name}.`,
  alternates: { canonical: "/reviews" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Reviews", href: "/reviews" },
];

export default function ReviewsPage() {
  const bySource = Object.entries(
    testimonials.reduce<Record<string, number>>((acc, t) => {
      acc[t.source] = (acc[t.source] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`${site.rating.value.toFixed(1)} Stars from Real Local Customers`}
        lede="Unfiltered and attributed reviews from real homeowners across Lexington, Columbia, and the SC Midlands."
        extras={
          <>
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-4 py-2 ring-1 ring-white/15">
              <Stars value={site.rating.value} />
              <span className="text-sm font-semibold text-white">{site.rating.value.toFixed(1)} / 5.0 on Google</span>
            </span>
            {bySource.map(([source, count]) => (
              <Badge key={source} tone="onDark">
                {source}: {count}
              </Badge>
            ))}
          </>
        }
        primaryCta={{ label: "Get a free quote", href: "/quote" }}
      />

      {/* Review CTA Callout Banner */}
      <Section tone="sand" className="border-b border-ink-100/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-card bg-white p-8 text-center shadow-card ring-1 ring-ink-900/5 sm:flex-row sm:text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf-600">
              <Stars value={5} />
              <span>Verified Google Reviews</span>
            </div>
            <h2 className="text-2xl font-bold text-ink-900">Had us out for a clean recently?</h2>
            <p className="text-sm text-ink-600 max-w-xl">
              Your feedback means everything to a locally owned business! Leave us a review on Google and let your neighbors know how we did.
            </p>
          </div>
          <Button
            href={site.reviewLink}
            variant="primary"
            className="shrink-0"
          >
            Leave Us a Review on Google ⭐
          </Button>
        </div>
      </Section>

      <Section tone="light">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">Verified Customer Testimonials</h2>
            <p className="text-sm text-ink-500">Real feedback from properties cleaned across our service region.</p>
          </div>
          <Button
            href={site.reviewLink}
            variant="outline"
            size="sm"
          >
            + Leave a Review
          </Button>
        </div>

        <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id}>
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>

        {/* Footer Review Prompt */}
        <div className="mt-12 rounded-card bg-ink-900 p-8 text-center text-white shadow-lift harbor-mesh">
          <h3 className="text-xl font-bold">Have you used Ray&apos;s Window Cleaning & Pressure Washing?</h3>
          <p className="mt-2 text-sm text-ink-200">
            Click below to share your experience on our official Google Business Profile.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              href={site.reviewLink}
              variant="primary"
            >
              Write a Google Review ⭐
            </Button>
            <Button
              href={site.googleMapsUrl}
              variant="onDark"
            >
              View Google Business Profile
            </Button>
          </div>
        </div>
      </Section>

      <GuaranteeBand guarantee={site.guarantee} />
    </>
  );
}
