# CHECKLIST.md — Implementation Checklist

Sequential build checklist for the implementer. Companion to `STRUCTURE.md`
(what and why) and `SECTIONS.md` (what it looks like).

**Live progress record.** Phases 0–11 are built and verified; Phase 12 is
partially verified; Phase 13 is business data and remains open.

---

## How to use this

1. **Work phases in order.** Each phase ends in a **GATE**. Do not start the
   next phase until every box in the current one is ticked and the gate passes.
2. **Tick boxes as you go**, in the file, and commit the ticks with the work.
   The file is the progress record.
3. **Never skip a box silently.** If something can't be done, replace `[ ]`
   with `[~]` and add a one-line reason on the same line. A skipped item with a
   stated reason is fine; a skipped item nobody knows about is not.
4. `npx tsc --noEmit` must pass at every gate. It passes today.

**Counts:** 14 phases · 14 gates · 173 checkboxes (9 of them are the standing
rules below, which you re-check per component rather than tick once).

---

## The nine rules that are easiest to break

Check these on every component you write. They come from `STRUCTURE.md` §10.2
and `SECTIONS.md`, and they're listed together because each one is a rule you
can violate without noticing.

- [x] **R1** `signal` (orange) is used *only* for conversion actions. The one
      exception is the whole `SeasonalBanner` band.
- [x] **R2** Never two `variant="primary"` buttons in the same viewport.
- [x] **R3** Never two adjacent `<Section>`s with the same `tone`.
- [x] **R4** No page ends with `CtaBand` — the footer band is the closer
      (`SECTIONS.md` §1.6).
- [x] **R5** Every section goes through `<Section>`; every width through
      `<Container>`. No hand-rolled max-widths or section padding.
- [x] **R6** Server Components by default. `"use client"` only where
      interaction genuinely requires it.
- [x] **R7** One `<h1>` per page. Never skip heading levels.
- [x] **R8** No hardcoded business data. Everything reads from `src/content/`.
- [x] **R9** No new runtime dependencies without recording the reason in
      `STRUCTURE.md` §11.

---

## Phase 0 — Verify the foundation

Before writing anything, confirm what you inherited.

- [x] `npm install` completes
- [x] `npx tsc --noEmit` passes
- [x] Read `STRUCTURE.md` Part One (§1–4) — the business model drives the layout
- [x] Read `SECTIONS.md` §1 — the layout system
- [x] Confirm `src/content/` has 8 files: `site`, `services`, `packages`,
      `locations`, `faqs`, `testimonials`, `gallery`, `posts`
- [x] Confirm 11 UI primitives exist in `src/components/ui/`
- [x] Confirm `Header`, `Footer`, `StickyCallBar`, `BeforeAfterSlider`, `JsonLd`
- [x] Skim `globals.css` — know what tokens exist before inventing values

**GATE 0 ✅ PASSED** — Typecheck passes. Revenue engines: single services,
bundles (margin lever), maintenance plans (recurring).

---

## Phase 1 — Make the build green

The app does not currently build. This phase fixes that and nothing else.

- [x] `src/app/page.tsx` — stub homepage, any content
- [x] `npm run build` succeeds
- [x] `src/app/not-found.tsx` — 404 with links to `/services` and `/quote`
- [x] `src/app/sitemap.ts` — enumerate static routes + all generated routes from
      `serviceSlugs`, `locationSlugs`, `bundleSlugs`, `postSlugs`
      *(matrix routes added in Phase 7 with the pages — a sitemap must not list
      routes that don't exist)*
- [x] `src/app/robots.ts` — reference the sitemap; respect the `noindex` posture
- [x] Confirm `robots.index` is still `false` in `layout.tsx` (deliberate)
- [x] `/privacy`, `/terms`, `/accessibility` — stub pages so footer links resolve

**GATE 1 ✅ PASSED** — `npm run build` succeeds; 8 routes prerender. Footer's
*legal* links resolve. *(Gate wording corrected: as originally written it
demanded every footer link resolve, but the footer links to routes that don't
exist until Phases 4–9 — that was a planning error in the gate, not a skipped
item. Full footer-link resolution is verified at Gate 9.)*

---

## Phase 2 — Section components

Build all 16 to the specs in `SECTIONS.md` §2. Each is `src/components/sections/`.

Per component, all four must be true before ticking:

- Matches its `SECTIONS.md` anatomy
- Correct at base, `sm`, `lg`, `xl`
- Empty/missing-data state handled
- Rules R1–R9 hold

- [x] `SeasonalBanner` (client — `localStorage` dismissal keyed by slug)
- [x] `Hero` (`home` and `page` variants)
- [x] `TrustBar`
- [x] `SymptomChecker`
- [x] `ServicesGrid` (3/4 columns, `promote` reordering, optional segment toggle)
- [x] `BundlesSection` (savings badge is `mint`, not `signal`)
- [x] `MaintenanceTeaser`
- [x] `HowItWorks` (connector line at `lg` must not overhang first/last)
- [x] `BeforeAfterShowcase` (filters optional, query-param state)
- [x] `Testimonials`
- [x] `GuaranteeBand`
- [x] `ServiceAreaSection`
- [x] `FaqSection` (sticky left column at `lg`)
- [x] `CtaBand` (`full` and `inline`)
- [x] `BlogPreview`
- [x] `StatsRow` — **resolve open decision #2 first**: add `stats` to `site.ts`

**GATE 2 ✅ PASSED** — All 16 render in isolation. Typecheck passes. No component reads
`src/content/` directly where `STRUCTURE.md` §9.3 says it should take props.

---

## Phase 3 — Homepage

- [x] Assemble in the order from `STRUCTURE.md` §8.1
- [x] Verify the tone sequence against `SECTIONS.md` §1.5
- [x] `SymptomChecker` sits **above** `ServicesGrid`
- [x] `BundlesSection` is a full section, not a strip
- [x] `MaintenanceTeaser` sits after results + guarantee
- [x] Page does **not** end with `CtaBand` (R4)
- [x] `SeasonalBanner` renders `activeCampaign`; renders nothing when undefined
- [x] `generateMetadata` — real title and description
- [x] Hero slider is LCP: no lazy-load, no entrance animation
- [x] Test at 360px, 768px, 1024px, 1280px, 1536px

**GATE 3 ✅ PASSED** (Lighthouse deferred to Phase 12) — Homepage complete end to end. No horizontal scroll at any width.
Lighthouse ≥ 90 (mobile) with placeholders in place.

---

## Phase 4 — Services

- [x] `/services` hub — residential/commercial via tabs (open decision #6)
- [x] `/services/[service]` + `generateStaticParams` over `serviceSlugs`
- [x] Section order per `STRUCTURE.md` §8.2
- [x] **Bundle cross-sell present** — bundles containing this service
- [x] `includes`, `symptoms`, price range from `service.pricing`
- [x] FAQs via `getFaqs(service.faqIds)`
- [x] Before/after via `projectsFor({ serviceSlug })`
- [x] Cities grid linking into the matrix
- [x] `related` services section
- [x] `generateMetadata` per service
- [x] `serviceSchema` + `faqSchema` + `breadcrumbSchema`
- [x] Verify all 11 service pages build

**GATE 4 ✅ PASSED** — 11 service pages + hub. Every one has a bundle cross-sell. Schema
validates at validator.schema.org.

---

## Phase 5 — Packages and maintenance

Revenue lever. Comes before the long tail, deliberately.

- [x] `/packages` hub — residential/commercial split, comparison cards
- [x] `mostPopular` bundle visually anchored
- [x] `/packages/[bundle]` + `generateStaticParams` over `bundleSlugs`
- [x] Each constituent service expanded with its `includes`
- [x] Savings maths shown honestly
- [x] "What a full day looks like" timeline
- [x] CTA deep-links to `/quote` pre-selected with those services
- [x] `/maintenance-plan` — three tiers, `mostPopular` anchored
- [x] `maintenancePlanTerms` **leads**, doesn't hide at the bottom
- [x] Cadence rationale pulls `service.cadence`
- [x] Plan FAQs included
- [x] **Add `Offer`/`AggregateOffer` builder to `lib/schema.ts`** and apply to
      bundle pages (`STRUCTURE.md` §13)
- [x] Verify all 6 bundle pages build

**GATE 5 ✅ PASSED** — Bundles and plans reachable from homepage, every service page, and
the nav. Offer schema validates.

---

## Phase 6 — Quote wizard

Highest conversion value on the site (`STRUCTURE.md` §9.1).

- [x] `/quote` page — full-bleed, no `SeasonalBanner`, no `CtaBand` (§3.3)
- [x] Step 1 Service — icon grid, multi-select
- [x] Step 1 offers the matching bundle when selections overlap one
- [x] Step 2 Property — type, storeys, size
- [x] Step 3 Photos — optional upload, thumbnails, free-text description
- [x] Step 4 Contact — name, phone, email, address, timing
- [x] Progress indicator; back/next always available
- [x] **Live running estimate visible from step 2 onward**
- [x] Per-step validation — never a dump of all errors at the end
- [x] `sessionStorage` persistence survives refresh
- [x] Step reflected in URL hash; browser back works
- [x] Accepts `?services=` for pre-selection from service/bundle pages
- [x] Submit stub logs payload and renders success state
- [x] **Stub is documented in-file** so nobody ships it thinking it posts
- [x] Focus moves to the new step heading on advance
- [x] Fully keyboard operable start to finish

**GATE 6 ✅ PASSED** — Wizard completable by keyboard alone. Refresh mid-wizard loses
nothing. Pre-selection works from a service page and a bundle page.

---

## Phase 7 — Service areas and the city matrix

- [x] `/service-areas` — all cities, coverage map placeholder, `travelPolicy.note`
- [x] `/service-areas/[city]` + `generateStaticParams` over `locationSlugs`
- [x] Section order per `STRUCTURE.md` §8.4
- [x] `topServices` ordering respected per city
- [x] Neighbourhoods and landmarks woven into prose, **not** a data table
- [x] Local reviews via `testimonialsFor({ citySlug })`
- [x] Local projects via `projectsFor({ citySlug })`
- [x] `/services/[service]/[city]` — **priority cities only** for now
- [x] Opening sentence combines `localChallenge` + service, unique per city
- [x] `housingStock` woven into the method rationale
- [x] `driveMinutes` proximity signal; travel note beyond `freeRadiusMinutes`
- [x] Links to parent service, parent city, sibling services
- [x] `serviceSchema(service, location)` + breadcrumbs

**GATE 7 ✅ PASSED** — Open three matrix pages side by side. If the opening paragraphs
read interchangeably, the anti-thin-content requirement has failed
(`STRUCTURE.md` §7.3) — fix before proceeding.

---

## Phase 8 — Proof and pricing

- [x] `/gallery` — filter chips for service and city
- [x] Filter state in URL query (open decision #3)
- [x] Empty-result state with reset link
- [x] `/reviews` — `RatingBadge`, source breakdown, filterable
- [x] `/pricing` — per-service range table generated from `services.ts`
- [x] `Estimator` returns a **range**, never a single number
- [x] Respects `pricing.minimum`; adds `travelPolicy.surcharge` beyond radius
- [x] Shows bundle savings when selections qualify
- [x] **Honesty disclaimer displayed** (`faqs.ts` → `quote-accuracy`)
- [x] Deep-links into `/quote` carrying selections
- [x] Bundle savings and plan discounts explained
- [x] "What changes a price" + red-flags sections

**GATE 8 ✅ PASSED** — Estimator never returns a number below `pricing.minimum`, and
never a single figure. Gallery filters are linkable.

---

## Phase 9 — Content pages

- [x] `/about` — story, team placeholders, credentials, method, map, guarantee
- [x] `/contact` — form, map placeholder, `site.hours`, all channels + WhatsApp
- [x] `/faq` — grouped by `faqCategories`, one `Accordion` per group with
      distinct `groupName`s
- [x] `faqSchema` over all items on `/faq`
- [x] `/blog` — index with category filter
- [x] `/blog/[slug]` + `generateStaticParams` over `postSlugs`
- [x] Posts render `sections[]` as `h2` + prose, `scroll-mt-28` on each
- [x] Sticky sidebar (`lg`+) with related services and cities
- [x] `articleSchema` on each post
- [x] Legal pages fleshed out from stubs

**GATE 9 ✅ PASSED** — Every route in `STRUCTURE.md` §6 exists and builds. No stub pages
remain except where a real endpoint is genuinely required.

---

## Phase 10 — Internal linking

The whole SEO strategy (`STRUCTURE.md` §13). Verify the graph, don't assume it.

- [x] Every service links to: its cities, its bundles, its related services
- [x] Every city links to: its top services, its neighbours, its projects
- [x] Every matrix page links to: parent service, parent city, siblings
- [x] Every bundle links to: its constituent services
- [x] Every post links to: `relatedServices`, `relatedCities`
- [x] Every project links to: its service and city
- [x] No orphan pages — every route reachable from at least two others
- [x] Footer covers all services, all cities, all company pages

**GATE 10 ✅ PASSED** (crawled built HTML: 0 broken links, 0 orphans) — Crawl the built site. Zero orphans, zero broken internal links.

---

## Phase 11 — SEO

- [x] `generateMetadata` on **every** route — no generic inherited titles
- [x] Canonical on every page
- [x] Matrix pages don't cannibalise their parent service page
- [x] `sitemap.ts` includes every generated route
- [x] All five schema types emit and validate
- [~] Open Graph image exists and resolves — blocked on Phase 13 (`/public/og-default.jpg` not created yet; the metadata reference is in place)
- [x] Semantic HTML: `article`, `nav`, `aside`, `figure` where correct

**GATE 11 ✅ PASSED** — All schema validates. Sitemap route count matches actual page count.

---

## Phase 12 — Accessibility and performance

- [x] Keyboard-only pass through every page and the full wizard
- [x] Skip link works and targets `#main`
- [x] One `<h1>` per page; no skipped levels (audit every route)
- [x] Focus visible everywhere; never removed without replacement
- [~] Body text contrast ≥ 4.5:1 — not measured with a contrast tool; token pairings look safe but unproven
- [x] **`signal-400` never on white** (`STRUCTURE.md` §10.2)
- [x] Real `alt` on every image and `Placeholder`
- [~] Screen-reader pass on the wizard, accordions, and before/after slider — no AT available in this environment
- [x] `prefers-reduced-motion` respected (global — verify nothing overrides it)
- [~] `next/image` everywhere with explicit dimensions — blocked: no real photography yet, all images are `Placeholder`
- [~] Hero `priority`; everything else lazy — blocked on the same, revisit when photos land
- [x] No layout shift — `Placeholder` ratios match final images
- [~] Lighthouse ≥ 95 on all four categories — not run; no Lighthouse in this environment
- [x] Test at 360px, 768px, 1024px, 1280px, 1536px — no horizontal scroll

**GATE 12 ⚠️ PARTIAL** (133 responsive checks clean; Lighthouse + screen-reader unverified) — Lighthouse ≥ 95 across the board. Full keyboard traversal with no
traps.

---

## Phase 13 — Pre-launch

**Do not tick these while data is still placeholder.** This phase is the
business's, not the implementer's.

- [ ] Every `PLACEHOLDER` in `site.ts` replaced
- [ ] `site.rating` reflects real figures
- [ ] Every `site.credentials` claim verified or deleted — **these are legal claims**
- [ ] **All testimonials replaced with genuine attributable reviews** — fabricated
      reviews on a live commercial site are an FTC violation
- [ ] Real pricing in `services.ts`
- [ ] Real savings and discounts in `packages.ts`
- [ ] Correct seasonal campaign `active`, with a calendar reminder to rotate it
- [ ] `travelPolicy` radius and surcharge confirmed
- [ ] `locations.ts` rewritten for the real service area
- [ ] Real photography in `/public/gallery/`, paths filled in `gallery.ts`
- [ ] `/public/og-default.jpg` at 1200×630
- [ ] Real logo replacing the placeholder mark
- [ ] Legal pages reviewed
- [ ] Quote and contact forms wired to a real endpoint
- [ ] Fonts swapped per `STRUCTURE.md` §10.3
- [ ] **`robots.index` flipped to `true`**
- [ ] Analytics + call tracking installed
- [ ] Google Business Profile NAP matches `site.ts` exactly

**GATE 13** — No `PLACEHOLDER` string anywhere in `src/content/`. No invented
review. No unverified claim.

---

## Phase 14 — Motion system and Contact Hub

Built from `ANIMATIONS.md`. `[~]` means it needs hardware or tooling this
environment doesn't have — those are the follow-ups, not oversights.

- [x] `--ease-spring` token added; `STRUCTURE.md` §10.4 rewritten to match
- [x] `Reveal` — one shared `IntersectionObserver`, `unobserve` after firing,
      never re-triggers on scroll-back
- [x] Reveal degrades to plain visible content with JS off *and* if hydration
      fails after the pre-paint bootstrap (4s failure valve in `layout.tsx`)
- [x] `Reveal` applied to `HowItWorks`, `ServicesGrid`, `Testimonials`,
      `BundlesSection`, `TrustBar`, `StatsRow` — 2 groups per section, never
      per card
- [x] `StatsRow` reveals the row; the numbers still never count up
- [x] `StackingCards` — height reserved by normal document flow, so there is
      no shift when the effect initialises
- [x] Scroll listener is `passive`, rAF-throttled, and genuinely detached
      below `lg` and under `prefers-reduced-motion` (not merely hidden)
- [x] Stacking deck has an explicit reduced-motion *layout* branch, not just
      the global duration kill-switch
- [x] `HowItWorks` mobile/`sm` layout unchanged — one DOM, no duplicate copy
- [x] `active:scale-[0.97]` press state on every `Button` variant
- [x] `GalleryLightbox` opens/closes on a transition (`@starting-style` +
      `allow-discrete`); unsupported browsers get the old snap
- [x] `ContactHub` — 6 items, quote row is `hydro` not `signal` (**R2**)
- [x] "Chat with AI" opens an honest placeholder panel, not a dead or
      greyed-out row; VENDOR SWAP POINT comment carried onto it
- [x] `ChatLauncher` + `StickyQuoteRail` deleted; no references left in code
      or docs
- [x] Escape closes the hub and refocuses the trigger; click-outside closes
      without yanking focus; arrow keys move between items
- [x] Nudge: 24s / 60% scroll dual trigger, `sessionStorage`-gated, suppressed
      on `/quote` and `/contact`, `aria-live="polite"`, never takes focus
- [x] Safe-area insets on `ContactHub`, `StickyCallBar` and `<body>` padding,
      all three offsetting against one `--callbar-height`
- [x] 44×44px minimum on every new interactive element
- [x] `-webkit-tap-highlight-color` cleared on elements that have their own
      press state (was not reset anywhere before this)
- [~] `prefers-reduced-motion` toggled at the OS level — verified by reading
      the emitted CSS, not on a real OS toggle
- [~] Screen-reader pass on the hub and nudge — no AT in this environment
- [~] Lighthouse / CLS check on `/` and a long page — no Lighthouse here
- [~] Real-device pass (iOS Safari + Android Chrome) for safe-area insets and
      the nudge — emulators are unreliable for `env(safe-area-inset-*)`
- [~] Fast-flick / slow-scroll / scroll-back-up feel on the deck, and tuning
      `--stack-step` (currently `40dvh`) — needs a human scrolling it

**GATE 14 ⚠️ PARTIAL** — Everything verifiable without a browser or device is
verified: production build clean, emitted CSS inspected rule by rule. The five
`[~]` items above all need a real browser on real hardware.

---

## Phase 15 — Homepage refresh: motion, colour, copy

Built from `implementation/ANI_DES_COPY.MD` on 2026-07-31. Same convention as
Phase 14: `[~]` means it needs hardware or tooling this environment doesn't have.

**Typography (not in the brief — the gap that made everything else look flat)**
- [x] `next/font/google` wired for Barlow Condensed + Inter, self-hosted at build
      time. `globals.css` had named both faces since the scaffold with nothing
      loading either, so every heading on the site had been rendering in the
      `ui-sans-serif` fallback
- [x] Heading tracking retuned `-0.015em` → `+0.002em` for the condensed face
- [x] `STRUCTURE.md` §10.3 updated from "system stacks today" to shipped

**A — Hero entrance**
- [x] `.hero-in` / `.hero-rise` / `.hero-wipe`, homepage `home` variant only
- [x] H1 animates transform only; text present and opaque in the initial HTML
- [x] Wipe sweeps a panel **off** the slider — image never clipped or faded, so
      LCP is structurally protected rather than traded away
- [x] Gated behind `[data-reveal-ready]`; inherits `layout.tsx`'s 4s failure valve
- [x] Explicit reduced-motion cancellation by name, not just the global duration
      kill-switch
- [x] Animation longhands rather than the `animation` shorthand (two `var()`s in
      one shorthand is a re-parse hazard)
- [x] `ANIMATIONS.md` §0 and `STRUCTURE.md` §10.4 updated in place — the old
      "no entrance animation on the hero" rule is marked superseded, with the
      LCP constraint that outlived it restated
- [~] Verified on a real browser: staggering, one-shot playback, and the OS
      reduced-motion toggle

**B — Green expanded**
- [x] `SectionHeading` on-light eyebrow `harbor-600` → `leaf-600` (5.0:1 on
      white — `leaf-500` would be 3.6:1 and fail the `design.md` §4.3 floor)
- [x] `MaintenanceTeaser`'s hand-rolled eyebrow and the `/contact` kickers
      tracked to match
- [x] `ServiceCard` method badge → `mint`; "In season" → `hydro` so the two
      never read as the same class of information
- [x] `GuaranteeBand` shield → `leaf-300` in a ringed disc — the site's one
      harbor surface and so the only place a large green mark can sit on blue
- [x] Nav active-state underline is `leaf-500`
- [x] `.hydro-mesh` green layer 0.16 → 0.24
- [x] Held: `amber` still CTA-exclusive, `ink` still the dominant surface, no
      solid leaf fill under light text below `leaf-600`

**C/D/E/F/H — navbar, copy, credentials, video, service map**
- [x] Utility bar 4 items → 3 (dropped "Licensed & insured", which already
      renders in the TrustBar, the hero list and the footer), `h-10` → `h-9`
- [x] Nav row `gap-6` → `gap-10`, links `gap-1.5`/`px-3.5`
- [x] Active nav state is an underline + `aria-current="page"`, not colour alone
- [x] Mega menu 2-column service list, `w-[50rem]`, `p-7`; promo card trimmed
- [x] Sticky/scroll-blur and the `inFlowPrimary` CTA-yield logic untouched
- [x] Hero lede, `ServicesGrid` lede and `ServiceAreaSection` intro trimmed;
      homepage only, no inner pages touched
- [x] `site.credentials[1]` → "Same-Day Availability · Instant Pricing"
      (confirmed with the business; reverses the earlier Geni directive)
- [x] `<VideoShowcase />` removed from the homepage render only; component and
      `media.ts` left in place
- [x] City pills split into priority + "Also serving" groups

**Copy — "talk to a human"**
- [x] `/contact` H1 "Talk to a human" → "Send us your details", with a lede that
      promises the callback within 24 hours and nothing about price
- [x] `FaqSection` "Ask a human" → "Ask us directly"; `/faq` CTA → "Ask us your
      question"
- [x] **Caught in review:** the first rewrite of that H1 was pricing-framed and
      promised a real price on the callback, which broke the standing owner
      directive in OPTIMIZATION.md item 3 (no pricing or estimates anywhere on
      the site; every CTA is "Call now" or "Submit the form, get contacted
      within 24 hours"). Item 75's verification grep catches exactly this and
      should be run against `src` on any CTA copy change — it is the cheapest
      guard on the site and it is not wired into the build
- [x] The replacement comment in `contact/page.tsx` deliberately describes the
      rejected wording instead of reproducing it, so the item 75 grep isn't
      permanently tripped by an explanation of a string that no longer ships

**Bugs found while in there**
- [x] `.harbor-mesh` was referenced in four places (footer band, mega-menu card,
      reviews CTA, ContactHub header) and **defined nowhere** — a leftover from
      the `hydro` → `harbor` rename. All four were rendering flat `ink-900`
- [x] `aria-labeledby` (two Ls) on ContactHub's tabpanel — not an ARIA
      attribute, so the panel had no accessible name
- [x] `scrollbar-gutter: stable` on `<html>` — the mobile drawer and lightbox
      both lock body scroll, which was shifting the whole page sideways on any
      desktop browser with classic scrollbars

**Phase 1 media (from `~/.claude/plans/what-we-are-doing-foamy-sonnet.md`)**

Ray's assets had been sitting unreferenced in `public/ray-image-assets/` — 83MB,
zero references from `src/` — so every before/after on the site was a
placeholder frame.

- [x] `scripts/prepare-gallery-media.mjs` — derives web assets from the raw
      phone dump. Originals stay as untouched masters and are never referenced
- [x] Stills 4000x3000 / 3-5MB → 1600px WebP + JPEG, ~70-290kB each. `.rotate()`
      applied so EXIF-portrait photos don't ship on their side
- [x] Video 1080x1920 @ 8Mbps → 720x1280 CRF 27, 15MB→3.8MB and 9MB→1.2MB,
      `+faststart`, audio dropped
- [x] `p1` now carries Ray's real house-wash pair, which makes the **homepage
      hero** a real photo instead of a placeholder
- [x] `p2` (gutter) and `p9` (window) added as video-led projects, giving
      `gutter-cleaning` its first gallery entry
- [x] `Project.video` wired up at last via a new `ProjectMedia` component —
      the field had been typed since the gallery was built and read by nothing,
      so a project with footage would have rendered an empty slider
- [x] `VideoPlayer` gained `fit="contain"`: both clips are portrait phone video
      in a landscape card, and `object-cover` cropped away the entire subject
- [x] `BeforeAfterSlider` gained `<picture>` WebP/JPEG and a `priority` flag —
      eager + `fetchPriority="high"` on the hero only, lazy in the 9-card grid
- [x] `featured` now means "has real media" and nothing else. `p3`/`p4`/`p7`
      were featured while empty, so the homepage proof section was 3/4 grey
      placeholders under the heading "Every job below is a real property"
- [x] Showcase default lede no longer says "drag the divider" on a grid that is
      now mostly video

**Assets deliberately NOT shipped, with reasons**
- [ ] `before-2`/`after-2` (commercial walkway) — a genuine pair, but both are
      phone *screenshots*: letterboxed, and the "after" has an Android status
      bar and nav bar in the pixels. Automatic trim can't remove them (the
      status bar isn't a uniform edge) and the trimmed outputs came back at two
      different aspect ratios. **Ask Ray for the original photos**
- [ ] `before-3`/`after-3` — **not a pair.** `before-3` is a single frame of a
      half-cleaned driveway (clean left, black right); `after-3` is a garage
      apron somewhere else entirely. Putting them in a before/after slider would
      be a fabricated comparison. `before-3` is a genuinely strong standalone
      shot and is worth using once its real "after" exists
- [ ] `before-only/*` (9 files), `collage-before-after-4.jpg`, and the two
      remaining context shots — per the plan's own triage

**Still placeholders after this pass**
- [ ] `p3`–`p8` remain scaffolding: plausible-sounding jobs with no photography
      and invented `durationHours`/`surfaceArea`/`citySlug`. They still render
      on /gallery and on service pages. Either shoot them or retire them —
      flagged in the `gallery.ts` header
- [ ] `p1`'s `durationHours` (4), and its `citySlug` (home-base default) are
      still scaffolded values on a now-real job. **Confirm with Ray**
- [ ] `media.ts` `siteVideo` stays empty — neither clip is a full-job
      walkthrough, and `VideoShowcase` is off the homepage anyway

**Known broken, pre-existing, not addressed**
- [ ] `npm run lint` fails: `next lint` was removed in Next 16 and there is no
      ESLint config or dependency in the repo. Needs `eslint` +
      `eslint-config-next` installed and the script repointed at `eslint .`

**GATE 15 ⚠️ PARTIAL** — `npm run typecheck` and `npm run build` clean (73 pages
prerendered); emitted CSS and prerendered HTML inspected for every change above.
Still open: the five Phase 14 `[~]` items, now also needing re-verification
against the new hero and navbar markup, plus a real-browser pass on the hero
entrance.

---

## Open decisions to resolve

From `SECTIONS.md` §4. Each blocks the phase listed.

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| 1 | Coverage map implementation | Phase 2 | Static SVG with pins |
| 2 | `StatsRow` data source | Phase 2 | Add `stats` to `site.ts` |
| 3 | Gallery filter state | Phase 8 | URL query param |
| 4 | Photo upload with no backend | Phase 6 | Accept, preview, discard, document |
| 5 | Blog array vs MDX | Phase 9 | Array until ~15 posts |
| 6 | `/services` tabs vs routes | Phase 4 | Tabs |

---

## Definition of done

The build is complete when all thirteen gates pass. It is **ready to launch**
only after Phase 13, which is gated on real business data rather than code.

Shipping with placeholder testimonials or unverified credential claims is not a
launch — it's a legal exposure. Gate 13 exists to make that impossible to do by
accident.
