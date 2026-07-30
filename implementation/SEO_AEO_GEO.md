# SEO / AEO / GEO Implementation Plan

**Created:** 29 July 2026
**Status:** Phases 1–4 and 5 implemented 29 July 2026. Indexing gate still closed
by design — see §7.3. Phase 6 verification partially done (build-time checks
pass; the live-crawler steps need a deployment).
**Owner:** dev
**Supersedes:** the SEO portions of `CHECKLIST.md` Phase 11 and Phase 13

---

## Implementation notes, 29 July 2026

What actually shipped, where it diverged from the plan above, and why. The
sections below are left as written so the reasoning is still readable; this block
is the correction layer.

### Corrections to the plan's own figures

- **The sitemap emits 61 URLs, not 56.** Ray supplied the confirmed service area
  on 29 July 2026 and it is **13 cities**, not the 8 §7.1 assumed. 13 static + 8
  service + 24 matrix + 13 location + 3 article = 61. Static page count is 71.
- **The drafted city list in §1.5 was superseded.** Four cities I had drafted are
  **not** in Ray's area and were removed: Ballentine, Gilbert, Cayce, Prosperity.
  Eight were added: Seven Oaks, Blythewood, Gaston, Hopkins, Gadsden,
  Batesburg-Leesville, Aiken, Dalzell. Kept: Lexington, Irmo, Chapin, Columbia,
  West Columbia. The lesson is recorded in the file header — drafting plausible
  cities was the right call to unblock the work, and confirming them was never
  optional.
- **The supplied list contained a duplicate.** "Batesburg-Leesville, SC" and
  "Leesville, Batesburg-Leesville, SC" are one municipality — Batesburg and
  Leesville merged in 1993. Single entry, both former town centers named in
  `neighborhoods`.
- **There are 7 published reviews, not 8.** `testimonials.ts` runs t1–t6 plus t8;
  there is no t7. The derived `aggregateRating` is therefore **5.0 from 7
  reviews**, which is honest and page-verifiable but understates the business —
  Ray's real Google aggregate should replace it.

### Divergences, with reasons

- **Article 3 used the substitute.** `services.ts` pricing is still
  `PLACEHOLDER`, so the cost guide stayed unwritten per §5.3 and
  `how-often-should-you-pressure-wash-your-house` shipped instead. The cost guide
  is the highest-intent piece in the backlog; write it the day real figures exist.
- **Testimonial city attribution went further than §1.3 asked.** The plan said
  re-map each review to a real city. On inspection that is the same error in
  better clothing: assigning a real city we cannot verify is still fabricated
  provenance on a genuine quote. So `citySlug` and `neighborhood` became optional
  and are set only where the review names the place itself — t6 says "Columbia
  and Lexington" and carries a city; the rest carry none until Ray matches them
  against the Google Business Profile records. `testimonialsFor` already falls
  back to featured reviews, so no page lost content.
- **`posts.ts` → `articles.ts` and `Post` → `Article` were done**, not left as the
  optional item in §5.2. `BlogPreview.tsx` → `ArticlePreview.tsx` with it.
- **The `ArticleSection` shape was extended.** The old `{heading, body}` pair
  could not carry a 40–60 word direct answer, a table, or multiple paragraphs.
  `answer` is now a *required* field, which makes the AEO requirement structural
  rather than a convention an editor can silently drop. `table` and `list` are
  optional.
- **`INDEXABLE` was introduced** (`src/lib/indexing.ts`) rather than editing the
  noindex posture in two files. `layout.tsx` and `robots.ts` both read it, so
  they cannot drift — which was the risk both files' existing comments warned
  about. Launch is now one line in one place. **Both branches were built and
  verified**, so flipping it is not an untested path.
- **`articleListSchema` was added** (an `ItemList` for the /articles index),
  which the plan did not specify.
- **Per-article Open Graph** (`type: article`, `publishedTime`, `modifiedTime`,
  `authors`) was added alongside the canonical, which §3 did not call for.
- **`max-snippet` / `max-image-preview: large`** added to the googleBot directives.
  Google's defaults truncate; for a business that wins on straight answers a
  clipped snippet is a lost click.

### Added outside the plan

- **Favicon rebuilt from the logo** (requested separately). The old
  `src/app/icon.png` was an unrelated orange gear graphic, badly cropped. The
  lockup is 2:1 landscape and mostly words, so letterboxing it into a square
  favicon renders the text ~9px tall and illegible; the icons are therefore built
  from the mascot, which survives being shrunk. Generated reproducibly by
  `scripts/generate-logos.js` — a circular badge for `icon.png` and a full-bleed
  square for `apple-icon.png`, using `#004090` sampled from the artwork itself.
  Legibility was checked at 16/32/48/96px rather than assumed.

### Verified at build time

- `npm run build` and `npm run typecheck` clean; 67 static pages.
- 57 sitemap URLs, zero containing `.example`.
- `lastModified` reads the git commit date, not build time.
- Footer renders "Last updated July 29, 2026" in a `<time>` element.
- Homepage emits 10 `Question`/`Answer` pairs, `WebSite` and
  `HomeAndConstructionBusiness` with 9 `City` in `areaServed`.
- `/about` emits `Person`; `/reviews` emits 7 `Review` + 7 `Rating`;
  `/articles` emits `ItemList`; article pages emit `Article` with a resolving
  `author: {"@id": …/#ray}` and a real `wordCount`.
- With `INDEXABLE = true`: `robots.txt` emits per-agent rules for all 9 AI
  crawlers plus `*`, `Host`, and the sitemap; the homepage meta reads
  `index, follow`; `/llms.txt` emits the full business map.

### Fixed while wiring the real city list

- **`CoverageMap` scaled its rings against a hardcoded 45 minutes**
  (`CoverageMap.tsx:33`), which silently assumed no city was further out than
  that. Aiken at 50 and Dalzell at 60 computed a radius past the edge of the
  400×300 viewBox and would have clipped off the map. Now normalised against the
  furthest city in the list, so adding a more distant city re-scales the art
  instead of losing a pin. Verified: 44 circles, zero out of bounds.
- **Gallery and article city references re-pointed** off the four dropped cities —
  the motor court to new-build Blythewood, the river-house glass to Gadsden on
  the Congaree, the fence run to Batesburg-Leesville, and the "how often" article
  to Hopkins.
- **Travel-fee copy confirmed firing correctly** against
  `travelPolicy.freeRadiusMinutes` of 30: Lexington reads "Our home base",
  Aiken and Dalzell both render the travel-fee sentence, and the batch-route
  discount language appears where it should.

### Round two, 29 July 2026 — approved follow-ups

Both open items above were resolved, and auditing them surfaced a systematic
metadata problem that had been present since before this plan.

**`site.serviceRegion` → "the SC Midlands".** It read "the Lake Murray area"
while the confirmed area reached Aiken and Sumter counties, so the Aiken and
Dalzell pages claimed to serve them "across the Lake Murray area". The field's
docblock now states that it only ever describes *coverage* — the homepage H1 and
title lead on lake houses via `cityState` and are untouched by the change, so the
lake-home targeting survives. Keeping those two jobs in separate strings is the
point: once a coverage string starts doing positioning work, one of the two
becomes a lie.

**`stats` rebuilt from derived figures and moved to `content/stats.ts`.** The two
invented tiles are gone. All four now derive: cities covered (13), average review
score (5.0), services offered (8), days open per week (7). Nothing there can go
stale or be wrong. It moved out of `site.ts` because it reads from the service
catalog and service area, and business *identity* should not depend on the content
describing the work.

**Columbia promoted to a fourth priority city.** Search volume is an order of
magnitude above anywhere else on the list (~137,000 people against Lexington's
24,000) and its housing stock is the most varied on the site, so the eight new
service×city pages have real material. Matrix went 24 → 32, sitemap 61 → **69**.

**`expandDays` de-duplicated.** It was private in `lib/schema.ts`; `content/stats.ts`
needed the same translation for its days-per-week tile. Moved to `content/site.ts`
beside the `hours` data both callers read, with `openDaysCount` derived from it.

#### The metadata bugs this surfaced

- **48 of 71 pages had meta descriptions over the ~160-character limit**, running
  200–370 characters and truncating mid-sentence in the search result. Cause: the
  city and service×city templates interpolated `loc.localChallenge` — and in the
  matrix case `localChallenge` *plus* `service.blurb` — straight into the
  description. `localChallenge` is page prose, rendered as a section lede; it was
  never a 160-character field. Rewriting it richer in §1.5 made this worse.
  **Fix:** a new short `Location.summary` field, one clause under 95 characters,
  purpose-written per city. All 32 matrix and 13 city descriptions now fit and
  every one is distinct.
- **The root `<title>` was 103 characters** — everything identifying the business
  sat past the truncation point. Now leads with the search phrase and the city and
  ends with the short brand name, at 49.
- **The layout fallback description was 218 characters**, so its call to action
  was never rendered. Trimmed to 142.
- **"and the The Spotless Guarantee"** appeared in three places, including the
  homepage meta description, from interpolating `the ${site.guarantee.title}` when
  the title already begins with "The". Added a derived `guaranteeName` export
  (title minus the leading article) for copy that supplies its own.
- **The `/service-areas` description listed all 13 city names** (230+ chars) and
  read "the surrounding **the** SC Midlands area". Now derived from the count plus
  the priority cities.
- **`Article.metaTitle`** added, optional. The soft-wash article's H1 is 63
  characters, which overflows a `<title>` once the brand suffix is appended — but
  an H1 can afford to be longer and more conversational than a search result can,
  and forcing them to share one string makes one of them worse.
- **`keywords`** now carries service-plus-city terms instead of `serviceRegion`
  alone. Google has ignored the tag since 2009; it earns its place only as a hint
  to smaller engines, which means the entries should at least be terms a human
  would type.

Audited after the fix: **71 pages, all titles ≤62 characters, all descriptions
≤160, zero duplicate descriptions.** The one flagged page is `/_global-error`,
Next's internal error boundary, which is never indexed.

---

## 0. What this document is

An ordered, file-level implementation plan for three overlapping goals:

- **SEO** — ranking in Google's classic organic results.
- **AEO** (Answer Engine Optimization) — being the extracted answer in AI
  Overviews, featured snippets and voice results.
- **GEO** (Generative Engine Optimization) — being *cited by name* inside
  ChatGPT, Claude, Perplexity and Gemini answers.

They are not the same job. SEO rewards crawlable structure and authority. AEO
rewards a directly-quotable answer in the first 40–60 words under a
question-shaped heading. GEO rewards a resolvable, consistent business entity
plus crawler access for the AI bots specifically. Most of the work below serves
more than one, and the phases are ordered so nothing gets built on a value that
is about to change underneath it.

### Related plans in this folder

| Document | What it governs | Relationship to this plan |
|---|---|---|
| `STRUCTURE.md` | Route architecture, content model, performance budget | §13 is the sitemap contract this plan extends |
| `CHECKLIST.md` | Phase-gated build checklist | Phase 11 (schema) and Phase 13 (pre-launch) are absorbed here |
| `SECTIONS.md` | Per-section design + content spec | §2.13 is the FAQ section this plan expands |
| `Copywriting.md` | Voice, tone, claim discipline | Binds all new article and FAQ copy |
| `AIfinalimplementation.md` | Assistant / ContactHub behaviour | Shares the FAQ bank; keep answers in sync |
| `OPTIMIZATION.md` | Core Web Vitals, image and font strategy | Page-speed is a ranking input; no conflicts |
| `design.md` | Visual system and tokens | Constrains the new FAQ + article layouts |
| `ANIMATIONS.md` | Motion system | New sections must use `Reveal`, not bespoke motion |
| `improvement.md` | Backlog of known gaps | Several items here close entries there |

---

## 1. Current state: audit findings

Read before touching anything. The technical layer is largely built; the
blockers are upstream of it.

### Already built and working — do not rebuild

- **JSON-LD is wired end to end.** `HomeAndConstructionBusiness` sitewide
  (`layout.tsx:88`), plus `Service` + `FAQPage` + `BreadcrumbList` on every
  service and service×city page, `Article` on posts, `FAQPage` on `/faq`. The
  `@id` cross-referencing is correct — `provider: {"@id": ".../#business"}`
  resolves against the sitewide node instead of duplicating the business.
- **`sitemap.xml` self-maintains.** `sitemap.ts` enumerates from the content
  arrays, so adding a service, city or article updates it with no edit.
- **`robots.txt` already points at the sitemap** (`robots.ts:18`).
- **Metadata is complete.** All 17 routes have title, description and a
  self-referencing canonical. Root has `metadataBase`, OG, Twitter card and a
  live Google Search Console verification token (`layout.tsx:42`).
- **The homepage already has an FAQ section** (`page.tsx:86`) rendering 6 of the
  17 questions in the bank.
- **The FAQ bank is the strongest AEO asset on the site.** 17 answers that are
  specific, numeric and directly phrased — exactly the shape answer engines
  lift verbatim.

### Blockers

**B1 — The site is deliberately de-indexed.** `layout.tsx:44-48` sets
`robots: { index: false, follow: false }`; `robots.ts:15-17` sets
`disallow: "/"`. Every item in this plan produces zero measurable effect until
both flip together. Flipping one without the other sends mixed signals.

**B2 — Every canonical URL points at a domain that cannot resolve.**
`site.ts:33` is `https://www.ryanspressurewashing.example`. `.example` is an
IANA-reserved TLD, permanently unresolvable. That one value flows into
`metadataBase`, all 17 canonicals, every URL in `sitemap.xml`, the `robots.txt`
sitemap pointer, and every schema `@id`. A sitemap generated today is 100%
invalid URLs. **This must be fixed before the sitemap is generated, not after.**

**B3 — 32 of 59 sitemap URLs target cities that do not exist.**
`locations.ts` is invented (Springfield, Lakeside, Oakmont, Riverbend, North
Valley, Port Haven, Cedar Park, Maple Grove). The file says so at line 13.
8 location pages + 24 service×city pages are built on it.

**B4 — `aggregateRating` publishes placeholder numbers.** `site.ts:71-72` is
4.9 / 218, both marked `PLACEHOLDER`, both emitted in JSON-LD
(`schema.ts:71-77`) *and* rendered visibly in the footer (`Footer.tsx:76-82`).
Fabricated review counts in structured data violate Google's structured-data
policy and are FTC exposure. Not a style issue.

**B5 — `sameAs` emits placeholder social URLs.** `site.ts:87-90` —
`facebook.com/example`, `instagram.com/example`, `yelp.com/biz/example` — all
flow into the entity graph at `schema.ts:91`. Broken `sameAs` links actively
weaken entity resolution, which is the core GEO signal.

**B6 — 6 blog posts render the literal string `DRAFT:`.** Every section body in
`posts.ts` is a stub, rendered straight to the page at
`blog/[slug]/page.tsx:75`, wrapped in `Article` schema claiming a real article.
~200 words each.

**B7 — `sitemap.ts` fakes freshness.** Line 21 sets
`lastModified: new Date()` for all 13 static routes plus every service, matrix
and location route — ~53 URLs stamped "modified now" on every build regardless
of whether they changed. Google learns to distrust `lastModified` when it always
says *now*; this is worse than omitting it. Only articles do it correctly
(line 67, via `post.updated ?? post.date`).

**B8 — Dead schema builder.** `bundleOfferSchema` (`schema.ts:122-140`) points
at `/packages/[slug]`, a route deleted in `20b88f6`. Unreferenced.

**B9 — Outdated comment.** `faqs.ts:4` claims FAQPage markup "wins the
expandable rich result in search". Google restricted FAQ rich results to
authoritative government and health sites in August 2023. FAQPage is still
worth emitting — it is a strong AEO/GEO signal because it hands answer engines
pre-parsed question/answer pairs — but it will not produce the expandable
result for this business. Correct the comment so nobody optimises for a result
that no longer exists.

---

## 2. Decisions taken

Locked. Recorded here so the reasoning survives.

| # | Decision | Rationale |
|---|---|---|
| D1 | Homepage FAQ expands 6 → **10** questions | All 10 already exist in the bank; zero new copy required |
| D2 | Homepage emits its own `FAQPage` JSON-LD | Currently emits none; AEO/GEO value, not rich-result value (see B9) |
| D3 | **`/blog` is renamed to `/articles`** | Requested route. Only 7 references in the codebase; contained |
| D4 | **3 articles ship, 3 are dropped** | Requested count. See §5 for which and why |
| D5 | Visible "last updated" date in the footer, auto-refreshed on every push | Requested. Mechanism in §4 |
| D6 | The same date source feeds `sitemap.ts` `lastModified` | Fixes B7 with the work already being done for D5 |
| D7 | All schema gaps from the audit are added | Requested "add them all". Full list in §6 |
| D8 | AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are **allowed** | GEO citations are a stated goal; blocking them forecloses it |
| D9 | `site.url` moves to an env var with a **resolving** fallback | Unblocks B2 today without waiting on the real domain |
| D10 | `aggregateRating` is **derived from real reviews on file**, not placeholders | Closes B4 honestly without waiting on GBP data |
| D11 | `locations.ts` is rewritten to **real Midlands/Lake Murray cities** | Closes B3. Cities are real and verifiable; only the service claim needs Ray's sign-off |
| D12 | Indexing stays off until Phase 5 | Launching with B3/B4 live would be worse than the current noindex |

---

## 3. Phase 1 — Foundations (blocks everything downstream)

Nothing in Phases 2–6 has value until this is done, because every artifact those
phases produce embeds `site.url` and the business claims.

### 1.1 Real origin, via environment (closes B2, D9)

`src/content/site.ts`

```ts
/**
 * Canonical production origin, no trailing slash.
 *
 * Read from the environment so preview deploys stop emitting production
 * canonicals. The fallback MUST be a URL that actually resolves — the old
 * `.example` value is a reserved TLD and made every canonical, sitemap entry
 * and schema @id unresolvable.
 */
url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://<vercel-production-url>",
```

- Add `NEXT_PUBLIC_SITE_URL` to `.env.example` with the same explanatory comment
  style as the existing `RESEND_API_KEY` block.
- Set it in Vercel for **Production only**. Leave it unset on Preview so preview
  builds fall back and never claim a production canonical.
- **When the real domain lands, this is a one-variable change.** Nothing else
  moves.

> **Open item for the business:** the real domain. A live Google Search Console
> verification token already sits at `layout.tsx:42`, which implies a property
> exists. Until it is supplied, the Vercel production URL is the correct
> fallback — it resolves, it is crawlable, and it makes every downstream
> artifact valid.

### 1.2 Honest review figures (closes B4, D10)

The site currently claims 4.9 stars from 218 reviews. `testimonials.ts` holds
8 genuine, attributable Google reviews, all 5★.

- Derive `site.rating` from `testimonials.ts` rather than hardcoding it:
  `value` = mean rating, `count` = array length. One source of truth, and the
  visible footer figure can never contradict the schema again.
- Remove the `PLACEHOLDER` comments once derived.
- If Ray supplies the real Google Business Profile aggregate, that number
  replaces the derived one and becomes the single hardcoded value — but it must
  be the real one, and the visible display must match it exactly.
- **Never** ship `aggregateRating` describing reviews that are not on the page
  or verifiable on the linked profile.

### 1.3 Fix testimonial attribution

`testimonials.ts` quotes read as genuine, but every one is attached to an
invented `neighborhood` and `citySlug` ("Cypress Landing, Springfield"). Real
quote, fabricated provenance.

- Re-map each testimonial to a real city slug from the rewritten `locations.ts`.
- Where the real neighbourhood is unknown, **delete the field** rather than
  invent one. `Testimonial.neighborhood` becomes optional; the components fall
  back to city alone.

### 1.4 Clean the entity graph (closes B5)

`site.ts` — delete the three `example.com` social URLs. Keep the real Google
link. Then make `sameAs` defensive in `schema.ts:91`:

```ts
sameAs: Object.values(site.social).filter(Boolean),
```

A short, accurate `sameAs` outperforms a long one containing dead links.

### 1.5 Rewrite the service area (closes B3, D11)

`src/content/locations.ts` — replace the entire array. The `Location` type is
well designed and stays exactly as-is; only the data changes.

Real candidates for a Lexington, SC business working Lake Murray, roughly by
proximity:

| Slug | City | Notes |
|---|---|---|
| `lexington` | Lexington, SC | Home base. `driveMinutes: 0`, `priority: true` |
| `chapin` | Chapin, SC | North shore Lake Murray, large waterfront homes — `priority: true` |
| `irmo` | Irmo, SC | Dense suburban, HOA-heavy — `priority: true` |
| `ballentine` | Ballentine, SC | Lakefront, docks and boathouses |
| `gilbert` | Gilbert, SC | Rural/large-lot, long driveways |
| `west-columbia` | West Columbia, SC | Older housing stock |
| `cayce` | Cayce, SC | River-adjacent, mature tree canopy |
| `columbia` | Columbia, SC | Largest metro in range |
| `prosperity` | Prosperity, SC | Far north shore; batch-route candidate |

Per city, the anti-thin-content fields must carry genuinely distinct data —
`intro`, `housingStock`, `localChallenge`, `neighborhoods`, `landmarks`. This is
what stops the 24 service×city pages from being clones, and it is the single
highest-value SEO task in this plan.

Keep `priority: true` to exactly 3 cities. `sitemap.ts:47` and
`generateStaticParams` in `services/[service]/[city]/page.tsx` both read from
`priorityLocations`, so the built pages and the sitemap cannot disagree.

> **Open item for the business:** confirm the list. The cities and their
> characteristics are real and checkable; the claim "we drive there" is Ray's to
> make. Drafting it now is defensible; publishing it unreviewed is not.

### 1.6 Delete dead code (closes B8) and fix the stale comment (closes B9)

- Remove `bundleOfferSchema` from `schema.ts`.
- Rewrite the `faqs.ts` header comment: FAQPage is emitted for answer-engine
  parsing, not for an expandable rich result.

---

## 4. Phase 2 — Freshness signal (D5, D6, closes B7)

One mechanism, two consumers: the visible footer date and `sitemap.ts`.

### 4.1 Resolve the date at build time

The requirement is "updates every time something is synced to GitHub". Vercel
rebuilds on every push, so build time and push time are the same event. Reading
the actual last-commit date is more precise and costs nothing.

`next.config.ts`

```ts
import { execSync } from "node:child_process";

/**
 * Timestamp for the visible "last updated" line and every sitemap
 * `lastModified`. Prefers the real last-commit date, which is available in
 * local dev and in Vercel's Git-integration builds. Falls back to build time
 * so a `vercel deploy` from a tarball, or a checkout without git, still
 * produces a truthful — if coarser — value. Never throws.
 */
function resolveLastUpdated(): string {
  try {
    return execSync("git log -1 --format=%cI", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString();
  }
}

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_LAST_UPDATED: resolveLastUpdated() },
  // ...existing config
};
```

**Why `next.config.ts` `env` and not a git hook:** a `pre-commit` hook lives in
`.git/hooks`, which is not version-controlled, so it silently does nothing on a
fresh clone or in CI and needs `core.hooksPath` wiring to share. The config
approach has nothing to install, works identically on every machine and on
Vercel, and updates on every push automatically. No GitHub Action is needed —
Vercel's Git integration is already the trigger.

`src/lib/last-updated.ts`

```ts
/** Build-time constant, inlined by Next. See next.config.ts. */
export const lastUpdated = process.env.NEXT_PUBLIC_LAST_UPDATED ?? new Date().toISOString();
```

### 4.2 Render it in the footer

`src/components/layout/Footer.tsx` — into the existing bottom bar
(around line 185, alongside the copyright), using the existing `formatDate`
helper from `@/lib/utils` and a semantic `<time>`:

```tsx
<p>
  Last updated{" "}
  <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
</p>
```

Renders as "Last updated July 29, 2026". Keep it in the `text-ink-300` row —
`ink-400` fails the 4.5:1 contrast floor on `ink-950`, per the existing comment
at `Footer.tsx:178`.

### 4.3 Feed the sitemap from the same source (closes B7)

`src/app/sitemap.ts` — replace `const now = new Date()` with
`const now = new Date(lastUpdated)`.

This makes `lastModified` mean "the last time this site actually changed"
instead of "whenever the build ran", which is the honest signal. Articles keep
their own per-article dates (line 67) — a real content date always beats a
repo-wide one.

While in the file: `changeFrequency` and `priority` are ignored by Google
entirely. Harmless to keep, worth a comment so nobody tunes them expecting an
effect.

---

## 5. Phase 3 — Content

### 5.1 Homepage FAQ: 6 → 10 (D1, D2)

`src/app/page.tsx` — extend `homeFaqIds` (line 35) to these ten, in this order.
All already exist in `faqs.ts`; **no new copy is required.**

| # | id | Category | Why it earns a homepage slot |
|---|---|---|---|
| 1 | `soft-vs-pressure` | Process | The category-defining question, and the differentiator |
| 2 | `quote-accuracy` | Pricing | The #1 hiring objection in this trade |
| 3 | `how-long-lasts` | Process | Sets the maintenance-plan upsell |
| 4 | `plants-safe` | Safety | Top homeowner anxiety |
| 5 | `need-to-be-home` | Scheduling | Removes a booking blocker |
| 6 | `roof-warranty` | Safety | ARMA citation — highly quotable for AEO |
| 7 | `hard-water` | Process | Window cleaning is half the business name and is otherwise absent here |
| 8 | `contracts` | Pricing | Backs the "No Contracts" credential chip |
| 9 | `weather` | Scheduling | Removes the last scheduling objection |
| 10 | `payment` | Pricing | Closes on "pay after you've seen it" |

Pass `limit={10}` to `<FaqSection>` — it defaults to 6 (`FaqSection.tsx:8`) and
would silently truncate.

Add the FAQPage node (D2):

```tsx
<JsonLd data={faqSchema(getFaqs(homeFaqIds))} />
```

The homepage and `/faq` will both emit `FAQPage`. That is fine and not a
duplicate-content risk — but both must draw from `faqs.ts` so the answer text
can never diverge between them. `/faq` remains the canonical full set.

### 5.2 `/blog` → `/articles` (D3)

Site is `noindex`, so there is no accumulated link equity at risk. Clean rename.

Seven references, all shallow:

| File | Change |
|---|---|
| `src/app/blog/` → `src/app/articles/` | `git mv` the directory |
| `src/app/articles/page.tsx:12` | canonical → `/articles` |
| `src/app/articles/page.tsx:17` | breadcrumb href |
| `src/app/articles/[slug]/page.tsx:31,42` | canonical + breadcrumb |
| `src/components/layout/Header.tsx:20` | `/blog` → `/articles`, label "Guides" → "Articles" |
| `src/components/layout/Footer.tsx:143` | same |
| `src/components/sections/BlogPreview.tsx:12,49` | card + index hrefs |
| `src/app/sitemap.ts:27,66` | static entry + article route template |
| `src/lib/schema.ts:177` | `mainEntityOfPage` |

Align the nav label to the URL ("Articles", not "Guides"). Label/URL agreement
is a small clarity win for users and crawlers both.

Add redirects to `next.config.ts` — cheap insurance, six lines:

```ts
redirects: async () => [
  { source: "/blog", destination: "/articles", permanent: true },
  { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
],
```

**Recommended, optional:** rename `src/content/posts.ts` → `articles.ts` and the
`Post` type → `Article`, so the content module matches the route. Touches 6
files. A route/module mismatch is the kind of drift this codebase's comments
otherwise work hard to prevent.

### 5.3 Three articles (D4)

Keep 3, delete 3. Each needs question-shaped H2s and a **direct 40–60 word
answer immediately under each heading** — that block is what answer engines
extract. Target 1,200–1,800 words. `Copywriting.md` governs voice.

**Ship — Article 1: `soft-washing-vs-pressure-washing`**
"Soft washing vs pressure washing: which does your surface need?"
The planned surface-by-surface table (line 74) is the highest-value AEO asset in
this plan — comparison tables get lifted verbatim into AI Overviews. Build it as
a real `<table>`: surface | method | pressure | why. Cover siding, brick,
stucco, asphalt shingle, metal roof, concrete, pavers, wood deck, composite
deck, vinyl fence, screen enclosure, glass. No business-data dependency.

**Ship — Article 2: `black-streaks-on-roof-explained`**
"Those black streaks on your roof are alive"
Definitional content about *Gloeocapsa magma* — the strongest GEO candidate on
the site, because "what are the black streaks on my roof" is a question people
ask an LLM directly, and the answer is factual rather than promotional. Cite the
ARMA method as in the `roof-warranty` FAQ. Drop the `relatedCities: ["oakmont"]`
reference; re-map to a real city. No business-data dependency.

**Article 3 — one of two, depending on data availability:**

- *Preferred:* `pressure-washing-cost-guide` — "What pressure washing costs
  around Lake Murray, and what moves the number". Highest commercial intent of
  anything in the backlog. **Gated:** its first section (line 91) is specified
  to pull live figures from `services.ts` pricing, and that pricing is
  `PLACEHOLDER` (`services.ts:32`). Publishing invented price ranges is the same
  class of error as B4. Needs real numbers from Ray.
- *Drop-in substitute if pricing isn't ready:*
  `how-often-should-you-pressure-wash-your-house` — "How often should you
  actually wash your house?" Strong AEO question, zero business-data
  dependency, ships immediately.

**Delete:** `hoa-violation-letter-exterior-cleaning` (built on the invented city
"Oakmont"), `preparing-your-home-for-exterior-cleaning` (thin, low intent), and
whichever of the two Article-3 candidates is not used. Titles stay recorded here
as backlog.

Every deleted slug must come out of `posts.ts` — the sitemap and
`generateStaticParams` both derive from it, so removal is automatic once the
array shrinks.

**Article images:** `articleSchema` gains an `image` field in Phase 4, and
Article rich results effectively require one. No photography exists yet. Point
each article at the existing `opengraph-image.tsx` route as a valid placeholder
so the markup is never emitted with a broken or missing image, and swap to real
photography when it lands.

---

## 6. Phase 4 — Schema completion (D7)

All in `src/lib/schema.ts` unless noted. Validate every change at
validator.schema.org and Google's Rich Results Test before shipping — the
existing file header already mandates this.

### Additions to `localBusinessSchema()`

| Field | Value | Why |
|---|---|---|
| `image` | Absolute URL to the OG image route | Google local results effectively require an image |
| `logo` | Absolute URL to `/logo.png` | Knowledge-panel eligibility |
| `areaServed` | Array of `{ "@type": "City", name }` from `locations.ts` | Currently only per-`Service`; the business node claims no area at all |
| `hasMap` | `site.googleMapsUrl` (already in `site.ts:84`) | Ties the site to the GBP listing — direct entity-resolution signal |
| `paymentAccepted` | From the `payment` FAQ | Card, bank transfer, digital wallets |
| `founder` | `{ "@id": ".../#ray" }` | Links to the new `Person` node |
| `aggregateRating` | Derived per §1.2 | Must be real before it ships |

### New builders

**`websiteSchema()`** — one `WebSite` node in `layout.tsx`, `@id`
`${origin}/#website`, with `publisher: {"@id": ".../#business"}` and
`inLanguage: "en-US"`. Skip `SearchAction`; there is no site search.

**`personSchema()`** — `Person` for Ray, `@id` `${origin}/#ray`, rendered on
`/about`. Include `name`, `jobTitle`, `worksFor: {"@id": ".../#business"}`, and
`knowsAbout` (soft washing, roof cleaning, pure-water window cleaning). **This
is disproportionately valuable for GEO:** LLMs preferentially cite named,
attributable expertise over anonymous corporate copy. Then reference it from
`articleSchema` as `author` instead of the current bare string.

**`reviewSchema()`** — maps `testimonials.ts` to `Review` nodes on `/reviews`,
which currently renders 8 real reviews with zero markup. Each needs
`author` (`Person`, name only), `reviewRating`, `datePublished`,
`reviewBody`, and `itemReviewed: {"@id": ".../#business"}`.

**`imageObjectSchema()`** — for gallery before/after pairs. Scaffold it now,
guarded on a non-empty path, so it activates the moment real photography lands
in `gallery.ts` (every `before`/`after` is `""` today).

**`videoObjectSchema()`** — same pattern, guarded on `siteVideo.src` being
non-empty (`media.ts:34` is `""`). Must include `thumbnailUrl`, `uploadDate`,
`duration`, `description`.

### Changes to `articleSchema()`

Add `image`, `author: {"@id": ".../#ray"}`, `isPartOf: {"@id": ".../#website"}`,
`inLanguage`, `articleSection` (from `post.category`), and `wordCount`. Change
`mainEntityOfPage` to the `/articles/` path.

### Removals

- `bundleOfferSchema` — dead (B8).
- `aggregateRating` stays out until §1.2 is done.

---

## 7. Phase 5 — Crawl, index, and AI access

Do this **last**. Everything above must be true before inviting crawlers in.

### 7.1 Sitemap coverage (all pages mapped)

After Phases 1–4, `sitemap.ts` emits **56 URLs**, all real, all indexable:

| Group | Count |
|---|---|
| Static routes (`/articles` replacing `/blog`) | 13 |
| `/services/[service]` | 8 |
| `/services/[service]/[city]` — 3 priority cities × 8 services | 24 |
| `/service-areas/[city]` | 8 |
| `/articles/[slug]` | 3 |

No route in the app is excluded, and nothing is listed that isn't built —
`generateStaticParams` and the sitemap both derive from the same content arrays,
which is the invariant `STRUCTURE.md` §13 already requires.

### 7.2 `robots.ts` — the gatekeeping change

Replace the blanket `disallow: "/"` with per-agent rules. Allow the AI crawlers
explicitly (D8):

- `*` — allow all, disallow `/api/`
- `GPTBot` (ChatGPT), `ClaudeBot` / `Claude-Web`, `PerplexityBot`,
  `Google-Extended` — allow

`Google-Extended` is the one people miss: it controls whether the site can be
used to ground Gemini and AI Overviews answers, and it is independent of normal
Googlebot crawling. Blocking it forecloses the largest AEO surface there is.

Keep the sitemap pointer.

> Allowing AI crawlers means the content can be summarised without a click.
> That is the trade GEO is: citation and brand presence in exchange for some
> zero-click traffic. For a local service business whose conversion is a phone
> call, being *named* in the answer is worth more than the click.

### 7.3 Flip indexing (closes B1)

`layout.tsx:44-48` → `index: true, follow: true`, **in the same commit** as the
`robots.ts` change. The existing comment at line 45 and the note in `robots.ts`
both warn about splitting these; honour that.

**Gate:** do not flip until §1.1, §1.2, §1.5 and §5.3 are all complete. A live
site with invented cities and a fabricated review count is worse for the
business than the current noindex.

### 7.4 `llms.txt`

Add `src/app/llms.txt/route.ts` — a route handler, not a static file in
`/public/`, so it generates from the content arrays and self-maintains like the
sitemap does. Contents: business identity and NAP, service list with URLs, the
service-area list, the article list, and the FAQ index. This is an emerging
convention rather than a ratified standard, but it is ~40 lines and it is the
cheapest GEO signal available.

### 7.5 Entity consistency (GEO)

The footer NAP block (`Footer.tsx:66-104`) is already correct and carries the
right comment about directory consistency. Verify character-for-character
against the Google Business Profile: business name, street, city, region,
postal code, phone. Inconsistent NAP is the most common local-ranking
self-inflicted wound.

---

## 8. Phase 6 — Verification

Not optional, and not covered by the original plan.

1. `npm run build` clean, `npm run typecheck` clean.
2. Every JSON-LD node through validator.schema.org **and** Google's Rich Results
   Test. Confirm the `@id` graph resolves — `#business`, `#website`, `#ray`.
3. `curl` the built `/sitemap.xml`, `/robots.txt` and `/llms.txt`. Assert no URL
   contains `.example`, and that the count is 56.
4. Confirm exactly one canonical per page and one `og:image` — the
   `opengraph-image.tsx` file convention injects automatically, and the comment
   at `layout.tsx:35-38` records that a manual `images` key previously caused a
   duplicate.
5. Submit the sitemap in Google Search Console; request indexing on the
   homepage and the three priority city pages.
6. Verify indexation 48–72h later. GSC tooling is available in-session
   (sitemap submit, URL inspection, indexing status, search analytics) — use it
   rather than guessing.
7. Re-run Lighthouse. `OPTIMIZATION.md` sets the budget; page speed is a
   ranking input.

---

## 9. Handling the placeholder-data caveat

The recommended approach, given the domain and GBP figures are still open:
**ship the infrastructure now, gate only the claims.**

| Blocker | Ships now? | How |
|---|---|---|
| B2 domain | ✅ | Env var + resolving Vercel fallback (§1.1). Real domain later is one variable |
| B4 rating | ✅ | Derive from the 8 real reviews on file (§1.2). No waiting |
| B5 social | ✅ | Delete the placeholders; filter `sameAs` (§1.4) |
| B6 draft posts | ✅ | Write 2 articles with no data dependency; substitute for the 3rd (§5.3) |
| B7 freshness | ✅ | Build-time git date (§4) |
| B8 dead code | ✅ | Delete (§1.6) |
| B9 stale comment | ✅ | Rewrite (§1.6) |
| B3 cities | ⚠️ Draft now, **confirm before flipping index** | Real cities, real geography, drafted for Ray's sign-off (§1.5) |
| B1 noindex | ⛔ Last | Gated on B3 confirmation (§7.3) |

Net effect: everything except the index flip can be built and merged this week
behind the existing `noindex`, and launch becomes a two-line commit plus one
env var once Ray confirms the service area.

---

## 10. Execution order

| Phase | Scope | Gate to clear |
|---|---|---|
| **1** | Foundations — origin, rating, attribution, `sameAs`, cities, dead code | No `.example` anywhere; no `PLACEHOLDER` in `site.ts`; no invented city |
| **2** | Freshness — build-time date → footer + sitemap | Footer shows a real date; sitemap `lastModified` is not build-now |
| **3** | Content — FAQ 6→10, `/blog`→`/articles`, 3 articles | Zero `DRAFT:` strings in `src/content/`; no dead internal links |
| **4** | Schema — all additions, all removals | Every node validates; `@id` graph resolves |
| **5** | Crawl — sitemap, robots, index flip, `llms.txt` | 56 valid URLs; `index: true` and `robots.txt` in one commit |
| **6** | Verification — GSC, Rich Results, Lighthouse | Sitemap accepted; priority pages indexed |

Phases 1 and 2 are independent and can run in parallel. Phase 3 depends on
Phase 1 (articles reference cities). Phase 4 depends on Phases 1 and 3 (schema
references the real rating, cities and article set). Phase 5 depends on all of
them.

---

## 11. Open items for the business

Everything else in this plan can proceed without these.

1. **The production domain.** A GSC verification token already exists at
   `layout.tsx:42` — the property appears to be set up.
2. **Confirm the service-area city list** (§1.5). Cities and characteristics are
   drafted and real; the "we serve here" claim is Ray's.
3. **Real Google rating and review count** — otherwise the derived figure from
   the 8 reviews on file stands, which is honest but understates the business.
4. **Real Facebook and Instagram URLs** — or they stay deleted.
5. **Real pricing in `services.ts`** — gates the cost-guide article (§5.3) and
   any `Offer` price markup.
6. **Photography** — gates `ImageObject`, article images, and the gallery's
   before/after frames, all of which are scaffolded and waiting.
7. **Verify or delete each `site.credentials` claim** — "Licensed & insured" is
   a legal claim, not copy. `CHECKLIST.md` Phase 13 already flags this.
