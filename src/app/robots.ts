import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { INDEXABLE, AI_CRAWLERS } from "@/lib/indexing";

/**
 * Both this file and the `robots` block in layout.tsx read `INDEXABLE`, so the
 * two can no longer disagree — see lib/indexing.ts for why that mattered enough
 * to centralise. Flipping that one constant launches the site.
 *
 * While `INDEXABLE` is false everything is disallowed, including the AI crawlers:
 * a pre-launch site with unconfirmed service-area claims should not be feeding
 * answer engines either.
 *
 * Once true, the rules split by agent. `/api/` stays disallowed for everyone —
 * the lead endpoint and the assistant endpoint are not content and have no
 * business in an index.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${site.url}/sitemap.xml`,
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      // Listed explicitly rather than relying on the wildcard: several of these
      // agents only honour a rule addressed to them by name.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    host: site.url,
    sitemap: `${site.url}/sitemap.xml`,
  };
}
