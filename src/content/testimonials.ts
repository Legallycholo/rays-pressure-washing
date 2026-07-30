/**
 * Reviews from verified Google Business Profile customers.
 *
 * `source` drives the platform badge; `serviceSlug` and `citySlug` let city and
 * service pages surface locally relevant reviews instead of the same three.
 *
 * ── Attribution discipline ──────────────────────────────────────────────────
 *
 * The quotes are real. The *provenance* used to be invented: every review was
 * tagged with a neighborhood and city from the old placeholder locations array
 * ("Cypress Landing, Springfield"), which turned a genuine review into a
 * fabricated one the moment it rendered. A real quote under a false byline is
 * the same FTC problem as a made-up quote.
 *
 * So `citySlug` and `neighborhood` are now OPTIONAL and set only where the
 * review itself supports them — t6 names Columbia and Lexington in its own
 * text, so it carries a city; the rest carry none until Ray matches them
 * against the real reviewer records in the Google Business Profile.
 *
 * `serviceSlug` stays required because every quote describes the work plainly
 * enough to classify it (gutters, roof streaks, pool deck, concrete striping).
 * That is a reading of the review, not an invention about the reviewer.
 *
 * `testimonialsFor` already falls back to featured reviews when a city has no
 * matches, so an unset `citySlug` costs a page nothing.
 */

export type Testimonial = {
  id: string;
  name: string;
  /** Only when known from the real review record. Never inferred. */
  neighborhood?: string;
  /** Only when the review itself names the place. Never inferred. */
  citySlug?: string;
  serviceSlug: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  source: "Google" | "Facebook" | "Yelp" | "Direct";
  quote: string;
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Dana R.",
    serviceSlug: "house-washing",
    rating: 5,
    date: "2026-05-14",
    source: "Google",
    quote:
      "Ray's did an outstanding job on our house and windows! The north side of our house was covered in green algae and two other companies told us it needed repainting. Ray soft-washed it completely clean in a few hours. Looks brand new!",
    featured: true,
  },
  {
    id: "t2",
    name: "Marcus T.",
    serviceSlug: "roof-cleaning",
    rating: 5,
    date: "2026-04-28",
    source: "Google",
    quote:
      "We had an HOA violation letter for black roof streaks with a 30-day deadline. Ray came out within two days, cleaned the entire roof safely, and sent clear photos I could forward straight to the board. Highly recommended!",
    featured: true,
  },
  {
    id: "t3",
    name: "Priya S.",
    serviceSlug: "pool-deck",
    rating: 5,
    date: "2026-06-02",
    source: "Google",
    quote:
      "Ray's Window Cleaning & Pressure Washing cleaned our pool deck, screen enclosure, and exterior glass. The pure water window system left zero water spots or streaks. Absolutely top-tier service!",
    featured: true,
  },
  {
    id: "t4",
    name: "Ellen K.",
    serviceSlug: "house-washing",
    rating: 5,
    date: "2026-03-19",
    source: "Google",
    quote:
      "Ray's crew took extreme care with our older wood and painted trim. They used soft pressure and tailored cleaning solutions. No damage, no chipped paint, just sparkling clean results.",
  },
  {
    id: "t5",
    name: "Tom W.",
    serviceSlug: "driveway-concrete",
    rating: 5,
    date: "2026-05-30",
    source: "Google",
    quote:
      "A previous company left heavy zebra stripes all over our long concrete driveway. Ray re-surfaced the entire slab with a professional surface cleaner and restored it to perfectly even concrete.",
    featured: true,
  },
  {
    // The only review that names its own location, so the only one carrying a city.
    id: "t6",
    name: "Sofia M.",
    citySlug: "columbia",
    serviceSlug: "window-cleaning",
    rating: 5,
    date: "2026-06-21",
    source: "Google",
    quote:
      "Hands down the best window cleaner in Columbia and Lexington! Cleaned all second-story glass inside and out. Very polite, punctual, and left everything crystal clear.",
  },
  {
    id: "t8",
    name: "Gareth L.",
    serviceSlug: "gutter-cleaning",
    rating: 5,
    date: "2026-01-27",
    source: "Google",
    quote:
      "Great communication from start to finish. Gutters are completely clear and the black tiger stripes on the gutter face were washed clean. Will definitely hire again next season!",
  },
];

export const featuredTestimonials = testimonials.filter((t) => t.featured);

export const testimonialsFor = (opts: { serviceSlug?: string; citySlug?: string }) => {
  const matches = testimonials.filter(
    (t) =>
      (!opts.serviceSlug || t.serviceSlug === opts.serviceSlug) &&
      (!opts.citySlug || t.citySlug === opts.citySlug),
  );
  // Fall back to featured reviews so a page never renders an empty section.
  return matches.length >= 2 ? matches : featuredTestimonials;
};
