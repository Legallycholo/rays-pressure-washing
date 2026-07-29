/**
 * SINGLE SOURCE OF TRUTH for business identity.
 *
 * Everything here is a PLACEHOLDER. Replace the values in this one file and
 * the whole site (nav, footer, schema.org markup, tel: links, page metadata)
 * updates with it. Search for "PLACEHOLDER" to find everything that needs
 * real data before launch.
 */

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

  /** PLACEHOLDER: canonical production origin, no trailing slash. */
  url: "https://www.ryanspressurewashing.example",

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
   * Broad region label used in copy: "serving all of {serviceRegion}".
   *
   * Lexington sits on Lake Murray, and the current push targets large homes
   * on the lake, not a general service-area claim.
   */
  serviceRegion: "the Lake Murray area",

  /**
   * One row because the week is uniform. `schema.ts` and the chat's `hoursLine`
   * both derive from this array, so keep it an array even at length one.
   */
  hours: [{ days: "Monday – Sunday", open: "07:00", close: "22:00" }],

  /** Drives the star rating badges and the Review schema aggregate. */
  rating: {
    value: 4.9, // PLACEHOLDER
    count: 218, // PLACEHOLDER
  },

  /** Rendered as trust chips. Remove any that aren't true, these are claims. */
  credentials: [
    "Licensed & insured",
    "Same-Day Availability · Instant Pricing · No Contracts",
    "Locally owned and operated",
  ],

  /** Direct link for customers to leave a 5-star Google review */
  reviewLink: "https://g.page/r/CcTTVMucwQXsEBM/review",
  googleMapsUrl: "https://www.google.com/maps/place/Ray's+Window+Cleaning+And+Pressure+Washing+LLC/@33.8608907,-81.4194598,10z/data=!3m1!4b1!4m6!3m5!1s0x6faf424f02aaa63:0xec05c19ccb54d3c4!8m2!3d33.8613312!4d-81.089143!16s%2Fg%2F11lyhtlts1",

  social: {
    facebook: "https://facebook.com/example", // PLACEHOLDER
    instagram: "https://instagram.com/example", // PLACEHOLDER
    google: "https://g.page/r/CcTTVMucwQXsEBM/review",
    yelp: "https://yelp.com/biz/example", // PLACEHOLDER
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
 * "07:00" → "7am". `site.hours` stores 24-hour times because that is what
 * schema.org's `openingHours` wants; every human-facing render goes through
 * here so the site never shows a visitor a 24-hour clock.
 */
export const formatHour = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

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

/**
 * StatsRow data (SECTIONS.md §2.16, open decision #2). One figure derives from
 * a real field above; the other two are PLACEHOLDER counts to replace.
 *
 * No "Years in business" tile: the founding year it was computed from was
 * placeholder data and the business does not want to claim one yet. Add the
 * tile back only alongside a confirmed year.
 */
export const stats = [
  { value: "3,400", suffix: "+", label: "Properties cleaned" }, // PLACEHOLDER
  { value: String(site.rating.count), suffix: "+", label: "Five-star reviews" },
  { value: "1.2M", suffix: " sq ft", label: "Cleaned last year" }, // PLACEHOLDER
];
