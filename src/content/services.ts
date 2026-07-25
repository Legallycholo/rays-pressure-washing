/**
 * The service catalogue. This array drives:
 *   - the /services hub grid
 *   - every /services/[service] detail page
 *   - every /services/[service]/[city] programmatic SEO page
 *   - the nav mega-menu, the footer, and the quote wizard's step 1
 *
 * Adding a service here creates all of its pages automatically.
 */

export type Segment = "residential" | "commercial";

export type Service = {
  slug: string;
  name: string;
  /** Short label for nav and chips. */
  navLabel: string;
  segment: Segment;
  /** One-line value proposition — used on cards and meta descriptions. */
  blurb: string;
  /** 2–3 sentence intro for the service page hero. */
  intro: string;
  /** Name of the icon in components/ui/Icon.tsx */
  icon: string;
  /** Method badge shown on the card — a genuine differentiator vs competitors. */
  method: "Soft wash" | "Pressure wash" | "Surface clean" | "Hand detail";
  /** Bullet list of what's included. */
  includes: string[];
  /** Problems this solves — used for the "is this you?" symptom checker. */
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
  /** How often it should be repeated — powers the maintenance-plan upsell. */
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
      "A low-pressure soft wash that strips algae, mildew and road film off siding without forcing water behind it.",
    intro:
      "Most of what makes a house look tired isn't dirt — it's organic growth feeding on the surface. We treat it chemically at low pressure so the siding, seals and paint stay exactly where they belong. The green comes off; the house doesn't.",
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
    related: ["roof-cleaning", "gutter-cleaning", "window-cleaning"],
    featured: true,
  },
  {
    slug: "roof-cleaning",
    name: "Roof Cleaning",
    navLabel: "Roof Cleaning",
    segment: "residential",
    blurb:
      "No-pressure treatment that kills the black streak algae shingles collect — without walking granules off your roof.",
    intro:
      "Those black streaks are a living organism eating the limestone filler in your shingles. Pressure would blast the protective granules straight into the gutter. We apply a treatment that kills it at the root and let the weather rinse it clean.",
    icon: "roof",
    method: "Soft wash",
    includes: [
      "Full roof algae and lichen treatment",
      "Gutter and downspout flush included",
      "Surrounding landscaping protected",
      "Post-treatment inspection photos",
    ],
    symptoms: [
      "Black streaks running down from the ridge",
      "Green or grey lichen patches",
      "Neighbours' roofs look newer than yours",
    ],
    pricing: { unit: "sq ft", from: 0.2, to: 0.45, minimum: 399, duration: "3–5 hours" },
    cadence: "Every 2–3 years",
    faqIds: ["roof-warranty", "soft-vs-pressure", "how-long-lasts"],
    related: ["house-washing", "gutter-cleaning"],
    featured: true,
  },
  {
    slug: "driveway-concrete",
    name: "Driveway & Concrete Cleaning",
    navLabel: "Driveways & Concrete",
    segment: "residential",
    blurb:
      "Surface-cleaner passes that lift years of grey out of concrete evenly — no zebra stripes, no wand marks.",
    intro:
      "Concrete is where a rushed job shows forever. A pressure wand leaves stripes you'll see every time you pull in. We use a rotating surface cleaner for an even lift, then hand-detail the edges and expansion joints.",
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
      "Concrete has gone grey or green",
      "Dark tyre marks and oil stains",
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
      "Pressure dialled to the material — wood, composite, pavers or stone all get a different setting.",
    intro:
      "Wood, composite, travertine and pavers each fail in a different way under the wrong nozzle. We match pressure and chemistry to the material, so the surface comes back clean rather than furred, etched or stripped.",
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
      "Grey, weathered timber",
      "Moss growing in the paver joints",
    ],
    pricing: { unit: "sq ft", from: 0.2, to: 0.4, minimum: 199, duration: "2–4 hours" },
    cadence: "Every 12 months",
    faqIds: ["wood-damage", "how-long-lasts", "furniture"],
    related: ["driveway-concrete", "pool-deck", "fence-cleaning"],
  },
  {
    slug: "fence-cleaning",
    name: "Fence Cleaning",
    navLabel: "Fences",
    segment: "residential",
    blurb:
      "Vinyl, wood or aluminium — both sides, top rail to bottom, with the green line at the base gone.",
    intro:
      "Fences collect the worst of it: soil splash at the base, algae on the shaded face, mildew in the grain. We clean both sides at a pressure the material can take, and we don't skip the neighbour-facing side.",
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
      "Grey, dull vinyl",
      "Black mildew spotting on timber",
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
      "Clearing a gutter and cleaning a gutter are two different jobs. We do both: debris out and downspouts flowing, then the outward face treated to lift the black vertical streaking that ordinary washing leaves behind.",
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
    related: ["roof-cleaning", "house-washing"],
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    navLabel: "Windows",
    segment: "residential",
    blurb: "Pure-water pole system — spot-free glass with no ladders leaning on your gutters.",
    intro:
      "We filter the minerals out of the water before it touches the glass, so it dries without spots and there's nothing left to squeegee. Reaching second-storey windows from the ground also means no ladder feet in your flowerbeds.",
    icon: "window",
    method: "Hand detail",
    includes: [
      "Exterior glass, frames and sills",
      "Pure-water deionised system",
      "Screens rinsed",
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
  },
  {
    slug: "pool-deck",
    name: "Pool Deck & Screen Enclosure",
    navLabel: "Pool Decks",
    segment: "residential",
    blurb:
      "Cage, screens and deck done together — the algae comes back fast when you only do one of them.",
    intro:
      "Pool cages hold moisture, and moisture grows everything. Cleaning the deck alone means the spores overhead reseed it within a season. We do the enclosure frame, the screens and the deck as one job so it actually stays clean.",
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
  {
    slug: "commercial-building-washing",
    name: "Commercial Building Washing",
    navLabel: "Building Washing",
    segment: "commercial",
    blurb:
      "Scheduled exterior maintenance for offices, retail and multi-family — done outside trading hours.",
    intro:
      "A tired building costs you tenants and foot traffic. We work to a fixed schedule, outside your operating hours, with the documentation your property manager or insurer needs on file.",
    icon: "building",
    method: "Soft wash",
    includes: [
      "Full building envelope",
      "Out-of-hours and overnight scheduling",
      "COI and safety documentation provided",
      "Multi-property contract pricing",
    ],
    symptoms: [
      "Streaking and staining on the facade",
      "Tenant complaints about appearance",
      "Upcoming inspection or property sale",
    ],
    pricing: { unit: "sq ft", from: 0.1, to: 0.28, minimum: 750, duration: "1–3 days" },
    cadence: "Every 6–12 months",
    faqIds: ["commercial-insurance", "after-hours", "contracts"],
    related: ["commercial-storefront", "commercial-flatwork"],
  },
  {
    slug: "commercial-storefront",
    name: "Storefront & Awning Cleaning",
    navLabel: "Storefronts",
    segment: "commercial",
    blurb: "Entryways, glass and awnings on a recurring schedule — before your doors open.",
    intro:
      "The three metres either side of your front door does more for your brand than most of your marketing. We keep the glass, the awning and the entry concrete looking maintained on a schedule you never have to think about.",
    icon: "storefront",
    method: "Pressure wash",
    includes: [
      "Entry glass and door frames",
      "Awning and signage cleaning",
      "Entry concrete degreased",
      "Weekly, fortnightly or monthly plans",
    ],
    symptoms: [
      "Gum and grime tracked across the entry",
      "Faded, dirty awning fabric",
      "Fingerprinted glass by mid-morning",
    ],
    pricing: { unit: "flat", from: 120, to: 450, minimum: 120, duration: "1–2 hours" },
    cadence: "Weekly to monthly",
    faqIds: ["after-hours", "contracts", "commercial-insurance"],
    related: ["commercial-building-washing", "commercial-flatwork"],
  },
  {
    slug: "commercial-flatwork",
    name: "Parking Lots & Sidewalks",
    navLabel: "Parking & Sidewalks",
    segment: "commercial",
    blurb:
      "Degreasing, gum removal and reclaimed-water flatwork that keeps you compliant with runoff rules.",
    intro:
      "Large-area flatwork isn't just a bigger driveway — there are wastewater rules about where the runoff goes. We capture and reclaim, degrease the oil-drop zones, and remove gum with heat rather than brute pressure.",
    icon: "parking",
    method: "Surface clean",
    includes: [
      "Water reclamation and compliant disposal",
      "Oil and grease spot treatment",
      "Gum removal",
      "Night and weekend scheduling",
    ],
    symptoms: [
      "Black oil drip lines in every bay",
      "Gum spotting across the walkways",
      "Municipal or landlord compliance notice",
    ],
    pricing: { unit: "sq ft", from: 0.06, to: 0.15, minimum: 600, duration: "1–2 nights" },
    cadence: "Quarterly to twice yearly",
    faqIds: ["water-reclaim", "after-hours", "contracts"],
    related: ["commercial-building-washing", "commercial-storefront"],
  },
];

export const residentialServices = services.filter((s) => s.segment === "residential");
export const commercialServices = services.filter((s) => s.segment === "commercial");
export const featuredServices = services.filter((s) => s.featured);

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug);
