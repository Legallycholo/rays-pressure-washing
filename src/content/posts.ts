/**
 * Blog / resource hub. Structure only, each post carries real frontmatter-style
 * metadata and a section outline, with body copy as DRAFT.
 *
 * Migration note: this is a plain array so the scaffold has zero content-pipeline
 * dependencies. When the post count passes ~15, move to MDX files in /content/posts
 * with a loader, the `Post` shape is designed to survive that change unchanged.
 */

export type PostSection = { heading: string; body: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date. */
  date: string;
  updated?: string;
  author: string;
  category: "Maintenance" | "How it works" | "Cost" | "Seasonal" | "Commercial";
  readMinutes: number;
  /** Internal linking targets, keeps the SEO graph tight. */
  relatedServices: string[];
  relatedCities?: string[];
  sections: PostSection[];
  featured?: boolean;
};

export const posts: Post[] = [
  {
    slug: "how-often-should-you-pressure-wash-your-house",
    title: "How often should you actually wash your house?",
    excerpt:
      "The honest answer isn't a fixed number. It depends on shade, humidity and what your walls are made of. Here's how to read your own house.",
    date: "2026-06-12",
    author: "Ray",
    category: "Maintenance",
    readMinutes: 6,
    relatedServices: ["house-washing", "roof-cleaning"],
    relatedCities: ["springfield", "lakeside"],
    featured: true,
    sections: [
      {
        heading: "The short answer",
        body: "DRAFT: 12 to 18 months for most homes, but the useful version of this answer depends on four variables covered below.",
      },
      {
        heading: "Why the north side always goes first",
        body: "DRAFT: sun exposure, drying time, and why one elevation can look years older than the rest of the same house.",
      },
      {
        heading: "Reading your own siding",
        body: "DRAFT: the three visual signals that mean it's time, and the one that means you've left it too long.",
      },
      {
        heading: "What happens if you wait too long",
        body: "DRAFT: organic growth moving from cosmetic to structural, and the point where washing stops being enough.",
      },
    ],
  },
  {
    slug: "soft-washing-vs-pressure-washing",
    title: "Soft washing vs pressure washing: which does your surface need?",
    excerpt:
      "Using the wrong one is how siding gets scarred and roofs lose their granules. A surface-by-surface breakdown.",
    date: "2026-05-22",
    author: "Ray",
    category: "How it works",
    readMinutes: 8,
    relatedServices: ["house-washing", "roof-cleaning", "deck-patio"],
    featured: true,
    sections: [
      { heading: "Force versus chemistry", body: "DRAFT: the fundamental difference in one paragraph." },
      { heading: "The surface-by-surface table", body: "DRAFT: every common exterior surface and the correct method." },
      { heading: "What high pressure does to a roof", body: "DRAFT: granule loss, and why it's invisible until it isn't." },
      { heading: "How to tell what your contractor is actually using", body: "DRAFT: questions to ask before they start." },
    ],
  },
  {
    slug: "pressure-washing-cost-guide",
    title: "What pressure washing costs, and what makes the number move",
    excerpt:
      "Real ranges by service, plus the five job factors that legitimately change a quote and the two that shouldn't.",
    date: "2026-04-30",
    author: "Ray",
    category: "Cost",
    readMinutes: 7,
    relatedServices: ["house-washing", "driveway-concrete", "roof-cleaning"],
    featured: true,
    sections: [
      { heading: "Typical ranges by service", body: "DRAFT: pull the live figures from services.ts pricing so this never goes stale." },
      { heading: "What legitimately changes a price", body: "DRAFT: access, height, surface condition, material, and square footage." },
      { heading: "Red flags in a quote", body: "DRAFT: per-hour pricing with no cap, large deposits, and pressure to sign same-day." },
      { heading: "Why the cheapest quote usually costs more", body: "DRAFT: damage repair, re-cleaning, and regrowth within one season." },
    ],
  },
  {
    slug: "black-streaks-on-roof-explained",
    title: "Those black streaks on your roof are alive",
    excerpt:
      "Gloeocapsa magma is an algae that eats the limestone filler in asphalt shingles. Here's what it's doing and how it's removed.",
    date: "2026-03-18",
    author: "Ray",
    category: "How it works",
    readMinutes: 5,
    relatedServices: ["roof-cleaning"],
    relatedCities: ["oakmont"],
    sections: [
      { heading: "What it actually is", body: "DRAFT: the organism, and why it always streaks downward." },
      { heading: "Why it's not just cosmetic", body: "DRAFT: heat absorption, granule loss, and shortened roof life." },
      { heading: "Why pressure is the wrong tool", body: "DRAFT: and what manufacturer warranties say about it." },
      { heading: "How long treatment lasts", body: "DRAFT: realistic expectations and prevention between visits." },
    ],
  },
  {
    slug: "hoa-violation-letter-exterior-cleaning",
    title: "Got an HOA letter about your roof or driveway? Start here",
    excerpt:
      "What boards typically require, how quickly it can be resolved, and the documentation that closes the file.",
    date: "2026-02-25",
    author: "Ray",
    category: "Maintenance",
    readMinutes: 5,
    relatedServices: ["roof-cleaning", "driveway-concrete", "house-washing"],
    relatedCities: ["oakmont"],
    sections: [
      { heading: "Read the letter properly first", body: "DRAFT: deadline, specific citation, and re-inspection date." },
      { heading: "The two most-cited violations", body: "DRAFT: roof streaking and driveway staining, and typical timelines." },
      { heading: "What documentation boards accept", body: "DRAFT: dated before/after photography and service records." },
      { heading: "Preventing the next one", body: "DRAFT: scheduling ahead of the annual inspection cycle." },
    ],
  },
  {
    slug: "preparing-your-home-for-exterior-cleaning",
    title: "A five-minute checklist before your cleaning appointment",
    excerpt: "Small preparations that make the job faster, safer and better. Most take under a minute.",
    date: "2026-01-15",
    author: "Ray",
    category: "Seasonal",
    readMinutes: 4,
    relatedServices: ["house-washing", "deck-patio", "window-cleaning"],
    sections: [
      { heading: "Close and latch everything", body: "DRAFT: windows, storm doors, and the one vent people forget." },
      { heading: "Clear the perimeter", body: "DRAFT: furniture, planters, vehicles and pet items." },
      { heading: "Water and power access", body: "DRAFT: spigot access, and why we don't need your electricity." },
      { heading: "Tell us about problem areas", body: "DRAFT: existing damage, failed seals, and delicate plantings." },
    ],
  },
];

export const featuredPosts = posts.filter((p) => p.featured);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const postSlugs = posts.map((p) => p.slug);
export const postCategories = [...new Set(posts.map((p) => p.category))];
