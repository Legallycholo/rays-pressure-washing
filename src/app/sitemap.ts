import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { serviceSlugs } from "@/content/services";
import { locationSlugs, priorityLocations } from "@/content/locations";
import { articleSlugs, articles } from "@/content/articles";
import { lastUpdated } from "@/lib/last-updated";

/**
 * Enumerates every route from the content arrays, so adding a service, city or
 * article updates the sitemap automatically (STRUCTURE.md §13).
 *
 * Matrix routes cover priority cities only, matching generateStaticParams in
 * app/services/[service]/[city]/page.tsx — the sitemap and the built pages must
 * never disagree.
 *
 * `lastModified` comes from the last git commit, not from `new Date()`. That
 * distinction is the whole point: stamping build time on ~53 unchanged URLs told
 * Google the entire site changed on every deploy, and a `lastModified` that
 * always reads "now" gets learned and then ignored — strictly worse than
 * omitting it. See lib/last-updated.ts.
 *
 * `changeFrequency` and `priority` are retained below but Google ignores both
 * outright. Do not spend time tuning them expecting an effect.
 *
 * `/thank-you` is missing from `staticRoutes` on purpose, not by oversight. It
 * is `noindex` (see the metadata note in app/thank-you/page.tsx), and listing a
 * noindex URL here asks Google to index a page that then tells it not to —
 * conflicting signals on a page with nothing to gain from either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date(lastUpdated);

  const staticRoutes = [
    "",
    "/services",
    "/service-areas",
    "/gallery",
    "/reviews",
    "/about",
    "/articles",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.9 : 0.7,
  }));

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const matrixRoutes = priorityLocations.flatMap((l) =>
    serviceSlugs.map((slug) => ({
      url: `${base}/services/${slug}/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  const locationRoutes = locationSlugs.map((slug) => ({
    url: `${base}/service-areas/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Articles carry their own dates. A real content date always beats a
  // repo-wide one, so these ignore `now` entirely.
  const articleRoutes = articleSlugs.map((slug) => {
    const article = articles.find((a) => a.slug === slug);
    return {
      url: `${base}/articles/${slug}`,
      lastModified: article ? new Date(article.updated ?? article.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    };
  });

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...matrixRoutes,
    ...locationRoutes,
    ...articleRoutes,
  ];
}
