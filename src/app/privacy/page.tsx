import type { Metadata } from "next";
import { site, cityState } from "@/content/site";
import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

/**
 * PRIVACY POLICY — DRAFT, NOT YET REVIEWED BY COUNSEL.
 *
 * Same standing as /terms: written at the business's direction, replacing the
 * `LegalPageStub`, and superseding that component's "do not draft binding legal
 * text here" note for this page only. /accessibility is still a stub.
 *
 * WHAT THIS IS: a description of what this site actually does, verified against
 * the code rather than assumed. Every claim below was checked:
 *
 *   - the field list        → `Lead` in app/api/leads/route.ts and ContactForm
 *   - "stored then emailed" → the ordering note at the top of that same route
 *   - Supabase as the store → the same route's provisioning note
 *   - analytics             → `<Analytics />` (Vercel) in app/layout.tsx
 *   - no ad tracking        → there is no ad pixel anywhere in the codebase
 *
 * That last one is the important one. A privacy policy that lists trackers a
 * site doesn't run is merely sloppy; one that OMITS a tracker it does run is a
 * compliance problem. If a pixel, ad tag, session recorder, chat widget or CRM
 * script is ever added, this page has to change in the same commit — that is
 * the whole reason the sources are enumerated above.
 *
 * WHAT IT IS NOT: legal advice. Before launch this wants a lawyer's eye,
 * particularly on the retention period and on whether the business has
 * obligations under any state privacy law that applies to it. Deliberately
 * absent because they are claims this business cannot yet truthfully make:
 * any GDPR/CCPA-specific rights section, a Do Not Sell link, or a cookie
 * consent banner. Add them if and when they actually apply.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect your information.",
  alternates: { canonical: "/privacy" },
};

/** Bump whenever the substance below changes, not on every deploy. */
const LAST_UPDATED = "August 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${site.legalName} provides pressure washing, soft washing, gutter cleaning and window cleaning for residential and commercial properties across ${site.serviceRegion}, from our base in ${cityState}.`,
      "This policy describes what we do with the information you give us through this website, our quote and contact forms, and the assistant on this site. It is written to be read, not to be survived.",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "When you request a callback or a quote, we collect only what we need to call you back and price the work:",
    ],
    bullets: [
      "Your name",
      "Your email address",
      "Your phone number",
      "Your city",
      "The services you selected",
      "Anything you type into the message field",
    ],
  },
  {
    heading: "What we do not collect",
    body: [
      "We do not ask for payment card details through this website. Payment is taken after the work is done, and never through a form on this site.",
      "We do not run advertising pixels, ad-network trackers, session recorders or cross-site profiling of any kind on this website. We do not buy contact data, and we do not add you to a mailing list because you filled in a quote form.",
    ],
  },
  {
    heading: "Why we use it",
    body: [
      "To respond to your enquiry, prepare an estimate, schedule the work, and follow up about the job you asked about. That is the whole list.",
      "We do not sell your personal information, and we do not share it for anyone else's marketing.",
    ],
  },
  {
    heading: "How it is stored",
    body: [
      "Form submissions are saved to a hosted database and then emailed to us so the enquiry reaches a person. Access is limited to the people who need it to run the business and do the work.",
      "We use established hosting and database providers who process this data only on our behalf. They are service providers, not recipients we sell to.",
    ],
  },
  {
    heading: "Analytics",
    body: [
      "We use privacy-friendly, aggregate analytics to understand which pages get used and how the site performs — page views, load times, and roughly where traffic comes from. It tells us that a page is slow or popular; it does not tell us who you are, and it is not used to build a profile of you or to target advertising.",
    ],
  },
  {
    heading: "The assistant on this site",
    body: [
      "This site has an assistant that answers questions about our services, coverage and process. What you type into it is used to produce an answer and to help us improve the answers it gives.",
      "It is a convenience, not a confessional: please do not enter payment details, passwords, or anything sensitive you would not put in an ordinary email. If you want to tell us something private, call or email instead.",
    ],
  },
  {
    heading: "Photographs of your property",
    body: [
      "We photograph most jobs before and after for our quality records and to show real work rather than stock imagery. These photographs show the property only — never house numbers, vehicles, people, or anything else that identifies you — and we describe locations by town.",
      "If you would rather we did not photograph your property, or want an existing photograph taken down, tell us and we will do it. No reason needed.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiry and job records for as long as we need them to provide the service, answer billing or guarantee questions afterwards, and meet our legal and tax obligations. When a record is no longer needed for any of those, we delete it.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it where we have no continuing reason to keep it. Just contact us using the details below and tell us what you would like — we will not make you fill in a form to do it.",
      "If you would rather not leave your details on a website at all, call us. That has always been an option and always will be.",
    ],
  },
  {
    heading: "Children",
    body: [
      "This site is intended for adults arranging work on a property. We do not knowingly collect information from children.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If what we do with your information changes, this page changes with it, and the date at the top is updated. We will not quietly broaden how we use data already collected.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary={`What ${site.legalName} collects through this website, why, how long we keep it, and what you can ask us to do about it.`}
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
