import type { Metadata } from "next";
import Link from "next/link";
import { site, cityState } from "@/content/site";
import { locations } from "@/content/locations";
import { travelPolicy } from "@/content/packages";
import { Hero } from "@/components/sections/Hero";
import { CoverageMap } from "@/components/sections/CoverageMap";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Service Areas in ${site.serviceRegion}`,
  /**
   * Two things were wrong with the previous version. It interpolated
   * `serviceRegion` after the article — "and the surrounding **the** SC Midlands
   * area" — and it listed all thirteen city names, which ran past 230 characters
   * against the ~160 Google renders, so the sentence was cut mid-list.
   *
   * Now: the count plus the five biggest markets, derived, so adding a city moves
   * the number instead of lengthening the string past the limit.
   */
  description:
    `Pressure washing and window cleaning across ${locations.length} ${site.address.regionName} ` +
    `Midlands cities including ${locations
      .filter((l) => l.priority)
      .map((l) => l.city)
      .join(", ")} and Aiken. Based in ${cityState}.`,
  alternates: { canonical: "/service-areas" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Service Areas", href: "/service-areas" },
];

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`On the road across ${site.serviceRegion}`}
        lede={`Based in ${site.address.city}, working everywhere below. Each area page covers what we see most in that neighborhood, because a lakefront deck and a new-build driveway are different jobs.`}
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
      />

      <Section tone="light">
        <div className="mx-auto max-w-2xl">
          <CoverageMap locations={locations} />
        </div>
        <ul className="mt-14 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <li key={l.slug}>
              <Card href={`/service-areas/${l.slug}`} className="h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl text-ink-900">
                    {l.city}, {l.region}
                  </h2>
                  {l.priority && <Badge tone="mint">Core area</Badge>}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {l.driveMinutes === 0 ? "Home base" : `${l.driveMinutes} min from our shop`}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                  {l.localChallenge}
                </p>
                <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-harbor-700">
                  {l.city} services
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" containerSize="narrow">
        <SectionHeading eyebrow="Travel" title="Outside the 30-minute ring?" />
        <p className="mt-6 text-center leading-relaxed text-ink-600">
          Within {travelPolicy.freeRadiusMinutes} minutes of {site.address.city} there&apos;s
          never a travel charge. Beyond that a flat call-out applies, and{" "}
          {travelPolicy.note.charAt(0).toLowerCase() + travelPolicy.note.slice(1)}
        </p>
        <p className="mt-6 text-center">
          <Link href="/contact" className="font-semibold text-harbor-700 underline underline-offset-2 hover:no-underline">
            Not listed? Ask us anyway
          </Link>
        </p>
      </Section>
    </>
  );
}
