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
 * No code work is outstanding. As of 29 July 2026 the service area is confirmed
 * (13 cities), the origin resolves, every public figure on the site is either
 * real or derived from real data, the articles are written, the schema graph
 * validates, and all 71 pages sit inside their title and description budgets.
 * Both branches of this switch have been built and verified, so flipping it is
 * not a leap.
 *
 * What is left is business judgement, listed in implementation/SEO_AEO_GEO.md §11
 * — chiefly: verify or delete each `site.credentials` claim, since
 * "Licensed & insured" is a legal statement rather than copy. Nothing there
 * blocks indexing, but the credentials line is worth one look before the site is
 * publicly making that claim.
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
 * who reads "Ray's in Lexington washes lake houses on Lake Murray" in an AI
 * answer calls the number. Revisit if that stops being true.
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
