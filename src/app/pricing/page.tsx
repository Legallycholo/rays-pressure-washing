import type { Metadata } from "next";
import { services } from "@/content/services";
import { bundles, maintenancePlans } from "@/content/packages";
import { getFaqs } from "@/content/faqs";
import { Estimator } from "@/components/Estimator";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { currency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing — Published, Not Hidden",
  description:
    "Real price ranges for every service, an instant estimator, and the five things that legitimately change a quote.",
  alternates: { canonical: "/pricing" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

/** Tool page (§3.3): estimator first, then the published table. No CtaBand. */
export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Section tone="sand">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h1 className="text-display-sm text-ink-900">
            Most companies hide this page. Here&apos;s ours.
          </h1>
          <p className="mt-3 text-ink-500">
            Ranges, not games. Pick a service, enter a rough size, get a ballpark.
          </p>
        </div>
        <Estimator />
      </Section>

      {/* Published ranges, generated from services.ts */}
      <Section tone="light">
        <SectionHeading eyebrow="The full table" title="Every service, every rate" />
        <div className="mt-12 overflow-x-auto rounded-card ring-1 ring-ink-900/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="bg-ink-900 text-white">
                <th className="p-4 font-display text-base font-semibold">Service</th>
                <th className="p-4 font-display text-base font-semibold">Typical rate</th>
                <th className="p-4 font-display text-base font-semibold">Minimum</th>
                <th className="p-4 font-display text-base font-semibold">Duration</th>
                <th className="p-4 font-display text-base font-semibold">Repeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white">
              {services.map((s) => (
                <tr key={s.slug} className="transition-colors hover:bg-sand-50">
                  <td className="p-4">
                    <a href={`/services/${s.slug}`} className="font-semibold text-ink-800 hover:text-hydro-700">
                      {s.name}
                    </a>
                    <span className="block text-xs text-ink-400">{s.method}</span>
                  </td>
                  <td className="p-4 text-ink-600">
                    {currency(s.pricing.from)}–{currency(s.pricing.to)} / {s.pricing.unit}
                  </td>
                  <td className="p-4 text-ink-600">{currency(s.pricing.minimum)}</td>
                  <td className="p-4 text-ink-600">{s.pricing.duration}</td>
                  <td className="p-4 text-ink-600">{s.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-ink-400">
          Bundles run {Math.min(...bundles.map((b) => b.savingsPercent))}–
          {Math.max(...bundles.map((b) => b.savingsPercent))}% below these rates; maintenance
          plans {Math.min(...maintenancePlans.map((p) => p.discountPercent))}–
          {Math.max(...maintenancePlans.map((p) => p.discountPercent))}% below.{" "}
          <a href="/packages" className="font-semibold text-hydro-700 underline underline-offset-2">
            See packages
          </a>
        </p>
      </Section>

      {/* What moves a price / red flags */}
      <Section tone="sand">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-ink-900">What legitimately changes a price</h2>
            <ul className="mt-5 space-y-3.5">
              {[
                ["Square footage", "The biggest factor, and why we quote from measurements."],
                ["Height and access", "Second storeys, steep sites and tight access add time and rigging."],
                ["Surface condition", "Years of buildup takes more chemistry and more passes than annual upkeep."],
                ["Material", "Old timber and soft brick need slower, gentler work than concrete."],
                ["Travel", `Beyond ${30} minutes a flat call-out applies — waived when neighbours book together.`],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-mint-600" />
                  <p className="text-ink-600">
                    <span className="font-semibold text-ink-800">{title}.</span> {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">Red flags in anyone&apos;s quote</h2>
            <ul className="mt-5 space-y-3.5">
              {[
                ["Per-hour pricing with no cap", "You're paying for slowness."],
                ["A big deposit for a small job", "Standard residential work shouldn't need money upfront."],
                ["Same-day-only pricing", "A real price survives a night's sleep."],
                ["No mention of method", "If they can't say soft wash or pressure wash and why, the roof finds out the hard way."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <Icon name="droplet" className="mt-1 h-5 w-5 shrink-0 text-signal-500" />
                  <p className="text-ink-600">
                    <span className="font-semibold text-ink-800">{title}.</span> {body}
                  </p>
                </li>
              ))}
            </ul>
            <Button href="/quote" variant="secondary" className="mt-6">
              Get our number on it
            </Button>
          </div>
        </div>
      </Section>

      <FaqSection
        items={getFaqs(["quote-accuracy", "payment", "interior-windows", "oil-stains"])}
        groupName="faq-pricing"
        heading={{ eyebrow: "Pricing questions", title: "Asked every week" }}
      />
    </>
  );
}
