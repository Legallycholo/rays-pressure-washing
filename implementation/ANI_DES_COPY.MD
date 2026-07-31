# ANI_DES_COPY.MD — Animations, Design & Copy: Homepage Refresh Brief

**Status:** Planning only. No code has been touched to produce this document.
**Execution:** Handed to an agent run on **Fable 5** as a self-contained brief.
**Scope:** Homepage-first visual/motion/copy refresh, plus the SEO/mobile/navbar
research requested alongside it. The earlier gallery-photos plan (new before/after
images and the two service videos) is tracked separately in
`/Users/legallycholo/.claude/plans/what-we-are-doing-foamy-sonnet.md` — not
duplicated here, but item **I** below cross-references it since it touches the
same pages.

This project already carries a mature `implementation/` doc set —
`STRUCTURE.md`, `SECTIONS.md`, `ANIMATIONS.md`, `design.md`, `Copywriting.md`,
`OPTIMIZATION.md`, `SEO_AEO_GEO.md`, `CHECKLIST.md`, `AIfinalimplementation.md`.
Everything below was checked against them and against the real code, not
written from a blank page. Where this brief **changes a decision those docs
already made**, that's called out explicitly in §1 — Fable 5 should treat §1 as
authoritative and the older docs as superseded on those specific points only,
nothing else.

---

## 0. Read-first: what's already true, verified against the code

- The color rebrand (`ink` navy / `harbor` blue / `leaf` green / `amber`
  CTA-only) is **already shipped**, not a future task — `globals.css:14-61`.
  `design.md`'s own "Planning document only" header (`design.md:3`) is stale;
  ignore it.
- `Reveal.tsx` (scroll-reveal) and `StackingCards.tsx` (the n8n.io-style
  stacking effect) are **already built** and already used once, in
  `HowItWorks.tsx`. This brief extends both, it doesn't invent them.
- The site is **already indexable** — `INDEXABLE = true` in
  `src/lib/indexing.ts`, flipped 2026-07-29. SEO changes below are visible to
  Google immediately, not staged behind a future launch switch.
- `VideoShowcase` is already wired into the homepage
  (`src/app/page.tsx`, between `BeforeAfterShowcase` and `HowItWorks`) but
  `siteVideo` in `media.ts` is still an empty placeholder, so it currently
  renders a gray "VIDEO: ..." placeholder box on the live site. That's the
  thing being removed in item **F**.
- `site.credentials[1]` = `"Same-Day Availability · Instant Pricing · No
  Contracts"` is a single string read by `TrustBar`, `Hero`, `Footer`,
  `/about`, and `credentialBadges` — one edit removes it everywhere.

---

## 1. Explicit overrides of prior decisions

Two items in this brief **reverse a decision another doc already made on
purpose**. Fable 5 should implement them as written — the override is
intentional, coming from the current direction — but each is flagged so
nothing gets quietly lost:

1. **Hero entrance animation.** `CHECKLIST.md` and `improvement.md` codified
   "no entrance animation on the hero" (reaffirmed in `ANIMATIONS.md:68-70`),
   specifically to protect LCP. This brief asks for one anyway (item **A**).
   The override is: animate the *chrome* around the hero (eyebrow, CTAs,
   credentials, the image wipe) on a stagger, but the constraint that made the
   original rule exist doesn't go away — **the H1 text itself must still be
   present and paintable immediately**, never delayed behind JS or fetched
   fonts. See item A's implementation notes.
2. **Green's role.** `design.md` §4.3 deliberately scoped `leaf` green to a
   *narrow* accent (checkmarks, verified/clean icons) with `harbor` blue
   staying dominant — never a "how much green vs. blue" ratio decision. This
   brief asks for more green, including in font/heading color (item **B**).
   The one rule from that doc that **must survive unchanged**: any solid
   `leaf` fill under white text has to be `leaf-600` or darker (5:1 contrast
   floor, `design.md:293-294`). Green gets more territory; the contrast floor
   doesn't move.

Two more items touch a **real business decision**, not just scaffolding, and
should be confirmed rather than assumed:

3. **Removing "No Contracts."** This phrase wasn't a placeholder — it's a
   verbatim directive from Geni, the business owner, collected in a working
   session (`OPTIMIZATION.md:24-31`), replacing an earlier, unwanted "$2M
   coverage / background-checked crews" claim. Removing it now is fine to
   build, but it's worth a one-line confirmation with the business side before
   it ships, since it reverses an owner instruction rather than cleaning up
   scaffolding.
4. **Service × city matrix expansion** (see item **K**) — same category: a
   deliberate, documented scope-control choice, not an oversight.

---

## 2. Checklist for Fable 5

Work top to bottom. Each item names its files. Nothing here is code yet —
this is the spec to implement from.

### A. Hero opening animation
- [ ] `src/components/sections/Hero.tsx` (home variant only, not `page`
      variant): stagger eyebrow → H1 → lede → CTAs → rating/credentials in on
      first paint. Reuse `--ease-out-expo` / `--ease-spring` from
      `globals.css` — no new animation library.
- [ ] Apply the existing `.edge-wipe-top` / `.edge-wipe-bottom` clip-path
      motif (`globals.css:195-200`, defined but never used on the hero) to the
      `BeforeAfterSlider` image so it wipes into view — ties the "opening"
      moment to the site's one existing signature shape instead of inventing
      a new one.
- [ ] Must plug into the existing progressive-enhancement contract exactly
      like `Reveal.tsx` does: hidden state gated behind `[data-reveal-ready]`
      (set pre-paint in `layout.tsx`), safe if hydration fails, fully
      collapsed under `prefers-reduced-motion`.
- [ ] **Non-negotiable:** the H1 string itself renders in the initial HTML,
      unhidden by any `opacity:0` base state that depends on JS to clear —
      animate a wrapper/transform around it, never the text's paint itself.
      This is what keeps LCP intact per the original rule this item overrides.
- [ ] Update `ANIMATIONS.md`'s "no entrance animation on the hero" line in
      place once built, same as that doc's own Phase-0 convention of keeping
      docs and code from contradicting each other.

### B. Green, expanded — including font color
- [ ] `src/components/ui/SectionHeading.tsx` — shift the on-light eyebrow/
      kicker color from `harbor-600` to `leaf-600` (on-dark already uses
      `leaf-400`), the literal "green font" ask.
- [ ] `src/components/ui/Badge.tsx` — reach for the existing `mint` tone more
      often where it semantically fits (guarantee, clean-result, eco-adjacent
      copy) instead of defaulting to `hydro`.
- [ ] `StatsRow.tsx`, `ServicesGrid` method badges, `GuaranteeBand` — a few
      targeted spots to let a stat suffix or badge run in leaf instead of
      harbor.
- [ ] `.hydro-mesh` in `globals.css:203-208` — the green radial layer already
      exists at 0.16 opacity; nudge it up modestly on dark sections.
- [ ] **Hold the line on:** `amber` stays CTA-exclusive (untouched); any solid
      leaf fill with white/light text stays `leaf-600`+ for contrast
      (`design.md:293-294`); `ink` navy stays the dominant surface color. This
      is an expansion of green's territory, not a repaint of the palette.

### C. Navbar — more professional, more spacious (n8n.io-inspired)
- [ ] `src/components/layout/Header.tsx` — reduce visual *density* without
      undoing the prior "make the logo bigger" fix from Geni
      (`OPTIMIZATION.md` item 1, already shipped as `Logo.tsx` h-12/h-14 and
      `--header-height: 5.5rem`). The ask is spacing and restraint, not a
      smaller logo: tighten the utility bar's content, give the main nav row
      more horizontal breathing room, simplify the services mega-menu to
      fewer words per row so icons + short labels carry it.
- [ ] Keep the existing sticky/scroll-blur behavior and the
      header-CTA-yields-to-in-flow-primary logic (`inFlowPrimary` state,
      `Header.tsx:48-66`) exactly as-is — that's conversion logic, unrelated
      to the visual pass.
- [ ] No browser/screenshot tool was available to literally inspect n8n.io's
      live navbar in this session — the description above (minimal chrome,
      generous padding, restrained mega-menus, muted palette, pill CTA) is a
      known-pattern description, not a pixel reference. If a closer visual
      match matters, get an actual screenshot or reference URL into a future
      session.

### D. Trim the copy (homepage first)
- [ ] Audit `src/app/page.tsx` and every section it renders for paragraph
      blocks that restate a claim the heading or an icon already makes.
      Candidates: `Hero`'s lede, `SectionHeading` ledes across sections,
      `ServiceAreaSection`'s intro paragraph (see item **H**).
- [ ] Apply `Copywriting.md`'s existing voice rules while trimming — short
      sentences, no hype phrases, no unsupported superlatives, no em dashes —
      this is a length pass, not a new voice.
- [ ] Scoped to the homepage. Inner pages (service pages, city pages, about,
      articles) are **not** included in this pass — if the business wants
      that broader, it's a separate, explicitly-scoped follow-up.

### E. Remove the "No Contracts" claim
- [ ] `src/content/site.ts:128` — change
      `"Same-Day Availability · Instant Pricing · No Contracts"` to
      `"Same-Day Availability · Instant Pricing"`. One line; cascades to
      `TrustBar`, `Hero`, `Footer`, `/about`, `credentialBadges` automatically.
      (See §1.3 — confirm with the business side before shipping.)

### F. Remove the homepage "watch a full job" video section
- [ ] Remove `<VideoShowcase />` from `src/app/page.tsx`'s render only. Leave
      `VideoShowcase.tsx` and `src/content/media.ts` in the codebase, unused,
      for whenever real full-job walkthrough footage exists — don't delete
      the component.
- [ ] Do not confuse this with the two task-specific clips (gutter cleaning,
      window washing) from the gallery plan — those are separate, real
      footage, and live in the gallery, not this generic reel slot. See the
      cross-referenced plan file for that work.

### G. No offers/promotions section — confirmed non-goal
- [ ] Nothing to build. Checked `CHECKLIST.md`, `improvement.md`, and
      `packages.ts`'s own header comment — no offers/promo section has ever
      been proposed or deferred in this codebase; it's genuinely untouched
      ground, not something being removed. Do not add one while doing the
      `pressurewashingxpert.com`-inspired pass — that reference site has one,
      this site deliberately doesn't yet.

### H. Space out the service map
- [ ] `src/components/sections/ServiceAreaSection.tsx` /
      `CoverageMap.tsx` — this is the "service map" that reads piled-up: a
      dense intro paragraph next to a wall of 13 city pill-links wrapped
      together. Give the pill list more breathing room (gap/grouping instead
      of one long wrapped block — e.g. priority cities as their own row,
      visually separated from the rest) and trim the intro paragraph per
      item **D**'s rules.

### I. Gallery photos/videos — tracked elsewhere, not duplicated here
- [ ] Cross-reference only: adding Ray's real before/after photos and the two
      service videos is planned in
      `/Users/legallycholo/.claude/plans/what-we-are-doing-foamy-sonnet.md`
      (Phase 1). That plan also wires the currently-dormant
      `Project.video` field into `ProjectCard`/`GalleryLightbox`. If Fable 5
      is doing both passes in one session, do Phase 1 first — item F above
      assumes those two clips stay in the gallery, not the homepage reel.

### J. Mobile optimization
- [ ] This is not new ground — `ANIMATIONS.md §7` (safe-area insets, 44×44px
      targets, detached scroll listeners below `lg`, overscroll lock, `dvh`
      not `vh`) and `AIfinalimplementation.md §4` (320/360/390px widths,
      Lighthouse ≥90, chat composer vs. on-screen keyboard, CLS on slow 4G)
      already spec this. `CHECKLIST.md` Phase 14 marks five of these `[~]` —
      **written but unverified on real hardware**: OS reduced-motion toggle,
      screen-reader pass, Lighthouse/CLS numbers, real-device safe-area check,
      and scroll-feel tuning of `--stack-step`.
- [ ] Fable 5's job here is to close those five `[~]` items out (or as many
      as a device lab / real browser access allows), plus re-verify all of
      them against whatever new markup items A/C/H add — a new hero animation
      and a denser mega-menu are exactly the kind of change that can
      regress a previously-passed mobile check.
- [ ] No live device was available in this planning session to pre-verify
      any of this — treat the whole list as open, not assumed-fine.

### K. Service × city matrix — research findings + a decision, not an action
- [ ] **What exists today:** `/services/[service]` (7 pages, all cities
      linked). `/services/[service]/[city]` is intentionally capped to the 4
      **priority** cities (Lexington, Irmo, Columbia, Chapin) × 7 services =
      28 pages — `generateStaticParams` in
      `src/app/services/[service]/[city]/page.tsx` and `dynamicParams =
      false` enforce this at build time; non-priority cities link out to the
      generic `/service-areas/[city]` page instead.
  - Every page has its own `generateMetadata` (unique title/description,
    canonical), `serviceSchema`/`faqSchema`/`breadcrumbSchema` JSON-LD, and
    is enumerated in `sitemap.ts` from the same content arrays that drive
    `generateStaticParams` — sitemap and built pages can't drift apart by
    construction.
  - This cap is a **deliberate SEO strategy**, documented twice
    (`STRUCTURE.md §7.3`, `SEO_AEO_GEO.md §7`): thin, near-duplicate
    city×service pages get sites demoted, so ship the priority set, prove it
    ranks, then expand — not a missing feature.
- [ ] **The gap, if it's wanted:** the other 9 cities (Gaston,
      Batesburg-Leesville, Hopkins, Blythewood, Gadsden, Aiken, Dalzell, West
      Columbia, Seven Oaks) × 7 services = 63 pages don't exist yet. No doc
      states a numeric trigger ("expand once X ranks") — it's a judgment
      call for the business, not something these docs pre-authorize.
  - **Decision needed from the business:** expand the matrix now, or keep
    waiting on priority-city rankings? If yes, each new city page needs the
    same non-thin, per-city prose STRUCTURE.md §7.3 requires (`localChallenge`,
    `housingStock`, `neighborhoods` woven into real paragraphs, not a data
    table) — `locations.ts` already carries that data for all 13 cities, so
    the content model doesn't block this, only the `generateStaticParams`
    cap does.

### L. `pressurewashingxpert.com` benchmark (already researched)
- Fetched as static content only (no browser tool this session, so live
  JS/animation behavior couldn't be observed). Findings: plain white/gray/blue
  palette, no green at all, standard sans-serif type, conversion-focused
  section order (hero → 6 service cards → before/after → how-it-works →
  gallery → testimonials carousel → offers → FAQ → service areas → contact).
- Ray's site already matches or exceeds that section list (`TrustBar`,
  `SymptomChecker`, `ServicesGrid`, `BeforeAfterShowcase`, `HowItWorks`,
  `GuaranteeBand`, `MaintenanceTeaser`, `Testimonials` carousel,
  `ServiceAreaSection`, `FaqSection`, `StatsRow`, `ArticlePreview`) plus a
  from-scratch motion system that reference site shows no evidence of having.
  This is a polish pass to beat a competitor, not a rebuild.

### M. `v0-pressure-washing-xperts` GitHub repo — BLOCKED
- [ ] **Could not access this.** No GitHub MCP connector is configured for
      this session, the `gh` CLI isn't installed, and a web search for
      `v0-pressure-washing-xperts` returned no public match — it's most
      likely a private repo under your GitHub account (a v0.dev build).
- [ ] **To unblock:** either (a) share the repo URL and make it public or
      grant access, (b) paste the relevant component/page code directly into
      a session, or (c) install and authenticate the `gh` CLI
      (`brew install gh && gh auth login`) so a future session can pull it
      via `gh repo clone` / `gh api`. Nothing in items A-L above depended on
      this repo — it was purely for extra visual reference, which is why the
      rest of this brief could proceed without it.

---

## 3. Explicit non-goals (don't touch)

- No offers/promotions section (item G).
- No change to `amber`'s CTA-exclusive role, or to the dominant `ink` navy
  surfaces (item B).
- No expansion of the service×city matrix without an explicit go from the
  business (item K) — build the capability if asked, don't flip
  `dynamicParams`/`generateStaticParams` unilaterally.
- No copy trim on inner pages (service pages, city pages, `/about`,
  `/articles`) — homepage only, per item D.
- No deletion of `VideoShowcase.tsx` or `media.ts` — item F removes it from
  the homepage render, keeps the component for later.

---

## 4. Verification

- [ ] `npm run typecheck`, `npm run lint`, `npm run build`.
- [ ] `npm run dev`, hard-reload the homepage: hero entrance plays once,
      correctly staggered; re-check with OS "reduce motion" on — collapses to
      instant/static.
- [ ] Confirm `site.credentials` still renders cleanly (no dangling `·`) in
      all five consuming locations.
- [ ] Confirm the homepage no longer renders a "VIDEO: ..." placeholder box.
- [ ] Scan every new/changed green usage against `globals.css`'s existing
      focus-ring and `::selection` rules for contrast.
- [ ] Re-run the five `[~]` mobile items from `CHECKLIST.md` Phase 14 (item J)
      against the new hero/navbar/service-map markup specifically, not just
      in isolation.
- [ ] Confirm `ANIMATIONS.md`'s "no hero entrance animation" line has been
      updated in place to describe the new, intentional exception (per that
      doc's own Phase-0 convention).
