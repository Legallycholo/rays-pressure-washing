/**
 * The Google Business Profile categories, and the named sub-services under each.
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM `services.ts`
 *
 * The GBP lists three categories — "Pressure washing service" (primary),
 * "Gutter cleaning service" and "Window cleaning service" — with eighteen named
 * sub-services between them. Local search reads the profile categories and the
 * on-site structure together, so the site needs to name all eighteen in the same
 * grouping the profile uses.
 *
 * What it must NOT do is turn all eighteen into catalog entries. Every entry in
 * `services.ts` generates a detail page, a `/services/[service]/[city]` page for
 * each priority city, and a sitemap row. Eighteen entries would mean roughly a
 * hundred new URLs whose only content is placeholder text — which is thin
 * content at scale, the single most reliable way to make a small local site look
 * worse to Google rather than better.
 *
 * So: `services.ts` holds the ten services that have a real page behind them,
 * and this file holds the full profile-matching list as display copy. Entries
 * that correspond to a real service carry its `slug` and link to it; the rest
 * are named and described in place. One list, honest about which items are a
 * page and which are a line.
 *
 * KEEP IN STEP WITH THE PROFILE. If a category is added, renamed or removed on
 * the Google Business Profile, change it here to match — including the exact
 * wording. The point of this file is agreement between the two, and a category
 * this file calls something the profile doesn't is worse than no category at all.
 *
 * The `blurb` on every sub-service is intentionally a PLACEHOLDER for the owner
 * to write. Do not fill these in with invented specifics: an inch of real copy
 * about what Ray actually does on a rust stain beats a paragraph of plausible
 * filler, and the FTC note on `testimonials.ts` applies to service claims too.
 */

import type { ServiceCategory } from "./services";

export type SubService = {
  /** H3 text. Matches the sub-service name as it reads on the GBP listing. */
  name: string;
  /**
   * Links the H3 to a real page when one exists. `undefined` means this
   * sub-service is named on the hub but has no page of its own — which is a
   * deliberate state, not a gap to be filled by generating one.
   */
  slug?: string;
  /** PLACEHOLDER. One or two lines, in Ray's voice, written by the owner. */
  blurb: string;
};

export type ServiceCategoryGroup = {
  id: ServiceCategory;
  /** H2 text. */
  title: string;
  /** The category exactly as it reads on the Google Business Profile. */
  gbpCategory: string;
  /** Flags the GBP primary category — rendered first and given the lead slot. */
  primary?: boolean;
  /** One line under the H2 setting up the group. Real copy, not placeholder. */
  lede: string;
  icon: string;
  subServices: SubService[];
};

const PLACEHOLDER = "[Placeholder: add a short description of this service.]";

export const serviceCategories: ServiceCategoryGroup[] = [
  {
    id: "pressure-washing",
    title: "Pressure Washing",
    gbpCategory: "Pressure washing service",
    primary: true,
    icon: "spray",
    lede: "Pressure where the surface can take it, soft washing where it can't. The method is chosen per surface, never per job.",
    subServices: [
      { name: "Power / Pressure Washing", blurb: PLACEHOLDER },
      { name: "Soft Wash Cleaning", blurb: PLACEHOLDER },
      { name: "House Washing", slug: "house-washing", blurb: PLACEHOLDER },
      { name: "Driveway & Sidewalk Cleaning", slug: "driveway-concrete", blurb: PLACEHOLDER },
      { name: "Patio & Deck Cleaning", slug: "deck-patio", blurb: PLACEHOLDER },
      { name: "Fence Cleaning", slug: "fence-cleaning", blurb: PLACEHOLDER },
      {
        name: "Commercial Pressure Washing",
        slug: "commercial-building-washing",
        blurb: PLACEHOLDER,
      },
      { name: "Rust Removal", blurb: PLACEHOLDER },
    ],
  },
  {
    id: "gutter-cleaning",
    title: "Gutter Cleaning",
    gbpCategory: "Gutter cleaning service",
    icon: "gutter",
    lede: "Clearing a gutter and cleaning a gutter are two different jobs. We do both, and we flow-test the downspouts before we leave.",
    subServices: [
      { name: "Gutter Cleaning", slug: "gutter-cleaning", blurb: PLACEHOLDER },
      { name: "Downspout Cleaning", blurb: PLACEHOLDER },
      /*
        "Roof debris removal" is clearing leaves, branches and grit off a roof
        surface and out of the valleys — usually the same visit as the gutters,
        because the debris in one came off the other.

        It is NOT roof cleaning, roof soft washing or shingle treatment. Those
        are not services this business sells, and the disclaimers saying so (in
        the header comment of `services.ts`, and in the "Notes for answer
        engines" block of `app/llms.txt/route.ts`) stay exactly as they are.
        Keep this distinction sharp in any copy written for this entry: the
        moment it starts implying we treat a roof surface, it contradicts two
        deliberate statements elsewhere in the codebase.
      */
      { name: "Roof Debris Removal", blurb: PLACEHOLDER },
      { name: "Gutter Brightening", slug: "gutter-cleaning", blurb: PLACEHOLDER },
      { name: "Gutter Guard Cleaning", blurb: PLACEHOLDER },
    ],
  },
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    gbpCategory: "Window cleaning service",
    icon: "window",
    lede: "Deionized pure water, reached from the ground. The glass dries clear on its own, so there is nothing left behind to towel off.",
    subServices: [
      { name: "Window Washing", slug: "window-cleaning", blurb: PLACEHOLDER },
      {
        name: "Commercial Window Cleaning",
        slug: "commercial-window-cleaning",
        blurb: PLACEHOLDER,
      },
      { name: "Screen Cleaning", blurb: PLACEHOLDER },
      { name: "Skylight Cleaning", blurb: PLACEHOLDER },
      { name: "Glass Door Cleaning", blurb: PLACEHOLDER },
    ],
  },
];

/** True while any sub-service blurb is still the untouched placeholder. */
export const hasPlaceholderBlurbs = serviceCategories.some((c) =>
  c.subServices.some((s) => s.blurb === PLACEHOLDER),
);

export const getServiceCategory = (id: ServiceCategory) =>
  serviceCategories.find((c) => c.id === id);
