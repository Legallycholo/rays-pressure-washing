import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/content/site";
import { getService, serviceSlugs, getServicesForCityPage } from "@/content/matrix";
import { getLocation, priorityLocations } from "@/content/locations";
import { travelPolicy } from "@/content/packages";
import { getFaqs } from "@/content/faqs";
import { projectsFor } from "@/content/gallery";
import { testimonialsFor } from "@/content/testimonials";
import { Hero } from "@/components/sections/Hero";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { currency } from "@/lib/utils";

/**
 * The service × city matrix — PRIORITY CITIES ONLY for now (STRUCTURE.md §7.3
 * scope control: prove these rank before expanding to all 88).
 */
export function generateStaticParams() {
  return priorityLocations.flatMap((l) =>
    serviceSlugs.map((service) => ({ service, city: l.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service: sSlug, city: cSlug } = await params;
  const service = getService(sSlug);
  const loc = getLocation(cSlug);
  if (!service || !loc) return {};
  return {
    title: `${service.name} in ${loc.city}, ${loc.region}`,
    description: `${service.name} for ${loc.city} homes — ${loc.localChallenge.toLowerCase()} ${service.blurb}`,
    alternates: { canonical: `/services/${service.slug}/${loc.slug}` },
  };
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service: sSlug, city: cSlug } = await params;
  const service = getService(sSlug);
  const loc = getLocation(cSlug);
  if (!service || !loc || !loc.priority) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.name, href: `/services/${service.slug}` },
    { name: loc.city, href: `/services/${service.slug}/${loc.slug}` },
  ];

  const siblings = getServicesForCityPage(loc, service.slug);
  const serviceFaqs = getFaqs(service.faqIds.slice(0, 4));
  const beyondRadius = loc.driveMinutes > travelPolicy.freeRadiusMinutes;

  return (
    <>
      <JsonLd
        data={[serviceSchema(service, loc), faqSchema(serviceFaqs), breadcrumbSchema(crumbs)]}
      />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`${service.name} in ${loc.city}, ${loc.region}`}
        // The one sentence that must differ per city: local challenge × service.
        lede={`${loc.localChallenge} It's the single biggest reason ${loc.city} homes call us for ${service.name.toLowerCase()} — and it's a problem we plan for before the truck leaves the yard.`}
        extras={
          <>
            <Badge tone="onDark">{service.method}</Badge>
            <Badge tone="onDark">From {currency(service.pricing.minimum)}</Badge>
            <Badge tone="onDark">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {loc.driveMinutes === 0 ? "We're based here" : `${loc.driveMinutes} min from our shop`}
            </Badge>
          </>
        }
        primaryCta={{ label: "Get My Free Quote", href: `/quote?services=${service.slug}` }}
        secondaryCta={{ label: site.contact.phone, href: `tel:${site.contact.phoneHref}` }}
      />

      {/* Local rationale — housingStock woven into the method argument */}
      <Section tone="light" containerSize="narrow">
        <SectionHeading
          eyebrow={`${loc.city} specifics`}
          title={`Why ${service.method.toLowerCase()} suits ${loc.city} properties`}
        />
        <div className="mt-8 space-y-5 leading-relaxed text-ink-600">
          <p>
            Around here the housing stock is mostly {loc.housingStock.toLowerCase()}.
            That matters for {service.name.toLowerCase()}: {service.intro}
          </p>
          <p>
            We work {loc.city} street by street —{" "}
            {loc.neighborhoods.slice(0, -1).join(", ")} and {loc.neighborhoods.at(-1)} are
            all regular stops
            {loc.driveMinutes === 0
              ? ", and being based here means no travel charge and short lead times."
              : beyondRadius
                ? `. At ${loc.driveMinutes} minutes out a flat travel fee applies, waived when a neighbour books the same route.`
                : `, ${loc.driveMinutes} minutes from our shop — inside the free-travel ring.`}
          </p>
          <ul className="!mt-7 space-y-2.5 rounded-card bg-sand-50 p-6 ring-1 ring-ink-900/5">
            {service.includes.slice(0, 4).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-ink-700">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <BeforeAfterShowcase
        projects={projectsFor({ serviceSlug: service.slug, citySlug: loc.slug })}
        heading={{ eyebrow: "Nearby results", title: `${service.name} jobs near ${loc.city}` }}
      />

      <Testimonials
        items={testimonialsFor({ serviceSlug: service.slug, citySlug: loc.slug })}
        heading={{ eyebrow: "Local word", title: `What ${loc.city} says` }}
      />

      <FaqSection
        items={serviceFaqs}
        groupName={`faq-${service.slug}-${loc.slug}`}
        heading={{ eyebrow: "Before you book", title: "Worth knowing" }}
      />

      {/* Internal-link graph: parent service, parent city, siblings */}
      <Section tone="light" size="compact">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="rounded-pill bg-hydro-50 px-4 py-1.5 text-sm font-semibold text-hydro-800 hover:bg-hydro-100"
          >
            All about {service.name}
          </Link>
          <Link
            href={`/service-areas/${loc.slug}`}
            className="rounded-pill bg-hydro-50 px-4 py-1.5 text-sm font-semibold text-hydro-800 hover:bg-hydro-100"
          >
            Everything we do in {loc.city}
          </Link>
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/${loc.slug}`}
              className="rounded-pill bg-sand-100 px-4 py-1.5 text-sm font-medium text-ink-700 hover:bg-sand-200"
            >
              {s.navLabel} in {loc.city}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
