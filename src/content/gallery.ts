/**
 * Before/after project gallery, the single highest-converting asset a cleaning
 * business owns, and the thing the reference site under-uses most.
 *
 * `before` and `after` are intentionally empty strings right now. Components
 * detect that and render a labeled placeholder frame at the correct aspect
 * ratio, so layout is final before photography exists. Drop real images into
 * /public/gallery/ and fill in the paths, nothing else needs to change.
 *
 * Every `citySlug` points at a city in Ray's confirmed service area, matched to
 * the job it describes — the HOA roof to Irmo, the 14,000 sq ft motor court to
 * new-build Blythewood, the river-house glass to Gadsden on the Congaree. They
 * previously referenced invented placeholder towns, which left the gallery's
 * city filter offering options no page existed for.
 *
 * These are still descriptive scaffolding, not records: once real photography
 * lands, set each `citySlug` to the city the job actually came from.
 */

export type Project = {
  id: string;
  title: string;
  serviceSlug: string;
  citySlug: string;
  /** Empty string → placeholder frame renders. */
  before: string;
  after: string;
  alt: string;
  /** Short story, what the problem was and what was done. */
  summary: string;
  /**
   * Optional walkthrough clip for this one job. Absent by default and
   * placeholder-safe the same way `before`/`after` are: an empty `src` renders
   * the placeholder frame rather than a broken player. Direct file only,
   * a YouTube/Vimeo embed is a third-party script decision, not this field.
   */
  video?: { src: string; poster: string; alt: string };
  durationHours: number;
  /** Surfaced as a stat chip on the card. */
  surfaceArea?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "p1",
    title: "Two-story vinyl with heavy north-side algae",
    serviceSlug: "house-washing",
    citySlug: "lexington",
    before: "",
    after: "",
    alt: "Two-story vinyl-sided home before and after soft washing",
    summary:
      "Ten years of unwashed siding under heavy oak canopy. Soft washed at low pressure across two elevations, gutter faces brightened, entry detailed by hand.",
    durationHours: 4,
    surfaceArea: "2,400 sq ft",
    featured: true,
  },
  {
    id: "p2",
    title: "Black-streaked shingle roof, HOA violation",
    serviceSlug: "roof-cleaning",
    citySlug: "irmo",
    before: "",
    after: "",
    alt: "Asphalt shingle roof before and after no-pressure algae treatment",
    summary:
      "Gloeocapsa magma streaking across the full south elevation. No-pressure treatment applied, gutters flushed, dated documentation issued for the HOA board.",
    durationHours: 5,
    surfaceArea: "3,100 sq ft",
    featured: true,
  },
  {
    id: "p3",
    title: "Striped driveway corrected with surface cleaner",
    serviceSlug: "driveway-concrete",
    citySlug: "west-columbia",
    before: "",
    after: "",
    alt: "Concrete driveway before and after even surface cleaning",
    summary:
      "Previous contractor left wand striping across the whole slab. Re-cleaned edge to edge with a rotary surface cleaner, joints and borders hand-detailed.",
    durationHours: 3,
    surfaceArea: "900 sq ft",
    featured: true,
  },
  {
    id: "p4",
    title: "Screen enclosure and pool deck, full reset",
    serviceSlug: "pool-deck",
    citySlug: "chapin",
    before: "",
    after: "",
    alt: "Pool screen enclosure and deck before and after cleaning",
    summary:
      "Cage frame, screen panels and deck treated as one job so overhead spores couldn't reseed the deck. Pool covered throughout.",
    durationHours: 4,
    surfaceArea: "1,200 sq ft",
    featured: true,
  },
  {
    id: "p5",
    title: "1920s timber porch, low-pressure restoration",
    serviceSlug: "house-washing",
    citySlug: "columbia",
    before: "",
    after: "",
    alt: "Historic timber porch before and after gentle cleaning",
    summary:
      "Original timber with fragile paint. Pressure dropped to the minimum effective setting, architectural detail cleaned by hand along the grain.",
    durationHours: 6,
  },
  {
    id: "p6",
    title: "Motor court and walkway run",
    serviceSlug: "driveway-concrete",
    citySlug: "blythewood",
    before: "",
    after: "",
    alt: "Long residential driveway before and after surface cleaning",
    summary:
      "A wide motor court with years of even gray across it. Rotary surface cleaner end to end so the lift is uniform, edges and joints finished by hand.",
    durationHours: 9,
    surfaceArea: "14,000 sq ft",
  },
  {
    id: "p7",
    title: "Pollen-filmed river-house glass",
    serviceSlug: "window-cleaning",
    citySlug: "gadsden",
    before: "",
    after: "",
    alt: "River-facing home windows before and after pure water cleaning",
    summary:
      "Baked-on spring pollen across 22 panes. Pure-water deionized system, frames and sills included, screens rinsed and refitted.",
    durationHours: 3,
  },
  {
    id: "p8",
    title: "Vinyl fence with base-line algae",
    serviceSlug: "fence-cleaning",
    citySlug: "batesburg-leesville",
    before: "",
    after: "",
    alt: "White vinyl fence before and after soft washing",
    summary:
      "Green soil-splash line along 180 feet of panel. Soft washed both faces, gates and post caps detailed.",
    durationHours: 3,
    surfaceArea: "180 linear ft",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectsFor = (opts: { serviceSlug?: string; citySlug?: string }) =>
  projects.filter(
    (p) =>
      (!opts.serviceSlug || p.serviceSlug === opts.serviceSlug) &&
      (!opts.citySlug || p.citySlug === opts.citySlug),
  );
