import type { Metadata } from "next";
import { site } from "@/content/site";
import { residentialServices, commercialServices } from "@/content/services";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ServicesByCategory } from "@/components/sections/ServicesByCategory";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pressure Washing & Exterior Cleaning Services",
  description: `Every exterior cleaning service we run on residential and commercial properties across ${site.serviceRegion}.`,
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
        lede="Any property is four or five different materials, and none of them want the same setting. Pressure where pressure belongs, chemistry where it doesn't, called surface by surface."
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
      />
      {/* Residential first, commercial second, then the full GBP-category list.
          The two grids are split rather than merged because the buyers are
          different: a homeowner scanning for their own house should not have to
          read past fleet-scale copy to find it. */}
      <ServicesGrid
        services={residentialServices}
        heading={{
          eyebrow: "Residential",
          title: "Exterior cleaning for your home",
          lede: "Siding, glass, concrete, decks and gutters — each on the method that surface can take.",
        }}
      />
      <ServicesGrid
        services={commercialServices}
        tone="sand"
        heading={{
          eyebrow: "Commercial",
          title: "Exterior cleaning for your business",
          lede: "Storefronts, offices and small commercial buildings, cleaned outside your trading hours.",
        }}
      />
      <ServicesByCategory tone="light" />
      <HowItWorks />
      <FaqSection
        items={getFaqs(["soft-vs-pressure", "quote-accuracy", "how-long-lasts", "need-to-be-home", "weather", "payment"])}
        groupName="faq-services"
      />
    </>
  );
}
