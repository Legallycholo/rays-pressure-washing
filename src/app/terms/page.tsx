import type { Metadata } from "next";
import { site, cityState, guaranteeName, hoursLine } from "@/content/site";
import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

/**
 * TERMS OF SERVICE — DRAFT, NOT YET REVIEWED BY COUNSEL.
 *
 * Written at the business's direction to replace the `LegalPageStub` that used
 * to sit here. It supersedes the "do not draft binding legal text here" note on
 * that component for this page only; the note still stands for /privacy and
 * /accessibility, which remain stubs.
 *
 * WHAT THIS IS: a faithful write-up of how this business already says it
 * operates. Every substantive clause below is derived from something the site
 * already commits to in public, not invented for this page:
 *
 *   - pricing and the no-surprises promise → the `quote-accuracy` FAQ
 *   - payment terms and no deposits       → the `payment` FAQ
 *   - the weather policy                  → the `weather` FAQ
 *   - the remedy and the refund backstop  → `site.guarantee`
 *   - what we decline to work on          → the roof note in `content/services.ts`
 *
 * Keep it that way. If a clause here starts promising something the rest of the
 * site doesn't, one of the two is now a lie, and this is the one a customer
 * will quote back. When one of those FAQ answers changes, change the matching
 * clause here in the same pass.
 *
 * WHAT IT IS NOT: legal advice, or a substitute for review. Before launch this
 * needs an attorney licensed in South Carolina to look at it — particularly the
 * liability, pre-existing condition and governing law sections, which are the
 * clauses that actually matter if a job goes wrong. Deliberately absent, and to
 * be added only on a lawyer's advice rather than copied off another company's
 * site: any arbitration clause, class-action waiver, or damages cap.
 */

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to our services and this website.",
  alternates: { canonical: "/terms" },
};

/** Bump whenever the substance below changes, not on every deploy. */
const LAST_UPDATED = "August 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${site.legalName} is a locally owned exterior cleaning company based in ${cityState}, providing pressure washing, soft washing, gutter cleaning and window cleaning for residential and commercial properties across ${site.serviceRegion}.`,
      "These terms apply when you book work with us and when you use this website. Booking a job means you accept them. If something here does not work for your situation, tell us before we start rather than after — most of it is more flexible than a page like this can sound.",
    ],
  },
  {
    heading: "The work we do, and what we decline",
    body: [
      "We clean exterior surfaces: siding, glass, concrete and other flatwork, decks, patios, fences, gutters, pool decks and screen enclosures, and the commercial equivalents of the same. The method is chosen per surface — low-pressure soft washing where pressure would cause damage, pressure only where the material can take it.",
      "We do not clean or treat roofs. We do not perform roof soft washing or shingle treatment, and we will decline that work rather than take it on. Clearing leaves and debris off a roof surface alongside a gutter clean is a different job, and one we do.",
      "If we arrive and find that a surface cannot be cleaned safely — because of its condition, its material, or something we could not see when quoting — we will tell you, explain why, and not charge you for work we have not done.",
    ],
  },
  {
    heading: "Quotes and pricing",
    body: [
      "We quote from the surfaces themselves, not from a square-footage guess. The number we give you is the number you pay.",
      "If something on site differs materially from what we discussed — significantly more area, a surface in a condition that changes the method, access that is not what was described — we will tell you before we start work and agree a revised price with you. We will not present you with a number for the first time on the invoice.",
      "Quotes are valid for 30 days unless we say otherwise in writing. Any figures shown on this website are indicative ranges to help you plan and are not offers; the only binding price is the one we give you for your property.",
    ],
  },
  {
    heading: "Scheduling, access and weather",
    body: [
      `We operate ${hoursLine}. We confirm your day in advance and call ahead on the morning of the job.`,
      "We need working access to an outdoor water supply and, for most jobs, an exterior power outlet, unless we have agreed otherwise beforehand. You do not need to be home for most exterior work, provided we have the access we need.",
      "Light rain does not affect most of what we do and sometimes helps. Heavy rain, lightning or high wind means we reschedule — we call you the morning of rather than leave you waiting, and you go to the front of the next available slot at no penalty.",
    ],
  },
  {
    heading: "Preparing your property",
    body: [
      "Before we arrive, please close and latch windows and doors, move vehicles clear of the work area, and tell us anything we would not otherwise know: a window that leaks, a loose board, a surface that has been repaired or repainted, a pet in the yard, or an irrigation or security system that needs switching off.",
      "We pre-soak and rinse landscaping as part of our normal process. If you have plantings that are unusually sensitive, tell us and we will work around them or cover them.",
    ],
  },
  {
    heading: "Our guarantee",
    body: [
      `${site.guarantee.title}: ${site.guarantee.body}`,
      `To make a claim under the ${guaranteeName}, contact us within 14 days of the work with a description of what is wrong, and photographs if you have them. We will come back and look. This guarantee covers the quality of the cleaning we performed; it is not a warranty against a surface getting dirty again over time, which every exterior surface does.`,
    ],
  },
  {
    heading: "Payment",
    body: [
      "Payment is due after the work is done and you have seen the result. We do not take deposits for standard residential jobs. Commercial work and unusually large jobs may be quoted on different terms, which we will set out in writing before we start.",
      "We accept card, bank transfer and the common digital wallets. You will receive an itemized invoice by email.",
    ],
  },
  {
    heading: "Cancelling or rescheduling",
    body: [
      "You can cancel or reschedule at no charge by telling us before the crew is dispatched on the day. We ask for as much notice as you can reasonably give, so the slot can go to someone else.",
      "If we cannot reach your property, or cannot start because access, water or power is not available as agreed and we were not told beforehand, we may charge a call-out fee to cover the trip. We will always try to reach you first rather than simply leaving.",
    ],
  },
  {
    heading: "Existing damage and the limits of cleaning",
    body: [
      "Cleaning reveals what is underneath it. Surfaces that are already failing — oxidized or chalking paint, cracked or spalling concrete, rotten timber, failed sealant, loose siding, previously broken window seals, aging gutter fixings — can look worse once the dirt covering them is gone, and in some cases cannot survive being cleaned at all.",
      "Where we can see a pre-existing condition, we will point it out before we start and agree with you how to proceed. We are not responsible for pre-existing damage, for defects revealed by cleaning, or for the failure of materials that were already at the end of their life. We are responsible for damage we cause through our own negligence, and we carry insurance for exactly that.",
      "Some staining is permanent. Rust, deeply penetrated oil, artillery fungus, acid etching and certain mineral deposits may lighten substantially without disappearing. Where we expect that, we tell you before you book rather than after we finish.",
    ],
  },
  {
    heading: "Insurance and liability",
    body: [
      "We are licensed and insured. A certificate of insurance is available on request, before work starts, for residential and commercial customers alike.",
      "If we damage something through our own negligence, tell us promptly and we will put it right through our insurance. Nothing in these terms limits liability that cannot lawfully be limited, including liability for death or personal injury caused by negligence, or for fraud.",
    ],
  },
  {
    heading: "Photographs of our work",
    body: [
      "We photograph most jobs before and after, from the same camera position, for our own quality records and to show prospective customers real work rather than stock imagery.",
      "These photographs show the property, never house numbers, vehicles, people or anything else that identifies you, and we describe locations only by town. If you would rather we did not photograph your property at all, or would like an existing photograph taken down, tell us and we will do it — no reason needed.",
    ],
  },
  {
    heading: "Reviews",
    body: [
      "We may ask you to leave a review. Whether you do, and what you say, is entirely your business — we do not offer discounts, credits or any other incentive in exchange for one, and we do not write, edit or filter them.",
    ],
  },
  {
    heading: "Using this website",
    body: [
      "The content of this site — text, photographs, and the layout itself — belongs to us and may not be reproduced commercially without permission. You are welcome to link to it.",
      "We work to keep the information here accurate and current, but the site is provided as-is: service descriptions, coverage areas and indicative figures can change, and the quote we give you for your property is what governs.",
      "Any estimate or guidance produced by tools on this site, including the pricing estimator and the assistant, is indicative only and is not a quote.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The version published here when you book is the version that applies to your job, so the date at the top of this page is the one that matters.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the State of South Carolina, and any dispute arising from them is subject to the jurisdiction of the courts of that state.",
      "If any part of these terms turns out to be unenforceable, the rest of them continue to apply.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      summary={`The terms under which ${site.legalName} provides cleaning services and operates this website: how we quote, how scheduling and weather work, when you pay, what our guarantee covers, and where the limits are.`}
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
