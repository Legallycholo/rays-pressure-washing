/**
 * What this business sells BEYOND a single service.
 *
 * Two things now: recurring maintenance, and the travel rule behind the
 * neighbor discount `locations.ts` promises.
 *
 * WHAT USED TO BE HERE, and why it isn't: multi-service bundles, seasonal
 * campaigns (the homepage banner and its countdown), and the discount
 * percentages attached to all of them. The business is not running offers right
 * now and does not publish prices anywhere on the site, so a "Save 20%" badge
 * had no number to be a percentage of. Recover them from git history if offers
 * come back rather than retyping them.
 *
 * All figures are PLACEHOLDER.
 */

/* ---------------------------------------------------------------------------
   1. MAINTENANCE PLANS
   Converting a one-off customer into recurring revenue. Sold on cadence and
   on not having to think about it, never on a discount figure.
   ------------------------------------------------------------------------ */

export type MaintenancePlan = {
  slug: string;
  name: string;
  /** Visits per year. */
  frequency: string;
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
    blurb: "The minimum that keeps organic growth from ever getting established.",
    includes: [
      "One scheduled house wash per year",
      "Booked automatically, no chasing",
      "Held pricing for 12 months",
      "Priority rescheduling after weather delays",
    ],
    bestFor: "Open, sunny properties with little tree cover",
  },
  {
    slug: "seasonal",
    name: "Seasonal Care",
    frequency: "2 visits per year",
    blurb:
      "Spring and fall visits. It is the cadence that actually matches how fast growth returns in a humid climate.",
    includes: [
      "Two scheduled visits per year",
      "House wash plus driveway each visit",
      "Gutter clear included in the fall visit",
      "Spot-treatment call-outs between visits",
      "Held pricing for 12 months",
    ],
    bestFor: "Most homes, especially anything with shade on one elevation",
    mostPopular: true,
  },
  {
    slug: "complete",
    name: "Complete Care",
    frequency: "4 visits per year",
    blurb:
      "Quarterly attention across every exterior surface. For properties where appearance is never allowed to slip.",
    includes: [
      "Quarterly scheduled visits",
      "All exterior surfaces on rotation",
      "Roof treatment included every third year",
      "Unlimited spot-treatment call-outs",
      "First call after storms",
      "Held pricing for 24 months",
    ],
    bestFor: "Heavily shaded properties, lakefront homes, and HOA communities with strict standards",
  },
];

/** Terms are month-to-month by design. See faqs.ts → `contracts`. */
export const maintenancePlanTerms =
  "Month-to-month. Cancel any time. We'd rather keep the work by doing it well than by locking you in.";

/* ---------------------------------------------------------------------------
   2. TRAVEL / SERVICE RADIUS
   locations.ts already promises a neighbor discount on the furthest route.
   This is the rule behind it.
   ------------------------------------------------------------------------ */

export const travelPolicy = {
  /** Drive minutes within which there is no surcharge. */
  freeRadiusMinutes: 30,
  /** Waived when neighboring jobs are booked on the same route. */
  neighborWaiver: true,
  note: "Book alongside a neighbor on the same street and the travel fee comes off both invoices. Two jobs in one trip genuinely costs us less.",
};
