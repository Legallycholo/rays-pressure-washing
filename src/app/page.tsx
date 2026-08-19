import type { Metadata } from "next";
import { site, credentialBadges, cityState, guaranteeName } from "@/content/site";
import { stats } from "@/content/stats";
import { featuredServices, residentialServices } from "@/content/services";
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
import { HowItWorks } from "@/components/sections/HowItWorks";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { StatsRow } from "@/components/sections/StatsRow";
import { Testimonials } from "@/components/sections/Testimonials";
import { PressBar } from "@/components/sections/PressBar";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { GoogleMapEmbed } from "@/components/sections/GoogleMapEmbed";
import { FaqSection } from "@/components/sections/FaqSection";
import { ArticlePreview } from "@/components/sections/ArticlePreview";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `BEST Window Cleaning & Pressure Washing Service Lexington SC - If you're looking for Window Cleaning or Pressure Washing near me - Ray's is the place to be`,
  description:
    `Professional window cleaning, pressure washing, soft washing, deck and concrete cleaning for homes ` +
    `across ${site.serviceRegion}. Same-day availability and the ${guaranteeName}.`,
  alternates: { canonical: "/" },
};

/**
 * The nine highest-intent questions, in the order a buyer actually asks them:
 * what is this, what will it cost me, how long does it last, is it safe, how
 * does booking work, and finally how do I pay.
 *
 * Nine rather than six because this section carries the homepage's answer-engine
 * weight — each entry is a question/answer pair emitted as FAQPage JSON-LD below,
 * and these are the queries people type. `hard-water` and `gutter-frequency` are
 * the two additions worth calling out: the first is the only window-cleaning
 * question here, which matters when half the business name is window cleaning,
 * and the second is the highest-repeat service we sell.
 *
 * It was ten until `contracts` ("Am I locked into a contract?") came out with
 * the maintenance plans — that answer described recurring visits that are no
 * longer sold. See the note where it used to sit in content/faqs.ts.
 *
 * All nine live in content/faqs.ts — the homepage never holds its own copy of an
 * answer, so this list and /faq can never contradict each other.
 */
const homeFaqIds = [
  "soft-vs-pressure",
  "quote-accuracy",
  "how-long-lasts",
  "plants-safe",
  "need-to-be-home",
  "gutter-frequency",
  "hard-water",
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
      {/* H1 = primary category + cityname */}
      <Hero
        eyebrow={`Serving ${site.serviceRegion}`}
        title="Window Cleaning & Pressure Washing Service Lexington SC"
        lede={`Glass, siding, decks and driveways, each on the method that surface can take. Backed by the ${guaranteeName}.`}
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
        secondaryCta={{ label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` }}
        project={featuredProjects[0]}
      />
      <TrustBar items={site.credentials} badges={credentialBadges} />
      <SymptomChecker services={residentialServices} />
      {/* H2 = secondary categories + most pertinent services */}
      <ServicesGrid
        services={featuredServices}
        heading={{
          eyebrow: "Secondary Categories & Services",
          title: "Soft Washing, House Washing, Window Cleaning & Driveway Pressure Washing Services",
          lede: "Pressure where pressure works, safe chemistry where soft washing is required.",
        }}
      />
      <BeforeAfterShowcase
        projects={featuredProjects}
        heading={{
          eyebrow: "Recent Work Portfolio",
          title: "Pressure Washing, Soft Washing & Roof Cleaning Projects in Lexington SC",
          lede: "Real local properties cleaned with precision soft washing, pressure washing, and streak-free window cleaning.",
        }}
      />
      {/* `VideoShowcase` used to sit here, between the photo proof and the
          process. It came out because `siteVideo` in content/media.ts is still
          an empty placeholder, so the live homepage was rendering a grey
          "VIDEO: ..." box in the middle of its strongest run of sections.

          The component and its content file are deliberately still in the
          codebase, unused, for whenever real full-job walkthrough footage
          exists — this is a render change, not a deletion. Note this is NOT the
          same thing as the two task-specific gutter/window clips, which belong
          in the gallery. */}
      <HowItWorks />
      <GuaranteeBand guarantee={site.guarantee} />
      {/* `MaintenanceTeaser` sat here, between the guarantee and the reviews.
          It and `/maintenance-plan` were deleted with the rest of the plans and
          offers at the business's direction — see the note in content/packages.ts.

          Tone alternation still holds without it: this ran hydro → sand → light
          and now runs hydro → light, so no two adjacent sections share a tone.
          Check that again if anything goes back in this slot. */}
      {/* Carousel on the homepage only. /reviews and the detail pages keep the
          grid, where seeing every review at once is the point (SECTIONS.md §2.10). */}
      <Testimonials items={featuredTestimonials} layout="carousel" />
      {/* Renders nothing until there is real press coverage. See content/press.ts. */}
      <PressBar />
      <ServiceAreaSection locations={locations} />
      {/* GBP map embed. Sits directly after the coverage section because the two
          answer adjacent questions — "which towns" then "where are you" — and
          low on the page because it is a lazy-loaded third-party iframe.
          `light`, not the component's `sand` default: ServiceAreaSection above
          is ink and FaqSection below is sand, so sand here would put two sand
          sections back to back (STRUCTURE.md tone alternation). */}
      <GoogleMapEmbed tone="light" />
      {/* limit={10}: FaqSection defaults to 6 and would silently truncate. */}
      <FaqSection items={getFaqs(homeFaqIds)} limit={10} groupName="faq-home" />
      <StatsRow stats={stats} />
      <ArticlePreview articles={featuredArticles} />
    </>
  );
}
