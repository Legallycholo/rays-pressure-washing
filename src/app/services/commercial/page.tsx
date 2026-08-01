import type { Metadata } from "next";
import { site, cityState } from "@/content/site";
import { commercialServices } from "@/content/services";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/**
 * The commercial overview.
 *
 * A static segment sitting beside the `[service]` dynamic route. Next resolves
 * static ahead of dynamic, so this wins for `/services/commercial` — and
 * "commercial" is not a slug in `services.ts`, so nothing is shadowed. If a
 * service is ever added with that slug, this page is why it will not render.
 *
 * Deliberately not a second copy of the services hub. A business owner arrives
 * with different questions than a homeowner — can you work around my hours, are
 * you insured, will this shut my entrance — so the page leads on those and lets
 * the three service cards do the catalog work.
 */

export const metadata: Metadata = {
  title: "Commercial Pressure Washing & Window Cleaning",
  description: `Commercial exterior cleaning for storefronts, offices and small commercial buildings across ${site.serviceRegion}. Scheduled around your trading hours.`,
  alternates: { canonical: "/services/commercial" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Commercial", href: "/services/commercial" },
];

/**
 * The four objections that decide a commercial job, in the order they get
 * raised on the phone. Each one is answered by something this business
 * genuinely does — no capability is claimed here that isn't already claimed
 * elsewhere on the site.
 */
const commercialPoints = [
  {
    icon: "clock",
    title: "We work around your hours",
    body: "Early mornings, evenings and weekends. Nobody should have to step over a hose to get through your front door during trading hours.",
  },
  {
    icon: "shield",
    title: "Licensed and insured",
    body: "Certificate of insurance provided on request, before we start, without anyone having to chase it.",
  },
  {
    icon: "spray",
    title: "Method matched to the building",
    body: "Soft washing for EIFS, stucco and painted panel; pressure only where the substrate can take it. The same argument we make on houses matters more on a facade you cannot easily repaint.",
  },
  {
    icon: "check",
    title: "No contracts",
    body: "Recurring visits if you want the frontage kept on a rhythm, one-off if you don't. Either way you pay the number we quoted.",
  },
];

export default function CommercialServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Commercial exterior cleaning"
        lede={`Storefronts, offices and small commercial buildings across ${site.serviceRegion}. The same crew and the same methods as our residential work, scheduled so your customers never see us.`}
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
        secondaryCta={{ label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` }}
      />

      <ServicesGrid
        services={commercialServices}
        heading={{
          eyebrow: "Commercial services",
          title: "What we clean for local businesses",
          lede: "Three services, quoted per site after we have actually looked at it.",
        }}
      />

      <Section tone="sand">
        <SectionHeading
          eyebrow="Why businesses call us"
          title="The parts that usually decide it"
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 sm:mt-16">
          {commercialPoints.map((point) => (
            <li
              key={point.title}
              className="flex gap-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-harbor-50 text-harbor-600">
                <Icon name={point.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg text-ink-900">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <HowItWorks />

      <CtaBand
        title="Send us the address and we'll come look at it"
        lede={`We quote commercial work on site, not over the phone from a square-footage guess. Based in ${cityState}, so it is usually the same week.`}
      />

      <FaqSection
        items={getFaqs(["quote-accuracy", "how-long-lasts", "weather", "payment"])}
        groupName="faq-commercial"
      />
    </>
  );
}
