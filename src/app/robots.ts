import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Mirrors the noindex posture set in layout.tsx (robots.index: false), which
 * keeps placeholder content out of the index while the site is built.
 *
 * LAUNCH: flip BOTH this file's disallow rule AND layout.tsx robots.index
 * together — see CHECKLIST.md Phase 13. One without the other sends search
 * engines mixed signals.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
