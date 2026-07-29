# SECTIONS.md — Visual Specification

Companion to `STRUCTURE.md`. That document says *what goes on each page and
why*. This one says *what each section looks like at every breakpoint*.

**Planning document. No code in this repo implements any of it yet.**

Every section below is specified to the point where two implementers would
produce the same layout. Where a decision is genuinely open, it says so
explicitly rather than leaving it implied.

---

## 1. Layout system

### 1.1 Breakpoints

Tailwind defaults. Mobile-first — write the mobile rule unprefixed, then layer up.

| Token | Min width | What changes here |
|---|---|---|
| *(base)* | 0 | Single column everywhere. Sticky call bar visible |
| `sm` | 640px | Card grids go 2-up. Button rows go horizontal |
| `md` | 768px | Split sections go 2-column. Body type steps up |
| `lg` | 1024px | Card grids go 3-up. Hero splits. Sticky call bar hides |
| `xl` | 1280px | Desktop nav appears (mobile drawer below this) |
| `2xl` | 1536px | Nothing. Containers cap before this — do not add rules here |

Two hard rules:

1. **The `lg` → `xl` gap is deliberate.** The header keeps the mobile drawer
   until `xl` because the mega-menu plus logo plus two CTAs genuinely does not
   fit at 1024px. Don't "fix" this by moving the nav to `lg`.
2. **Never design at a width between two breakpoints.** If a layout only works
   at 900px, it's wrong.

### 1.2 Containers

Set by `<Container size>` — never hand-roll a max-width.

| Size | Max | Use for |
|---|---|---|
| `prose` | 42rem | Blog body, legal pages, long-form reading |
| `narrow` | 48rem | Centred single-column sections, guarantee band |
| `default` | 72rem | **The default.** Almost every section |
| `wide` | 80rem | Header, footer, hero, full-bleed card grids |

Gutters are built in: `px-5` mobile, `px-8` at `sm`. Don't add your own.

### 1.3 Grid columns by content type

| Content | base | sm | lg | xl |
|---|---|---|---|---|
| Service cards | 1 | 2 | 3 | 3 |
| Service cards (compact, on city pages) | 1 | 2 | 3 | 4 |
| Bundle cards | 1 | 1 | 3 | 3 |
| Testimonial cards | 1 | 2 | 3 | 3 |
| Blog cards | 1 | 2 | 3 | 3 |
| Before/after cards | 1 | 1 | 2 | 2 |
| Stat tiles | 2 | 2 | 4 | 4 |
| Process steps | 1 | 2 | 4 | 4 |
| Symptom cards | 1 | 2 | 3 | 3 |
| Split section (copy + visual) | 1 | 1 | 2 (`md`) | 2 |

Bundle cards go 1-up until `lg` on purpose — they carry more content than a
service card and a 2-up bundle grid at `sm` produces unreadable cramming.

### 1.4 Spacing rhythm

Section outer padding comes from `<Section size>` — never override it.

| Gap | Value | Where |
|---|---|---|
| Section heading → content | `mb-12` (`sm:mb-16`) | Every section |
| Card grid gap | `gap-6` | All card grids |
| Stat/chip gap | `gap-3` | Chip rows, badge rows |
| Within-card stack | `gap-3` | Icon → title → body |
| Split-section column gap | `gap-10` (`lg:gap-16`) | Two-column sections |
| Button row gap | `gap-3` | CTA pairs |
| List item gap | `gap-2.5` | Inclusion lists, link lists |

### 1.5 Section tone sequence

Rule from `STRUCTURE.md` §10.2: never two adjacent sections with the same tone.
The canonical homepage sequence, as a worked example:

```
ink (hero) → light (trust) → sand (symptoms) → light (services)
→ ink (bundles) → sand (before/after) → light (how it works)
→ hydro (guarantee) → sand (maintenance) → light (testimonials)
→ ink (service areas) → sand (faq) → [footer band closes]
```

### 1.6 The CtaBand correction

**`Footer` already contains a full conversion band** — headline, sub, primary +
phone CTA, on `ink-900` with `.hydro-mesh`. It renders on every page.

Therefore: **no page ends with a `CtaBand`.** Doing so stacks two nearly
identical dark conversion bands. `CtaBand` is a *mid-page* device — use it to
break up a long service or city page, never as the closer. The footer is the
closer, on every route, for free.

This supersedes the "→ CtaBand" ending in `STRUCTURE.md` §8.

---

## 2. Section specifications

Each spec gives: purpose, tone, props, anatomy, responsive behaviour, states,
and the mistakes to avoid.

---

### 2.1 `SeasonalBanner`

**Purpose** Surface the active seasonal campaign. Creates urgency the rest of
the site can't — "spring books out first" is true and it works.

**Tone** Own band, not a `<Section>`. `bg-signal-400` with `text-ink-950`.
This is the one non-CTA use of `signal` in the system, justified because the
whole band *is* a conversion prompt.

**Client component** — needs dismissal state.

```tsx
<SeasonalBanner campaign={activeCampaign} />
```

**Anatomy** (single row, left to right)
`Icon sparkle` · `headline` (bold) · `body` (hidden below `md`) · `ctaLabel` link with arrow · dismiss `×` button

**Responsive**

| Breakpoint | Behaviour |
|---|---|
| base | Two lines: headline + CTA. `body` hidden. Height auto, `py-2.5` |
| `md` | Single line, `body` visible, centred |

**States**
- Dismissed → persist to `localStorage` keyed by `campaign.slug`, so a new
  campaign reappears. Never `sessionStorage`; re-nagging every visit is hostile.
- `activeCampaign` undefined → render nothing. No empty band.

**Placement** Directly below `<Header>`, above the hero. Not sticky.

**Don't** Animate it. Auto-dismiss it. Run two at once.

---

### 2.2 `Hero`

**Purpose** State what the business does, prove it visually, and offer the two
actions people actually take. The before/after slider *is* the hero image —
demonstrating the product beats describing it.

**Tone** `ink`, with `.hydro-mesh` and `.blueprint-grid` layered. Optional
`.edge-wipe-bottom`.

```tsx
<Hero
  eyebrow?      // "Serving {site.serviceRegion}"
  title         // h1
  lede
  primaryCta    // { label, href }
  secondaryCta? // { label, href } — rendered variant="onDark"
  project?      // Project from gallery.ts for the slider
  variant?      // "home" | "page" — page variant drops the visual, halves height
/>
```

**Anatomy — copy column (in order)**
1. Eyebrow with `Icon pin`
2. `h1` at `--text-display-lg`
3. Lede, `text-lg`/`text-xl`, `text-ink-200`, max ~55ch
4. CTA row — `primary` + `onDark`
5. `RatingBadge onDark`
6. Micro trust row: 3 items from `site.credentials` with `Icon check` in `mint-400`

**Anatomy — visual column**
`BeforeAfterSlider` at `ratio="3/2"`, `shadow-lift`, `rounded-card`.
Below it, a caption line: project title + city.

**Responsive**

| Breakpoint | Layout |
|---|---|
| base | Stacked, copy first. Slider `ratio="4/3"`. Section `py-14`. `h1` at `--text-display-sm` |
| `md` | Still stacked but centred copy, wider slider. `h1` at `--text-display-md` |
| `lg` | Two columns `5fr 7fr`, `gap-12`, copy left-aligned and vertically centred. Min height `min-h-[34rem]`. `h1` at `--text-display-lg` |

**States**
- `project` absent → `Placeholder ratio="3/2" tone="dark"`. Layout unchanged.
- `variant="page"` → no visual, single centred column, `size="compact"`,
  breadcrumbs above the `h1`.

**Don't** Use a background photo behind text without a scrim — contrast fails
the moment real photography lands. Add entrance animation; this is LCP content.
Put three CTAs here.

---

### 2.3 `TrustBar`

**Purpose** Answer "are these people legitimate" in the first scroll.

**Tone** `light`, `size="compact"`. Top and bottom hairline `border-ink-100`.

```tsx
<TrustBar items={site.credentials} showRating?={true} />
```

**Anatomy** `RatingBadge` first, then credential chips: `Icon check` in
`mint-500` + label, `text-sm font-medium`.

**Responsive**

| Breakpoint | Layout |
|---|---|
| base | Wrapped, centred, `gap-3`, `gap-y-2` |
| `md` | Single row, `justify-between`, hairline dividers between items |

**Don't** Make it sticky. Add logos of certifications that don't exist yet —
leave the chip out rather than shipping a placeholder badge image.

---

### 2.4 `SymptomChecker`

**Purpose** The vocabulary bridge (`STRUCTURE.md` §2). Nobody searches "soft
washing"; they search "green stuff on my siding." This maps what they see onto
what fixes it. **Sits above the service grid** — recognition before vocabulary.

**Tone** `sand`.

```tsx
<SymptomChecker services={featuredServices} limit?={6} />
```

**Anatomy**
- `SectionHeading` — eyebrow "Sound familiar?", title "What are you seeing?"
- Grid of symptom cards. One card per symptom, pulled from
  `service.symptoms[0]` across the passed services (not all symptoms of one
  service — variety matters more than completeness here).
- Card: quotation-styled symptom text as the visual headline (`text-lg`,
  `font-display`), then a divider, then a footer row: `Icon {service.icon}` +
  "That's {service.name}" + arrow. Whole card links to the service page.
- Below the grid: a text link — "None of these? Describe it and we'll tell you
  → `/quote`".

**Responsive** 1 / 2 (`sm`) / 3 (`lg`). Equal-height cards via `items-stretch`.

**States** Hover → arrow translates `x-1`, card lifts, service name goes
`hydro-700`.

**Don't** Turn this into a multi-step quiz. It's a router, not an interaction.
Use method names ("soft washing") in the symptom text — that defeats the point.

---

### 2.5 `ServicesGrid`

**Purpose** The catalogue. Also the page's main internal-linking hub.

**Tone** `light`.

```tsx
<ServicesGrid
  services       // Service[]
  columns?       // 3 | 4 — default 3
  showSegmentToggle? // boolean, /services hub only
  promote?       // string[] — activeCampaign.promoteServices, reorders
  heading?       // SectionHeading props
/>
```

**Anatomy — card (top to bottom)**
1. Icon tile — 48px, `rounded-xl`, `bg-hydro-50`, `Icon` in `hydro-600`
2. `Badge tone="hydro"` with `service.method`
3. `h3` service name
4. Blurb, `text-sm text-ink-500`, clamped to 3 lines
5. Divider
6. Footer row: "From {currency(pricing.minimum)}" (`font-semibold`) + arrow

Card uses `<Card href>` so the whole surface is clickable.

**Responsive** Per §1.3. At `columns={4}`, use 1/2/3/4.

**States**
- `promote` present → those services sort first, and each gets a
  `Badge tone="mint"` reading "In season".
- `showSegmentToggle` → two pill buttons, Residential default. Client component
  only in that case; the plain grid stays a Server Component.

**Don't** Put the price in `signal` — it's information, not a CTA. Let blurbs
run to different lengths without clamping; ragged card bottoms look broken.

---

### 2.6 `BundlesSection`

**Purpose** The largest margin lever in the business (`STRUCTURE.md` §1). Gets
a full section, never a footnote.

**Tone** `ink` — the dark band that makes the white cards pop, and visually
separates "packages" from "services".

```tsx
<BundlesSection bundles={featuredBundles} heading? />
```

**Anatomy — card**
1. `mostPopular` → ribbon across the top: `bg-mint-400 text-ink-950`, "Most popular"
2. Bundle name, `h3`, `font-display`
3. `trigger` line — `text-sm text-ink-500`, italic. This is the emotional hook
4. Included services: horizontal icon row, each with a tooltip-free text label
   below at `text-xs`. Wraps at 4+
5. `Badge tone="mint"` — "Save {savingsPercent}%"
6. `duration` with `Icon clock`, `text-sm`
7. `Button variant="primary" fullWidth` → `/packages/{slug}`

**Savings badge is `mint`, not `signal`.** `signal` is reserved for the CTA and
the card already has one. Two oranges in a card and neither reads as the action.

**Responsive** 1 / 1 (`sm`) / 3 (`lg`) — see §1.3 for why not 2-up at `sm`.
`mostPopular` card: `lg:scale-105` with `ring-2 ring-mint-400`; at base widths
it simply sorts first instead of scaling.

**States** Commercial bundles filtered out on residential pages and vice versa
via `bundle.segment`.

**Don't** Show a bundle price. `savingsPercent` is honest and durable; a dollar
figure goes stale and invites disputes. Render more than three here — the rest
live on `/packages`.

---

### 2.7 `MaintenanceTeaser`

**Purpose** Convert a one-off customer into recurring revenue. **Placement is
the whole design decision:** directly after the before/after results and the
guarantee, while "keep it looking like this" is the obvious next thought.

**Tone** `sand`.

```tsx
<MaintenanceTeaser plan={mostPopularPlan} terms={maintenancePlanTerms} />
```

**Anatomy — split section**

*Left column (copy)* — eyebrow "Stop thinking about it", `h2`, one paragraph on
why cadence matters (reference `service.cadence`), then three `Icon check`
bullets pulled from `plan.includes`, then `Button variant="secondary"` →
`/maintenance-plan`.

*Right column (plan card)* — elevated white card: plan name, `frequency`,
`discountPercent` as a large `mint` figure, `bestFor` line, and
`maintenancePlanTerms` in small text at the bottom. **Lead with the terms** —
"cancel any time" is the objection, so answer it before it's raised.

**Responsive** Stacked (copy first) → 2-column at `md`, `gap-10`/`lg:gap-16`.

**Don't** Show all three tiers here. This is a teaser; the comparison lives on
`/maintenance-plan`. Use `signal` on the card — the CTA is in the copy column.

---

### 2.8 `HowItWorks`

**Purpose** Removes the "what actually happens" uncertainty that stalls
bookings. Four steps, no more.

**Tone** `light`.

```tsx
<HowItWorks steps={[{ icon, title, body }]} />
```

Default steps: **Get your quote** → **Pick your date** → **We clean** →
**Walk it with us**. The fourth matters — it's the guarantee made concrete.

**Anatomy — step**
Numbered circle (`bg-ink-900 text-white`, `font-display`), icon above or beside,
`h3` title, one-line body at `text-sm text-ink-500`.

**Responsive**

| Breakpoint | Layout |
|---|---|
| base | Vertical. 2px `ink-100` rail down the left through the number circles |
| `sm` | 2×2 grid, no connecting line |
| `lg` | Scroll-linked stacking deck (`StackingCards`) — each step is a full `sand-50` card that pins under the header while the next one slides over it and the one beneath scales and dims |

The `lg` deck replaced the 4-across row with the connecting line. This is the
one section on the site whose content is genuinely sequential, which is the
whole argument for stacking it: the cards land in the order the customer lives
the steps. Same markup at every breakpoint — the deck is CSS on top of the
list, not a second copy of the DOM — and the scroll listener never attaches
below `lg` or under `prefers-reduced-motion`. See `STRUCTURE.md` §10.4.

**Don't** Add a fifth step (four cards is already most of a screen of scroll
runway on the deck). Number them with anything other than 1–4. Extend the deck
to mobile.

---

### 2.9 `BeforeAfterShowcase`

**Purpose** The highest-converting asset in the trade.

**Tone** `ink` on the homepage; `light` on `/gallery` where filter chips need
contrast.

```tsx
<BeforeAfterShowcase
  projects
  showFilters?  // /gallery only
  columns?      // 2 default
/>
```

**Anatomy — card**
`BeforeAfterSlider ratio="3/2"` then a caption block: `h3` title, `summary`
(2-line clamp), and a stat row — `Icon clock` duration, `Icon pin` city,
`surfaceArea` if present.

**Responsive** 1 / 1 (`sm`) / 2 (`lg`). Sliders stay large — a small comparison
slider is useless, which is why this never goes 3-up.

**States**
- `showFilters` → two chip rows (service, then city), client component,
  filter state in URL query so a filtered gallery is linkable.
- Empty result → "No projects yet for that combination" + reset link. Never an
  empty grid.

**Don't** Autoplay the slider position. Lazy-load the first card's images.

---

### 2.10 `Testimonials`

**Tone** `sand` (homepage) / `light` (`/reviews`).

```tsx
<Testimonials items columns?={3} showSourceBreakdown?={false} />
```

**Anatomy — card** `Stars` → quote (`text-ink-700`, no clamp — truncating a
review reads as hiding something) → divider → attribution row: name (bold),
`neighborhood`, `citySlug` → city name, then `Badge tone="neutral"` with
`source` and the formatted `date`.

**Responsive** 1 / 2 (`sm`) / 3 (`lg`). Masonry is not required; equal-height
cards with the attribution row pinned to the bottom (`mt-auto`) is enough.

**States** Fed by `testimonialsFor()`, which already falls back to featured
reviews — so this never renders empty. Don't add a second fallback.

**Don't** Auto-rotate it. Testimonials that advance on a timer are skipped by
everyone, and a carousel that mounts one slide at a time hides the rest from
crawlers.

**Amended** (`improvement.md` Phase 7) — `layout="carousel"` is permitted and
is what the homepage now uses. It is a CSS scroll-snap rail, which is not the
thing this rule was written against: every review stays in the DOM and in the
markup a crawler sees, nothing advances on a timer, and the only script is the
prev/next buttons. `layout="grid"` remains the default and is what `/reviews`
and the service/city pages use — a page *about* reviews should show them all
at once. If either of the two properties above ever stops being true, this
rule reverts in full.

---

### 2.11 `GuaranteeBand`

**Purpose** The single strongest objection-handler on the site.

**Tone** `hydro` — the only place that tone is used, which is what makes it land.

```tsx
<GuaranteeBand guarantee={site.guarantee} />
```

**Anatomy** Centred, `containerSize="narrow"`. Large `Icon shield` (64px,
`text-white`, `opacity-90`) → `site.guarantee.title` as `h2` → `body` at
`text-lg` → `Button variant="onDark"` → `/quote`.

**Responsive** Single column at all widths. `py-16` / `sm:py-24`.

**Don't** Add fine print here. If the guarantee needs conditions, it isn't one —
put conditions in the FAQ and keep this band absolute.

---

### 2.12 `ServiceAreaSection`

**Tone** `ink` (homepage) / `light` (`/service-areas`).

```tsx
<ServiceAreaSection locations columns?={2} showMap?={true} />
```

**Anatomy — split**

*Left* — heading, one paragraph naming `site.serviceRegion`, then city chips
(`rounded-pill`, link to `/service-areas/{slug}`), priority cities first and
visually heavier. Below: travel note from `travelPolicy.note` at `text-sm`.

*Right* — `Placeholder ratio="4/3" label="Service area coverage map"`. Real map
later; see §3.

**Responsive** Stacked (copy first) → 2-column at `md`.

**Don't** Embed a live Google Maps iframe. It's the heaviest thing on the page,
it can't be styled, and a static map image with pins performs better. Note this
as a decision, not an oversight.

---

### 2.13 `FaqSection`

**Tone** `sand`.

```tsx
<FaqSection items limit?={6} heading? showAllLink?={true} />
```

**Anatomy — split**

*Left (`lg:col-span-4`)* — sticky heading block (`lg:sticky lg:top-28`):
`SectionHeading align="left"`, a "Still not sure?" line, and a `ghost` button to
`/faq` or `/contact`.

*Right (`lg:col-span-8`)* — `<Accordion singleOpen groupName="faq-{page}">`.

**Responsive** Single column below `lg` with the heading not sticky.

**States** On service and city pages, pass `getFaqs(service.faqIds)`. On `/faq`,
render one `Accordion` per `faqCategories` entry with distinct `groupName`s.

**Don't** Open the first item by default. Nest accordions.

---

### 2.14 `CtaBand`

**Purpose** Mid-page conversion break on long pages. **Not a page closer** — see
§1.6.

**Tone** `ink` with `.blueprint-grid`.

```tsx
<CtaBand title lede? primaryCta secondaryCta? variant?="full" | "inline" />
```

**Anatomy** `full` — centred, headline, lede, CTA pair, micro trust line.
`inline` — single row, headline left, CTA right, `size="compact"`; use this one
inside long service pages.

**Responsive** Stacked and centred below `md`; `inline` becomes `full` below `md`.

**Don't** Place within two sections of the footer. Use more than one per page.

---

### 2.15 `BlogPreview`

**Tone** `light`.

```tsx
<BlogPreview posts={featuredPosts} columns?={3} />
```

**Anatomy — card** `Placeholder ratio="16/9"` → `Badge` category → `h3` title →
excerpt (2-line clamp) → footer row: `readMinutes` + formatted `date`.

**Responsive** 1 / 2 (`sm`) / 3 (`lg`).

**Don't** Show more than three on the homepage.

---

### 2.16 `StatsRow`

**Purpose** Scale and longevity at a glance.

**Tone** `hydro` or `ink`. Usually `size="compact"`.

```tsx
<StatsRow stats={[{ value, label, suffix? }]} />
```

**Open decision — needs a data source.** These figures do not exist in
`src/content/` yet. Add a `stats` array to `site.ts` during implementation:
years in business (derive from `foundedYear`), homes cleaned, gallons used,
5-star reviews (derive from `site.rating.count`). Two of four derive from
existing data; the other two are new placeholders.

**Anatomy** Big `font-display` number at `--text-display-sm`, label beneath at
`text-sm uppercase tracking-wide opacity-80`.

**Responsive** 2 / 2 (`sm`) / 4 (`lg`).

**Don't** Animate count-up. It delays LCP and re-triggers on scroll.

---

## 3. Page layout templates

Section order comes from `STRUCTURE.md` §8. This covers layout only.

### 3.1 Detail-page shell

Applies to `/services/[service]`, `/services/[service]/[city]`,
`/service-areas/[city]`, `/packages/[bundle]`.

```
Hero variant="page"        breadcrumbs → h1 → lede → CTA pair
[content sections]
FaqSection                 scoped FAQs
[related links section]
                           ← footer band closes (§1.6)
```

Breadcrumbs: `text-sm`, `ink-400`, `/` separators, current page not a link,
always mirrored by `breadcrumbSchema`.

### 3.2 Long-form shell

`/blog/[slug]`, legal pages. `containerSize="prose"`. `h2` per `post.sections`
entry, `scroll-mt-28` on each for anchor links. Sidebar (`lg` and up only,
sticky) with related services and cities.

### 3.3 Tool pages

`/quote` and `/pricing` are **full-bleed, single-purpose**: no `SeasonalBanner`,
no `CtaBand`, minimal surrounding sections. Every element competing with the
tool is a leak. `/quote` in particular should be the calmest page on the site.

---

## 4. Open decisions

Flagged rather than silently defaulted. Each needs a call before or during
implementation.

| # | Decision | Recommendation |
|---|---|---|
| 1 | Coverage map: static image, SVG, or embed | **Static SVG with pins.** Styleable, light, no third-party JS |
| 2 | `StatsRow` data source | Add `stats` to `site.ts`; derive two of four from existing fields |
| 3 | Gallery filter state: query param or client-only | **Query param** — filtered views become linkable and shareable |
| 4 | Quote wizard photo upload with no backend | Accept files, show thumbnails, discard on submit. Document the stub loudly |
| 5 | Blog: keep the TS array or move to MDX | Array until ~15 posts. The `Post` type survives the migration unchanged |
| 6 | Segment toggle on `/services`: tabs or separate routes | **Tabs.** Two routes split link equity for no benefit |

---

## 5. What this document does not cover

Deliberate omissions, so nobody assumes they were forgotten:

- **Copy.** Draft copy lives in `src/content/`. Don't write final copy against
  placeholder business data.
- **Photography art direction.** Needs real photos to exist first.
- **Logo and brand mark.** `Header` and `Footer` carry a placeholder mark.
- **Email templates and form confirmations.** No backend exists.
- **Animation choreography beyond the rules in `STRUCTURE.md` §10.4.**
