import { site, expandDays } from "@/content/site";
import { serviceCategories } from "@/content/service-categories";
import { locations } from "@/content/locations";
import type { Service } from "@/content/services";
import type { Location } from "@/content/locations";
import type { Faq } from "@/content/faqs";
import { articleWordCount, type Article } from "@/content/articles";
import type { Testimonial } from "@/content/testimonials";
import type { Project } from "@/content/gallery";
import type { SiteVideo } from "@/content/media";

/**
 * Structured data. For a local service business this is not optional polish,
 * it's what produces the star rating, the price range and the service list in
 * the search result, and it's a large part of why one competitor outranks
 * another on identical copy.
 *
 * It has a second job now. Answer engines — AI Overviews, Perplexity, ChatGPT —
 * lean on this markup to decide *what a site is* and whether it can be cited by
 * name. That is why the `@id` graph below matters more than any individual
 * field: three stable nodes (`#business`, `#website`, `#ray`) that everything
 * else points at, so a crawler resolves one business with one author rather than
 * a dozen unrelated fragments.
 *
 * Validate every change at https://validator.schema.org and Google's Rich
 * Results Test before shipping.
 */

const origin = site.url;

/** The three stable nodes everything else references. */
export const BUSINESS_ID = `${origin}/#business`;
export const WEBSITE_ID = `${origin}/#website`;
export const PERSON_ID = `${origin}/#ray`;

/**
 * Stable `@id` for a service, so the `Service` node on its own page and the
 * entry for it in the business's `hasOfferCatalog` are the same node rather
 * than two similar ones a crawler has to guess about.
 *
 * Base service page only. The `/services/[service]/[city]` pages deliberately
 * do NOT get one — see the note in `serviceSchema`.
 */
export const serviceId = (slug: string) => `${origin}/services/${slug}#service`;

/**
 * Absolute URL for the sitewide social image. `opengraph-image.tsx` is the file
 * convention Next serves this from, and schema.org wants an absolute URL rather
 * than the relative path metadata can get away with.
 */
const OG_IMAGE = `${origin}/opengraph-image`;

/**
 * `hasOfferCatalog` for the business node: the three Google Business Profile
 * categories, each as a named sub-catalog holding the services under it.
 *
 * WHY IT IS BUILT AND NOT WRITTEN. It is generated from
 * `content/service-categories.ts`, the same array that renders the H2/H3
 * section on /services, so the catalog a crawler reads and the list a visitor
 * reads cannot drift apart. A hand-maintained copy of this would be wrong
 * within two service changes — the same reasoning as `publishedRating` in
 * content/site.ts.
 *
 * WHY THE SUB-CATALOG NAMES ARE THE GBP STRINGS VERBATIM. The entire point of
 * this property is to tell Google that the categories on the profile and the
 * services on the site are the same three things. `gbpCategory` holds the exact
 * profile wording; do not "improve" it here to read better, because matching is
 * the feature.
 *
 * WHY IT INCLUDES SERVICES WITH NO PAGE. The catalog describes what the
 * business sells, which is not the same set as what the site has URLs for.
 * Sub-services without a page (rust removal, skylight cleaning, and the rest)
 * are real work the profile already advertises, so they belong here; they
 * simply carry no `url`. Ones with a page point at that page's `Service` node
 * by `@id`, so the catalog entry and the page are one node.
 *
 * NO `price`, `priceRange` OR `priceSpecification` ON THESE OFFERS, EVER. See
 * the long note in `serviceSchema` about why `offers` was stripped from the
 * service pages: structured data is published data, the figures in
 * content/services.ts are PLACEHOLDER, and this business does not publish
 * prices. An `Offer` with no price is valid and still resolves the service to
 * the business, which is all this needs to do.
 */
function offerCatalog() {
  /*
    More than one sub-service can point at the same page — "Gutter Cleaning" and
    "Gutter Brightening" are both aspects of the one gutter service, exactly as
    the profile lists them.

    Only the first of them may carry the page's `@id`. Emitting it on both would
    put two nodes with the same `@id` and different `name` values into the
    graph, which asks a crawler to believe one node is called two things — and
    an `@id` that resolves ambiguously is worse than no `@id`, because it
    corrupts the node the service page itself depends on. The later ones keep
    `url`, which links them to the page without claiming to *be* it.
  */
  const claimed = new Set<string>();

  return {
    "@type": "OfferCatalog",
    name: `Services offered by ${site.name}`,
    itemListElement: serviceCategories.map((category) => ({
      "@type": "OfferCatalog",
      // Verbatim from the Google Business Profile. Do not reword.
      name: category.gbpCategory,
      itemListElement: category.subServices.map((sub) => {
        const canonical = Boolean(sub.slug) && !claimed.has(sub.slug!);
        if (sub.slug) claimed.add(sub.slug);

        return {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: sub.name,
            serviceType: sub.name,
            provider: { "@id": BUSINESS_ID },
            ...(sub.slug ? { url: `${origin}/services/${sub.slug}` } : {}),
            ...(canonical ? { "@id": serviceId(sub.slug!) } : {}),
          },
        };
      }),
    })),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    url: origin,
    telephone: site.contact.phoneHref,
    email: site.contact.email,
    priceRange: "$$",
    /**
     * Google's local results effectively require an image on the business node,
     * and `logo` is separately what knowledge-panel eligibility looks for. They
     * are different fields for different surfaces — emit both.
     */
    image: OG_IMAGE,
    logo: `${origin}${site.logoSrc}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    /**
     * Ties this site to the Google Business Profile listing. One of the
     * strongest entity-resolution signals available, and one line to emit.
     */
    hasMap: site.googleMapsUrl,
    /**
     * Every city we publish a page for. The per-`Service` nodes carry their own
     * `areaServed`, but until this was added the business node itself claimed no
     * service area at all — which is the field local search actually reads.
     */
    areaServed: locations.map((l) => ({
      "@type": "City",
      name: `${l.city}, ${l.region}`,
    })),
    /**
     * The three GBP categories and everything under them. Generated — see
     * `offerCatalog` above, including why none of these offers carries a price.
     */
    hasOfferCatalog: offerCatalog(),
    /** Matches the `payment` FAQ. Keep the two in step. */
    paymentAccepted: "Credit Card, Bank Transfer, Digital Wallet",
    currenciesAccepted: "USD",
    founder: { "@id": PERSON_ID },
    /**
     * Derived in site.ts from the reviews published on /reviews, never typed in.
     * An `aggregateRating` that describes reviews a visitor cannot find is a
     * structured-data policy violation — see the note on `publishedRating`.
     */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    /**
     * `dayOfWeek` takes schema.org day names, not the display string in
     * `site.hours` ("Monday – Sunday"), so the range is expanded by
     * `expandDays` — which now lives in content/site.ts beside the hours data,
     * because content/stats.ts needs the same translation for its
     * days-per-week tile. Anything without a closing time is a closed day and
     * drops out.
     */
    openingHoursSpecification: site.hours
      .filter((h) => Boolean(h.close))
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: expandDays(h.days),
        opens: h.open,
        closes: h.close,
      })),
    /**
     * Filtered, because an entry that 404s is worse than a missing one: `sameAs`
     * is how a crawler confirms this site and that profile are the same
     * business, and dead links weaken that rather than padding it.
     */
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

/**
 * One `WebSite` node, emitted sitewide alongside the business. Gives the
 * `#website` anchor that every Article points at with `isPartOf`, which is how a
 * crawler tells "an article on this publication" from "a loose page".
 *
 * No `SearchAction`: there is no site search, and claiming one that doesn't
 * exist is the kind of markup that gets a site's structured data distrusted
 * wholesale.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: origin,
    name: site.name,
    description: site.tagline,
    inLanguage: "en-US",
    publisher: { "@id": BUSINESS_ID },
  };
}

/**
 * The named human behind the work, rendered on /about and referenced as the
 * `author` of every article and the `founder` of the business.
 *
 * This is disproportionately valuable for GEO. Answer engines preferentially
 * cite attributable expertise over anonymous corporate copy, and a `Person` node
 * with `knowsAbout` and a `worksFor` back-reference is what makes "according to
 * Ray at Ray's Window Cleaning…" a sentence an LLM is willing to write.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Ray",
    jobTitle: "Owner and lead technician",
    worksFor: { "@id": BUSINESS_ID },
    url: `${origin}/about`,
    knowsAbout: [
      "Soft washing",
      "Pressure washing",
      "Pure water window cleaning",
      "Exterior surface restoration",
    ],
  };
}

export function serviceSchema(service: Service, location?: Location) {
  const areaName = location ? `${location.city}, ${location.region}` : site.serviceRegion;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    /*
      `@id` on the base service page only, so it resolves to the same node the
      business's `hasOfferCatalog` points at.

      The city variants are left un-`@id`'d on purpose. Giving every
      `/services/[service]/[city]` page the same `@id` would declare forty pages
      to be one node; giving each a unique one would put forty near-identical
      Service nodes into the graph for a business that sells seven services.
      An anonymous node on those pages says the true thing — this page is about
      that service in that city — without either problem.
    */
    ...(location ? {} : { "@id": serviceId(service.slug) }),
    name: location ? `${service.name} in ${location.city}` : service.name,
    description: service.blurb,
    serviceType: service.name,
    category: service.category,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: areaName },
    /*
      No `offers`. An `Offer` with a `minPrice` drawn from
      `service.pricing.minimum` used to be emitted here, on every service page
      and every service-in-city page.

      It was the one place on the site that published a price. Nothing renders a
      figure — that is a standing directive, and it is why /pricing is a 404 and
      why the form quotes nothing — but structured data is still published data:
      Google reads it and can surface it as a "From $X" in a result, which is
      exactly the number the business does not want a customer arriving with.
      Worse, the figures behind it are marked PLACEHOLDER in content/services.ts,
      so it was publishing prices that were never real.

      Removed with the plans and offers. `Service` schema without `offers` is
      still valid and still resolves the service to the business.

      If it comes back, it needs real confirmed prices first, and it needs the
      no-pricing directive lifted — not one without the other.
    */
  };
}

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${origin}${c.href}`,
    })),
  };
}

export function articleSchema(article: Article) {
  const url = `${origin}/articles/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    /**
     * The `#ray` node rather than a bare string. A named, resolvable author is
     * the difference between an article a search engine attributes and one it
     * treats as unsigned.
     */
    author: { "@id": PERSON_ID },
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@id": WEBSITE_ID },
    /**
     * Article rich results effectively require an image, and no photography
     * exists yet — so this points at the generated OG image, which is a real
     * resolving 1200×630. Swap to the article's own photograph when there is
     * one; never emit this field pointing at nothing.
     */
    image: OG_IMAGE,
    articleSection: article.category,
    wordCount: articleWordCount(article),
    inLanguage: "en-US",
    mainEntityOfPage: url,
    url,
  };
}

/** The /articles index, as an ordered list of the articles on it. */
export function articleListSchema(items: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${origin}/articles/${a.slug}`,
      name: a.title,
    })),
  };
}

/**
 * Individual `Review` nodes for /reviews, which rendered eight real reviews with
 * no markup at all until now.
 *
 * These and `aggregateRating` have to describe the same set of reviews. Both
 * derive from `testimonials.ts`, so they cannot drift apart.
 */
export function reviewSchema(items: Testimonial[]) {
  return items.map((t) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${origin}/reviews#${t.id}`,
    itemReviewed: { "@id": BUSINESS_ID },
    author: { "@type": "Person", name: t.name },
    datePublished: t.date,
    reviewBody: t.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));
}

/**
 * Before/after gallery images.
 *
 * Guarded on purpose: every `before`/`after` in gallery.ts is still an empty
 * string while photography is outstanding, and an `ImageObject` whose
 * `contentUrl` points at nothing is worse than no markup. Returns an empty array
 * until real paths land, at which point this starts emitting with no further
 * change.
 */
export function imageObjectSchema(projects: Project[]) {
  return projects
    .flatMap((p) =>
      [
        { src: p.before, label: `${p.title} — before` },
        { src: p.after, label: `${p.title} — after` },
      ].filter((i) => Boolean(i.src)),
    )
    .map((i) => ({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: `${origin}${i.src}`,
      name: i.label,
      creditText: site.name,
      creator: { "@id": BUSINESS_ID },
    }));
}

/**
 * Site video. Same guard as `imageObjectSchema`: `media.ts` ships empty paths,
 * and `VideoObject` without a real `contentUrl` and `thumbnailUrl` fails
 * validation. Returns null until the footage exists.
 */
export function videoObjectSchema(video: SiteVideo, uploadDate: string) {
  if (!video.src || !video.poster) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${site.name} — exterior cleaning walkthrough`,
    description: video.alt,
    contentUrl: `${origin}${video.src}`,
    thumbnailUrl: `${origin}${video.poster}`,
    uploadDate,
    publisher: { "@id": BUSINESS_ID },
  };
}
