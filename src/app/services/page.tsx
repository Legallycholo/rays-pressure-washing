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
  description: `Every exterior cleaning service we offer across ${site.serviceRegion}, for lake homes and the properties around them.`,
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
        lede="Pressure washing where pressure belongs, soft washing where it doesn't, and the right call made surface by surface."
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
