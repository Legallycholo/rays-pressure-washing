import type { Metadata } from "next";
import { site } from "@/content/site";
import { residentialServices } from "@/content/services";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pressure Washing & Exterior Cleaning Services",
  description: `Every exterior cleaning service we run on big lake homes and the properties around them, across ${site.serviceRegion}.`,
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
        lede="A big house on the water is four or five different materials, and none of them want the same setting. Pressure where pressure belongs, chemistry where it doesn't, called surface by surface."
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
      />
      <ServicesGrid services={residentialServices} />
      <HowItWorks />
      <FaqSection
        items={getFaqs(["soft-vs-pressure", "quote-accuracy", "how-long-lasts", "need-to-be-home", "weather", "payment"])}
        groupName="faq-services"
      />
    </>
  );
}
