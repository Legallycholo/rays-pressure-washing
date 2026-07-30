import type { Metadata } from "next";
import { site, credentialBadges, cityState, guaranteeName } from "@/content/site";
import { stats } from "@/content/stats";
import { featuredServices, residentialServices } from "@/content/services";
import { maintenancePlans, maintenancePlanTerms } from "@/content/packages";
import { locations } from "@/content/locations";
import { featuredProjects } from "@/content/gallery";
import { featuredTestimonials } from "@/content/testimonials";
import { getFaqs } from "@/content/faqs";
import { featuredArticles } from "@/content/articles";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { SymptomChecker } from "@/components/sections/SymptomChecker";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
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
import { ArticlePreview } from "@/components/sections/ArticlePreview";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Pressure Washing Big Lake Houses in ${cityState}`,
  description:
    `Window cleaning, soft washing, roof cleaning and concrete cleaning for lake homes ` +
    `across ${site.serviceRegion}. Same-day availability and the ${guaranteeName}.`,
  alternates: { canonical: "/" },
};

/**
 * The ten highest-intent questions, in the order a buyer actually asks them:
 * what is this, what will it cost me, how long does it last, is it safe, how
 * does booking work, and finally how do I pay.
 *
 * Ten rather than six because this section carries the homepage's answer-engine
 * weight — each entry is a question/answer pair emitted as FAQPage JSON-LD below,
 * and these are the queries people type. `roof-warranty` and `hard-water` are
 * the two additions worth calling out: the first cites ARMA and is the most
 * quotable answer in the bank, and the second is the only window-cleaning
 * question here, which matters when half the business name is window cleaning.
 *
 * All ten live in content/faqs.ts — the homepage never holds its own copy of an
 * answer, so this list and /faq can never contradict each other.
 */
const homeFaqIds = [
  "soft-vs-pressure",
  "quote-accuracy",
  "how-long-lasts",
  "plants-safe",
  "need-to-be-home",
  "roof-warranty",
  "hard-water",
  "contracts",
  "weather",
  "payment",
];

/** Assembled per STRUCTURE.md §8.1 / SECTIONS.md §1.5. Ends on FAQ: the
 *  footer band closes every page (§1.6). */
export default function HomePage() {
  return (
    <>
      {/* FAQPage for the ten questions rendered below. This will not produce an
          expandable rich result — Google restricted those to government and
          health sites in 2023 — but it hands answer engines ten pre-parsed
          question/answer pairs, which is what gets quoted. See content/faqs.ts. */}
      <JsonLd data={faqSchema(getFaqs(homeFaqIds))} />
      {/* The H1 is the search phrase, not the tagline. `site.tagline` still
          carries the brand line in the footer and the OG card, where it has
          room to be a slogan rather than the thing someone typed to get here.
          The eyebrow stays the region: it renders against a map-pin icon. */}
      <Hero
        eyebrow={`Serving ${site.serviceRegion}`}
        title={`Pressure washing big lake houses in ${cityState}`}
        lede={`Big houses on the water take more than a pressure washer and a ladder. We clean the glass, the siding, the roof and the driveway on lake homes around ${site.address.city}, with the method matched to each surface and backed by the ${guaranteeName}.`}
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
        secondaryCta={{ label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` }}
        project={featuredProjects[0]}
      />
      <TrustBar items={site.credentials} badges={credentialBadges} />
      <SymptomChecker services={residentialServices} />
      <ServicesGrid
        services={featuredServices}
        heading={{
          eyebrow: "What we clean",
          title: "Every surface on a lake house, its own method",
          lede: "Pressure where pressure works, chemistry where it doesn't. Stone, stucco and hardwood near the water each get a different setting, and the method badge on each card tells you which.",
        }}
      />
      <BeforeAfterShowcase projects={featuredProjects} />
      {/* sand → ink → light: photo proof, motion proof, then the process. */}
      <VideoShowcase />
      <HowItWorks />
      <GuaranteeBand guarantee={site.guarantee} />
      <MaintenanceTeaser
        plan={maintenancePlans.find((p) => p.mostPopular) ?? maintenancePlans[0]}
        terms={maintenancePlanTerms}
      />
      {/* Carousel on the homepage only. /reviews and the detail pages keep the
          grid, where seeing every review at once is the point (SECTIONS.md §2.10). */}
      <Testimonials items={featuredTestimonials} layout="carousel" />
      {/* Renders nothing until there is real press coverage. See content/press.ts. */}
      <PressBar />
      <ServiceAreaSection locations={locations} />
      {/* limit={10}: FaqSection defaults to 6 and would silently truncate. */}
      <FaqSection items={getFaqs(homeFaqIds)} limit={10} groupName="faq-home" />
      <StatsRow stats={stats} />
      <ArticlePreview articles={featuredArticles} />
    </>
  );
}
