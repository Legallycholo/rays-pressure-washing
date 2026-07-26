/**
 * What this business sells BEYOND a single service.
 *
 * This file exists because exterior cleaning does not actually make its money
 * one driveway at a time. It makes it three ways:
 *   1. BUNDLES      — raising average job value on a visit already being made
 *   2. MAINTENANCE  — converting a one-off customer into recurring revenue
 *   3. SEASONAL     — concentrating demand into the windows that convert best
 *
 * All figures are PLACEHOLDER.
 */

import type { Segment } from "./services";

/* ---------------------------------------------------------------------------
   1. BUNDLES
   The single highest-leverage upsell in this trade. The truck, the crew, the
   setup and the drive are already paid for — every additional surface cleaned
   on the same visit is almost pure margin. Price bundles below the sum of
   their parts and both sides win.
   ------------------------------------------------------------------------ */

export type Bundle = {
  slug: string;
  name: string;
  /** The moment in a customer's life this is sold against. */
  trigger: string;
  blurb: string;
  segment: Segment;
  /** Service slugs included. Must match services.ts. */
  serviceSlugs: string[];
  /** Percentage off the sum of the individual services. */
  savingsPercent: number;
  /** Typical all-in duration. */
  duration: string;
  /** Ordering on the /packages page and homepage. */
  featured?: boolean;
  /** Most businesses need exactly one "most popular" — it anchors the others. */
  mostPopular?: boolean;
};

export const bundles: Bundle[] = [
  {
    slug: "whole-home-exterior",
    name: "Whole Home Exterior",
    trigger: "Everything at once, once a year — the default for most homeowners.",
    blurb:
      "House, roof, driveway, walkways and gutters in a single visit. The complete reset, and the best value we offer because we're only setting up once.",
    segment: "residential",
    serviceSlugs: ["house-washing", "roof-cleaning", "driveway-concrete", "gutter-cleaning"],
    savingsPercent: 20,
    duration: "1 full day",
    featured: true,
    mostPopular: true,
  },
  {
    slug: "curb-appeal",
    name: "Curb Appeal",
    trigger: "The parts people actually see from the street.",
    blurb:
      "House wash plus driveway and walkways. Covers roughly 80% of what changes a first impression, at about half the cost of the full package.",
    segment: "residential",
    serviceSlugs: ["house-washing", "driveway-concrete"],
    savingsPercent: 15,
    duration: "4–6 hours",
    featured: true,
  },
  {
    slug: "listing-ready",
    name: "Listing Ready",
    trigger: "Selling. Photography is booked and the exterior has to hold up.",
    blurb:
      "Full exterior plus windows, scheduled around your photographer. Turnaround prioritised — we work to the listing date, not our calendar.",
    segment: "residential",
    serviceSlugs: ["house-washing", "roof-cleaning", "driveway-concrete", "window-cleaning"],
    savingsPercent: 18,
    duration: "1 full day",
    featured: true,
  },
  {
    slug: "pool-season-ready",
    name: "Pool Season Ready",
    trigger: "Before the pool goes back into daily use.",
    blurb:
      "Enclosure, screens, deck and surrounding fence together — the only way it stays clean, since spores overhead reseed a deck cleaned on its own.",
    segment: "residential",
    serviceSlugs: ["pool-deck", "fence-cleaning", "deck-patio"],
    savingsPercent: 15,
    duration: "5–7 hours",
  },
  {
    slug: "storefront-refresh",
    name: "Storefront Refresh",
    trigger: "The three metres either side of your front door.",
    blurb:
      "Entry glass, awning and walkway degreased overnight. Priced as a recurring visit because doing it once achieves nothing.",
    segment: "commercial",
    serviceSlugs: ["commercial-storefront", "window-cleaning"],
    savingsPercent: 12,
    duration: "2–3 hours",
  },
  {
    slug: "property-envelope",
    name: "Full Property Envelope",
    trigger: "Annual property maintenance cycle or pre-inspection.",
    blurb:
      "Building exterior, walkways and parking areas as one scheduled program, with compliance documentation for your file.",
    segment: "commercial",
    serviceSlugs: ["commercial-building-washing", "commercial-flatwork", "commercial-storefront"],
    savingsPercent: 20,
    duration: "2–4 nights",
  },
];

export const featuredBundles = bundles.filter((b) => b.featured);
export const getBundle = (slug: string) => bundles.find((b) => b.slug === slug);
export const bundleSlugs = bundles.map((b) => b.slug);

/* ---------------------------------------------------------------------------
   2. MAINTENANCE PLANS
   faqs.ts already promises these ("our maintenance plan schedules it
   automatically at a lower rate") and services.ts carries a `cadence` field to
   drive them. This is the data behind that promise.

   Recurring work is worth more than its revenue: it routes efficiently, it
   removes the re-sell, and it turns a seasonal business into a predictable one.
   ------------------------------------------------------------------------ */

export type MaintenancePlan = {
  slug: string;
  name: string;
  /** Visits per year. */
  frequency: string;
  /** Discount off standard one-off rates. */
  discountPercent: number;
  blurb: string;
  includes: string[];
  bestFor: string;
  mostPopular?: boolean;
};

export const maintenancePlans: MaintenancePlan[] = [
  {
    slug: "annual",
    name: "Annual Refresh",
    frequency: "1 visit per year",
    discountPercent: 10,
    blurb: "The minimum that keeps organic growth from ever getting established.",
    includes: [
      "One scheduled house wash per year",
      "Booked automatically — no chasing",
      "Locked-in pricing for 12 months",
      "Priority rescheduling after weather delays",
    ],
    bestFor: "Open, sunny properties with little tree cover",
  },
  {
    slug: "seasonal",
    name: "Seasonal Care",
    frequency: "2 visits per year",
    discountPercent: 15,
    blurb:
      "Spring and autumn visits — the cadence that actually matches how fast growth returns in a humid climate.",
    includes: [
      "Two scheduled visits per year",
      "House wash plus driveway each visit",
      "Gutter clear included in the autumn visit",
      "Free spot-treatment call-outs between visits",
      "Locked-in pricing for 12 months",
    ],
    bestFor: "Most homes — especially anything with shade on one elevation",
    mostPopular: true,
  },
  {
    slug: "complete",
    name: "Complete Care",
    frequency: "4 visits per year",
    discountPercent: 25,
    blurb:
      "Quarterly attention across every exterior surface. For properties where appearance is never allowed to slip.",
    includes: [
      "Quarterly scheduled visits",
      "All exterior surfaces on rotation",
      "Roof treatment included every third year",
      "Unlimited spot-treatment call-outs",
      "First call after storms",
      "Locked-in pricing for 24 months",
    ],
    bestFor: "Heavily shaded properties, waterfront homes, and HOA communities with strict standards",
  },
];

/** Terms are month-to-month by design — see faqs.ts → `contracts`. */
export const maintenancePlanTerms =
  "Month-to-month. Cancel any time. We'd rather keep the work by doing it well than by locking you in.";

/* ---------------------------------------------------------------------------
   3. SEASONAL CAMPAIGNS
   Exterior cleaning demand is strongly seasonal, and the site should not look
   identical in February and June. One `active` campaign at a time surfaces as
   a homepage banner and reorders featured services.

   Set `active: true` on exactly one entry. More than one and the signal dies.
   ------------------------------------------------------------------------ */

export type SeasonalCampaign = {
  slug: string;
  /** Months this campaign is relevant, 1-indexed. */
  months: number[];
  headline: string;
  body: string;
  /** Services to push to the front of homepage grids while active. */
  promoteServices: string[];
  ctaLabel: string;
  ctaHref: string;
  /**
   * Hard deadline, ISO 8601. Optional, and most campaigns should leave it
   * unset — a maintenance-plan promo that "ends" on a date nobody enforces is
   * a lie the countdown will tell every visitor. Set it only when the offer
   * genuinely stops, and `SeasonalBanner` will show the time remaining.
   */
  endsAt?: string;
  active?: boolean;
};

export const seasonalCampaigns: SeasonalCampaign[] = [
  {
    slug: "spring-reset",
    months: [2, 3, 4],
    headline: "Spring books out first",
    body: "Every year the same thing happens: everyone calls in April and half of them wait three weeks. Book the reset now and pick your date.",
    promoteServices: ["house-washing", "driveway-concrete", "roof-cleaning"],
    ctaLabel: "Book the spring reset",
    ctaHref: "/packages/whole-home-exterior",
  },
  {
    slug: "pool-season",
    months: [4, 5, 6],
    headline: "Pool season starts in two weeks",
    body: "Cage, screens and deck together, before the pool goes back into daily use.",
    promoteServices: ["pool-deck", "deck-patio", "fence-cleaning"],
    ctaLabel: "Get pool-season ready",
    ctaHref: "/packages/pool-season-ready",
    active: true,
  },
  {
    slug: "storm-recovery",
    months: [6, 7, 8, 9],
    headline: "Storm cleanup — priority scheduling",
    body: "Debris, staining and blown-in grime after a storm. Maintenance plan customers get first call.",
    promoteServices: ["gutter-cleaning", "roof-cleaning", "house-washing"],
    ctaLabel: "Request storm cleanup",
    ctaHref: "/quote",
  },
  {
    slug: "holiday-ready",
    months: [10, 11],
    headline: "Guests before the holidays?",
    body: "Driveway, walkways and entry cleaned before the visitors arrive. Last full week of scheduling fills early.",
    promoteServices: ["driveway-concrete", "window-cleaning", "gutter-cleaning"],
    ctaLabel: "Book before the holidays",
    ctaHref: "/packages/curb-appeal",
  },
  {
    slug: "off-season",
    months: [12, 1],
    headline: "Off-season rates",
    body: "Quieter months, shorter lead times and lower pricing on the same work. Roof treatments especially.",
    promoteServices: ["roof-cleaning", "fence-cleaning", "deck-patio"],
    ctaLabel: "See off-season pricing",
    ctaHref: "/pricing",
  },
];

/**
 * The one campaign currently on air. A campaign whose `endsAt` is in the past
 * is never active regardless of its `active` flag — expiry is the primary
 * guard, and `Countdown` refusing to render "0d 0h" is only the fallback.
 *
 * Evaluated at build time on a statically prerendered site, so a campaign that
 * expires between deploys stays up until the next build. That is the right
 * trade for a marketing banner (no per-request work, no client flash); if an
 * offer ever needs to expire to the minute, move this check into the client
 * component rather than making the whole page dynamic.
 */
export const activeCampaign = seasonalCampaigns.find(
  (c) => c.active && (!c.endsAt || new Date(c.endsAt).getTime() > Date.now()),
);

/* ---------------------------------------------------------------------------
   4. TRAVEL / SERVICE RADIUS
   locations.ts already promises a neighbour discount on the furthest route.
   This is the rule behind it.
   ------------------------------------------------------------------------ */

export const travelPolicy = {
  /** Drive minutes within which there is no surcharge. */
  freeRadiusMinutes: 30,
  /** Flat surcharge beyond the free radius. PLACEHOLDER. */
  surcharge: 45,
  /** Waived when neighbouring jobs are booked on the same route. */
  neighborWaiver: true,
  note: "Book alongside a neighbour on the same street and the travel fee comes off both invoices — two jobs in one trip genuinely costs us less.",
};
