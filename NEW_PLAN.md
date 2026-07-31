# NEW_PLAN.md — Reposition Ray's off "lake houses only" to Residential + Commercial

Context for whoever runs this (Claude Code in Cursor): this plan was scoped in a
planning session against two repos — `rays-pressure-washing` (this repo) and
`Legallycholo/V0--Pressure-Washing-Xperts` (a sibling site, cloned for copy/UX
inspiration, not to be copied verbatim). Decisions below were confirmed by the
owner; where something is still open, it's called out explicitly instead of
guessed.

## Confirmed scope

- **Commercial**: light section only. One `/services/commercial` overview page
  (small business / offices / storefronts) plus enough commercial entries to
  make the nav dropdown feel real. **Not** the ~20-page commercial buildout
  from the Xperts repo — that's future work, not this pass.
- **Lake copy**: rewrite it, don't delete the city. Chapin/Lake Murray stays
  as a service area, but the "lake humidity" framing that leaks into
  `services.ts` (house-washing, driveways, decks-fences, gutters, glass,
  pool-deck) and `locations.ts` (Chapin's `intro`/`localChallenge`/`summary`)
  gets generalized to shade/humidity/tree-canopy language that reads true for
  every property, not just waterfront ones.
- **Visual style**: keep Ray's existing design system (the `ink-*` /
  `harbor-*` / `leaf-500` / `sand-*` tokens, `Container`, `Button`, `Icon`
  components) — don't adopt the Xperts dark-navy/cyan look. Where Xperts has a
  genuinely better *pattern* (its two-column residential/commercial mega-menu,
  its clearer nav information architecture), borrow the structure and
  reskin it in Ray's palette.
- **SEO**: hands off. Do not touch `layout.tsx` metadata `keywords`,
  `sitemap.ts`, `robots`, `schema.ts`, or the `lib/indexing.ts` AEO/GEO work.
  Those keep the existing "lake house pressure washing" / "Lake Murray
  pressure washing" targeting untouched.
- **Nav**: reorganize into a more organized dropdown structure across the
  header (see Phase 3).

### Flagged, not decided — confirm before touching

Two files say "big lake houses" in visitor- and crawler-facing copy that
isn't strictly SEO *metadata*, but sits right on the line the "don't touch
SEO" instruction drew:

- `src/app/llms.txt/route.ts:43` — `"for big lake houses and the residential properties around them"`
- `src/app/opengraph-image.tsx:50` — `` `Big lake houses · ${site.guarantee.title} · ${site.serviceRegion}` ``

Recommendation: update both to match the new positioning (they're
crawler/social copy, not metadata config), but don't do it silently — ask the
owner in the same session before editing these two, since "don't touch SEO"
was explicit.

---

## Phase 1 — Kill the "lake houses only" framing (site-wide copy)

Every file below currently states or implies the business is *for* lake
houses specifically. Replace with "residential and commercial exterior
cleaning across {site.serviceRegion}" (or equivalent), keeping each file's
existing voice/tone.

| File | Current | Change to |
|---|---|---|
| `src/components/layout/Header.tsx:198-211` | Mega-menu promo card: *"Own a big place on the lake? Send your address. We come back with a price."* | Generic promo card, e.g. *"Residential or commercial?"* / *"Send your address. We come back with a price."* — keep the card, change the hook line only |
| `src/app/services/page.tsx:14` | *"...on big lake homes and the properties around them..."* | *"...for residential and commercial properties across {region}."* |
| `src/app/about/page.tsx:21,42,69` | 3 instances of "big lake houses" | Reposition around residential + commercial, keep the "same owner, same standard" through-line |
| `src/app/thank-you/page.tsx:65` | *"Real jobs around the lake, dragged side by side."* (gallery slider copy) | Broaden to "Real jobs, dragged side by side" or reference a mix of residential/commercial jobs |
| `src/content/assistant.ts:154` | *"We work on big lake homes, and the whole exterior can go in one visit..."* | Same claim, generalized to any residential or commercial property |
| `src/content/site.ts:94-111` (`serviceRegion` comment) | Comment references "homepage H1 and title still lead on lake houses" | Update comment once the homepage copy actually changes — this is a doc-comment, low risk, but keep it in sync so it doesn't mislead the next reader |

Also check for a homepage-specific Hero component (`src/components/sections/Hero.tsx` or similar under `src/app/(home)` — locate it; it wasn't grep-matched for "lake" directly but is almost certainly where the H1 referenced in the `site.ts` comment lives) and update the H1/subhead there to lead with residential + commercial, not lake houses.

## Phase 2 — Generalize lake-specific service & location copy

**`src/content/services.ts`** — these entries currently justify themselves
with lake/waterfront causation. Rewrite the causation, keep the service
mechanics (method, includes, pricing) untouched:

- `house-washing` (line ~63): *"a house that sits near open water feeds it constantly: humidity off the lake..."* → shade, tree canopy, and general Midlands humidity as the cause, not proximity to a lake.
- `driveways-sidewalks` / concrete (line ~91): *"a long lake-house driveway or a motor court"* → *"a long driveway or a motor court"*.
- `decks-fences` (line ~146): *"On a lake lot the base of a fence line barely dries..."* → *"In shaded yards the base of a fence line barely dries..."*.
- `gutters` (line ~172): *"Lake lots keep their hardwoods..."* → *"Mature-canopy lots keep their hardwoods..."*.
- `window-cleaning`/glass (line ~198): *"That matters most on the lake-facing side of a house..."* → *"That matters most on any wall of glass..."*.
- `pool-deck` (line ~226): *"On a lake property the pool usually sits between the house and the water..."* → generalize to shaded/enclosed pool decks generally.

Also update the file's top-of-file doc comment (line 1-15: *"for residential
lake houses"*) once commercial entries exist (Phase 4) — it should describe
the catalog accurately, not the old niche.

**`src/content/locations.ts`** — Chapin entry (lines ~220-249):
- `intro`: drop *"Chapin calls itself the Capital of Lake Murray, and the work here reflects it"* opening; keep the factual detail (waterfront homes, glass, docks) as *what's on the ground in Chapin*, not as the business's specialty pitch.
- `localChallenge` / `summary`: keep factually accurate (Chapin genuinely does have lake humidity), but frame it as "this is what Chapin needs" rather than "this is who we serve."
- Leave `neighborhoods`, `landmarks`, `topServices`, `driveMinutes`, etc. untouched — factual, not positioning.

**`src/content/articles.ts`** (lines ~34, 206, 260) — these are educational
blog content, not homepage positioning. Lower priority; leave as-is unless
the owner wants the blog scrubbed too (they read as legitimate "why humidity
near water is worse" content, which is true regardless of positioning).

## Phase 3 — Nav: organized dropdowns, residential + commercial

Current nav (`Header.tsx`): one "Services" mega-menu (single column, all
services flat — no residential/commercial split, because there is no
commercial yet) plus flat links (Before & After, Service Areas, Reviews,
About, Articles).

Xperts' `data/navigation.ts` pattern worth borrowing (structure only, not
visual style): separate `residentialServices` / `commercialServices` arrays,
each rendered as its own labeled column inside one mega-menu, plus grouped
"quick links."

Target structure for Ray's:

1. Add a `Segment = "residential" | "commercial"` union to `src/content/services.ts` (currently `Segment = "residential"` only, line 17) and tag every existing service `residential` explicitly.
2. Add 3–5 commercial entries (Phase 4) tagged `commercial`.
3. In `Header.tsx`'s mega-menu, split the single flat service list into two
   columns — **Residential** and **Commercial** — keeping the existing
   two-column CSS grid but keyed off `segment` instead of one flat list.
   Promo card (3rd column) stays, just re-worded per Phase 1.
4. Mobile drawer (`Header.tsx:317-332`): same split, two labeled sub-lists
   instead of one flat list.
5. Add "Commercial" as its own top-level nav link if the owner wants
   commercial discoverable outside the mega-menu — optional, ask before
   adding since it changes information architecture beyond "more organized
   dropdowns."
6. Leave `navLinks` (Before & After, Service Areas, Reviews, About, Articles)
   as flat top-level items — they're not services, don't force them into a
   dropdown.

## Phase 4 — Light commercial section

New content, additive only — does not touch the residential catalog.

1. **`src/content/services.ts`**: add 3–5 `Service` objects with
   `segment: "commercial"`. Suggested set, phrased in Ray's existing voice
   (not copied from Xperts): `commercial-building-washing`,
   `storefront-cleaning`, `office-exterior-cleaning`. Keep the same shape
   (blurb/intro/includes/symptoms/pricing/faqIds/related) other entries use
   so the existing `/services/[service]` detail page template renders them
   with zero template changes.
2. **`/services/commercial` overview route**: new page, modeled on the
   existing `/services` hub (`src/app/services/page.tsx`) but filtered to
   `segment === "commercial"` — small business, offices, storefronts pitch,
   reusing existing page primitives (no new components needed).
3. **`/services` hub**: add a residential/commercial toggle or two labeled
   sections so the hub page itself reflects the split, not just the nav.
4. Pricing/FAQ data for the new services: mark clearly as PLACEHOLDER
   (matching this repo's existing convention in `services.ts`) until Ray
   supplies real commercial pricing — do not invent commercial rates.

## Phase 5 — QA pass

- `grep -rni "lake" src/` after Phases 1-2 and manually confirm every
  remaining hit is either (a) a real place name in `locations.ts`/`articles.ts`
  correctly describing Chapin/Lake Murray as a place, or (b) something
  intentionally left per the SEO carve-out (`layout.tsx` keywords).
- Visually check the nav mega-menu and mobile drawer at a few breakpoints —
  this is the one part of this plan with real layout risk (two columns
  becoming three, or overflow on the two-column grid).
- Confirm `/services/commercial` and its detail pages pick up canonical URLs,
  sitemap entries, and schema automatically through the existing
  `services.ts`-driven generation (per that file's own doc comment) — since
  Phase 4 is additive to the same array, this should be free, but verify
  rather than assume, since "don't touch SEO" means the *generated* SEO
  artifacts should still come out correct, not that they're exempt from
  working.

---

## Suggested Claude Code prompt (paste into Cursor)

> Work through `NEW_PLAN.md` in this repo phase by phase. Start with Phase 1
> (site-wide "lake houses only" copy) and Phase 2 (generalizing lake-specific
> service/location copy) — these are copy-only changes, no new routes. Stop
> and ask before touching `src/app/llms.txt/route.ts` or
> `src/app/opengraph-image.tsx` (flagged in the plan as borderline-SEO). Once
> Phase 1-2 are done and reviewed, move to Phase 3 (nav dropdown
> reorganization) and Phase 4 (light commercial section: 3-5 new commercial
> services plus a `/services/commercial` overview page), keeping Ray's
> existing design tokens and components throughout — do not introduce new
> colors, fonts, or component patterns from the Xperts repo, only its
> residential/commercial information architecture. Do not modify
> `layout.tsx` metadata, `sitemap.ts`, `robots`, or `schema.ts`. Run Phase 5's
> QA grep and a visual check of the nav before calling it done.
