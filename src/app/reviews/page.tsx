import type { Metadata } from "next";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { Hero } from "@/components/sections/Hero";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { Section } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Reviews",
  description: `${site.rating.value} stars across ${site.rating.count} reviews. Read what ${site.serviceRegion} customers say about ${site.name}.`,
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
        title={`${site.rating.value.toFixed(1)} stars, ${site.rating.count} reviews`}
        lede="Unfiltered and attributed — neighbourhood included, because local word of mouth is the whole business."
        extras={
          <>
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-4 py-2 ring-1 ring-white/15">
              <Stars value={site.rating.value} />
              <span className="text-sm font-semibold text-white">{site.rating.value.toFixed(1)} / 5</span>
            </span>
            {bySource.map(([source, count]) => (
              <Badge key={source} tone="onDark">
                {source}: {count}
              </Badge>
            ))}
          </>
        }
        primaryCta={{ label: "Get My Free Quote", href: "/quote" }}
      />
      <Section tone="light">
        <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id}>
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-ink-400">
          Had us out recently? A review on{" "}
          <a href={site.social.google} target="_blank" rel="noopener noreferrer" className="font-semibold text-hydro-700 underline underline-offset-2">
            Google
          </a>{" "}
          helps more than you&apos;d think.
        </p>
      </Section>
      <GuaranteeBand guarantee={site.guarantee} />
    </>
  );
}
