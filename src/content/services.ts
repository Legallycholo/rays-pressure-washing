/**
 * The service catalog: window cleaning and pressure-washing-method services
 * for residential lake houses. This array drives:
 *   - the /services hub grid
 *   - every /services/[service] detail page
 *   - every /services/[service]/[city] programmatic SEO page
 *   - the nav mega-menu and the footer
 *
 * Adding a service here creates all of its pages automatically, and removing one
 * takes its detail page, its city matrix pages and its sitemap entries with it.
 *
 * Roof cleaning was removed here: it is not a service this business sells, and
 * a catalog entry for work that has to be turned down on the phone costs more
 * than it earns. Nothing roofing-related belongs in this array.
 */

export type Segment = "residential";

export type Service = {
  slug: string;
  name: string;
  /** Short label for nav and chips. */
  navLabel: string;
  segment: Segment;
  /** One-line value proposition, used on cards and meta descriptions. */
  blurb: string;
  /** 2–3 sentence intro for the service page hero. */
  intro: string;
  /** Name of the icon in components/ui/Icon.tsx */
  icon: string;
  /** Method badge shown on the card: a genuine differentiator vs competitors. */
  method: "Soft wash" | "Pressure wash" | "Surface clean" | "Hand detail";
  /** Bullet list of what's included. */
  includes: string[];
  /** Problems this solves, used for the "is this you?" symptom checker. */
  symptoms: string[];
  /** Drives the pricing estimator. All PLACEHOLDER numbers. */
  pricing: {
    unit: "sq ft" | "linear ft" | "per item" | "flat";
    from: number;
    to: number;
    /** Typical minimum charge for a callout. */
    minimum: number;
    /** Typical job duration, human readable. */
    duration: string;
  };
  /** How often it should be repeated. Powers the maintenance-plan upsell. */
  cadence: string;
  /** Service-specific FAQ ids, resolved against content/faqs.ts */
  faqIds: string[];
  /** Related service slugs for internal linking. */
  related: string[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "house-washing",
    name: "House Washing",
    navLabel: "House Washing",
    segment: "residential",
    blurb:
      "A low-pressure soft wash that strips algae, mildew and mineral film off siding, stone and stucco without forcing water behind it.",
    intro:
      "Most of what makes a house look tired isn't dirt. It's organic growth feeding on the surface, and a house that sits near open water feeds it constantly: humidity off the lake, shade from mature trees, and nothing ever fully drying out. We treat it chemically at low pressure so the siding, seals and paint stay exactly where they belong. The green comes off; the house doesn't.",
    icon: "home",
    method: "Soft wash",
    includes: [
      "Full exterior siding, soffits and fascia",
      "Gutter faces brightened",
      "Window frames and sills rinsed",
      "Entry doors and shutters hand-detailed",
      "Landscaping pre-soaked and rinsed after",
    ],
    symptoms: [
      "Green or black streaks on the north-facing walls",
      "Chalky white residue on siding",
      "Dark spots spreading under the eaves",
    ],
    pricing: { unit: "sq ft", from: 0.15, to: 0.3, minimum: 249, duration: "2–4 hours" },
    cadence: "Every 12–18 months",
    faqIds: ["soft-vs-pressure", "plants-safe", "how-long-lasts", "need-to-be-home"],
    related: ["gutter-cleaning", "window-cleaning", "deck-patio"],
    featured: true,
  },
  {
    slug: "driveway-concrete",
    name: "Driveway & Concrete Cleaning",
    navLabel: "Driveways & Concrete",
    segment: "residential",
    blurb:
      "Surface-cleaner passes that lift years of gray out of concrete evenly. No zebra stripes, no wand marks.",
    intro:
      "Concrete is where a rushed job shows forever. A pressure wand leaves stripes you'll see every time you pull in, and on a long lake-house driveway or a motor court there is nowhere to hide them. We use a rotating surface cleaner for an even lift across the whole slab, then hand-detail the edges and expansion joints.",
    icon: "driveway",
    method: "Surface clean",
    includes: [
      "Driveway, walkways and entry paths",
      "Rotary surface cleaner for even results",
      "Hand-detailed edges and joints",
      "Oil and rust spot pre-treatment",
      "Optional sealing quoted separately",
    ],
    symptoms: [
      "Concrete has gone gray or green",
      "Dark tire marks and oil stains",
      "Previous cleaning left visible stripes",
    ],
    pricing: { unit: "sq ft", from: 0.12, to: 0.25, minimum: 179, duration: "1–3 hours" },
    cadence: "Every 12 months",
    faqIds: ["stripes", "oil-stains", "how-long-lasts"],
    related: ["deck-patio", "fence-cleaning", "pool-deck"],
    featured: true,
  },
  {
    slug: "deck-patio",
    name: "Deck & Patio Cleaning",
    navLabel: "Decks & Patios",
    segment: "residential",
    blurb:
      "Pressure dialed to the material: wood, composite, pavers and stone each get a different setting.",
    intro:
      "Wood, composite, travertine and pavers each fail in a different way under the wrong nozzle. Waterside decks are the worst of it: constant damp, deep shade, and a slick film that builds up faster than anyone expects. We match pressure and chemistry to the material, so the surface comes back clean rather than furred, etched or stripped.",
    icon: "deck",
    method: "Pressure wash",
    includes: [
      "Material-matched pressure settings",
      "Railings, steps and balusters",
      "Paver joints re-sanded on request",
      "Furniture moved and replaced",
    ],
    symptoms: [
      "Boards feel slick or slippery underfoot",
      "Gray, weathered wood",
      "Moss growing in the paver joints",
    ],
    pricing: { unit: "sq ft", from: 0.2, to: 0.4, minimum: 199, duration: "2–4 hours" },
    cadence: "Every 12 months",
    faqIds: ["wood-damage", "how-long-lasts", "furniture"],
    related: ["driveway-concrete", "pool-deck", "fence-cleaning"],
    featured: true,
  },
  {
    slug: "fence-cleaning",
    name: "Fence Cleaning",
    navLabel: "Fences",
    segment: "residential",
    blurb:
      "Vinyl, wood or aluminum. Both sides, top rail to bottom, with the green line at the base gone.",
    intro:
      "Fences collect the worst of it: soil splash at the base, algae on the shaded face, mildew in the grain. On a lake lot the base of a fence line barely dries between rains, which is why the green stripe comes back there first. We clean both sides at a pressure the material can take, and we don't skip the neighbor-facing side.",
    icon: "fence",
    method: "Soft wash",
    includes: [
      "Both faces cleaned",
      "Base-line algae removed",
      "Gates and hardware detailed",
      "Post caps and rails included",
    ],
    symptoms: [
      "Green stripe along the bottom of the panels",
      "Gray, dull vinyl",
      "Black mildew spotting on wood",
    ],
    pricing: { unit: "linear ft", from: 2.5, to: 5, minimum: 179, duration: "1–3 hours" },
    cadence: "Every 12–18 months",
    faqIds: ["wood-damage", "plants-safe", "how-long-lasts"],
    related: ["house-washing", "deck-patio"],
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter Cleaning & Brightening",
    navLabel: "Gutters",
    segment: "residential",
    blurb:
      "Interiors cleared and flushed, exteriors brightened to remove the black tiger-stripe oxidation.",
    intro:
      "Clearing a gutter and cleaning a gutter are two different jobs. We do both: debris out and downspouts flowing, then the outward face treated to lift the black vertical streaking that ordinary washing leaves behind. Lake lots keep their hardwoods, and a long run of gutter under mature canopy fills faster than most owners expect.",
    icon: "gutter",
    method: "Hand detail",
    includes: [
      "Full debris removal by hand",
      "Downspouts flushed and flow-tested",
      "Exterior face brightened",
      "Before/after photos of every run",
    ],
    symptoms: [
      "Water spilling over the front edge in rain",
      "Black vertical stripes on the gutter face",
      "Plants growing out of the gutter",
    ],
    pricing: { unit: "linear ft", from: 1.5, to: 3.5, minimum: 149, duration: "1–3 hours" },
    cadence: "Twice yearly",
    faqIds: ["gutter-frequency", "need-to-be-home"],
    related: ["house-washing", "window-cleaning"],
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    navLabel: "Windows",
    segment: "residential",
    blurb:
      "Pure-water pole system that leaves glass to dry spot-free, with no ladders leaning on your gutters.",
    intro:
      "We filter the minerals out of the water before it ever touches the glass, so it dries clear on its own and there is nothing left behind to squeegee or towel off. That matters most on the lake-facing side of a house, where a wall of glass is the whole point of the room behind it and hard-water spotting is the thing you notice from the sofa. Reaching second-story windows from the ground means no ladder feet in your flowerbeds and nobody standing on your roofline. Frames, sills and screens get cleaned in the same visit, because clean glass in a dirty frame still reads as dirty.",
    icon: "window",
    method: "Hand detail",
    includes: [
      "Exterior glass, frames and sills",
      "Pure-water deionized system, no detergent residue",
      "Screens removed, rinsed and refitted",
      "Cobwebs cleared from frames and corners",
      "Interior glass available as an add-on",
    ],
    symptoms: [
      "Hard-water spotting that won't wipe off",
      "Cloudy film across the glass",
      "Cobwebs in the corners of every frame",
    ],
    pricing: { unit: "per item", from: 6, to: 14, minimum: 149, duration: "1–3 hours" },
    cadence: "Every 6–12 months",
    faqIds: ["hard-water", "interior-windows", "need-to-be-home"],
    related: ["house-washing", "gutter-cleaning"],
    featured: true,
  },
  {
    slug: "pool-deck",
    name: "Pool Deck & Screen Enclosure",
    navLabel: "Pool Decks",
    segment: "residential",
    blurb:
      "Deck, coping and any screen enclosure cleaned in one visit, because algae reseeds whatever you leave out.",
    intro:
      "A pool sits in shade and standing humidity all summer, and a screened enclosure holds both. On a lake property the pool usually sits between the house and the water, which is the dampest ground on the lot. Cleaning the deck on its own means the spores overhead reseed it inside a season. We do the deck, the coping and the enclosure frame and screens as one job so it actually stays clean.",
    icon: "pool",
    method: "Soft wash",
    includes: [
      "Screen enclosure frame and panels",
      "Full pool deck surface",
      "Coping and waterline edge",
      "Pool covered and protected throughout",
    ],
    symptoms: [
      "Black spotting on the screen frame",
      "Slippery deck around the waterline",
      "Green tint across the cage panels",
    ],
    pricing: { unit: "sq ft", from: 0.18, to: 0.35, minimum: 249, duration: "2–4 hours" },
    cadence: "Every 12 months",
    faqIds: ["pool-chemicals", "plants-safe", "how-long-lasts"],
    related: ["deck-patio", "driveway-concrete"],
  },
];

export const residentialServices = services.filter((s) => s.segment === "residential");
export const featuredServices = services.filter((s) => s.featured);

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug);
