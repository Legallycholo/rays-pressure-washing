/**
 * The single switch that controls whether search engines may index this site.
 *
 * Why one constant instead of two settings: the noindex posture lives in two
 * files that MUST agree — `robots` in app/layout.tsx and the rules in
 * app/robots.ts — and the failure mode when they disagree is silent. A
 * robots.txt that disallows everything while the page says `index: true` means
 * the crawler is blocked from ever reading the meta tag, so the page can end up
 * indexed with no description at all. Both files now read this value, so the two
 * cannot drift and the flip is genuinely one line in one place.
 *
 * ── TO LAUNCH ───────────────────────────────────────────────────────────────
 *
 * Set this to `true`. That is the whole change.
 *
 * Before doing so, check the two open items in implementation/SEO_AEO_GEO.md
 * ("Still outstanding"). Both are business decisions rather than code:
 *
 *   1. `site.serviceRegion` still reads "the Lake Murray area" but the confirmed
 *      service area now reaches Aiken and Sumter counties, so several pages claim
 *      a coverage area narrower than the one they list.
 *   2. `site.ts` `stats` still renders two invented figures on the homepage
 *      ("3,400+ properties cleaned", "1.2M sq ft"), which is the same class of
 *      fabricated public claim as the review count that was removed.
 *
 * The service-area list itself is settled — Ray confirmed all 13 cities on
 * 29 July 2026 — as are the origin, the derived review figures, the articles and
 * the schema graph. Both branches of this switch have been built and verified,
 * so flipping it is not a leap.
 */
export const INDEXABLE = false;

/**
 * Crawlers that feed answer engines and LLM citations, allowed explicitly.
 *
 * `Google-Extended` is the one that gets missed. It does not affect normal
 * Googlebot crawling or classic ranking at all — it controls whether this site
 * may be used to ground Gemini and AI Overviews answers. Leaving it blocked
 * forecloses the single largest AEO surface there is.
 *
 * The trade being made deliberately: allowing these means the content can be
 * summarised without a click. For a local service business whose conversion is a
 * phone call, being *named* in the answer is worth more than the click — someone
 * who reads "Ray's in Lexington handles roof soft washing" in an AI answer calls
 * the number. Revisit if that stops being true.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;
