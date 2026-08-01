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
 * ── Provenance ──────────────────────────────────────────────────────────────
 *
 * This is Ray's confirmed service area, supplied 29 July 2026. It replaced a
 * drafted list, which had itself replaced an invented one (Springfield,
 * Lakeside, Oakmont, Riverbend…) that was generating location and matrix pages
 * for towns that do not exist in South Carolina.
 *
 * The supplied list named Batesburg-Leesville twice — once as the town and once
 * as "Leesville, Batesburg-Leesville" — because Batesburg and Leesville merged
 * into a single municipality in 1993. They are one entry here, with both former
 * town centers named in `neighborhoods`.
 *
 * Ordered by drive time from the Lexington shop, which is also roughly the order
 * they matter commercially.
 *
 * ── What still needs a local eye ────────────────────────────────────────────
 *
 * `driveMinutes` are road-distance estimates from Lexington, not measured
 * times. `population` figures are rounded census approximations. Both are
 * rendered on the page ("18 min from our shop", "11,000 residents"), so correct
 * anything that reads wrong to someone who drives these routes weekly.
 *
 * `neighborhoods` are deliberately conservative: only names verifiable as real
 * places are listed, and the smaller rural communities carry fewer entries
 * rather than padded ones. Ray should expand these — genuine local neighborhood
 * names are among the highest-value long-tail terms on the site, and he knows
 * them. Never invent one to lengthen a list; that is the mistake this file is
 * recovering from.
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
  /**
   * One short clause for meta descriptions. Keep under ~95 characters.
   *
   * This exists because `localChallenge` is written for the page — it is rendered
   * as a section lede and woven into body prose, so it wants to be a full,
   * specific sentence. It was also being interpolated straight into the meta
   * description of every city and service×city page, where the budget is ~160
   * characters before Google truncates. The result was 48 pages with descriptions
   * running 200–370 characters, cut off mid-sentence in the search result.
   *
   * Two fields because they are two jobs. Keep this distinct per city — thirteen
   * city pages sharing one description is its own problem.
   */
  summary: string;
  /** Neighborhood names: real internal-link and long-tail value. */
  neighborhoods: string[];
  /** Recognizable local reference points. */
  landmarks: string[];
  /** Slugs of services most requested here, reorders the city page grid. */
  topServices: string[];
  /**
   * Set true for the 3–4 cities you actually want ranking hardest. Each one
   * multiplies into eight service×city pages, so this is a real content
   * commitment rather than a preference.
   *
   * Lexington (home base), Chapin (the Lake Murray waterfront work the homepage
   * is positioned around), Irmo (dense, HOA-driven, high volume) and Columbia
   * (by far the largest market in range, at roughly 137,000 people against
   * Lexington's 24,000).
   *
   * Four rather than three because Columbia earns it on two counts: the search
   * volume is an order of magnitude above anywhere else on the list, and its
   * housing stock is genuinely the most varied — historic Shandon woodwork
   * through to northeast new-build — which gives the eight service pages real
   * material instead of padding. Adding a fifth would need the same test passed.
   */
  priority?: boolean;
};

export const locations: Location[] = [
  {
    slug: "lexington",
    city: "Lexington",
    region: "SC",
    driveMinutes: 0,
    population: "≈ 24,000",
    intro:
      "Lexington is where our trucks are parked, so it's the town we know street by street. The older blocks around Main Street are painted brick and hardboard siding that stains fast on the shaded side, while the subdivisions spreading toward Lake Murray are newer vinyl and stone with a completely different set of problems. Being based here also means we reach a Lexington address faster than anyone driving out from Columbia.",
    housingStock:
      "Mixed: older painted brick and hardboard near downtown, large newer vinyl and stone subdivisions toward Lake Murray",
    summary:
      "Home base. Dense oak canopy keeps north-facing walls damp, so algae comes back fast.",
    localChallenge:
      "Heavy oak and pine canopy over the established streets keeps north-facing walls damp most of the year, so algae comes back faster here than in the open new-build developments.",
    neighborhoods: [
      "Downtown Lexington",
      "Golden Hills",
      "Barr Lake",
      "Hope Ferry",
      "the Old Chapin Road corridor",
    ],
    landmarks: [
      "Icehouse Amphitheater",
      "Virginia Hylton Park",
      "Lexington County Museum",
      "Lexington Main Street",
    ],
    topServices: ["house-washing", "window-cleaning", "driveway-concrete"],
    priority: true,
  },
  {
    slug: "west-columbia",
    city: "West Columbia",
    region: "SC",
    driveMinutes: 12,
    population: "≈ 17,500",
    intro:
      "West Columbia has some of the oldest housing stock we work on, and a lot of it has been damaged by contractors treating painted wood and soft brick like new construction. We drop pressure well below standard on the older streets near the river and lean on chemistry instead, because the surface can't take force and doesn't need it.",
    housingStock:
      "Older painted wood and soft brick, wide porches, original architectural detail, plus post-war ranch",
    summary:
      "Older painted wood and soft brick that high pressure ruins. We use chemistry instead.",
    localChallenge:
      "Older, softer building materials that conventional high-pressure cleaning permanently scars, combined with Congaree river-corridor damp that keeps organic growth active on the shaded elevations.",
    neighborhoods: [
      "the State Street district",
      "Riverwalk",
      "Saluda Gardens",
      "the Sunset Boulevard corridor",
    ],
    landmarks: [
      "the West Columbia Riverwalk",
      "the Gervais Street Bridge",
      "the Interactive Art Park",
      "Sunset Boulevard",
    ],
    topServices: ["house-washing", "deck-patio", "window-cleaning"],
  },
  {
    slug: "seven-oaks",
    city: "Seven Oaks",
    region: "SC",
    driveMinutes: 15,
    population: "≈ 15,000",
    intro:
      "Seven Oaks is a settled 1970s and 80s suburb with the tree canopy that comes with fifty years of growth, and that canopy is the whole story here. Mature hardwoods over the houses mean permanently shaded siding, gutters that pack twice a year, and north elevations that never dry out long enough to stay clean on their own.",
    housingStock:
      "Established 1970s–80s single-family, brick and vinyl, mature hardwood canopy",
    summary:
      "Fifty years of tree cover means shaded siding and gutters that pack twice a year.",
    localChallenge:
      "Fifty years of tree growth over the houses: constant shade on the north elevations, leaf and needle fall clogging gutters, and shaded walls that never fully dry between rains.",
    neighborhoods: ["Seven Oaks", "Whitehall", "Quail Hollow", "the St. Andrews Road corridor"],
    landmarks: ["Seven Oaks Park", "St. Andrews Road", "Harbison", "the Saluda River"],
    topServices: ["gutter-cleaning", "house-washing", "window-cleaning"],
  },
  {
    slug: "irmo",
    city: "Irmo",
    region: "SC",
    driveMinutes: 18,
    population: "≈ 11,000",
    intro:
      "Irmo is dense, established and heavily HOA-governed, which changes why the phone rings. A lot of our Irmo calls start with a letter from a board rather than a homeowner deciding the house looks tired. We work to HOA specification and send the dated before-and-after photo set boards ask for, so the file closes the first time.",
    housingStock:
      "Established HOA subdivisions, uniform vinyl and brick, mature landscaping",
    summary:
      "HOA country. Driveway stains and siding streaks are the two most-cited violations.",
    localChallenge:
      "HOA compliance deadlines. Driveway staining and streaked siding are the two most-cited exterior violations in the area, and both are on a clock once the letter arrives.",
    neighborhoods: ["Friarsgate", "Harbison", "Coldstream", "Murraywood", "Ballentine"],
    landmarks: [
      "Harbison State Forest",
      "Columbiana Centre",
      "Irmo Community Park",
      "the Okra Strut grounds",
    ],
    topServices: ["driveway-concrete", "house-washing", "gutter-cleaning"],
    priority: true,
  },
  {
    slug: "columbia",
    city: "Columbia",
    region: "SC",
    driveMinutes: 20,
    population: "≈ 137,000",
    intro:
      "Columbia is the largest market in our range and the most varied — everything from Shandon bungalows with original wood detail to new construction out toward the northeast. That variety is the whole reason we quote off the surfaces rather than the square footage, because two houses of identical size in different Columbia neighborhoods need completely different methods.",
    housingStock:
      "Highly varied: historic bungalows with original wood, mid-century brick, and new-build vinyl and stone",
    summary:
      "Historic bungalows through to new build. The method changes street by street here.",
    localChallenge:
      "Midlands heat and humidity drive fast organic regrowth citywide, and the historic districts hold materials that high pressure permanently damages — so the method has to change street by street.",
    neighborhoods: ["Shandon", "Forest Acres", "Rosewood", "Heathwood", "Northeast Columbia"],
    landmarks: [
      "the University of South Carolina",
      "Riverbanks Zoo and Garden",
      "the South Carolina State House",
      "Five Points",
    ],
    topServices: ["house-washing", "window-cleaning", "driveway-concrete"],
    priority: true,
  },
  {
    slug: "chapin",
    city: "Chapin",
    region: "SC",
    driveMinutes: 22,
    population: "≈ 1,700",
    intro:
      "Chapin is Lake Murray's north shore, and the properties here reflect it: a lot of glass facing the water, boat docks, screened porches and pool surrounds, plus the shops and offices along Columbia Avenue. Everything sits close enough to open water that humidity never really lets go, and second-story glass is the single most requested job we run out here.",
    housingStock:
      "Large waterfront and near-waterfront homes, high glass-to-wall ratio, docks, boathouses, screened porches and pool decks",
    summary:
      "Lake Murray humidity feeds mildew on docks, decks and shaded siding year-round.",
    localChallenge:
      "Constant lake humidity and overnight condensation feed mildew on docks, railings and shaded siding almost year-round, and lake spray leaves mineral spotting on waterfront glass that ordinary washing won't lift.",
    neighborhoods: [
      "Timberlake",
      "Amicks Ferry",
      "Night Harbor",
      "Cedar Cove",
      "Palmetto Shores",
    ],
    landmarks: [
      "Dreher Island State Park",
      "Timberlake Country Club",
      "Crystal Lake Park",
      "Chapin Town Hall",
    ],
    topServices: ["window-cleaning", "house-washing", "pool-deck"],
    priority: true,
  },
  {
    slug: "gaston",
    city: "Gaston",
    region: "SC",
    driveMinutes: 22,
    population: "≈ 1,700",
    intro:
      "Gaston is small-town and rural south of Lexington, with large lots, long driveways and a lot of metal outbuildings. Access is easy and the properties are big, which makes it one of the few areas where a full exterior — house, drive, shop and fence — genuinely gets finished in a single visit.",
    housingStock:
      "Rural and semi-rural properties on large lots, long driveways, metal outbuildings and workshops",
    summary:
      "Large lots and long driveways where red clay stains wide stretches of concrete.",
    localChallenge:
      "Sandy soil and red clay splash stain long stretches of exposed concrete, and outbuilding siding and fence lines go years between cleanings because they are easy to overlook.",
    neighborhoods: ["Gaston town center", "Pine Ridge", "Sandy Run", "the Old State Road corridor"],
    landmarks: ["Gaston town center", "Congaree Creek", "Old State Road"],
    topServices: ["driveway-concrete", "house-washing", "fence-cleaning"],
  },
  {
    slug: "batesburg-leesville",
    city: "Batesburg-Leesville",
    region: "SC",
    driveMinutes: 30,
    population: "≈ 5,100",
    intro:
      "Batesburg-Leesville is two former towns that merged into one in 1993, and it still reads that way on the ground — two distinct main streets with older housing stock around each and farmland between. Sitting at the edge of our free-travel ring, it's an area where booking alongside a neighbor makes a real difference to the invoice.",
    housingStock:
      "Older small-town housing around two historic centers, plus surrounding agricultural properties and outbuildings",
    summary:
      "Two town centres of older painted wood, with farmland and outbuildings between.",
    localChallenge:
      "Agricultural dust and pollen settle on everything through spring, and the older painted wood around both town centers needs low pressure rather than the force a farm building can take.",
    neighborhoods: ["Batesburg", "Leesville", "the Ridge Spring Road corridor", "the Highway 1 corridor"],
    landmarks: [
      "downtown Batesburg",
      "downtown Leesville",
      "the South Carolina Poultry Festival grounds",
    ],
    topServices: ["house-washing", "driveway-concrete", "fence-cleaning"],
  },
  {
    slug: "hopkins",
    city: "Hopkins",
    region: "SC",
    driveMinutes: 35,
    population: "≈ 2,900",
    intro:
      "Hopkins sits in Lower Richland on the edge of the Congaree floodplain, and it is the dampest ground we work. Bottomland humidity, dense hardwood canopy and river fog that holds into mid-morning mean organic growth here is not seasonal, it's continuous. Gutter work and house washing carry most of what we do out this way.",
    housingStock:
      "Rural and large-lot properties under dense hardwood canopy, plus older frame housing through Lower Richland",
    summary:
      "Congaree bottomland damp keeps siding wet and packs gutters with hardwood fall.",
    localChallenge:
      "Congaree bottomland humidity keeps north walls damp almost year round, and heavy hardwood leaf fall packs gutters faster here than anywhere else in our range.",
    neighborhoods: ["Lower Richland", "the Garners Ferry Road corridor", "Mill Creek", "Congaree"],
    landmarks: [
      "Congaree National Park",
      "Mill Creek Park",
      "Garners Ferry Road",
      "Lower Richland High School",
    ],
    topServices: ["gutter-cleaning", "house-washing", "driveway-concrete"],
  },
  {
    slug: "blythewood",
    city: "Blythewood",
    region: "SC",
    driveMinutes: 38,
    population: "≈ 4,700",
    intro:
      "Blythewood is the newest-built area we cover and one of the fastest growing, which changes the job entirely. Large homes on big lots, wide motor courts, and a lot of concrete that is young enough to protect before it stains permanently. First clean-and-seal on new flatwork is the most requested work we run up here.",
    housingStock:
      "New-build and recent large-lot subdivisions, wide driveways and motor courts, light-colored concrete, plus surrounding horse property",
    summary:
      "New-build country. Clay-stained young concrete and builder overspray on glass.",
    localChallenge:
      "Red clay from ongoing construction stains new concrete quickly, and builder overspray on glass and siding is common on houses only a few years old.",
    neighborhoods: [
      "Cobblestone Park",
      "Longtown",
      "the Rimer Pond Road corridor",
      "Ashley Oaks",
    ],
    landmarks: [
      "Doko Meadows Park",
      "Cobblestone Park Golf Club",
      "the Blythewood Historic District",
    ],
    topServices: ["driveway-concrete", "window-cleaning", "house-washing"],
  },
  {
    slug: "gadsden",
    city: "Gadsden",
    region: "SC",
    driveMinutes: 40,
    population: "≈ 1,600",
    intro:
      "Gadsden is a small rural community down on the Congaree, and the river sets the terms for everything we clean there. Morning fog holds surfaces damp well past sunrise for most of the year, and when spring pine pollen settles onto ground that is already wet it bonds to siding and glass in a way ordinary dirt never does.",
    housingStock:
      "Rural properties and older frame housing near the river, agricultural outbuildings, long fence lines",
    summary:
      "River fog holds surfaces damp, so spring pine pollen bonds instead of rinsing.",
    localChallenge:
      "River fog keeps surfaces damp into mid-morning, so spring pine pollen bonds to siding and glass instead of rinsing off, and needle fall packs the gutters twice a year.",
    neighborhoods: ["Gadsden village", "the McCords Ferry Road corridor", "the Congaree bottomland"],
    landmarks: ["Congaree National Park", "the Congaree River", "McCords Ferry Road"],
    topServices: ["house-washing", "window-cleaning", "gutter-cleaning"],
  },
  {
    slug: "aiken",
    city: "Aiken",
    region: "SC",
    driveMinutes: 50,
    population: "≈ 30,000",
    intro:
      "Aiken is the most architecturally careful work we take on. The Winter Colony houses and the historic district hold original woodwork, soft brick and detail that a standard pressure washer would ruin in an afternoon, and the horse-country properties out toward Whiskey Road come with their own problem: stable dust, arena sand and fence line after fence line. We quote Aiken by the surface, never by the square foot.",
    housingStock:
      "Historic Winter Colony and downtown properties with original woodwork and soft brick, plus equestrian estates, barns and extensive fencing",
    summary:
      "Historic woodwork and horse country: stable dust, arena sand, fence after fence.",
    localChallenge:
      "Historic materials that high pressure permanently damages, combined with equestrian properties where stable dust and arena sand coat fencing and outbuildings continuously.",
    neighborhoods: [
      "the Historic District",
      "Woodside Plantation",
      "Houndslake",
      "Cedar Creek",
      "the Whiskey Road corridor",
    ],
    landmarks: [
      "Hitchcock Woods",
      "Hopelands Gardens",
      "the Aiken Historic District",
      "Laurens Street",
    ],
    topServices: ["house-washing", "fence-cleaning", "window-cleaning"],
  },
  {
    slug: "dalzell",
    city: "Dalzell",
    region: "SC",
    driveMinutes: 60,
    population: "≈ 3,000",
    intro:
      "Dalzell is our furthest regular route, out past Sumter near Shaw Air Force Base, so we batch jobs there into set days each month rather than making the drive twice. A lot of the housing turns over on military rotation, which means move-out cleans on a deadline — book alongside a neighbor and the travel fee comes off both invoices.",
    housingStock:
      "Military-adjacent single-family housing with frequent turnover, plus rural properties and outbuildings through Sumter County",
    summary:
      "Sandhills pollen and sandy splash, on housing that turns over with base rotation.",
    localChallenge:
      "Sandhills pollen and sandy soil splash coat siding and lower walls through spring, and rental turnover means a lot of properties go several years between exterior cleans.",
    neighborhoods: ["Dalzell", "the Shaw Air Force Base area", "Wedgefield", "Oakland"],
    landmarks: [
      "Shaw Air Force Base",
      "Poinsett State Park",
      "Manchester State Forest",
    ],
    topServices: ["house-washing", "driveway-concrete", "window-cleaning"],
  },
];

export const priorityLocations = locations.filter((l) => l.priority);
export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
export const locationSlugs = locations.map((l) => l.slug);

/**
 * Furthest drive time in the list. `CoverageMap` scales its rings against this
 * rather than a hardcoded ceiling, so adding a city further out than the
 * previous furthest re-scales the map instead of pushing a dot off the edge.
 */
export const maxDriveMinutes = Math.max(...locations.map((l) => l.driveMinutes));
