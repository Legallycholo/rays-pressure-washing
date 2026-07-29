import type { Metadata } from "next";
import { maintenancePlans, maintenancePlanTerms } from "@/content/packages";
import { services } from "@/content/services";
import { getFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Maintenance Plans: Set It and Forget It",
  description:
    "Scheduled exterior cleaning at 10–25% below one-off rates. Month-to-month, cancel any time.",
  alternates: { canonical: "/maintenance-plan" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Maintenance Plans", href: "/maintenance-plan" },
];

export default function MaintenancePlanPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Never think about it again"
        // Terms lead, "am I locked in?" is the objection, so answer it first
        lede={maintenancePlanTerms}
        primaryCta={{ label: "Start a Plan", href: "/quote" }}
      />

      <Section tone="light">
        <ul className="grid items-stretch gap-6 lg:grid-cols-3">
          {maintenancePlans.map((plan) => (
            <li key={plan.slug} className="min-w-0">
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-900/5",
                  plan.mostPopular && "ring-2 ring-mint-400 lg:scale-105 lg:shadow-lift",
                )}
              >
                {plan.mostPopular && (
                  <p className="bg-mint-400 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-ink-950">
                    Most popular
                  </p>
                )}
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="font-display text-2xl text-ink-900">{plan.name}</h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-ink-400">
                    {plan.frequency}
                  </p>
                  <p className="mt-5 font-display text-5xl font-bold text-mint-600">
                    {plan.discountPercent}%
                    <span className="ml-2 align-middle font-sans text-sm font-semibold text-ink-500">
                      off one-off rates
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{plan.blurb}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-ink-100 pt-4 text-sm text-ink-500">
                    <span className="font-semibold text-ink-800">Best for:</span> {plan.bestFor}
                  </p>
                  <div className="mt-auto pt-6">
                    {/* R2: one primary per viewport, anchor card only */}
                    <Button
                      href={`/quote?plan=${plan.slug}`}
                      variant={plan.mostPopular ? "primary" : "secondary"}
                      fullWidth
                    >
                      Choose {plan.name}
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-ink-400">{maintenancePlanTerms}</p>
      </Section>

      {/* Why cadence matters */}
      <Section tone="sand">
        <SectionHeading
          eyebrow="Why a schedule"
          title="Growth doesn't wait for you to notice it"
          lede="Every surface has a natural regrowth clock. A plan simply matches our visits to it."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {services
            .filter((s) => s.segment === "residential")
            .slice(0, 6)
            .map((s) => (
              <li
                key={s.slug}
                className="flex items-center justify-between gap-3 rounded-card bg-white p-4 ring-1 ring-ink-900/5"
              >
                <span className="flex items-center gap-3 font-medium text-ink-800">
                  <Icon name={s.icon} className="h-5 w-5 text-hydro-600" />
                  {s.name}
                </span>
                <Badge tone="hydro">{s.cadence}</Badge>
              </li>
            ))}
        </ul>
      </Section>

      <GuaranteeBand guarantee={site.guarantee} />

      <FaqSection
        items={getFaqs(["contracts", "how-long-lasts", "gutter-frequency", "payment", "weather"])}
        groupName="faq-plans"
        showAllLink={false}
      />
    </>
  );
}
