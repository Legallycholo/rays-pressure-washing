/**
 * Reviews. DRAFT PLACEHOLDER COPY — every one of these must be replaced with a
 * genuine, attributable review before launch. Fabricated testimonials on a live
 * commercial site are an FTC violation, not just bad practice.
 *
 * `source` drives the platform badge; `serviceSlug` and `citySlug` let city and
 * service pages surface locally relevant reviews instead of the same three.
 */

export type Testimonial = {
  id: string;
  name: string;
  neighborhood: string;
  citySlug: string;
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
    neighborhood: "Cypress Landing",
    citySlug: "springfield",
    serviceSlug: "house-washing",
    rating: 5,
    date: "2026-05-14",
    source: "Google",
    quote:
      "The north side of our house had gone completely green and two other companies told us it needed repainting. It didn't. It needed washing. The crew was here four hours and it looks like a different house.",
    featured: true,
  },
  {
    id: "t2",
    name: "Marcus T.",
    neighborhood: "Oakmont Reserve",
    citySlug: "oakmont",
    serviceSlug: "roof-cleaning",
    rating: 5,
    date: "2026-04-28",
    source: "Google",
    quote:
      "We had an HOA violation letter with a 30-day deadline. They came out within the week, sent dated photos I could forward straight to the board, and the letter was closed out. Zero drama.",
    featured: true,
  },
  {
    id: "t3",
    name: "Priya S.",
    neighborhood: "Harbour Point",
    citySlug: "lakeside",
    serviceSlug: "pool-deck",
    rating: 5,
    date: "2026-06-02",
    source: "Facebook",
    quote:
      "They talked me into doing the cage and the screens at the same time as the deck rather than just the deck. Explained exactly why. A year on and it still looks clean, so they were right.",
    featured: true,
  },
  {
    id: "t4",
    name: "Ellen K.",
    neighborhood: "Historic Riverbend",
    citySlug: "riverbend",
    serviceSlug: "house-washing",
    rating: 5,
    date: "2026-03-19",
    source: "Google",
    quote:
      "Our place is 1920s timber and I was genuinely nervous. They dropped the pressure right down and spent the time to do it by hand around the porch detail. No furring, no lifted paint.",
  },
  {
    id: "t5",
    name: "Tom W.",
    neighborhood: "Valley Crest",
    citySlug: "north-valley",
    serviceSlug: "driveway-concrete",
    rating: 5,
    date: "2026-05-30",
    source: "Google",
    quote:
      "Previous company left stripes all over the driveway. These guys re-did the whole slab with a surface cleaner and it's finally even. Wish I'd called them first.",
    featured: true,
  },
  {
    id: "t6",
    name: "Sofia M.",
    neighborhood: "Dockside",
    citySlug: "port-haven",
    serviceSlug: "window-cleaning",
    rating: 5,
    date: "2026-06-21",
    source: "Yelp",
    quote:
      "Salt film on our windows never properly came off, no matter what we tried. The pure water system did it in one visit and there wasn't a single spot when it dried.",
  },
  {
    id: "t7",
    name: "Cedar Park Plaza",
    neighborhood: "Highway Business District",
    citySlug: "cedar-park",
    serviceSlug: "commercial-flatwork",
    rating: 5,
    date: "2026-02-11",
    source: "Direct",
    quote:
      "They work overnight so we never lose a trading hour, and the compliance paperwork arrives without us having to chase it. Third year on contract now.",
  },
  {
    id: "t8",
    name: "Gareth L.",
    neighborhood: "Millers Creek",
    citySlug: "springfield",
    serviceSlug: "gutter-cleaning",
    rating: 4,
    date: "2026-01-27",
    source: "Google",
    quote:
      "Arrived a bit later than the window they gave me, but they called ahead to say so. Gutters are clear and the black streaking on the fronts is gone, which I didn't know was even fixable.",
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
