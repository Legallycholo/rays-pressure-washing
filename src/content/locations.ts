/**
 * Service-area cities. Combined with services.ts this generates the
 * /services/[service]/[city] matrix.
 *
 * IMPORTANT, the anti-thin-content strategy:
 * The reference site (fullpowerwash.com) generates near-identical city pages,
 * which is exactly what Google's helpful-content system demotes. Every city
 * below carries genuinely distinct data (housing stock, local conditions,
 * neighborhoods, landmarks) and the page templates weave those into the
 * prose. A city with only a name will render a visibly thinner page, which is
 * the intended pressure to fill this in properly.
 *
 * All values are PLACEHOLDER. The city names are invented; only the `region`
 * and the climate details are real, and those are written for the South
 * Carolina Midlands (the (803) area code). Replace the whole array with the
 * actual route list before launch. Nothing here should ship as-is.
 */

export type Location = {
  slug: string;
  city: string;
  region: string;
  /** Shown as "15 min from our shop" style proximity signal. */
  driveMinutes: number;
  population: string;
  /** Distinct, city-specific paragraph. This is what stops pages being clones. */
  intro: string;
  /** Dominant housing/building stock. Changes which services get emphasized. */
  housingStock: string;
  /** The local environmental problem that drives demand here. */
  localChallenge: string;
  /** Neighborhood names: real internal-link and long-tail value. */
  neighborhoods: string[];
  /** Recognizable local reference points. */
  landmarks: string[];
  /** Slugs of services most requested here, reorders the city page grid. */
  topServices: string[];
  /** Set true for the 3–4 cities you actually want ranking hardest. */
  priority?: boolean;
};

export const locations: Location[] = [
  {
    slug: "springfield",
    city: "Springfield",
    region: "SC",
    driveMinutes: 0,
    population: "≈ 42,000",
    intro:
      "Springfield is where our trucks are parked, so it's the area we know street by street. The older blocks near the town center are mostly painted brick and hardboard siding that stains fast on the shaded side, while the newer subdivisions out east are vinyl and pavers with a different set of problems entirely.",
    housingStock: "Mixed: 1970s painted brick near the center, newer vinyl subdivisions east",
    localChallenge:
      "Heavy oak and pine canopy over the older streets keeps north-facing walls damp most of the year, so algae regrows faster here than in the open developments.",
    neighborhoods: ["Old Town", "Cypress Landing", "Eastwood Park", "Millers Creek", "The Grove"],
    landmarks: ["Springfield Town Square", "Riverside Park", "Springfield Community College"],
    topServices: ["house-washing", "driveway-concrete", "roof-cleaning"],
    priority: true,
  },
  {
    slug: "lakeside",
    city: "Lakeside",
    region: "SC",
    driveMinutes: 12,
    population: "≈ 28,500",
    intro:
      "Almost everything in Lakeside sits within a few hundred yards of open water, and that constant humidity shows up on exterior surfaces sooner than anywhere else we work. Docks, boathouses and shaded decks here need attention about twice as often as properties a mile inland.",
    housingStock: "Waterfront single-family, high proportion of decks, docks and pool surrounds",
    localChallenge:
      "Lake humidity and overnight condensation feed mildew on decks, railings and shaded siding almost continuously.",
    neighborhoods: ["Harbor Point", "Willow Bay", "North Shore", "Marina District"],
    landmarks: ["Lakeside Marina", "Waterfront Boardwalk", "Heron Point Nature Reserve"],
    topServices: ["pool-deck", "house-washing", "roof-cleaning"],
    priority: true,
  },
  {
    slug: "oakmont",
    city: "Oakmont",
    region: "SC",
    driveMinutes: 18,
    population: "≈ 61,000",
    intro:
      "Oakmont's HOA-managed communities have some of the strictest exterior appearance standards in the region, and violation letters are the reason most people here call us. We work to HOA specification and provide the dated photo documentation boards ask for.",
    housingStock: "HOA-governed subdivisions, tile and shingle roofs, uniform vinyl and stucco",
    localChallenge:
      "HOA compliance deadlines. Roof streaking and driveway staining are the two most-cited violations in the area.",
    neighborhoods: ["Oakmont Reserve", "Sterling Chase", "Bridgewater", "The Enclave at Oakmont"],
    landmarks: ["Oakmont Golf Club", "Sterling Town Center", "Oakmont Regional Library"],
    topServices: ["roof-cleaning", "driveway-concrete", "house-washing"],
    priority: true,
  },
  {
    slug: "riverbend",
    city: "Riverbend",
    region: "SC",
    driveMinutes: 22,
    population: "≈ 19,200",
    intro:
      "Riverbend's historic district is full of properties that predate modern siding, and a lot of them have been damaged by contractors treating old wood and soft brick like new construction. We drop pressure well below standard here and lean on chemistry instead.",
    housingStock: "Historic wood and soft brick, wide porches, original architectural detail",
    localChallenge:
      "Older, softer building materials that are easily damaged by conventional high-pressure cleaning.",
    neighborhoods: ["Historic Riverbend", "Mill Quarter", "Chestnut Row", "Southbank"],
    landmarks: ["Riverbend Historic Depot", "The Old Mill", "Riverwalk Trail"],
    topServices: ["house-washing", "deck-patio", "window-cleaning"],
  },
  {
    slug: "north-valley",
    city: "North Valley",
    region: "SC",
    driveMinutes: 25,
    population: "≈ 34,800",
    intro:
      "North Valley is still being built out, which means red clay construction dust on everything and a lot of brand-new concrete that homeowners want protected before it stains permanently. First-clean-and-seal is our most requested job here.",
    housingStock: "New-build subdivisions, large driveways, light-colored concrete and pavers",
    localChallenge:
      "Construction dust and clay staining on new concrete, plus builder overspray on windows and siding.",
    neighborhoods: ["Valley Crest", "Summit Ridge", "Copper Creek", "Highland Park"],
    landmarks: ["North Valley Sports Complex", "Summit Ridge Trailhead", "Valley Marketplace"],
    topServices: ["driveway-concrete", "window-cleaning", "house-washing"],
  },
  {
    slug: "port-haven",
    city: "Port Haven",
    region: "SC",
    driveMinutes: 30,
    population: "≈ 25,600",
    intro:
      "Port Haven sits low on the river with pine woods on three sides, which hands us two problems in the same town. River fog keeps everything damp into mid-morning for most of the year, and the loblolly pollen in March and April settles onto whatever the fog has already wet. That combination bonds to siding and glass in a way ordinary dirt never does.",
    housingStock: "River-facing homes and older working waterfront, metal outbuildings, boat storage",
    localChallenge:
      "Morning river fog holds surfaces damp long enough for spring pine pollen to bond to them, and needle fall packs the gutters twice a year.",
    neighborhoods: ["Harbor Heights", "Dockside", "Longleaf", "Old Port"],
    landmarks: ["Port Haven Landing", "The Old Boatworks", "Riverfront Park"],
    topServices: ["house-washing", "window-cleaning", "gutter-cleaning"],
  },
  {
    slug: "cedar-park",
    city: "Cedar Park",
    region: "SC",
    driveMinutes: 35,
    population: "≈ 47,300",
    intro:
      "Cedar Park's commercial strip along the highway is our biggest account cluster: retail plazas, quick-service restaurants and medical offices that need scheduled overnight work. Residential demand skews to the wooded western suburbs.",
    housingStock: "Retail plazas and offices along the corridor, wooded residential to the west",
    localChallenge:
      "Grease and gum accumulation across high-traffic retail flatwork, plus heavy leaf litter in the wooded suburbs.",
    neighborhoods: ["Cedar Commons", "Westwood", "Pine Hollow", "Highway Business District"],
    landmarks: ["Cedar Park Plaza", "Memorial Hospital", "Cedar Park Nature Preserve"],
    topServices: ["commercial-flatwork", "commercial-storefront", "gutter-cleaning"],
  },
  {
    slug: "maple-grove",
    city: "Maple Grove",
    region: "SC",
    driveMinutes: 40,
    population: "≈ 15,900",
    intro:
      "Maple Grove is our furthest regular route, so we batch jobs there into set days each month. Book alongside a neighbor and we'll take the travel surcharge off both invoices. It is genuinely cheaper for us to do two houses in one trip.",
    housingStock: "Large-lot rural and semi-rural properties, long driveways, outbuildings",
    localChallenge:
      "Long unshaded driveways and outbuildings that collect agricultural dust and organic staining.",
    neighborhoods: ["Grove Center", "Maple Ridge", "Country Estates", "Fairview"],
    landmarks: ["Maple Grove Fairgrounds", "Grove Center Historic Main Street"],
    topServices: ["driveway-concrete", "house-washing", "fence-cleaning"],
  },
];

export const priorityLocations = locations.filter((l) => l.priority);
export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
export const locationSlugs = locations.map((l) => l.slug);
