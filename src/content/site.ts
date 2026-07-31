/**
 * SINGLE SOURCE OF TRUTH for business identity.
 *
 * Change a value here and the whole site follows it: nav, footer, schema.org
 * markup, tel: links, page metadata, sitemap and robots.txt. Search for
 * "PLACEHOLDER" to find what still needs real data — as of the SEO pass
 * (implementation/SEO_AEO_GEO.md) that is down to the marketing claims in
 * `credentials` and the two `stats` figures at the bottom of this file.
 */

import { testimonials } from "./testimonials";

/**
 * The star rating shown on the site and emitted as schema.org
 * `aggregateRating`, derived from the reviews actually published in
 * `testimonials.ts` rather than typed in by hand.
 *
 * This is deliberate, not a convenience. A hardcoded figure drifts from the
 * reviews on the page, and an `aggregateRating` describing reviews a visitor
 * cannot see is a Google structured-data policy violation and an FTC problem —
 * it is the exact trap the previous PLACEHOLDER 4.9-from-218 walked into.
 * Deriving it means the visible number, the schema and the review list can
 * never disagree.
 *
 * If Ray supplies the real Google Business Profile aggregate it replaces this,
 * but then it must be the real figure and the `/reviews` page has to back it up.
 */
const publishedRating = {
  value:
    Math.round(
      (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10,
    ) / 10,
  count: testimonials.length,
};

export const site = {
  name: "Ray's Window Cleaning & Pressure Washing",
  shortName: "Ray's",
  tagline: "It's not pressure. It's precision.",
  /** Used in <title> templates and schema.org. */
  legalName: "Ray's Window Cleaning and Pressure Washing LLC",
  /**
   * Full lockup, header, footer, and any brand placements.
   *
   * Both files are the supplied artwork with its black matte knocked out to
   * real transparency, so the lockup sits on the white header and the near-
   * black footer without a box around it. The original flattened JPEG is kept
   * at /logo.jpg as the untouched master; nothing references it.
   *
   * WebP first because it is 95kB against the PNG's 163kB for identical
   * pixels; the PNG is the fallback for anything that can't take WebP. Serve
   * them through `<Logo>`, which handles the `<picture>` wiring.
   */
  logoSrc: "/logo.png",
  logoSrcWebp: "/logo.webp",
  logoAlt: "Ray's Window Cleaning and Pressure Washing LLC",

  /**
   * Canonical production origin, no trailing slash.
   *
   * Read from the environment so preview deploys stop claiming production
   * canonicals: set NEXT_PUBLIC_SITE_URL on Vercel's Production environment
   * only, and leave it unset everywhere else so previews fall back to the
   * Vercel alias below.
   *
   * The fallback MUST resolve. This was `https://www.ryanspressurewashing.example`,
   * and `.example` is an IANA-reserved TLD that can never exist — which quietly
   * invalidated every canonical, every sitemap entry, the robots.txt sitemap
   * pointer and every schema @id on the site at once. When the real domain is
   * registered, set the env var; nothing in the codebase needs to change.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ryan-pressure-washing.vercel.app",

  contact: {
    /** Human-readable. */
    phone: "(803) 368-3600",
    /** E.164, used for tel: and sms: hrefs. */
    phoneHref: "+18033683600",
    email: "rayswindows81@gmail.com",
  },

  address: {
    street: "257 Riglaw Cir",
    city: "Lexington",
    region: "SC",
    regionName: "South Carolina",
    postalCode: "29073",
    country: "US",
    /** Lexington, SC town-center coordinates; refine to the exact parcel once geocoded. */
    lat: 33.9815,
    lng: -81.2362,
  },

  /**
   * Broad region label used in COVERAGE copy: "Serving {serviceRegion}",
   * "exterior cleaning across {serviceRegion}", "Service Areas in
   * {serviceRegion}".
   *
   * This read "the Lake Murray area" while the confirmed service area reached
   * Aiken County and Sumter County — so the Aiken and Dalzell pages were claiming
   * to serve them "across the Lake Murray area", and the sitewide title
   * advertised a region covering roughly half the actual list. "The Midlands" is
   * also the term people here actually search.
   *
   * Note this field only ever describes *where we go*. It is not the marketing
   * angle: the homepage H1 and title still lead on lake houses, built from
   * `cityState` rather than this value, so the lake-home targeting survives a
   * change here untouched. Keep those two jobs separate — the moment a coverage
   * string starts doing positioning work, one of the two ends up a lie.
   */
  serviceRegion: "the SC Midlands",

  /**
   * One row because the week is uniform. `schema.ts` and the chat's `hoursLine`
   * both derive from this array, so keep it an array even at length one.
   */
  hours: [{ days: "Monday – Sunday", open: "07:00", close: "22:00" }],

  /**
   * Drives the star rating badges and the schema.org `aggregateRating`.
   * Derived from `testimonials.ts` — see `publishedRating` above.
   */
  rating: publishedRating,

  /**
   * Rendered as trust chips. Remove any that aren't true, these are claims.
   *
   * "No Contracts" was dropped from the middle entry on 2026-07-31 at the
   * business's direction. It had come from a working session with Geni
   * (OPTIMIZATION.md items 24–31), so this reverses an earlier owner
   * instruction rather than cleaning up scaffolding — noted here because the
   * next person to read that doc will otherwise think the string drifted.
   *
   * One string, five consumers: `TrustBar`, `Hero`, `Footer`, `/about` and
   * `credentialBadges` all read this array, so the separator has to stay
   * balanced — two claims, one `·`, no trailing dot.
   */
  credentials: [
    "Licensed & insured",
    "Same-Day Availability · Instant Pricing",
    "Locally owned and operated",
  ],

  /** Direct link for customers to leave a 5-star Google review */
  reviewLink: "https://g.page/r/CcTTVMucwQXsEBM/review",
  googleMapsUrl: "https://www.google.com/maps/place/Ray's+Window+Cleaning+And+Pressure+Washing+LLC/@33.8608907,-81.4194598,10z/data=!3m1!4b1!4m6!3m5!1s0x6faf424f02aaa63:0xec05c19ccb54d3c4!8m2!3d33.8613312!4d-81.089143!16s%2Fg%2F11lyhtlts1",

  /**
   * Every entry here is emitted as schema.org `sameAs`, which is how a search
   * engine or an LLM confirms that this site and that profile are the same
   * business. That makes it the core entity-resolution signal on the site.
   *
   * Only real, live profiles belong here. The facebook/instagram/yelp entries
   * that used to sit alongside Google pointed at `example.com` placeholders, and
   * a `sameAs` full of dead links weakens entity resolution rather than padding
   * it — a short accurate list beats a long broken one. Add each channel back
   * as its URL is confirmed; `schema.ts` filters empties either way.
   */
  social: {
    google: "https://g.page/r/CcTTVMucwQXsEBM/review",
  },

  /**
   * The one promise repeated across the site. Keep it short.
   *
   * ONE guarantee with two remedies, not two guarantees. The owner's public
   * reply to a review states a "100% money back guarantee even with
   * misunderstandings on pricing", which is a broader promise than the
   * re-clean this band originally carried. Shipping both without reconciling
   * them reads as overpromising, so the re-clean is the first remedy, the
   * refund is the backstop, and the price is covered by the same sentence
   * structure. Do not add a separate money-back band elsewhere on the site.
   */
  guarantee: {
    title: "The Spotless Guarantee",
    body: "If you can still see it after we leave, we come back and clean it again. If that still isn't right, you get your money back. The price works the same way: you pay the number we quoted, never one you're reading for the first time on the invoice.",
  },
} as const;

/** Convenience: "Lexington, SC" */
export const cityState = `${site.address.city}, ${site.address.region}`;

/**
 * "The Spotless Guarantee" without its leading article, for copy that supplies
 * its own: write "the {guaranteeName}", never "the {site.guarantee.title}".
 *
 * That second form was live in three places and rendered "and the The Spotless
 * Guarantee" — including in the homepage meta description, where it was the last
 * thing a searcher read. Use `site.guarantee.title` only where the name stands
 * alone, as it does in the guarantee band heading.
 */
export const guaranteeName = site.guarantee.title.replace(/^The\s+/i, "");

/**
 * "07:00" → "7am". `site.hours` stores 24-hour times because that is what
 * schema.org's `openingHours` wants; every human-facing render goes through
 * here so the site never shows a visitor a 24-hour clock.
 */
export const formatHour = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/**
 * "Monday – Sunday" → every day between them; "Saturday" → just Saturday.
 *
 * `site.hours` stores the label a human reads and schema.org wants the days
 * enumerated, so this is the one place that translation happens. It lives here,
 * beside the data it reads, because two callers need it now: `lib/schema.ts` for
 * `openingHoursSpecification`, and `content/stats.ts` for the days-per-week tile.
 */
export function expandDays(label: string): string[] {
  const [from, to] = label.split("–").map((s) => s.trim());
  const start = WEEK.indexOf(from as (typeof WEEK)[number]);
  if (start < 0) return [label];
  if (!to) return [WEEK[start]];

  const end = WEEK.indexOf(to as (typeof WEEK)[number]);
  if (end < 0) return [WEEK[start]];

  // Wraps across Sunday, e.g. "Saturday – Monday".
  const span = (end - start + WEEK.length) % WEEK.length;
  return Array.from({ length: span + 1 }, (_, i) => WEEK[(start + i) % WEEK.length]);
}

/**
 * How many distinct days of the week the business is open. Counts through
 * `expandDays` and de-duplicates, so overlapping rows can't inflate it past 7.
 */
export const openDaysCount = new Set(
  site.hours.filter((h) => Boolean(h.close)).flatMap((h) => expandDays(h.days)),
).size;

/** e.g. "Mon–Sun 7am–10pm". Closed days drop out. */
export const hoursLine = site.hours
  .filter((h) => h.close)
  .map(
    (h) =>
      `${h.days
        .replace(/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/g, (_, stem) => stem.slice(0, 3))
        .replace(" – ", "–")} ${formatHour(h.open)}–${formatHour(h.close)}`,
  )
  .join(" · ");

/**
 * The same four credentials as `site.credentials`, in the richer form a badge
 * row needs. A standalone export rather than a key inside `site` because the
 * labels are read back out of `site.credentials`, one source of truth for the
 * claim text, so the two can never drift apart.
 *
 * `logoSrc` is empty until Ray supplies the actual badge art from the issuing
 * body. NEVER fill these with a stock BBB / Google / "insured" graphic pulled
 * off the web: an unverified trust mark is a legal liability, not a
 * placeholder, and the FTC warning already on `testimonials.ts` applies here
 * in full. Empty is correct, `TrustBar` falls back to the text chip.
 */
export type CredentialBadge = { label: string; issuer: string; logoSrc: string };

export const credentialBadges: CredentialBadge[] = [
  { label: site.credentials[0], issuer: "State contractor licensing board", logoSrc: "" },
  { label: site.credentials[1], issuer: "Business practice", logoSrc: "" },
  { label: site.credentials[2], issuer: `Based in ${cityState}`, logoSrc: "" },
];

/** StatsRow data moved to ./stats.ts — see the note there for why. */
