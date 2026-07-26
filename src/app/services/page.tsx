import type { Metadata } from "next";
import { site } from "@/content/site";
import { residentialServices, commercialServices } from "@/content/services";
import { featuredBundles } from "@/content/packages";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { ServicesTabs } from "@/components/sections/ServicesTabs";
import { BundlesSection } from "@/components/sections/BundlesSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pressure Washing & Exterior Cleaning Services",
  description: `Every exterior cleaning service we offer across ${site.serviceRegion} — residential and commercial, with published starting prices.`,
  alternates: { canonical: "/services" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Every surface, its own method"
        lede="Pressure washing where pressure belongs, soft washing where it doesn't, and honest starting prices on all of it."
        primaryCta={{ label: "Get My Free Quote", href: "/quote" }}
      />
      <Section tone="light">
        <ServicesTabs residential={residentialServices} commercial={commercialServices} />
      </Section>
      <BundlesSection
        bundles={featuredBundles}
        heading={{
          eyebrow: "Better together",
          title: "Most people book two or three at once",
          lede: "Bundling services onto one visit is cheaper for you and easier for us — that's the whole trick.",
        }}
      />
      <HowItWorks />
      <FaqSection
        items={getFaqs(["soft-vs-pressure", "quote-accuracy", "how-long-lasts", "need-to-be-home", "weather", "payment"])}
        groupName="faq-services"
      />
    </>
  );
}
