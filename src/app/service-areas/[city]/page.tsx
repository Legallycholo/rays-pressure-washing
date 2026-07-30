import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/content/site";
import { getLocation, locationSlugs } from "@/content/locations";
import { services, getService } from "@/content/services";
import { travelPolicy } from "@/content/packages";
import { projectsFor } from "@/content/gallery";
import { testimonialsFor } from "@/content/testimonials";
import { Hero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/sections/ServicesGrid";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return locationSlugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const loc = getLocation((await params).city);
  if (!loc) return {};
  return {
    title: `Pressure Washing in ${loc.city}, ${loc.region}`,
    // `loc.summary`, not `loc.localChallenge`. The latter is page prose and runs
    // 170–200 characters on its own, which put every city page's description past
    // the truncation point. See the note on `summary` in content/locations.ts.
    description: `Pressure washing and window cleaning in ${loc.city}, ${loc.region}. ${loc.summary}`,
    alternates: { canonical: `/service-areas/${loc.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const loc = getLocation((await params).city);
  if (!loc) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Service Areas", href: "/service-areas" },
    { name: `${loc.city}, ${loc.region}`, href: `/service-areas/${loc.slug}` },
  ];

  const topServices = loc.topServices
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const otherServices = services.filter(
    (s) => !loc.topServices.includes(s.slug) && s.segment === "residential",
  );
  const beyondRadius = loc.driveMinutes > travelPolicy.freeRadiusMinutes;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`Pressure washing in ${loc.city}`}
        lede={loc.intro}
        extras={
          <>
            <Badge tone="onDark">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {loc.driveMinutes === 0 ? "Our home base" : `${loc.driveMinutes} min away`}
            </Badge>
            <Badge tone="onDark">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {loc.population} residents
            </Badge>
          </>
        }
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
        secondaryCta={{ label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` }}
      />

      {/* Most-requested services here, city-ordered */}
      <Section tone="light">
        <SectionHeading
          eyebrow={`Most booked in ${loc.city}`}
          title={`What ${loc.city} homes actually need`}
          lede={loc.localChallenge}
        />
        <ul className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s) => (
            <li key={s.slug}>
              {/* Priority cities link into the deeper service×city pages */}
              <ServiceCard service={s} />
            </li>
          ))}
        </ul>
        {loc.priority && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {topServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/${loc.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded-pill bg-harbor-50 px-4 py-1.5 text-sm font-semibold text-harbor-800 transition-colors hover:bg-harbor-100"
                >
                  {s.navLabel} in {loc.city} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Local knowledge woven as prose, not a data table (§7.3) */}
      <Section tone="sand" containerSize="narrow">
        <SectionHeading eyebrow="Local knowledge" title={`Why ${loc.city} is its own job`} />
        <div className="mt-8 space-y-5 leading-relaxed text-ink-600">
          <p>
            Housing here is mostly {loc.housingStock.toLowerCase()}, and that shapes how
            we work. {loc.localChallenge} We plan every {loc.city} visit around exactly
            that.
          </p>
          <p>
            You&apos;ll find our trucks regularly in{" "}
            {loc.neighborhoods.slice(0, -1).join(", ")} and {loc.neighborhoods.at(-1)},
            and anywhere within sight of {loc.landmarks.slice(0, 2).join(" or ")}.
            {beyondRadius && (
              <> Being {loc.driveMinutes} minutes out, a flat travel fee applies, but {travelPolicy.note.charAt(0).toLowerCase() + travelPolicy.note.slice(1)}</>
            )}
          </p>
        </div>
      </Section>

      <BeforeAfterShowcase
        projects={projectsFor({ citySlug: loc.slug })}
        tone="light"
        heading={{ eyebrow: "Local proof", title: `Recent work around ${loc.city}` }}
      />

      <Testimonials
        items={testimonialsFor({ citySlug: loc.slug })}
        tone="sand"
        heading={{ eyebrow: "Your neighbors", title: `${loc.city} customers, in their words` }}
      />

      <CtaBand
        variant="inline"
        title={`Book your ${loc.city} clean`}
        lede="Call now, or submit the form and we will get back to you within 24 hours."
      />

      {/* Full catalog for the internal-link graph */}
      <Section tone="light">
        <SectionHeading eyebrow="Everything else" title={`All services in ${loc.city}`} />
        <ul className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {otherServices.map((s) => (
            <li key={s.slug}>
              <ServiceCard service={s} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
