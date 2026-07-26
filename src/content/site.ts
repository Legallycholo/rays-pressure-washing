/**
 * SINGLE SOURCE OF TRUTH for business identity.
 *
 * Everything here is a PLACEHOLDER. Replace the values in this one file and
 * the whole site — nav, footer, schema.org markup, tel: links, page metadata —
 * updates with it. Search for "PLACEHOLDER" to find everything that needs
 * real data before launch.
 */

export const site = {
  name: "Ryan's Pressure Washing",
  shortName: "Ryan's",
  tagline: "Exterior cleaning that makes the whole place look new again",
  /** Used in <title> templates and schema.org. */
  legalName: "Ryan's Pressure Washing LLC", // PLACEHOLDER
  foundedYear: 2016, // PLACEHOLDER

  /** PLACEHOLDER — canonical production origin, no trailing slash. */
  url: "https://www.ryanspressurewashing.example",

  contact: {
    /** Human-readable. */
    phone: "(555) 018-4400", // PLACEHOLDER
    /** E.164, used for tel: and sms: hrefs. */
    phoneHref: "+15550184400", // PLACEHOLDER
    /** Digits only, used for the wa.me deep link. */
    whatsapp: "15550184400", // PLACEHOLDER
    email: "hello@ryanspressurewashing.example", // PLACEHOLDER
  },

  address: {
    street: "1420 Example Commerce Dr, Suite 5", // PLACEHOLDER
    city: "Springfield", // PLACEHOLDER
    region: "FL", // PLACEHOLDER
    regionName: "Florida", // PLACEHOLDER
    postalCode: "32801", // PLACEHOLDER
    country: "US",
    /** PLACEHOLDER — used for LocalBusiness schema + map embed. */
    lat: 28.5383,
    lng: -81.3792,
  },

  /** Broad region label used in copy: "serving all of {serviceRegion}". */
  serviceRegion: "Central Florida", // PLACEHOLDER

  hours: [
    { days: "Monday – Friday", open: "07:00", close: "18:00" },
    { days: "Saturday", open: "08:00", close: "16:00" },
    { days: "Sunday", open: "Closed", close: "" },
  ],

  /** Drives the star rating badges and the Review schema aggregate. */
  rating: {
    value: 4.9, // PLACEHOLDER
    count: 218, // PLACEHOLDER
  },

  /** Rendered as trust chips. Remove any that aren't true — these are claims. */
  credentials: [
    "Licensed & insured",
    "$2M liability coverage", // PLACEHOLDER
    "Background-checked crews",
    "Locally owned since 2016", // PLACEHOLDER
  ],

  social: {
    facebook: "https://facebook.com/example", // PLACEHOLDER
    instagram: "https://instagram.com/example", // PLACEHOLDER
    google: "https://g.page/example", // PLACEHOLDER
    yelp: "https://yelp.com/biz/example", // PLACEHOLDER
  },

  /** The one promise repeated across the site. Keep it short. */
  guarantee: {
    title: "The Spotless Guarantee",
    body: "If you can still see it after we leave, we come back and clean it again. No argument, no invoice, no expiry.",
  },
} as const;

/** Convenience: "Springfield, FL" */
export const cityState = `${site.address.city}, ${site.address.region}`;

/**
 * StatsRow data (SECTIONS.md §2.16, open decision #2). Two figures derive from
 * real fields above; the other two are PLACEHOLDER counts to replace.
 */
export const stats = [
  { value: String(new Date().getFullYear() - site.foundedYear), label: "Years in business" },
  { value: "3,400", suffix: "+", label: "Properties cleaned" }, // PLACEHOLDER
  { value: String(site.rating.count), suffix: "+", label: "Five-star reviews" },
  { value: "1.2M", suffix: " sq ft", label: "Cleaned last year" }, // PLACEHOLDER
];

export const waLink = (message = "Hi! I'd like a quote for exterior cleaning.") =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
