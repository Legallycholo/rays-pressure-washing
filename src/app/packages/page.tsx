import type { Metadata } from "next";
import { bundles } from "@/content/packages";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { BundleCard } from "@/components/sections/BundlesSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Cleaning Packages: Bundle & Save",
  description:
    "Combine services onto one visit and save 12–20%. Whole-home exterior resets, curb appeal packages, listing prep and commercial programs.",
  alternates: { canonical: "/packages" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Packages", href: "/packages" },
];

export default function PackagesPage() {
  const residential = bundles.filter((b) => b.segment === "residential");
  const commercial = bundles.filter((b) => b.segment === "commercial");

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="One visit. Several surfaces. Real savings."
        lede="The truck, the crew and the setup are already paid for, so every surface we add to the same visit costs less than booking it alone. That's the whole idea."
        primaryCta={{ label: "Get my free quote", href: "/quote" }}
      />

      <Section tone="light">
        <SectionHeading eyebrow="Residential" title="Home packages" />
        <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {residential.map((b) => (
            <li key={b.slug}>
              <BundleCard bundle={b} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow="Commercial"
          title="Property programs"
          lede="Scheduled, documented, and priced for recurrence."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
          {commercial.map((b) => (
            <li key={b.slug}>
              <BundleCard bundle={b} />
            </li>
          ))}
        </ul>
      </Section>

      <HowItWorks />
      <FaqSection
        items={getFaqs(["quote-accuracy", "how-long-lasts", "need-to-be-home", "payment", "weather"])}
        groupName="faq-packages"
      />
    </>
  );
}
