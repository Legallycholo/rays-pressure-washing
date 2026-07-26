# CHECKLIST.md — Implementation Checklist

Sequential build checklist for the implementer. Companion to `STRUCTURE.md`
(what and why) and `SECTIONS.md` (what it looks like).

**Planning document. Nothing below has been built.**

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

- [ ] **R1** `signal` (orange) is used *only* for conversion actions. The one
      exception is the whole `SeasonalBanner` band.
- [ ] **R2** Never two `variant="primary"` buttons in the same viewport.
- [ ] **R3** Never two adjacent `<Section>`s with the same `tone`.
- [ ] **R4** No page ends with `CtaBand` — the footer band is the closer
      (`SECTIONS.md` §1.6).
- [ ] **R5** Every section goes through `<Section>`; every width through
      `<Container>`. No hand-rolled max-widths or section padding.
- [ ] **R6** Server Components by default. `"use client"` only where
      interaction genuinely requires it.
- [ ] **R7** One `<h1>` per page. Never skip heading levels.
- [ ] **R8** No hardcoded business data. Everything reads from `src/content/`.
- [ ] **R9** No new runtime dependencies without recording the reason in
      `STRUCTURE.md` §11.

---

## Phase 0 — Verify the foundation

Before writing anything, confirm what you inherited.

- [ ] `npm install` completes
- [ ] `npx tsc --noEmit` passes
- [ ] Read `STRUCTURE.md` Part One (§1–4) — the business model drives the layout
- [ ] Read `SECTIONS.md` §1 — the layout system
- [ ] Confirm `src/content/` has 8 files: `site`, `services`, `packages`,
      `locations`, `faqs`, `testimonials`, `gallery`, `posts`
- [ ] Confirm 11 UI primitives exist in `src/components/ui/`
- [ ] Confirm `Header`, `Footer`, `StickyCallBar`, `BeforeAfterSlider`, `JsonLd`
- [ ] Skim `globals.css` — know what tokens exist before inventing values

**GATE 0** — Typecheck passes. You can name the three revenue engines from
`STRUCTURE.md` §1 without re-reading them.

---

## Phase 1 — Make the build green

The app does not currently build. This phase fixes that and nothing else.

- [ ] `src/app/page.tsx` — stub homepage, any content
- [ ] `npm run build` succeeds
- [ ] `src/app/not-found.tsx` — 404 with links to `/services` and `/quote`
- [ ] `src/app/sitemap.ts` — enumerate static routes + all generated routes from
      `serviceSlugs`, `locationSlugs`, `bundleSlugs`, `postSlugs`
- [ ] `src/app/robots.ts` — reference the sitemap; respect the `noindex` posture
- [ ] Confirm `robots.index` is still `false` in `layout.tsx` (deliberate)
- [ ] `/privacy`, `/terms`, `/accessibility` — stub pages so footer links resolve

**GATE 1** — `npm run build` succeeds. No 404s from any footer link.

---

## Phase 2 — Section components

Build all 16 to the specs in `SECTIONS.md` §2. Each is `src/components/sections/`.

Per component, all four must be true before ticking:

- Matches its `SECTIONS.md` anatomy
- Correct at base, `sm`, `lg`, `xl`
- Empty/missing-data state handled
- Rules R1–R9 hold

- [ ] `SeasonalBanner` (client — `localStorage` dismissal keyed by slug)
- [ ] `Hero` (`home` and `page` variants)
- [ ] `TrustBar`
- [ ] `SymptomChecker`
- [ ] `ServicesGrid` (3/4 columns, `promote` reordering, optional segment toggle)
- [ ] `BundlesSection` (savings badge is `mint`, not `signal`)
- [ ] `MaintenanceTeaser`
- [ ] `HowItWorks` (connector line at `lg` must not overhang first/last)
- [ ] `BeforeAfterShowcase` (filters optional, query-param state)
- [ ] `Testimonials`
- [ ] `GuaranteeBand`
- [ ] `ServiceAreaSection`
- [ ] `FaqSection` (sticky left column at `lg`)
- [ ] `CtaBand` (`full` and `inline`)
- [ ] `BlogPreview`
- [ ] `StatsRow` — **resolve open decision #2 first**: add `stats` to `site.ts`

**GATE 2** — All 16 render in isolation. Typecheck passes. No component reads
`src/content/` directly where `STRUCTURE.md` §9.3 says it should take props.

---

## Phase 3 — Homepage

- [ ] Assemble in the order from `STRUCTURE.md` §8.1
- [ ] Verify the tone sequence against `SECTIONS.md` §1.5
- [ ] `SymptomChecker` sits **above** `ServicesGrid`
- [ ] `BundlesSection` is a full section, not a strip
- [ ] `MaintenanceTeaser` sits after results + guarantee
- [ ] Page does **not** end with `CtaBand` (R4)
- [ ] `SeasonalBanner` renders `activeCampaign`; renders nothing when undefined
- [ ] `generateMetadata` — real title and description
- [ ] Hero slider is LCP: no lazy-load, no entrance animation
- [ ] Test at 360px, 768px, 1024px, 1280px, 1536px

**GATE 3** — Homepage complete end to end. No horizontal scroll at any width.
Lighthouse ≥ 90 (mobile) with placeholders in place.

---

## Phase 4 — Services

- [ ] `/services` hub — residential/commercial via tabs (open decision #6)
- [ ] `/services/[service]` + `generateStaticParams` over `serviceSlugs`
- [ ] Section order per `STRUCTURE.md` §8.2
- [ ] **Bundle cross-sell present** — bundles containing this service
- [ ] `includes`, `symptoms`, price range from `service.pricing`
- [ ] FAQs via `getFaqs(service.faqIds)`
- [ ] Before/after via `projectsFor({ serviceSlug })`
- [ ] Cities grid linking into the matrix
- [ ] `related` services section
- [ ] `generateMetadata` per service
- [ ] `serviceSchema` + `faqSchema` + `breadcrumbSchema`
- [ ] Verify all 11 service pages build

**GATE 4** — 11 service pages + hub. Every one has a bundle cross-sell. Schema
validates at validator.schema.org.

---

## Phase 5 — Packages and maintenance

Revenue lever. Comes before the long tail, deliberately.

- [ ] `/packages` hub — residential/commercial split, comparison cards
- [ ] `mostPopular` bundle visually anchored
- [ ] `/packages/[bundle]` + `generateStaticParams` over `bundleSlugs`
- [ ] Each constituent service expanded with its `includes`
- [ ] Savings maths shown honestly
- [ ] "What a full day looks like" timeline
- [ ] CTA deep-links to `/quote` pre-selected with those services
- [ ] `/maintenance-plan` — three tiers, `mostPopular` anchored
- [ ] `maintenancePlanTerms` **leads**, doesn't hide at the bottom
- [ ] Cadence rationale pulls `service.cadence`
- [ ] Plan FAQs included
- [ ] **Add `Offer`/`AggregateOffer` builder to `lib/schema.ts`** and apply to
      bundle pages (`STRUCTURE.md` §13)
- [ ] Verify all 6 bundle pages build

**GATE 5** — Bundles and plans reachable from homepage, every service page, and
the nav. Offer schema validates.

---

## Phase 6 — Quote wizard

Highest conversion value on the site (`STRUCTURE.md` §9.1).

- [ ] `/quote` page — full-bleed, no `SeasonalBanner`, no `CtaBand` (§3.3)
- [ ] Step 1 Service — icon grid, multi-select
- [ ] Step 1 offers the matching bundle when selections overlap one
- [ ] Step 2 Property — type, storeys, size
- [ ] Step 3 Photos — optional upload, thumbnails, free-text description
- [ ] Step 4 Contact — name, phone, email, address, timing
- [ ] Progress indicator; back/next always available
- [ ] **Live running estimate visible from step 2 onward**
- [ ] Per-step validation — never a dump of all errors at the end
- [ ] `sessionStorage` persistence survives refresh
- [ ] Step reflected in URL hash; browser back works
- [ ] Accepts `?services=` for pre-selection from service/bundle pages
- [ ] Submit stub logs payload and renders success state
- [ ] **Stub is documented in-file** so nobody ships it thinking it posts
- [ ] Focus moves to the new step heading on advance
- [ ] Fully keyboard operable start to finish

**GATE 6** — Wizard completable by keyboard alone. Refresh mid-wizard loses
nothing. Pre-selection works from a service page and a bundle page.

---

## Phase 7 — Service areas and the city matrix

- [ ] `/service-areas` — all cities, coverage map placeholder, `travelPolicy.note`
- [ ] `/service-areas/[city]` + `generateStaticParams` over `locationSlugs`
- [ ] Section order per `STRUCTURE.md` §8.4
- [ ] `topServices` ordering respected per city
- [ ] Neighbourhoods and landmarks woven into prose, **not** a data table
- [ ] Local reviews via `testimonialsFor({ citySlug })`
- [ ] Local projects via `projectsFor({ citySlug })`
- [ ] `/services/[service]/[city]` — **priority cities only** for now
- [ ] Opening sentence combines `localChallenge` + service, unique per city
- [ ] `housingStock` woven into the method rationale
- [ ] `driveMinutes` proximity signal; travel note beyond `freeRadiusMinutes`
- [ ] Links to parent service, parent city, sibling services
- [ ] `serviceSchema(service, location)` + breadcrumbs

**GATE 7** — Open three matrix pages side by side. If the opening paragraphs
read interchangeably, the anti-thin-content requirement has failed
(`STRUCTURE.md` §7.3) — fix before proceeding.

---

## Phase 8 — Proof and pricing

- [ ] `/gallery` — filter chips for service and city
- [ ] Filter state in URL query (open decision #3)
- [ ] Empty-result state with reset link
- [ ] `/reviews` — `RatingBadge`, source breakdown, filterable
- [ ] `/pricing` — per-service range table generated from `services.ts`
- [ ] `Estimator` returns a **range**, never a single number
- [ ] Respects `pricing.minimum`; adds `travelPolicy.surcharge` beyond radius
- [ ] Shows bundle savings when selections qualify
- [ ] **Honesty disclaimer displayed** (`faqs.ts` → `quote-accuracy`)
- [ ] Deep-links into `/quote` carrying selections
- [ ] Bundle savings and plan discounts explained
- [ ] "What changes a price" + red-flags sections

**GATE 8** — Estimator never returns a number below `pricing.minimum`, and
never a single figure. Gallery filters are linkable.

---

## Phase 9 — Content pages

- [ ] `/about` — story, team placeholders, credentials, method, map, guarantee
- [ ] `/contact` — form, map placeholder, `site.hours`, all channels + WhatsApp
- [ ] `/faq` — grouped by `faqCategories`, one `Accordion` per group with
      distinct `groupName`s
- [ ] `faqSchema` over all items on `/faq`
- [ ] `/blog` — index with category filter
- [ ] `/blog/[slug]` + `generateStaticParams` over `postSlugs`
- [ ] Posts render `sections[]` as `h2` + prose, `scroll-mt-28` on each
- [ ] Sticky sidebar (`lg`+) with related services and cities
- [ ] `articleSchema` on each post
- [ ] Legal pages fleshed out from stubs

**GATE 9** — Every route in `STRUCTURE.md` §6 exists and builds. No stub pages
remain except where a real endpoint is genuinely required.

---

## Phase 10 — Internal linking

The whole SEO strategy (`STRUCTURE.md` §13). Verify the graph, don't assume it.

- [ ] Every service links to: its cities, its bundles, its related services
- [ ] Every city links to: its top services, its neighbours, its projects
- [ ] Every matrix page links to: parent service, parent city, siblings
- [ ] Every bundle links to: its constituent services
- [ ] Every post links to: `relatedServices`, `relatedCities`
- [ ] Every project links to: its service and city
- [ ] No orphan pages — every route reachable from at least two others
- [ ] Footer covers all services, all cities, all company pages

**GATE 10** — Crawl the built site. Zero orphans, zero broken internal links.

---

## Phase 11 — SEO

- [ ] `generateMetadata` on **every** route — no generic inherited titles
- [ ] Canonical on every page
- [ ] Matrix pages don't cannibalise their parent service page
- [ ] `sitemap.ts` includes every generated route
- [ ] All five schema types emit and validate
- [ ] Open Graph image exists and resolves
- [ ] Semantic HTML: `article`, `nav`, `aside`, `figure` where correct

**GATE 11** — All schema validates. Sitemap route count matches actual page count.

---

## Phase 12 — Accessibility and performance

- [ ] Keyboard-only pass through every page and the full wizard
- [ ] Skip link works and targets `#main`
- [ ] One `<h1>` per page; no skipped levels (audit every route)
- [ ] Focus visible everywhere; never removed without replacement
- [ ] Body text contrast ≥ 4.5:1
- [ ] **`signal-400` never on white** (`STRUCTURE.md` §10.2)
- [ ] Real `alt` on every image and `Placeholder`
- [ ] Screen-reader pass on the wizard, accordions, and before/after slider
- [ ] `prefers-reduced-motion` respected (global — verify nothing overrides it)
- [ ] `next/image` everywhere with explicit dimensions
- [ ] Hero `priority`; everything else lazy
- [ ] No layout shift — `Placeholder` ratios match final images
- [ ] Lighthouse ≥ 95 on all four categories, mobile and desktop
- [ ] Test at 360px, 768px, 1024px, 1280px, 1536px — no horizontal scroll

**GATE 12** — Lighthouse ≥ 95 across the board. Full keyboard traversal with no
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
