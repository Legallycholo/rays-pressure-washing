/**
 * The service catalog: window cleaning and pressure-washing-method services for
 * residential and commercial properties. This array drives:
 *   - the /services hub grid
 *   - every /services/[service] detail page
 *   - every /services/[service]/[city] programmatic SEO page
 *   - the nav mega-menu and the footer
 *
 * Adding a service here creates all of its pages automatically, and removing one
 * takes its detail page, its city matrix pages and its sitemap entries with it.
 * That is the reason this array stays deliberately short: every entry is a real
 * page that has to earn its place. The long list of named sub-services that
 * mirrors the Google Business Profile — rust removal, downspout cleaning,
 * skylight cleaning and the rest — lives in `content/service-categories.ts` as
 * display copy precisely so it can be exhaustive without minting a page (and a
 * sitemap entry, and a city matrix) for each one.
 *
 * Roof cleaning was removed here: it is not a service this business sells, and
 * a catalog entry for work that has to be turned down on the phone costs more
 * than it earns. Nothing roofing-related belongs in this array. Note that
 * clearing debris off a roof is a different thing from cleaning or treating one
 * — see the note on `roof-debris-removal` in `content/service-categories.ts`.
 */

/** Who the work is for. Orthogonal to `category` — see the note there. */
export type Segment = "residential" | "commercial";

/**
 * Which Google Business Profile category the service belongs to: the primary
 * category ("Pressure washing service") and the two secondaries ("Gutter
 * cleaning service", "Window cleaning service").
 *
 * Deliberately a separate field from `segment` rather than folded into it.
 * `segment` answers "who is this for", `category` answers "which line of
 * business is this" — a commercial window clean is both "commercial" and
 * "window-cleaning" at once, and collapsing the two into one field forces
 * compound values like "commercial-window" that then have to be parsed apart
 * again by the nav.
 *
 * These three values must stay in step with the categories actually set on the
 * Google Business Profile. Local search reads the profile categories and the
 * on-site service structure together, and a site that groups its work
 * differently from the profile is a mismatch signal rather than a neutral one.
 */
export type ServiceCategory = "pressure-washing" | "gutter-cleaning" | "window-cleaning";

export type Service = {
  slug: string;
  name: string;
  /** Short label for nav and chips. */
  navLabel: string;
  segment: Segment;
  /** Which GBP category this rolls up under. See `ServiceCategory`. */
  category: ServiceCategory;
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
    category: "pressure-washing",
    blurb:
      "A low-pressure soft wash that strips algae, mildew and mineral film off siding, stone and stucco without forcing water behind it.",
    intro:
      "Most of what makes a house look tired isn't dirt. It's organic growth feeding on the surface, and a Midlands summer feeds it constantly: heat, humidity that never fully lets go, shade from mature trees, and a north wall that doesn't dry out between rains. We treat it chemically at low pressure so the siding, seals and paint stay exactly where they belong. The green comes off; the house doesn't.",
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
    faqIds: ["soft-vs-pressure", "plants-safe", "how-long-lasts", "need-to-be-home"],
    related: ["gutter-cleaning", "window-cleaning", "deck-patio"],
    featured: true,
  },
  {
    slug: "driveway-concrete",
    name: "Driveway & Concrete Cleaning",
    navLabel: "Driveways & Concrete",
    segment: "residential",
    category: "pressure-washing",
    blurb:
      "Surface-cleaner passes that lift years of gray out of concrete evenly. No zebra stripes, no wand marks.",
    intro:
      "Concrete is where a rushed job shows forever. A pressure wand leaves stripes you'll see every time you pull in, and on a long driveway or a motor court there is nowhere to hide them. We use a rotating surface cleaner for an even lift across the whole slab, then hand-detail the edges and expansion joints.",
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
    faqIds: ["stripes", "oil-stains", "how-long-lasts"],
    related: ["deck-patio", "fence-cleaning", "pool-deck"],
    featured: true,
  },
  {
    slug: "deck-patio",
    name: "Deck & Patio Cleaning",
    navLabel: "Decks & Patios",
    segment: "residential",
    category: "pressure-washing",
    blurb:
      "Pressure dialed to the material: wood, composite, pavers and stone each get a different setting.",
    intro:
      "Wood, composite, travertine and pavers each fail in a different way under the wrong nozzle. Shaded decks are the worst of it: constant damp, little direct sun, and a slick film that builds up faster than anyone expects. We match pressure and chemistry to the material, so the surface comes back clean rather than furred, etched or stripped.",
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
    faqIds: ["wood-damage", "how-long-lasts", "furniture"],
    related: ["driveway-concrete", "pool-deck", "fence-cleaning"],
    featured: true,
  },
  {
    slug: "fence-cleaning",
    name: "Fence Cleaning",
    navLabel: "Fences",
    segment: "residential",
    category: "pressure-washing",
    blurb:
      "Vinyl, wood or aluminum. Both sides, top rail to bottom, with the green line at the base gone.",
    intro:
      "Fences collect the worst of it: soil splash at the base, algae on the shaded face, mildew in the grain. The bottom rail sits in ground that barely dries between rains, which is why the green stripe comes back there first. We clean both sides at a pressure the material can take, and we don't skip the neighbor-facing side.",
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
    faqIds: ["wood-damage", "plants-safe", "how-long-lasts"],
    related: ["house-washing", "deck-patio"],
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter Cleaning & Brightening",
    navLabel: "Gutters",
    segment: "residential",
    category: "gutter-cleaning",
    blurb:
      "Interiors cleared and flushed, exteriors brightened to remove the black tiger-stripe oxidation.",
    intro:
      "Clearing a gutter and cleaning a gutter are two different jobs. We do both: debris out and downspouts flowing, then the outward face treated to lift the black vertical streaking that ordinary washing leaves behind. A long run of gutter under mature canopy fills faster than most owners expect, and the Midlands keeps its hardwoods.",
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
    faqIds: ["gutter-frequency", "need-to-be-home"],
    related: ["house-washing", "window-cleaning"],
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    navLabel: "Windows",
    segment: "residential",
    category: "window-cleaning",
    blurb:
      "Pure-water pole system that leaves glass to dry spot-free, with no ladders leaning on your gutters.",
    intro:
      "We filter the minerals out of the water before it ever touches the glass, so it dries clear on its own and there is nothing left behind to squeegee or towel off. That matters most on a wall of glass that is the whole point of the room behind it, where hard-water spotting is the thing you notice from the sofa. Reaching second-story windows from the ground means no ladder feet in your flowerbeds and nobody standing on your roofline. Frames, sills and screens get cleaned in the same visit, because clean glass in a dirty frame still reads as dirty.",
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
    faqIds: ["hard-water", "interior-windows", "need-to-be-home"],
    related: ["house-washing", "gutter-cleaning"],
    featured: true,
  },
  {
    slug: "pool-deck",
    name: "Pool Deck & Screen Enclosure",
    navLabel: "Pool Decks",
    segment: "residential",
    category: "pressure-washing",
    blurb:
      "Deck, coping and any screen enclosure cleaned in one visit, because algae reseeds whatever you leave out.",
    intro:
      "A pool sits in shade and standing humidity all summer, and a screened enclosure holds both. Cleaning the deck on its own means the spores overhead reseed it inside a season. We do the deck, the coping and the enclosure frame and screens as one job so it actually stays clean.",
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
    faqIds: ["pool-chemicals", "plants-safe", "how-long-lasts"],
    related: ["deck-patio", "driveway-concrete"],
  },

  /*
    Commercial. Three entries, not thirty.

    This is the same crew and the same equipment as the residential work, sold
    to a buyer with different constraints: they care about being open tomorrow,
    about liability, and about the building looking maintained to a landlord or
    an inspector. The copy answers those, rather than restating the method
    argument that the residential entries already make.

    Kept deliberately to the three kinds of commercial property this business
    actually takes on. The temptation with a commercial section is to list every
    vertical a competitor lists — parking decks, fleet washing, gas station
    canopies, dumpster pads — and each one is a page that has to be turned down
    on the phone. Add a fourth only when it is genuinely being sold.

    `pricing` numbers here are PLACEHOLDER on the same terms as every entry
    above: the shape is real, the figures are not, and commercial jobs are
    quoted per site regardless.
  */
  {
    slug: "commercial-building-washing",
    name: "Commercial Building Washing",
    navLabel: "Building Washing",
    segment: "commercial",
    category: "pressure-washing",
    blurb:
      "Facades, entryways and walkways cleaned on your schedule, at a pressure the cladding can take.",
    intro:
      "A building tells a customer how the business inside it is run, and the parts that go first are the parts everyone walks past: the entry, the column bases, the walkway up to the door. We match the method to the cladding — soft wash for EIFS, stucco and painted panel, pressure where the substrate can take it — and we work early, late or on a weekend so nobody is stepping over a hose to get in.",
    icon: "building",
    method: "Soft wash",
    includes: [
      "Full facade, entry surround and soffits",
      "Method matched to cladding: EIFS, stucco, brick, panel",
      "Walkways and column bases hand-detailed",
      "Scheduled outside your trading hours",
      "Certificate of insurance provided on request",
    ],
    symptoms: [
      "Green or black staining down the shaded elevation",
      "Entry walkway darker than the rest of the lot",
      "Building reads tired next to a newer neighbour",
    ],
    pricing: { unit: "sq ft", from: 0.15, to: 0.35, minimum: 449, duration: "Half day – 2 days" },
    faqIds: ["soft-vs-pressure", "quote-accuracy", "how-long-lasts", "weather"],
    related: ["storefront-cleaning", "commercial-window-cleaning", "driveway-concrete"],
  },
  {
    slug: "storefront-cleaning",
    name: "Storefront & Walkway Cleaning",
    navLabel: "Storefronts",
    segment: "commercial",
    category: "pressure-washing",
    blurb:
      "The twenty feet a customer sees before they decide: glass, frames, entry mat area and the concrete out front.",
    intro:
      "Retail and restaurant frontage takes more traffic per square foot than anything else we clean, and it shows first at the threshold — gum, spills, grease tracked out from the kitchen, and a grey halo on the concrete where everyone stands. We clean the whole approach as one job, glass through to the sidewalk, on a cadence that keeps it from ever getting bad enough to notice.",
    icon: "storefront",
    method: "Surface clean",
    includes: [
      "Entry glass, frames and door hardware",
      "Sidewalk and threshold concrete surface-cleaned",
      "Gum and grease spot treatment",
      "Awning faces rinsed where safe to do so",
      "Recurring visits available, no contract required",
    ],
    symptoms: [
      "Grey traffic path worn into the sidewalk out front",
      "Gum or grease spotting at the threshold",
      "Fingerprinted glass by mid-morning",
    ],
    pricing: { unit: "flat", from: 149, to: 450, minimum: 149, duration: "1–3 hours" },
    faqIds: ["quote-accuracy", "how-long-lasts", "hard-water", "payment"],
    related: ["commercial-window-cleaning", "commercial-building-washing", "driveway-concrete"],
  },
  {
    slug: "commercial-window-cleaning",
    name: "Commercial Window Cleaning",
    navLabel: "Commercial Windows",
    segment: "commercial",
    category: "window-cleaning",
    blurb:
      "Storefront and low-rise glass on a repeating schedule, cleaned from the ground with pure water.",
    intro:
      "Office and retail glass is judged constantly and noticed only when it's bad, which makes it the one exterior job worth doing on a rhythm rather than when someone finally complains. The same pure-water pole system we use on houses reaches low-rise glass from the ground — no ladders across your entrance, no scaffold, no lane closed off — and it dries without spotting, so there is nothing to towel off after we leave.",
    icon: "window",
    method: "Hand detail",
    includes: [
      "Exterior glass, frames and sills",
      "Pure-water deionized system, no detergent residue",
      "Ground-reach poles: no ladders across walkways",
      "Interior glass available as an add-on",
      "Monthly or quarterly rounds, no contract required",
    ],
    symptoms: [
      "Hard-water spotting from irrigation overspray",
      "Film building on the inside of the entry glass",
      "Glass cleaned unevenly by whoever was free",
    ],
    pricing: { unit: "per item", from: 6, to: 16, minimum: 179, duration: "1–4 hours" },
    faqIds: ["hard-water", "interior-windows", "quote-accuracy", "payment"],
    related: ["storefront-cleaning", "commercial-building-washing", "window-cleaning"],
  },
];

export const residentialServices = services.filter((s) => s.segment === "residential");
export const commercialServices = services.filter((s) => s.segment === "commercial");
export const featuredServices = services.filter((s) => s.featured);

/** Every service in one GBP category, in catalog order. */
export const servicesInCategory = (category: ServiceCategory) =>
  services.filter((s) => s.category === category);

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug);
