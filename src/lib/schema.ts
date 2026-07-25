import { site } from "@/content/site";
import type { Service } from "@/content/services";
import type { Location } from "@/content/locations";
import type { Faq } from "@/content/faqs";
import type { Post } from "@/content/posts";

/**
 * Structured data. For a local service business this is not optional polish —
 * it's what produces the star rating, the price range and the service list in
 * the search result, and it's a large part of why one competitor outranks
 * another on identical copy.
 *
 * Validate every change at https://validator.schema.org before shipping.
 */

const origin = site.url;

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
    foundingDate: String(site.foundedYear),
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
    openingHoursSpecification: site.hours
      .filter((h) => h.open !== "Closed")
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
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
