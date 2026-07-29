import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/content/site";
import { getService, serviceSlugs, services } from "@/content/services";
import { locations } from "@/content/locations";
import { getFaqs } from "@/content/faqs";
import { projectsFor } from "@/content/gallery";
import { testimonialsFor } from "@/content/testimonials";
import { Hero } from "@/components/sections/Hero";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceCard } from "@/components/sections/ServicesGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return serviceSlugs.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return {};
  return {
    title: `${service.name} in ${site.serviceRegion}`,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const service = getService((await params).service);
  if (!service) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.name, href: `/services/${service.slug}` },
  ];
  const serviceFaqs = getFaqs(service.faqIds);
  const related = service.related.map(getService).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const projects = projectsFor({ serviceSlug: service.slug });

  return (
    <>
      <JsonLd data={[serviceSchema(service), faqSchema(serviceFaqs), breadcrumbSchema(crumbs)]} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={service.name}
        lede={service.blurb}
        extras={
          <>
            <Badge tone="onDark">
              <Icon name="spray" className="h-3.5 w-3.5" />
              {service.method}
            </Badge>
            <Badge tone="onDark">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {service.pricing.duration}
            </Badge>
          </>
        }
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
        secondaryCta={{ label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` }}
      />

      {/* Intro + what's included */}
      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading align="left" eyebrow="Why it works" title={`How we approach ${service.name.toLowerCase()}`} />
            <p className="mt-6 text-lg leading-relaxed text-ink-600">{service.intro}</p>
            <div className="mt-8 rounded-card bg-sand-50 p-6 ring-1 ring-ink-900/5">
              <h3 className="font-display text-lg text-ink-900">Sound familiar?</h3>
              <ul className="mt-3 space-y-2.5">
                {service.symptoms.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-ink-600">
                    <Icon name="droplet" className="mt-0.5 h-4 w-4 shrink-0 text-harbor-500" />
                    &ldquo;{s}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-card bg-white p-7 shadow-lift ring-1 ring-ink-900/5 lg:sticky lg:top-28">
              <h3 className="font-display text-xl text-ink-900">Every visit includes</h3>
              <ul className="mt-4 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ink-700">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-ink-100 pt-5 text-sm text-ink-500">
                <p>
                  <span className="font-semibold text-ink-800">Typical visit:</span>{" "}
                  {service.pricing.duration}
                </p>
                <p className="mt-1.5">
                  <span className="font-semibold text-ink-800">Recommended:</span> {service.cadence}
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-harbor-700 underline underline-offset-2 hover:no-underline"
                >
                  Request a callback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {projects.length > 0 && (
        <BeforeAfterShowcase
          projects={projects}
          heading={{ eyebrow: "The result", title: `${service.name}, before and after` }}
        />
      )}

      <HowItWorks />

      <Testimonials
        items={testimonialsFor({ serviceSlug: service.slug })}
        tone="sand"
        heading={{ eyebrow: "In their words", title: `What customers say about our ${service.name.toLowerCase()}` }}
      />

      <CtaBand
        variant="inline"
        title={`Ready for ${service.name.toLowerCase()}?`}
        lede="Call now, or submit the form and we will get back to you within 24 hours."
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
      />

      {serviceFaqs.length > 0 && (
        <FaqSection
          items={serviceFaqs}
          groupName={`faq-${service.slug}`}
          heading={{ eyebrow: "Good to know", title: `${service.name} questions` }}
        />
      )}

      {/* Cities + related: the internal-linking block */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Where"
          title={`${service.name} across ${site.serviceRegion}`}
          lede="Local pages for the areas we serve most."
        />
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {locations.map((l) => (
            <li key={l.slug}>
              <Link
                href={
                  l.priority
                    ? `/services/${service.slug}/${l.slug}`
                    : `/service-areas/${l.slug}`
                }
                className="inline-flex min-h-[44px] items-center rounded-pill bg-sand-100 px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-harbor-50 hover:text-harbor-800"
              >
                {service.navLabel} in {l.city}
              </Link>
            </li>
          ))}
        </ul>

        {related.length > 0 && (
          <>
            <h2 className="mt-16 text-center font-display text-2xl text-ink-900">People also book</h2>
            <ul className="mx-auto mt-8 grid max-w-4xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <ServiceCard service={r} />
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-12 text-center">
          <Button href="/services" variant="ghost">
            All {services.length} services
          </Button>
        </div>
      </Section>
    </>
  );
}
