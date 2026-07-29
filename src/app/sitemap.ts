import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { serviceSlugs } from "@/content/services";
import { locationSlugs, priorityLocations } from "@/content/locations";
import { postSlugs, posts } from "@/content/posts";

/**
 * Enumerates every route from the content arrays, so adding a service, city or
 * post updates the sitemap automatically (STRUCTURE.md §13).
 *
 * Matrix routes cover priority cities only, matching generateStaticParams in
 * app/services/[service]/[city]/page.tsx, the sitemap and the built pages
 * must never disagree.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/maintenance-plan",
    "/service-areas",
    "/gallery",
    "/reviews",
    "/about",
    "/blog",
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

  const postRoutes = postSlugs.map((slug) => {
    const post = posts.find((p) => p.slug === slug);
    return {
      url: `${base}/blog/${slug}`,
      lastModified: post ? new Date(post.updated ?? post.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    };
  });

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...matrixRoutes,
    ...locationRoutes,
    ...postRoutes,
  ];
}
