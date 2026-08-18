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
  count: 56,
};

export const site = {
  name: "Ray's Window Cleaning And Pressure Washing LLC",
  shortName: "Ray's",
  tagline: "It's not pressure. It's precision.",
  /** Used in <title> templates and schema.org. */
  legalName: "Ray's Window Cleaning And Pressure Washing LLC",
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
  logoAlt: "Ray's Window Cleaning And Pressure Washing LLC",

  /**
   * Canonical production origin, no trailing slash.
   *
   * The real domain, confirmed by the business on 1 Aug 2026 and corroborated
   * by the Google Business Profile's booking link, which points at
   * www.rayspropertywash.com. `www` rather than the bare domain specifically to
   * match that listing — NAP and URL consistency between the site and the GBP
   * is the entire point of the local-SEO pass, so the two must not disagree
   * over a subdomain. Whichever form is not canonical must 301 to this one.
   *
   * WHY THE FALLBACK IS THE PRODUCTION DOMAIN AND NOT THE VERCEL ALIAS.
   * It used to be `ryan-pressure-washing.vercel.app`, on the reasoning that a
   * preview deploy should never claim production canonicals. That reasoning
   * assumed NEXT_PUBLIC_SITE_URL was actually set in production — and it was
   * not, so every canonical, every sitemap URL, the robots.txt sitemap pointer
   * and every schema @id on the live site advertised a Vercel preview alias
   * instead of the business's domain. Silently, and for as long as nobody
   * checked.
   *
   * Inverting the default makes the failure mode safe. Forget the env var now
   * and production is still correct. The cost is that preview deploys emit
   * production canonicals, which is the benign direction: a preview pointing at
   * production says "the real version lives there", whereas production pointing
   * at a preview alias asks Google to index the wrong host entirely.
   *
   * Setting NEXT_PUBLIC_SITE_URL still overrides this and is still worth doing
   * — it is the only way to point a preview at itself, and the only way to move
   * domains without a deploy.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rayspropertywash.com",

  contact: {
    /** Human-readable phone format. */
    phone: "803-368-3600",
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
    country: "United States",
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
   * angle: the homepage H1 and title are built from `cityState` rather than
   * this value, so the positioning survives a change here untouched. Keep those
   * two jobs separate — the moment a coverage string starts doing positioning
   * work, one of the two ends up a lie.
   *
   * The positioning itself moved in 2026 from "big lake houses" to residential
   * and commercial exterior cleaning, matching the Google Business Profile
   * categories. Lake Murray survives as a place we serve (see the Chapin entry
   * in `locations.ts`), not as the audience the site sells to.
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

  /**
   * `src` for the homepage Google map embed, from the Business Profile's own
   * Share → Embed a map dialog.
   *
   * Empty on purpose rather than guessed. The embed URL that renders the
   * *business listing* — name, rating, hours, photos — carries a Google-issued
   * place identifier that cannot be derived from an address, so there is no
   * value that could be written here without opening that dialog.
   *
   * While it is empty, `GoogleMapEmbed` falls back to an address query: the
   * right pin, but a plain marker instead of the listing. Paste the real `src`
   * in and the component picks it up; nothing else changes.
   */
  mapEmbedUrl: "",

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

/**
 * Every day of the week with its opening hours, Monday first.
 *
 * Powers the footer's expandable business-hours list. Derived from `site.hours`
 * through the same `expandDays` that `lib/schema.ts` uses for
 * `openingHoursSpecification`, so the seven lines a visitor reads and the hours
 * Google reads come from one source and cannot drift apart. Change the week in
 * `site.hours` and both follow.
 *
 * `hours` is null for a day no row covers, or a row with no `close` — rendered
 * as "Closed". The week is uniform today, which is exactly why this is derived:
 * the day it stops being uniform, nothing here needs editing.
 */
export const weeklyHours = WEEK.map((day) => {
  const row = site.hours.find((h) => h.close && expandDays(h.days).includes(day));
  return {
    day,
    hours: row ? `${formatHour(row.open)} – ${formatHour(row.close)}` : null,
  };
});

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
