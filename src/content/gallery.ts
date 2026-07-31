/**
 * Before/after project gallery, the single highest-converting asset a cleaning
 * business owns, and the thing the reference site under-uses most.
 *
 * ── WHICH OF THESE ARE REAL ─────────────────────────────────────────────────
 * `p1`, `p2` and `p9` are backed by Ray's own photography and footage, added
 * 2026-07-31 from `public/ray-image-assets/` via
 * `scripts/prepare-gallery-media.mjs`. They are the only `featured` entries —
 * see the note on `featuredProjects` at the bottom of this file.
 *
 * `p3`–`p8` are still **scaffolding**: the copy describes plausible jobs that
 * may never have happened, and `before`/`after` are empty strings, so
 * components render a labeled placeholder frame at the correct aspect ratio.
 * Their `citySlug`, `durationHours` and `surfaceArea` values were written for
 * layout, not recorded from a job sheet. Treat every one of them as unverified
 * until it is replaced with a real job.
 *
 * That distinction matters more than it looks: this file feeds
 * `BeforeAfterShowcase` on the service and city pages under headings that call
 * the work real, and `lib/schema.ts` reads nothing from here precisely because
 * inventing structured data about jobs is a different order of problem. Keep
 * it that way.
 *
 * To add real work: drop originals into `public/ray-image-assets/`, register
 * them in `scripts/prepare-gallery-media.mjs`, run it, and point `before`/
 * `after` (or `video`) at the generated `/gallery/` and `/video/` paths. Do not
 * reference anything under `/ray-image-assets/` directly — those are 3-5MB
 * unprocessed phone files.
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
  /**
   * REAL PHOTOGRAPHY. The first entry in this file backed by Ray's own images
   * rather than scaffolding, which also makes it the homepage hero's slider
   * (`page.tsx` reads `featuredProjects[0]`).
   *
   * Title, `alt` and `summary` were rewritten to describe what is actually in
   * the two frames. The scaffolded version claimed "ten years of unwashed
   * siding under heavy oak canopy" and an entry "detailed by hand" — none of
   * which is visible, and the photo has no oak canopy in it at all.
   *
   * `surfaceArea` was dropped rather than carried over: the old "2,400 sq ft"
   * was invented for layout, and a measured figure attached to a real job is a
   * claim. `durationHours` is required by the type, so it keeps the scaffolded
   * 4 — CONFIRM BOTH WITH RAY, along with `citySlug`, which is still the
   * home-base default rather than the city this job was actually in.
   */
  {
    id: "p1",
    title: "Two-story vinyl, full elevation soft wash",
    serviceSlug: "house-washing",
    citySlug: "lexington",
    before: "/gallery/house-washing-vinyl-before.jpg",
    after: "/gallery/house-washing-vinyl-after.jpg",
    alt: "Two-story cream vinyl siding before and after soft washing",
    summary:
      "Grey-green runoff streaking the full height of a two-story elevation, heaviest under the gutter line and along the lap seams. Soft washed at low pressure so nothing was driven behind the vinyl, down to the brick return.",
    durationHours: 4,
    featured: true,
  },

  /**
   * REAL FOOTAGE, video-led. `before`/`after` stay empty on purpose: there is
   * no before/after pair for this job, and `ProjectCard`/`GalleryLightbox`
   * render `video` in place of the slider when it is present.
   *
   * Fills the `p2` id gap and gives `gutter-cleaning` its first gallery
   * representation — that service had none at all, so its service page was
   * showing an empty showcase.
   */
  {
    id: "p2",
    title: "Gutter clear from the ladder, not the ground",
    serviceSlug: "gutter-cleaning",
    citySlug: "chapin",
    before: "",
    after: "",
    alt: "Crew clearing gutters by hand from an extension ladder at a two-story home",
    summary:
      "Two-story run reached from an extension ladder and cleared by hand, section by section, rather than blown through from a pole. Slower, and the only way to see what is actually in the trough.",
    video: {
      src: "/video/gutter-cleaning.mp4",
      poster: "/gallery/gutter-cleaning-poster.jpg",
      alt: "Fifteen-second clip of a crew member clearing a gutter by hand from an extension ladder",
    },
    durationHours: 2,
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

  /**
   * REAL FOOTAGE, video-led — see the note on `p2`. Placed on `irmo` because
   * `p7` already covers window cleaning in Gadsden and Irmo is a priority city
   * with no gallery entry of its own.
   */
  {
    id: "p9",
    title: "Upper-level glass on a modern build",
    serviceSlug: "window-cleaning",
    citySlug: "irmo",
    before: "",
    after: "",
    alt: "Crew washing exterior windows from a ladder at a modern two-story home",
    summary:
      "A contemporary elevation that is mostly glass, with deep overhangs that keep a pole off the upper panes. Worked from a ladder set on the terrace, one elevation at a time.",
    video: {
      src: "/video/window-washing.mp4",
      poster: "/gallery/window-cleaning-poster.jpg",
      alt: "Nine-second clip of a crew member washing exterior glass from a ladder",
    },
    durationHours: 3,
    featured: true,
  },
];

/**
 * Drives the homepage only — the hero slider (`featuredProjects[0]`) and
 * `BeforeAfterShowcase`.
 *
 * **`featured` now means "has real media", and only that.** `p3`, `p4` and `p7`
 * were featured while every one of them was an empty-string placeholder, so the
 * homepage's proof section — the part of the page whose entire job is showing
 * that the work is real — was three-quarters grey placeholder frames under the
 * heading "Every job below is a real property and a real result."
 *
 * Do not re-add `featured` to an entry until it has genuine photography or
 * footage. The rest of the scaffolded entries still render on /gallery and on
 * their service pages, where the placeholder frame reads as "photo pending"
 * rather than as the homepage's headline evidence.
 */
export const featuredProjects = projects.filter((p) => p.featured);

export const projectsFor = (opts: { serviceSlug?: string; citySlug?: string }) =>
  projects.filter(
    (p) =>
      (!opts.serviceSlug || p.serviceSlug === opts.serviceSlug) &&
      (!opts.citySlug || p.citySlug === opts.citySlug),
  );
