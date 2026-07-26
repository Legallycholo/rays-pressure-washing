import type { Metadata } from "next";
import { site, stats, credentialBadges } from "@/content/site";
import { featuredServices, residentialServices } from "@/content/services";
import { activeCampaign, featuredBundles, maintenancePlans, maintenancePlanTerms } from "@/content/packages";
import { locations } from "@/content/locations";
import { featuredProjects } from "@/content/gallery";
import { featuredTestimonials } from "@/content/testimonials";
import { getFaqs } from "@/content/faqs";
import { featuredPosts } from "@/content/posts";
import { SeasonalBanner } from "@/components/sections/SeasonalBanner";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { SymptomChecker } from "@/components/sections/SymptomChecker";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { BundlesSection } from "@/components/sections/BundlesSection";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { VideoShowcase } from "@/components/sections/VideoShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { MaintenanceTeaser } from "@/components/sections/MaintenanceTeaser";
import { StatsRow } from "@/components/sections/StatsRow";
import { Testimonials } from "@/components/sections/Testimonials";
import { PressBar } from "@/components/sections/PressBar";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { BlogPreview } from "@/components/sections/BlogPreview";

export const metadata: Metadata = {
  title: `Pressure Washing & Exterior Cleaning in ${site.serviceRegion}`,
  description:
    `${site.name} — soft washing, roof cleaning, driveway and concrete cleaning across ` +
    `${site.serviceRegion}. Published prices, free same-day quotes, and the ${site.guarantee.title}.`,
  alternates: { canonical: "/" },
};

// Highest-intent questions for the homepage FAQ slice.
const homeFaqIds = [
  "soft-vs-pressure",
  "quote-accuracy",
  "need-to-be-home",
  "plants-safe",
  "how-long-lasts",
  "payment",
];

/** Assembled per STRUCTURE.md §8.1 / SECTIONS.md §1.5. Ends on FAQ — the
 *  footer band closes every page (§1.6). */
export default function HomePage() {
  return (
    <>
      <SeasonalBanner campaign={activeCampaign} />
      <Hero
        eyebrow={`Serving ${site.serviceRegion}`}
        title={site.tagline}
        lede={`Soft washing, pressure washing and exterior cleaning done the right way for each surface — quoted free, priced openly, and backed by the ${site.guarantee.title}.`}
        primaryCta={{ label: "Get My Free Quote", href: "/quote" }}
        secondaryCta={{ label: site.contact.phone, href: `tel:${site.contact.phoneHref}` }}
        project={featuredProjects[0]}
      />
      <TrustBar items={site.credentials} badges={credentialBadges} />
      <SymptomChecker services={residentialServices} />
      <ServicesGrid
        services={featuredServices}
        promote={activeCampaign?.promoteServices ?? []}
        heading={{
          eyebrow: "What we clean",
          title: "Every surface, its own method",
          lede: "Pressure where pressure works, chemistry where it doesn't. The method badge on each card tells you which.",
        }}
      />
      <BundlesSection bundles={featuredBundles} />
      <BeforeAfterShowcase projects={featuredProjects} />
      {/* sand → ink → light: photo proof, motion proof, then the process. */}
      <VideoShowcase />
      <HowItWorks />
      <GuaranteeBand guarantee={site.guarantee} />
      <MaintenanceTeaser
        plan={maintenancePlans.find((p) => p.mostPopular) ?? maintenancePlans[0]}
        terms={maintenancePlanTerms}
      />
      {/* Carousel on the homepage only — /reviews and the detail pages keep the
          grid, where seeing every review at once is the point (SECTIONS.md §2.10). */}
      <Testimonials items={featuredTestimonials} layout="carousel" />
      {/* Renders nothing until there is real press coverage — see content/press.ts. */}
      <PressBar />
      <ServiceAreaSection locations={locations} />
      <FaqSection items={getFaqs(homeFaqIds)} groupName="faq-home" />
      <StatsRow stats={stats} />
      <BlogPreview posts={featuredPosts} />
    </>
  );
}
