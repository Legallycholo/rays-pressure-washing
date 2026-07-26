# STRUCTURE.md — Implementation Plan

**Project:** Ryan's Pressure Washing — marketing website
**Status:** Built. All 84 routes implemented and verified. Phase 13 (real
business data) is the only work remaining before launch.
**Audience:** the implementer building the pages (Fable 5).

## Document map

Three documents, read in this order:

| Document | Answers | Read when |
|---|---|---|
| **`STRUCTURE.md`** ← you are here | *What* goes on each page and *why* | First, all of it |
| **`SECTIONS.md`** | What each section *looks like* at every breakpoint | Before writing any component |
| **`CHECKLIST.md`** | *In what order*, and how to prove it's done | Continuously — tick as you go |

`CHECKLIST.md` is the working document. It has 14 phases, 14 gates and 173
checkboxes, and it's designed so nothing can be skipped silently.

---

## 0. Read this first

This repo contains a **built site on placeholder data**. The design system,
content model, component primitives, site chrome and all routes are implemented.

> ✅ `npm run build` prerenders 84 static routes. `npx tsc --noEmit` passes.
> Verified: 0 broken internal links, 0 orphan pages, exactly one `<h1>` per
> page, and no horizontal overflow across 19 pages × 7 viewport widths.

See `CHECKLIST.md` for the live gate-by-gate status.

**Structure-first build.** Every value in `src/content/` is placeholder and every
piece of copy is draft. Don't perfect words. Perfect layout, hierarchy,
component contracts and route architecture — the things that are expensive to
change once real content lands.

---

# PART ONE — THE BUSINESS

Sections 1–3 are the part that makes this site different from a generic
brochure. Read them before writing any page.

## 1. What this business actually sells

Pressure washing looks like a single-service trade and isn't. A site that only
lists services and a phone number leaves most of the available revenue on the
table. There are **three revenue engines**, and the site has to serve all three:

| Engine | What it is | Why it matters | Data |
|---|---|---|---|
| **Single service** | One surface, one visit | Entry point. Lowest value, highest volume | `services.ts` |
| **Bundles** | Several surfaces, one visit | **The biggest lever.** Truck, crew, setup and drive are already paid for — every extra surface on the same visit is near-pure margin | `packages.ts` → `bundles` |
| **Maintenance plans** | Scheduled recurring work | Turns a seasonal, re-sell-every-time business into a predictable one. Routes efficiently, removes the sale | `packages.ts` → `maintenancePlans` |

**Implication for the build:** a bundle must be reachable from every service
page, and the maintenance plan must be reachable from every result the customer
is about to admire. Someone looking at a clean driveway is the single best
audience for "keep it that way."

## 2. How customers actually buy

Four behaviours that should drive layout decisions:

**They don't know the vocabulary.** Nobody searches "soft washing." They search
*"green stuff on my siding"* and *"black streaks on roof."* This is why
`services.ts` carries a `symptoms` array and why the homepage needs a
**SymptomChecker** — it maps a problem the visitor recognises onto the service
that fixes it. Leading with method names loses people who don't have them.

**They're comparing three quotes.** Almost nobody hires the first company. The
site's job is to be the one that felt straight with them: published price
ranges, an honest disclaimer, a named guarantee, real before/afters. The
reference site hides pricing entirely — that's the gap we walk through.

**They're on a phone, and often outside looking at the problem.** Hence
`StickyCallBar`, WhatsApp as a first-class channel, and photo upload in the
quote wizard. Photos are the single best quote-accuracy input there is.

**They're buying a result, not a process.** Before/after imagery outperforms
every other asset in this trade. It's the hero, not a gallery afterthought.

## 3. Seasonality

Demand is strongly seasonal and the site should not look identical in February
and June. `packages.ts` → `seasonalCampaigns` carries five campaigns keyed to
months, with exactly one marked `active`.

| Window | Campaign | What gets promoted |
|---|---|---|
| Feb–Apr | Spring reset — books out first | House wash, driveway, roof |
| Apr–Jun | Pool season | Pool deck, patio, fence |
| Jun–Sep | Storm recovery | Gutters, roof, house wash |
| Oct–Nov | Holiday-ready | Driveway, windows, gutters |
| Dec–Jan | Off-season rates | Roof, fence, deck |

**Implementation:** a dismissible seasonal banner below the header, and
`activeCampaign.promoteServices` reordering the homepage service grid. Keep
exactly one campaign `active` — two competing banners and the signal dies.

Off-season is the one worth building for properly. Winter is when this trade
starves, and discounted roof work is the standard answer.

## 4. Trust, and the claims that carry legal weight

Local services convert on trust signals more than on design. Already modelled:
licensing and insurance (`site.credentials`), the named **Spotless Guarantee**
(`site.guarantee`), star ratings, and method transparency (`service.method`).

Three warnings, because these are legal claims, not copy:

1. **`testimonials.ts` is fabricated placeholder text.** Publishing invented
   reviews on a live commercial site is an FTC violation. Every one must be
   replaced with a genuine attributable review before launch, and
   `site.rating` must reflect real counts.
2. **Every entry in `site.credentials` is a claim** — "licensed", "insured",
   "$2M coverage", "background-checked". Verify or delete each one.
3. **Published prices set expectations.** The estimator must always return a
   range and always show the honesty disclaimer (`faqs.ts` → `quote-accuracy`).
   The credibility gained by publishing prices at all is lost the first time a
   final invoice lands outside the quoted range.

---

# PART TWO — THE SITE

## 5. Reference site analysis

The brief was "like [fullpowerwash.com](https://fullpowerwash.com/), but
different." That site returned HTTP 403 to direct fetching, so its structure is
reconstructed from search-index data — high confidence, not verified from
source. Worth a manual look before committing to URL patterns.

**What it is:** a lead-gen site whose real engine is a programmatic
`service × city` page matrix, not the homepage.

```
/                                                  homepage
/about/  /services/  /service-area/
/services/power-washing/lake-nona-fl/              service × city
/services/house-washing-near-me/kissimmee/         service × city
/commercial-pressure-washing/building-washing-florida/kissimmee-fl/
```

**What we copy:** the city matrix, the repeated free-quote CTA, the guarantee,
prominent ratings, and WhatsApp as a real channel (their reviews specifically
praise the instant WhatsApp response — that's a signal, not a vanity feature).

**Where we beat it:**

| Weakness in the reference | Our answer |
|---|---|
| Near-duplicate city pages — what Google's helpful-content system demotes | City pages driven by genuinely distinct per-city data (§7.3) |
| Pricing hidden behind "call us" | Public estimator + ranges on every service page |
| One long contact form | Multi-step quote wizard with photo upload |
| No structured before/after | Before/after is the primary visual system |
| Three inconsistent service URL patterns | One canonical pattern (§6) |
| **No bundles or recurring plans surfaced** | `/packages` and `/maintenance-plan` as first-class routes (§1) |
| **Static year-round** | Seasonal campaign system (§3) |

## 6. Route map

One canonical service URL shape, unlike the reference's three.

| Route | Type | Generation |
|---|---|---|
| `/` | Static | Homepage |
| `/services` | Static | Hub, residential/commercial split |
| `/services/[service]` | SSG | `serviceSlugs` — 11 pages |
| `/services/[service]/[city]` | SSG | Matrix — priority cities first |
| **`/packages`** | Static | **Bundles hub — §1** |
| **`/packages/[bundle]`** | SSG | `bundleSlugs` — 6 pages |
| **`/maintenance-plan`** | Static | **Recurring plans — §1** |
| `/service-areas` | Static | All cities + coverage map |
| `/service-areas/[city]` | SSG | `locationSlugs` — 8 pages |
| `/gallery` | Static | Before/after, filterable |
| `/pricing` | Static | Estimator + published ranges |
| `/quote` | Static | Multi-step wizard |
| `/reviews` `/about` `/faq` `/contact` | Static | |
| `/blog` + `/blog/[slug]` | SSG | `postSlugs` — 6 posts |
| `/privacy` `/terms` `/accessibility` | Static | Footer links to these — they must exist |
| `/sitemap.xml` `/robots.txt` | Generated | `app/sitemap.ts`, `app/robots.ts` |
| `not-found.tsx` | Static | 404 routing back to services |

## 7. Content model

### 7.1 The principle

`src/content/*.ts` is the entire data layer. **Adding a service, city or bundle
creates all of its pages automatically.** No page hardcodes a service name,
phone number, price or city.

### 7.2 `site.ts` is the file that matters at launch

Every placeholder business detail lives here. Replacing it updates nav, footer,
`tel:` links, WhatsApp deep links, metadata and schema.org in one edit. Search
for `PLACEHOLDER` to find everything outstanding.

### 7.3 The anti-thin-content strategy

The main reason to build this rather than clone the reference.

`11 services × 8 cities = 88` templated pages is trivial to generate and is how
sites get demoted, because the pages are functionally identical. So every
`Location` carries genuinely distinct data:

```ts
intro           // city-specific paragraph, written per city
housingStock    // "1970s painted block" vs "new-build subdivisions"
localChallenge  // WHY demand exists here specifically
neighborhoods   // long-tail and internal-link value
landmarks       // recognisable local reference points
topServices     // reorders the grid per city
driveMinutes    // proximity trust signal — and travel-fee input (§7.4)
```

**Requirement:** city pages must weave `localChallenge`, `housingStock` and
`neighborhoods` into prose, not render them as a data table. A city with only a
name must produce a visibly thinner page. That's the intended pressure.

**Scope control:** ship 3 priority cities × ~4 services first. Prove they rank,
then expand. 88 pages on day one is 88 pages of unproven template.

### 7.4 `packages.ts` — the commercial layer

Added because the trade's revenue model needs it, and because two shipped files
already promised things nothing implemented:

- `faqs.ts` promised *"our maintenance plan schedules it automatically at a
  lower rate"* → now backed by `maintenancePlans`
- `locations.ts` promised *"book alongside a neighbour and we'll take the
  travel surcharge off both"* → now backed by `travelPolicy`

Exports: `bundles` (6), `maintenancePlans` (3 tiers), `seasonalCampaigns` (5),
`travelPolicy`. Each plan tier has `mostPopular` on exactly one entry — the
anchor that makes the other two legible.

### 7.5 Content file inventory

```
site.ts          Business identity — NAP, hours, rating, credentials, guarantee
services.ts      11 services (8 residential, 3 commercial): pricing, includes,
                 symptoms, method, cadence, faqIds, related
packages.ts      Bundles, maintenance plans, seasonal campaigns, travel policy
locations.ts     8 cities with distinct local data
faqs.ts          20 FAQs, categorised, getFaqs(ids) resolver
testimonials.ts  8 reviews, service/city tagged, with fallback helper
gallery.ts       8 before/after projects (image paths intentionally empty)
posts.ts         6 posts with section outlines
```

## 8. Page specifications

Section order is the argument each page makes. Alternate `<Section tone>` down
every page per §10.2.

### 8.1 Homepage `/`

1. **SeasonalBanner** — `activeCampaign`, dismissible. Skip if none active.
2. **Hero** — `tone="ink"`, blueprint grid + hydro mesh. Headline, lede, primary
   CTA to `/quote`, secondary `tel:`, `RatingBadge`. **`BeforeAfterSlider` is
   the hero visual** — it demonstrates the product in the first viewport.
3. **TrustBar** — `compact`. `site.credentials` as chips.
4. **SymptomChecker** — "Is this you?" from `service.symptoms` (§2). Place this
   *above* the service grid: recognition before vocabulary.
5. **ServicesGrid** — `featuredServices`, reordered by
   `activeCampaign.promoteServices`.
6. **BundlesSection** — `tone="ink"`, `featuredBundles` with savings badges.
   **This is the revenue lever — give it a full section, not a footnote.**
7. **BeforeAfterShowcase** — `featuredProjects`.
8. **HowItWorks** — quote → schedule → clean → walkthrough. Removes the "what
   actually happens" uncertainty that stalls bookings.
9. **GuaranteeBand** — `tone="hydro"`, `site.guarantee`.
10. **MaintenanceTeaser** — placed directly after the results and the guarantee,
    while "keep it this way" is the obvious next thought.
11. **Testimonials** → **ServiceAreaSection** → **FaqSection**.

> **The page ends there.** `Footer` already carries a full conversion band on
> every route, so closing with `CtaBand` stacks two near-identical dark bands.
> `CtaBand` is a mid-page device only — see `SECTIONS.md` §1.6.

### 8.2 Service detail `/services/[service]`

Hero (name, `method` badge, price-from, CTA) → intro → `includes` → `symptoms` →
process → before/after filtered by service → pricing range + estimator link →
**bundles containing this service** → service FAQs (`faqIds`) → cities grid
linking to the matrix → `related` services. Footer band closes.

Long service pages may carry one `CtaBand variant="inline"` mid-page — never
within two sections of the footer.

The bundle cross-sell is not optional. Someone reading about driveway cleaning
is one sentence away from booking the whole exterior.

### 8.3 Service × city `/services/[service]/[city]`

The template that must not read as generated:

- H1 `{service.name} in {city}, {region}`
- Opening prose **combining** `location.localChallenge` with the service —
  a different sentence for every city
- `housingStock` woven into why the method suits local properties
- Neighbourhoods as prose plus links
- `testimonialsFor({serviceSlug, citySlug})` and `projectsFor(...)`
- `driveMinutes` proximity signal; travel note if outside `freeRadiusMinutes`
- Links to parent service, parent city, sibling services in that city

### 8.4 `/packages` and `/packages/[bundle]`

Hub: bundles as comparison cards — included services (icons from
`services.ts`), `savingsPercent`, `duration`, `trigger` as the headline. Mark
`mostPopular`. Split residential/commercial.

Detail: what's included with each service expanded, savings maths shown
honestly, before/after from the constituent services, "what a full day looks
like" timeline, FAQs, CTA into `/quote` pre-selected with those services.

### 8.5 `/maintenance-plan`

Three tiers side by side, `mostPopular` visually anchored. `frequency`,
`discountPercent`, `includes`, `bestFor` per tier. Then: why cadence matters
(pull `service.cadence`), the month-to-month terms (`maintenancePlanTerms` —
lead with it, it's the objection), and plan-specific FAQs.

### 8.6 Remaining pages

- **`/services`** — hub, residential/commercial split, `Card` per service with
  icon, `method` badge, blurb, price-from.
- **`/service-areas/[city]`** — `intro` hero → `topServices` (city-ordered) →
  local challenge → neighbourhoods + landmarks → local reviews → local projects
  → all services. Footer band closes.
- **`/gallery`** — filter chips (service, city), grid of `BeforeAfterSlider`
  cards with `summary`, duration, area.
- **`/pricing`** — estimator, per-service range table from `services.ts`, bundle
  savings, plan discounts, "what changes a price", red flags, pricing FAQs.
- **`/reviews`** — `RatingBadge`, source breakdown, filterable list.
- **`/about`** — story, team, credentials, equipment and method, coverage map,
  guarantee.
- **`/blog`**, **`/blog/[slug]`** — category filter; posts render `sections[]`
  as `h2` + prose with related services/cities in a sidebar.
- **`/faq`** — grouped by `faqCategories`, `Accordion` per group.
- **`/contact`** — form, map placeholder, `site.hours`, all channels including
  WhatsApp.
- **Legal** — real content required before launch.

## 9. Components still to build

### 9.1 `QuoteWizard` — `/quote` (client)

**The primary conversion asset.** Four steps beat one long form: each step is a
small commitment and progress is visible.

```
1  Service     Icon grid from services.ts, multi-select.
               Offer bundles when selections overlap one — "these three are
               the Curb Appeal package, 15% less."
2  Property    Type, storeys, approximate size. Drives the estimate.
3  Photos      Optional upload + free-text problem description (§2).
4  Contact     Name, phone, email, address, preferred timing.
```

- Progress indicator; back/next always available.
- **Live running estimate visible from step 2** — this is what stops drop-off at
  the contact step, because now there's something to lose.
- Validate per step, never dump all errors at the end.
- Persist to `sessionStorage`; step in URL hash (`#step-2`) so back works.
- Accept `?services=` to arrive pre-selected from a service or bundle page.
- **No backend exists.** Submit is a stub — log the payload, render success.
- Keyboard operable; move focus to the new step heading on advance.

### 9.2 `Estimator` — `/pricing` (client)

Reads `service.pricing`. Returns a **range**, never a single number.

- Inputs: service, measurement (unit from `pricing.unit`), condition modifier.
- Respects `pricing.minimum`; adds `travelPolicy.surcharge` beyond the radius.
- Shows bundle savings when selections qualify.
- Must display the honesty disclaimer (§4.3).
- Deep-links into `/quote` carrying selections.

### 9.3 Section components

`src/components/sections/` — take props rather than reading content directly
where reuse is expected:

`Hero` · `SeasonalBanner` · `TrustBar` · `SymptomChecker` · `ServicesGrid` ·
`BundlesSection` · `MaintenanceTeaser` · `HowItWorks` · `BeforeAfterShowcase` ·
`Testimonials` · `GuaranteeBand` · `ServiceAreaSection` · `FaqSection` ·
`CtaBand` · `BlogPreview` · `StatsRow`

**Each of these is fully specified in `SECTIONS.md` §2** — anatomy, props,
responsive behaviour at every breakpoint, empty states, and the specific
mistakes to avoid. Don't design them from this list.

---

# PART THREE — TECHNICAL REFERENCE

## 10. Design system

### 10.1 The core decision

Competitors in this trade are overwhelmingly white-background with mid-blue
accents. **We invert it.** Deep marine navy (`ink`) carries the page, bright
`hydro` blue does the brand work, and a scarce orange (`signal`) is reserved
*exclusively* for conversion actions — the highest-contrast pairing available,
so CTAs never compete with the brand colour.

### 10.2 Colour tokens

In `globals.css` under `@theme`. Full 50–950 scales for `ink` and `hydro`.

| Token | Role |
|---|---|
| `ink-*` | Navy — dominant dark surface + all body text |
| `hydro-*` | Brand blue — links, icons, eyebrows, secondary buttons |
| `signal-*` | Conversion orange — **CTA only, never decorative** |
| `mint-*` | "Clean" indicator — checkmarks, after-states, slider divider |
| `sand-*` | Warm neutral — alternating light sections |

**Hard rules**

1. `signal` never appears on anything that isn't a conversion action.
2. Never two `variant="primary"` buttons in one viewport.
3. Never two adjacent `<Section>`s with the same `tone`.
4. `signal-400` on `ink-950` passes contrast; `signal-400` on white does **not**.

### 10.3 Typography

System stacks today, so the scaffold builds with no network dependency. Two
lines in `globals.css` are the entire swap surface. Recommended:

- **Display:** Barlow Condensed 600/700 — industrial, trade-professional rather
  than corporate-generic; narrow enough that big headlines survive mobile.
- **Body:** Inter 400/500/600.

Fluid sizes use `clamp()` so headings scale continuously.

### 10.4 Motion

200–300ms, `--ease-out-expo`. Cards lift `-translate-y-1`, buttons
`-translate-y-0.5`. `prefers-reduced-motion` is handled globally — no per-component
guards. No scroll-jacking, no parallax, no entrance animations that delay content.

### 10.5 Signature motifs

Sparingly — they stop working when they're everywhere.

- `.edge-wipe-top` / `.edge-wipe-bottom` — diagonal clip echoing a surface-cleaner
  pass. **Max two per page.**
- `.hydro-mesh` — radial gradients for dark sections.
- `.blueprint-grid` — faint grid behind dark bands.
- `.img-placeholder` — must always read as "image goes here."

### 10.6 Iconography

`ui/Icon.tsx` — inline SVG, 24px grid, 1.75 stroke. No library, no runtime cost.
Referenced by name from `services.ts`. Unknown names fall back to `droplet`.

### 10.7 Layout, breakpoints and spacing

Specified in full in **`SECTIONS.md` §1** — breakpoint table and what changes at
each, container sizes, grid column counts per content type, and the spacing
rhythm. Summary of the parts most often got wrong:

- Mobile-first. Base rule unprefixed, then layer up.
- Desktop nav appears at `xl`, not `lg` — the mega-menu genuinely doesn't fit at
  1024px. This gap is deliberate; don't close it.
- Bundle cards go 1-up until `lg`; they carry more content than service cards.
- Before/after cards never go past 2-up — a small comparison slider is useless.
- Nothing changes at `2xl`. Containers cap before it.

## 11. Stack and conventions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router | `generateStaticParams` makes the matrix free |
| Language | TypeScript strict | Content model typed end to end |
| Styling | Tailwind v4, CSS-first `@theme` | Tokens in `globals.css`, no JS config |
| Rendering | Fully static | No runtime data source exists |
| Deploy | Vercel | Zero-config |

- Path alias `@/*` → `src/*`. No `../../..`.
- Server Components by default; `"use client"` only where interaction demands it
  (currently `Header`, `BeforeAfterSlider`, plus §9.1–9.2).
- No new runtime dependencies without recording the reason here. Ships with
  exactly `next`, `react`, `react-dom`.
- Every section goes through `<Section>`.

## 12. What already exists

```
src/app/       layout.tsx (metadata, skip link, LocalBusiness JSON-LD, chrome)
               globals.css (full token system + utilities)
src/content/   site · services · packages · locations · faqs · testimonials
               gallery · posts
src/lib/       utils (cn, currency, formatDate, titleCase)
               schema (localBusiness, service, faq, breadcrumb, article)
src/components/ JsonLd · BeforeAfterSlider
               layout/{Header, Footer, StickyCallBar}
               ui/{Container, Section, Button, SectionHeading, Icon, Rating,
                   Placeholder, Accordion, Badge, Card}
```

### 12.1 Primitive contracts

```tsx
<Container size="narrow|prose|default|wide" />
<Section tone="light|sand|ink|hydro" size="flush|compact|default|spacious" id />
<Button href variant="primary|secondary|outline|onDark|ghost" size="sm|md|lg" fullWidth />
<SectionHeading eyebrow title lede align onDark as />
<Icon name filled /> <Placeholder label ratio tone icon />
<Accordion items={[{id,question,answer}]} singleOpen groupName />
<Badge tone /> <Card href interactive />
<Stars value /> <RatingBadge onDark />
<BeforeAfterSlider before after alt label ratio />
```

Three behaviours to preserve:

- **`Placeholder` is load-bearing** — it reserves the exact aspect ratio real
  photography will occupy, so layout and CLS are final before any photo exists.
- **`BeforeAfterSlider` uses a real `<input type="range">`** — that buys keyboard
  support, arrow stepping, SR announcement and touch handling for free. Don't
  replace it with pointer-event handlers.
- **`Accordion` uses native `<details>/<summary>`** — accessible, zero JS.

## 13. SEO

- `generateMetadata` on every dynamic route. No page inherits a generic title.
- Canonical on every page; the matrix must not compete with its parent service.
- `app/sitemap.ts` from the content arrays; `app/robots.ts` alongside.
- Schema: `localBusiness` (global), `serviceSchema(service, location)`,
  `faqSchema`, `breadcrumbSchema`, `articleSchema`. **`packages.ts` needs an
  `Offer`/`AggregateOffer` builder adding to `lib/schema.ts`** — bundles have
  real prices and should be eligible for rich results. Validate at
  validator.schema.org.
- **`robots: { index: false }` is set in `layout.tsx` deliberately** — it keeps
  placeholder content out of the index. Flipping it is a launch item, not a
  build-time change.
- Internal linking is the strategy: service ↔ city ↔ bundle ↔ project ↔ review
  ↔ post. The content model already carries the relationships — use them.

## 14. Accessibility and performance

- Skip link exists; keep `#main` as target. One `<h1>` per page; never skip levels.
- Focus ring is global — never remove without a replacement.
- Everything keyboard operable. The wizard must move focus to the new step heading.
- Body text contrast ≥ 4.5:1. See the `signal` warning in §10.2.
- Real `alt` on every image and `Placeholder`.
- Lighthouse ≥ 95 target. Static rendering plus near-zero dependencies means the
  only realistic regressions are unoptimised images and stray client components.
- `next/image` with explicit dimensions; hero `priority`, everything else lazy.

## 15. Build order and checklist

The full sequence lives in **`CHECKLIST.md`** — 14 phases, 14 gates, 173
checkboxes, with acceptance criteria at every gate. Work it in order and tick as you go;
it's the progress record, not a summary.

Phase shape, for orientation:

| Phase | Work | Gate |
|---|---|---|
| 0 | Verify the inherited foundation | Typecheck passes |
| 1 | **Make the build green** — `page.tsx`, sitemap, robots, 404, legal stubs | `npm run build` succeeds |
| 2 | All 16 section components | Each renders, responsive, empty states handled |
| 3 | Homepage | No horizontal scroll at any width |
| 4 | `/services` + 11 service pages | Every page has a bundle cross-sell |
| 5 | **Packages + maintenance plans** | Revenue lever, built before the long tail |
| 6 | Quote wizard | Keyboard-completable, survives refresh |
| 7 | Service areas + city matrix | Matrix pages must not read interchangeably |
| 8 | Gallery, reviews, pricing + estimator | Estimator never returns a single number |
| 9 | About, contact, FAQ, blog, legal | Every route in §6 builds |
| 10 | Internal linking | Zero orphans |
| 11 | SEO | All schema validates |
| 12 | Accessibility + performance | Lighthouse ≥ 95 |
| 13 | **Pre-launch business data** | No `PLACEHOLDER` left, no invented review |

Two things worth pulling out of it here:

- **Phase 13 is the business's, not the implementer's.** It's gated on real
  pricing, real reviews and verified credential claims. Shipping without it
  isn't an incomplete launch — it's legal exposure (§4).
- **Six open decisions** are listed in `SECTIONS.md` §4 with recommendations.
  Each blocks a specific phase. Resolve them rather than defaulting silently.

Run `npx tsc --noEmit` after each step. It passes today; it should never be the
thing that breaks.
