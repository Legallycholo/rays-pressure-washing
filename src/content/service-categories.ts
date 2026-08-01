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
 * WRITING THE BLURBS. One or two sentences, describing the surface and what
 * comes off it. Three rules, all of which exist because breaking one creates a
 * claim the business then has to honour on the phone:
 *
 *   1. No prices, and no durations that read as a quote. Nothing on this site
 *      publishes a figure — see the note on `offers` in `lib/schema.ts`.
 *   2. Nothing that implies we clean or treat a roof surface. "Roof Debris
 *      Removal" below is the one roof-adjacent entry and its wording is load
 *      bearing; see the comment on it.
 *   3. No superlatives or invented specifics — no "military-grade", no
 *      equipment we don't own, no guarantee that isn't `site.guarantee`. The
 *      FTC note on `testimonials.ts` applies to service claims too.
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

export const serviceCategories: ServiceCategoryGroup[] = [
  {
    id: "pressure-washing",
    title: "Pressure Washing",
    gbpCategory: "Pressure washing service",
    primary: true,
    icon: "spray",
    lede: "Pressure where the surface can take it, soft washing where it can't. The method is chosen per surface, never per job.",
    subServices: [
      {
        name: "Power / Pressure Washing",
        blurb:
          "High-pressure cleaning for the surfaces that can take it — concrete, masonry, hard-wearing flatwork. Pressure is a tool here, not a default setting.",
      },
      {
        name: "Soft Wash Cleaning",
        blurb:
          "Low pressure and the right chemistry for siding, stucco and anything a wand would damage. It kills the growth at the root instead of blasting the top off it.",
      },
      {
        name: "House Washing",
        slug: "house-washing",
        blurb:
          "The whole exterior — siding, soffits, fascia, gutter faces, frames and sills — soft washed so the green comes off and the house stays where it is.",
      },
      {
        name: "Driveway & Sidewalk Cleaning",
        slug: "driveway-concrete",
        blurb:
          "A rotating surface cleaner lifts the grey evenly across the whole slab, then we hand-detail the edges and expansion joints. No wand stripes to look at later.",
      },
      {
        name: "Patio & Deck Cleaning",
        slug: "deck-patio",
        blurb:
          "Wood, composite, pavers and stone each get their own pressure and chemistry, so boards come back clean rather than furred, etched or stripped.",
      },
      {
        name: "Fence Cleaning",
        slug: "fence-cleaning",
        blurb:
          "Both faces, top rail to the green line at the base, at a pressure the material can take. We don't skip the side your neighbour looks at.",
      },
      {
        name: "Commercial Pressure Washing",
        slug: "commercial-building-washing",
        blurb:
          "Facades, entries and walkways for local businesses, cleaned early, late or at the weekend so nobody steps over a hose to get through your door.",
      },
      {
        name: "Rust Removal",
        blurb:
          "Irrigation rust, fertilizer stains and battery marks on concrete and masonry, treated with chemistry rather than pressure. Most lift out; some only lighten, and we say which before we start.",
      },
    ],
  },
  {
    id: "gutter-cleaning",
    title: "Gutter Cleaning",
    gbpCategory: "Gutter cleaning service",
    icon: "gutter",
    lede: "Clearing a gutter and cleaning a gutter are two different jobs. We do both, and we flow-test the downspouts before we leave.",
    subServices: [
      {
        name: "Gutter Cleaning",
        slug: "gutter-cleaning",
        blurb:
          "Debris out by hand, not blown into the flowerbeds, then every downspout flushed and flow-tested. You get before-and-after photos of each run.",
      },
      {
        name: "Downspout Cleaning",
        blurb:
          "The blockage is usually in the elbow, not the trough. We clear and flush each downspout and confirm water is actually moving away from the foundation.",
      },
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
      {
        name: "Roof Debris Removal",
        // Wording is load bearing. It describes clearing loose debris OFF a
        // roof; it must never imply washing, soft washing or treating the roof
        // surface. See the comment above and the note in llms.txt.
        blurb:
          "Leaves, twigs and grit cleared out of the valleys and off the shingles, usually in the same visit as the gutters — because what's in the gutter came off the roof.",
      },
      {
        name: "Gutter Brightening",
        slug: "gutter-cleaning",
        blurb:
          "The black vertical tiger-striping on the outward face is oxidation, and ordinary washing leaves it behind. This is the treatment that actually lifts it.",
      },
      {
        name: "Gutter Guard Cleaning",
        blurb:
          "Guards keep the big stuff out and let shingle grit and pollen through. We lift the covers, clear what's built up underneath, and refit them properly.",
      },
    ],
  },
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    gbpCategory: "Window cleaning service",
    icon: "window",
    lede: "Deionized pure water, reached from the ground. The glass dries clear on its own, so there is nothing left behind to towel off.",
    subServices: [
      {
        name: "Window Washing",
        slug: "window-cleaning",
        blurb:
          "Deionized water, so the glass dries clear on its own with nothing left to squeegee. Second-storey panes reached from the ground — no ladders in your flowerbeds.",
      },
      {
        name: "Commercial Window Cleaning",
        slug: "commercial-window-cleaning",
        blurb:
          "Storefront and low-rise glass on a monthly or quarterly round, cleaned from the ground so no ladder ever blocks your entrance. No contract required.",
      },
      {
        name: "Screen Cleaning",
        blurb:
          "Screens come out, get washed and dried, and go back in the opening they came from. Clean glass behind a grey screen still reads as dirty.",
      },
      {
        name: "Skylight Cleaning",
        blurb:
          "Glass, frame and the surrounding curb cleaned from above, where years of grit and organic film collect and quietly cost you the light you paid for.",
      },
      {
        name: "Glass Door Cleaning",
        blurb:
          "Entry and sliding doors, both sides, including the tracks and the handle area that takes every fingerprint. The first glass anyone actually touches.",
      },
    ],
  },
];

export const getServiceCategory = (id: ServiceCategory) =>
  serviceCategories.find((c) => c.id === id);
