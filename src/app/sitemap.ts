import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { serviceSlugs } from "@/content/services";
import { locationSlugs } from "@/content/locations";
import { bundleSlugs } from "@/content/packages";
import { postSlugs, posts } from "@/content/posts";

/**
 * Enumerates every route from the content arrays, so adding a service, city,
 * bundle or post updates the sitemap automatically (STRUCTURE.md §13).
 *
 * The /services/[service]/[city] matrix is added in Phase 7 alongside the
 * pages themselves — a sitemap must never list routes that don't exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/packages",
    "/maintenance-plan",
    "/service-areas",
    "/gallery",
    "/pricing",
    "/quote",
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
    priority: path === "" ? 1 : path === "/quote" ? 0.9 : 0.7,
  }));

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const bundleRoutes = bundleSlugs.map((slug) => ({
    url: `${base}/packages/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

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

  return [...staticRoutes, ...serviceRoutes, ...bundleRoutes, ...locationRoutes, ...postRoutes];
}
