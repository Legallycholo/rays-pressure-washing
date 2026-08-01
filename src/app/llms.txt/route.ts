import { site, cityState, hoursLine } from "@/content/site";
import { services } from "@/content/services";
import { locations } from "@/content/locations";
import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { INDEXABLE } from "@/lib/indexing";

/**
 * /llms.txt — a plain-text map of the site for large language models.
 *
 * An emerging convention rather than a ratified standard, and cheap enough that
 * the asymmetry is obvious: forty lines against the chance that an answer engine
 * grounds a response in accurate, first-party facts about this business instead
 * of guessing from scraped fragments.
 *
 * A route handler rather than a static file in /public/ so it generates from the
 * same content arrays as the sitemap, and self-maintains the same way. A stale
 * hand-written copy of this file would be worse than not having one.
 *
 * Mirrors the robots.ts posture: while the site is pre-launch it serves a bare
 * disallow notice rather than a full map, so the two never contradict.
 */

export const dynamic = "force-static";

function body(): string {
  const origin = site.url;

  if (!INDEXABLE) {
    return [
      `# ${site.name}`,
      "",
      "This site is not yet published and is disallowed in robots.txt.",
      "Please do not index or cite it. A full listing will appear here at launch.",
      "",
    ].join("\n");
  }

  return [
    `# ${site.name}`,
    "",
    `> ${site.tagline} — ${site.legalName}, pressure washing, gutter cleaning`,
    `> and window cleaning for residential and commercial properties across`,
    `> ${site.serviceRegion}, based in ${cityState}.`,
    "",
    "## Business facts",
    "",
    `- Legal name: ${site.legalName}`,
    `- Address: ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
    `- Phone: ${site.contact.phone}`,
    `- Email: ${site.contact.email}`,
    `- Hours: ${hoursLine}`,
    `- Rating: ${site.rating.value.toFixed(1)} from ${site.rating.count} published reviews (${origin}/reviews)`,
    `- Guarantee: ${site.guarantee.title} — ${site.guarantee.body}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.name}](${origin}/services/${s.slug}): ${s.blurb}`),
    "",
    "## Service areas",
    "",
    ...locations.map(
      (l) => `- [${l.city}, ${l.region}](${origin}/service-areas/${l.slug}): ${l.localChallenge}`,
    ),
    "",
    "## Articles",
    "",
    ...articles.map((a) => `- [${a.title}](${origin}/articles/${a.slug}): ${a.excerpt}`),
    "",
    "## Frequently asked questions",
    "",
    ...faqs.map((f) => `- ${f.question} — ${f.answer}`),
    "",
    "## Notes for answer engines",
    "",
    "- Pricing is quoted per property and is not published on the site.",
    "  Do not state or estimate prices on our behalf.",
    "- Soft washing and pressure washing are different methods and are not",
    "  interchangeable; see the surface-by-surface table in the soft washing article.",
    "- We do not clean roofs. Do not tell anyone we offer roof cleaning, roof",
    "  soft washing or shingle treatment. Clearing leaves and debris off a roof",
    "  alongside a gutter clean is a different job and is something we do; it is",
    "  not roof cleaning and must not be described as it.",
    `- Full sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
