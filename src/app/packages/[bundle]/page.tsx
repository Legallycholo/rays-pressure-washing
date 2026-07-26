import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getBundle, bundleSlugs } from "@/content/packages";
import { getService } from "@/content/services";
import { getFaqs } from "@/content/faqs";
import { projectsFor } from "@/content/gallery";
import { Hero } from "@/components/sections/Hero";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { bundleOfferSchema, breadcrumbSchema } from "@/lib/schema";
import { currency } from "@/lib/utils";

export function generateStaticParams() {
  return bundleSlugs.map((bundle) => ({ bundle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bundle: string }>;
}): Promise<Metadata> {
  const bundle = getBundle((await params).bundle);
  if (!bundle) return {};
  return {
    title: `${bundle.name} Package — Save ${bundle.savingsPercent}%`,
    description: bundle.blurb,
    alternates: { canonical: `/packages/${bundle.slug}` },
  };
}

export default async function BundlePage({ params }: { params: Promise<{ bundle: string }> }) {
  const bundle = getBundle((await params).bundle);
  if (!bundle) notFound();

  const services = bundle.serviceSlugs
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const minimumSum = services.reduce((sum, s) => sum + s.pricing.minimum, 0);
  const bundledFrom = Math.round(minimumSum * (1 - bundle.savingsPercent / 100));
  const quoteHref = `/quote?services=${bundle.serviceSlugs.join(",")}`;
  const projects = projectsFor({}).filter((p) => bundle.serviceSlugs.includes(p.serviceSlug)).slice(0, 2);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: bundle.name, href: `/packages/${bundle.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[bundleOfferSchema({ ...bundle, minimumSum }), breadcrumbSchema(crumbs)]}
      />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`The ${bundle.name} package`}
        lede={bundle.blurb}
        extras={
          <>
            <Badge tone="onDark">
              <Icon name="sparkle" className="h-3.5 w-3.5" />
              Save {bundle.savingsPercent}%
            </Badge>
            <Badge tone="onDark">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {bundle.duration}
            </Badge>
          </>
        }
        primaryCta={{ label: "Quote This Package", href: quoteHref }}
        secondaryCta={{ label: site.contact.phone, href: `tel:${site.contact.phoneHref}` }}
      />

      {/* What's included, each service expanded */}
      <Section tone="light">
        <SectionHeading
          eyebrow="What's included"
          title={`${services.length} services, one visit`}
        />
        <ul className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug} className="flex flex-col rounded-card bg-white p-6 shadow-card ring-1 ring-ink-900/5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-hydro-50 text-hydro-600">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink-900">{s.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{s.method}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {s.includes.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {/* Honest savings maths */}
      <Section tone="sand" containerSize="narrow">
        <div className="rounded-card bg-white p-8 shadow-lift ring-1 ring-ink-900/5">
          <h2 className="font-display text-2xl text-ink-900">The maths, openly</h2>
          <dl className="mt-5 space-y-3 text-ink-600">
            <div className="flex items-center justify-between gap-4">
              <dt>Booked separately (minimum charges)</dt>
              <dd className="font-semibold text-ink-800 line-through decoration-signal-500/60">
                from {currency(minimumSum)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>
                As the {bundle.name} package{" "}
                <Badge tone="mint" className="ml-1">
                  −{bundle.savingsPercent}%
                </Badge>
              </dt>
              <dd className="font-display text-2xl font-bold text-ink-900">from {currency(bundledFrom)}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-400">
            Starting figures based on minimum charges — your quote depends on your
            property&apos;s actual measurements. What never changes: the package
            price is always {bundle.savingsPercent}% below the same services booked
            separately.
          </p>
        </div>
      </Section>

      {/* The day, hour by hour */}
      <Section tone="light" containerSize="narrow">
        <SectionHeading eyebrow="On the day" title="What a visit looks like" />
        <ol className="mt-10 space-y-0">
          {[
            { time: "Arrival", body: "Walkthrough with you (or photos if you're out), plants soaked, surfaces pre-checked." },
            ...services.map((s) => ({
              time: s.pricing.duration,
              body: `${s.name} — ${s.blurb}`,
            })),
            { time: "Wrap-up", body: "Everything rinsed and reset, final walkthrough, photo set sent. Payment only after you've seen it." },
          ].map((step, i, arr) => (
            <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
              {i < arr.length - 1 && (
                <span aria-hidden="true" className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-ink-100" />
              )}
              <span className="relative z-10 mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-hydro-600">
                <Icon name="check" className="h-3.5 w-3.5 text-white" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-hydro-600">{step.time}</p>
                <p className="mt-1 leading-relaxed text-ink-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {projects.length > 0 && (
        <BeforeAfterShowcase
          projects={projects}
          heading={{ eyebrow: "The result", title: "From jobs like this one" }}
        />
      )}

      <CtaBand
        variant="inline"
        title={`Book the ${bundle.name} package`}
        lede={bundle.trigger}
        primaryCta={{ label: "Quote This Package", href: quoteHref }}
      />

      <FaqSection
        items={getFaqs(["quote-accuracy", "need-to-be-home", "weather", "payment"])}
        groupName={`faq-${bundle.slug}`}
      />
    </>
  );
}
