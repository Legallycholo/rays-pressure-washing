import { site } from "@/content/site";
import type { Service } from "@/content/services";
import type { Location } from "@/content/locations";
import type { Faq } from "@/content/faqs";
import type { Post } from "@/content/posts";

/**
 * Structured data. For a local service business this is not optional polish,
 * it's what produces the star rating, the price range and the service list in
 * the search result, and it's a large part of why one competitor outranks
 * another on identical copy.
 *
 * Validate every change at https://validator.schema.org before shipping.
 */

const origin = site.url;

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
 * `site.hours` stores the label a human reads, and schema.org wants the days
 * enumerated, so this is the one place that translation happens.
 */
function expandDays(label: string): string[] {
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

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${origin}/#business`,
    name: site.name,
    legalName: site.legalName,
    url: origin,
    telephone: site.contact.phoneHref,
    email: site.contact.email,
    priceRange: "$$",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    /**
     * `dayOfWeek` takes schema.org day names, not the display string in
     * `site.hours` ("Monday – Sunday"), so the range is expanded here. Anything
     * without a closing time is a closed day and drops out.
     */
    openingHoursSpecification: site.hours
      .filter((h) => Boolean(h.close))
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: expandDays(h.days),
        opens: h.open,
        closes: h.close,
      })),
    sameAs: Object.values(site.social),
  };
}

export function serviceSchema(service: Service, location?: Location) {
  const areaName = location ? `${location.city}, ${location.region}` : site.serviceRegion;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: location ? `${service.name} in ${location.city}` : service.name,
    description: service.blurb,
    serviceType: service.name,
    provider: { "@id": `${origin}/#business` },
    areaServed: { "@type": "City", name: areaName },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.pricing.minimum,
        priceCurrency: "USD",
      },
    },
  };
}

/**
 * Bundle pages emit a Service with an offer count only. No prices: the business
 * does not publish figures anywhere on the site, and markup that contradicts the
 * page is worse than no markup.
 */
export function bundleOfferSchema(bundle: {
  name: string;
  blurb: string;
  slug: string;
  serviceSlugs: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: bundle.name,
    description: bundle.blurb,
    provider: { "@id": `${origin}/#business` },
    url: `${origin}/packages/${bundle.slug}`,
    offers: {
      "@type": "AggregateOffer",
      offerCount: bundle.serviceSlugs.length,
    },
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

export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${origin}/#business` },
    mainEntityOfPage: `${origin}/blog/${post.slug}`,
  };
}
