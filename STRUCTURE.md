# STRUCTURE.md — Implementation Plan

**Project:** Ryan's Pressure Washing — marketing website
**Status:** Foundation built. Routes not yet implemented.
**Audience:** the implementer building the pages (Fable 5).

---

## 0. Read this first

This repo contains a **finished foundation and an unfinished app**. The design
system, content model, component primitives and site chrome all exist and
typecheck cleanly. **No routes exist yet**, which means:

> ⚠️ `npm run build` currently fails — a Next.js app requires at least
> `src/app/page.tsx`. That is expected. Creating the routes in §6 is the first
> implementation task, and the build goes green as soon as `page.tsx` exists.

`npx tsc --noEmit` passes today. Keep it passing.

**The governing constraint: this is a structure-first build.** Every value in
`src/content/` is placeholder data and every piece of copy is draft. Do not
spend effort perfecting words. Spend it on layout, hierarchy, component
contracts and route architecture — the things that are expensive to change
after content lands.

---

## 1. Reference site analysis

The brief was "like [fullpowerwash.com](https://fullpowerwash.com/), but
different." That site was analysed via search-index data — it returned HTTP 403
to direct fetching, so page structure is reconstructed from indexed metadata,
not from source. Treat the details as high-confidence, not verified.

**What it is:** a local-services lead-gen site whose real engine is a
programmatic `service × city` page matrix, not the homepage.

Its observed URL architecture:

```
/                                                  homepage
/about/  /services/  /service-area/
/services/power-washing/lake-nona-fl/              service × city
/services/house-washing-near-me/kissimmee/         service × city
/commercial-pressure-washing/building-washing-florida/kissimmee-fl/
```

**What we deliberately copy:** the programmatic city matrix, the free-quote CTA
repeated throughout, the satisfaction guarantee, prominent star ratings, and
WhatsApp as a first-class contact channel (their reviews specifically praise
the instant WhatsApp response — that's a real signal, not a vanity feature).

**Where we deliberately beat it:**

| Weakness in the reference | Our answer |
|---|---|
| Near-duplicate city pages — exactly what Google's helpful-content system demotes | City pages driven by genuinely distinct per-city data (§5.3) |
| Pricing entirely hidden behind "call us" | Public estimator + real price ranges on every service page |
| One long contact form | Multi-step quote wizard with photo upload |
| No structured before/after gallery | Before/after is the primary visual system, with a built comparison slider |
| Three inconsistent URL patterns for services | One canonical pattern (§6) |

---

## 2. Stack and conventions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router | `generateStaticParams` makes the city matrix nearly free |
| Language | TypeScript, strict | Content model is typed end to end |
| Styling | Tailwind v4, CSS-first `@theme` | Tokens live in `globals.css`, no JS config file |
| Rendering | Fully static | Every route prerenders; no runtime data source exists |
| Deploy target | Vercel | Zero-config for this stack |

**Conventions**

- Path alias `@/*` → `src/*`. Use it everywhere; no `../../..`.
- Server Components by default. `"use client"` only where interaction demands
  it — currently `Header` and `BeforeAfterSlider`, plus the two components in §7.
- No new runtime dependencies without a reason recorded here. The scaffold
  ships with exactly `next`, `react`, `react-dom` and nothing else.
- Every section on every page goes through `<Section>` so vertical rhythm and
  the light/dark alternation stay consistent.

---

## 3. Design system

### 3.1 The core decision

Competitors in this trade are overwhelmingly white-background with mid-blue
accents. **We invert it.** Deep marine navy (`ink`) carries the page as a
dominant surface, a bright `hydro` blue does the brand work, and a single
scarce orange (`signal`) is reserved *exclusively* for conversion actions.

Orange-on-navy is the highest-contrast pairing available in this palette, so
the CTA never competes with the brand colour for attention. That is the whole
point of the system.

### 3.2 Colour tokens

Defined in `src/app/globals.css` under `@theme`. Full 50–950 scales exist for
`ink` and `hydro`; partial scales for the accents.

| Token | Role | Rules |
|---|---|---|
| `ink-*` | Deep marine navy | Dominant dark surface + all body text |
| `hydro-*` | Brand blue | Links, icons, eyebrows, secondary buttons |
| `signal-*` | Conversion orange | **CTA only.** Never decorative |
| `mint-*` | "Clean" indicator | Checkmarks, after-states, the before/after divider |
| `sand-*` | Warm neutral | Alternating light sections — stops the light bands reading sterile against all that navy |

**Hard rules**

1. `signal` is never used for anything that isn't a conversion action.
2. Never two `variant="primary"` buttons in the same viewport. If everything is
   primary, nothing is.
3. Never two adjacent `<Section>`s with the same `tone` — the page reads as one
   undifferentiated slab. Alternate `light → sand → ink → light`.

### 3.3 Typography

Currently **system font stacks**, so the scaffold builds with zero network
dependency. Two lines in `globals.css` (`--font-display`, `--font-sans`) are
the entire swap surface.

Recommended upgrade via `next/font/google`:

- **Display:** Barlow Condensed 600/700 — condensed, industrial, confident.
  Reads as trade-professional rather than corporate-generic, and the narrow
  width lets big headlines survive on mobile without wrapping badly.
- **Body:** Inter 400/500/600 — neutral, high legibility at small sizes.

Fluid display sizes (`--text-display-sm/md/lg`) use `clamp()` so headings scale
continuously instead of stepping at breakpoints.

### 3.4 Motion

- Standard transition: 200–300ms, `--ease-out-expo`.
- Cards lift on hover (`-translate-y-1` + shadow). Buttons lift `-translate-y-0.5`.
- `prefers-reduced-motion` is already handled globally in `globals.css` —
  don't add per-component guards.
- No scroll-jacking, no parallax, no entrance animations that delay content.

### 3.5 Signature motifs

Use each sparingly — they stop working when they're everywhere.

- `.edge-wipe-top` / `.edge-wipe-bottom` — diagonal clip echoing a surface-cleaner
  pass. **Max two per page**, at major section boundaries.
- `.hydro-mesh` — layered radial gradients for dark sections.
- `.blueprint-grid` — faint grid behind dark hero/CTA bands.
- `.img-placeholder` — deliberately obvious diagonal hatch. It must always read
  as "image goes here", never as a finished design choice.

### 3.6 Iconography

`src/components/ui/Icon.tsx` — inline SVG set, 24px grid, 1.75 stroke. No icon
library, no runtime cost, no flash. Service icons are referenced by name from
`content/services.ts`. Add new icons to the `paths` map; unknown names fall
back to `droplet` rather than crashing.

---

## 4. What already exists

All files below are written, typechecked and ready to build against.

```
package.json  tsconfig.json  next.config.ts  postcss.config.mjs  .gitignore

src/app/
  layout.tsx        Root shell: metadata, viewport, skip link, LocalBusiness
                    JSON-LD, Header, Footer, StickyCallBar
  globals.css       Complete token system + utilities

src/content/        ← ALL PLACEHOLDER DATA
  site.ts           Business identity. Single source of truth for NAP,
                    hours, rating, credentials, guarantee, WhatsApp helper
  services.ts       11 services (8 residential, 3 commercial) with pricing,
                    inclusions, symptoms, cadence, FAQ ids, related slugs
  locations.ts      8 cities with distinct housing stock, local challenge,
                    neighbourhoods, landmarks, top services
  faqs.ts           20 FAQs, categorised, with getFaqs(ids) resolver
  testimonials.ts   8 reviews with service/city tagging + fallback helper
  gallery.ts        8 before/after projects (image paths intentionally empty)
  posts.ts          6 blog posts with section outlines

src/lib/
  utils.ts          cn, currency, formatDate, titleCase
  schema.ts         localBusiness, service, faq, breadcrumb, article builders

src/components/
  JsonLd.tsx
  BeforeAfterSlider.tsx        ← client, built
  layout/Header.tsx            ← client, built (mega-menu + mobile drawer)
  layout/Footer.tsx
  layout/StickyCallBar.tsx     ← mobile-only persistent action bar
  ui/Container.tsx  Section.tsx  Button.tsx  SectionHeading.tsx
  ui/Icon.tsx  Rating.tsx  Placeholder.tsx  Accordion.tsx  Badge.tsx  Card.tsx
```

### 4.1 Primitive contracts

Use these rather than reinventing. Signatures are stable.

```tsx
<Container size="narrow|prose|default|wide" />
<Section tone="light|sand|ink|hydro" size="flush|compact|default|spacious"
         id containerSize />
<Button href variant="primary|secondary|outline|onDark|ghost"
        size="sm|md|lg" fullWidth />
<SectionHeading eyebrow title lede align="left|center" onDark as="h1|h2|h3" />
<Icon name className filled />
<Placeholder label ratio="1/1|4/3|3/2|16/9|3/4|21/9" tone="light|dark" icon />
<Accordion items={[{id,question,answer}]} singleOpen groupName />
<Badge tone="hydro|mint|signal|neutral|onDark" />
<Card href interactive />        // href makes the whole card clickable
<Stars value /> <RatingBadge onDark />
<BeforeAfterSlider before after alt label ratio />
```

Two behaviours worth knowing:

- **`Placeholder` is load-bearing.** It reserves the exact aspect ratio real
  photography will occupy, so layout and CLS are final before any photo exists.
  Swapping in `<Image>` later must change nothing around it.
- **`BeforeAfterSlider` uses a real `<input type="range">`** laid over the
  image. That buys keyboard support, arrow stepping, screen-reader announcement
  and touch handling for free. Don't replace it with pointer-event handlers.
- **`Accordion` uses native `<details>/<summary>`** — accessible, zero JS, works
  without hydration. Keep it that way.

---

## 5. Content model

### 5.1 The principle

`src/content/*.ts` is the entire data layer. **Adding a service or a city
creates all of its pages automatically.** No page should ever hardcode a
service name, phone number, price or city — read it from content.

### 5.2 `site.ts` is the one file that matters at launch

Every placeholder business detail lives here. Replacing this file updates nav,
footer, `tel:` links, WhatsApp deep links, page metadata and schema.org output
in one edit. Search the repo for `PLACEHOLDER` to find everything outstanding.

### 5.3 The anti-thin-content strategy

This is the single most important thing in the plan and the main reason to
build this rather than clone the reference.

Generating `11 services × 8 cities = 88` pages from a template is trivial. It's
also how sites get demoted, because the pages are functionally identical. So
every `Location` carries genuinely distinct data:

```ts
intro           // city-specific paragraph, written per city
housingStock    // "1970s painted block" vs "new-build subdivisions"
localChallenge  // WHY demand exists here specifically
neighborhoods   // real long-tail and internal-link value
landmarks       // recognisable local reference points
topServices     // reorders the grid per city
driveMinutes    // proximity trust signal
```

**Implementation requirement:** city pages must weave `localChallenge`,
`housingStock` and `neighborhoods` into prose — not render them as a bare data
table. A city with only a name must produce a visibly thinner page. That's the
intended pressure to fill it in properly.

**Scope control:** ship the 3 `priority: true` cities × ~4 services first.
Prove they rank, then expand. 88 pages on day one is 88 pages of unproven
template.

### 5.4 Fabricated review warning

`testimonials.ts` is draft placeholder copy. **Fabricated testimonials on a
live commercial site are an FTC violation**, not just poor practice. Every one
must be replaced with a genuine attributable review before launch, and the
`aggregateRating` in `site.ts` must reflect real counts.

---

## 6. Route map

Canonical pattern — **one** service URL shape, unlike the reference site's three.

| Route | Type | Generation |
|---|---|---|
| `/` | Static | Homepage |
| `/services` | Static | Hub, split residential/commercial |
| `/services/[service]` | SSG | `serviceSlugs` — 11 pages |
| `/services/[service]/[city]` | SSG | service × city matrix — start with priority cities only |
| `/service-areas` | Static | All cities + coverage map |
| `/service-areas/[city]` | SSG | `locationSlugs` — 8 pages |
| `/gallery` | Static | Before/after, filterable |
| `/pricing` | Static | Estimator + published ranges |
| `/quote` | Static | Multi-step wizard |
| `/reviews` | Static | Aggregated reviews |
| `/about` | Static | Story, team, credentials |
| `/blog` | Static | Index + category filter |
| `/blog/[slug]` | SSG | `postSlugs` — 6 posts |
| `/faq` | Static | All FAQs grouped by category |
| `/contact` | Static | Form, map, hours |
| `/privacy` `/terms` `/accessibility` | Static | Legal — footer links to these, so they must exist |
| `/sitemap.xml` `/robots.txt` | Generated | `app/sitemap.ts`, `app/robots.ts` |
| `not-found.tsx` | Static | 404 routing back to services |

---

## 7. Components still to build

### 7.1 `QuoteWizard` — `/quote` (client)

**The primary conversion asset.** A four-step wizard consistently outperforms a
single long form, because each step is a small commitment and progress is
visible.

```
Step 1  Service      Icon grid from services.ts. Multi-select.
Step 2  Property     Type (house/townhouse/commercial), storeys,
                     approximate size. Drives the estimate.
Step 3  Photos       Optional upload + free-text problem description.
                     Photos are the single best quote-accuracy input.
Step 4  Contact      Name, phone, email, address, preferred timing.
```

Requirements:

- Progress indicator across the top; back/next always available.
- **Live running estimate visible from step 2 onward** — this is what stops
  drop-off at the contact step, because the user now has something to lose.
- Validate per step, never dump all errors at the end.
- Persist state to `sessionStorage` so a refresh doesn't wipe progress.
- Step state in URL hash (`#step-2`) so back-button behaves.
- **No backend exists.** Submit is a stub — log the payload and render a
  success state. Wire to a form endpoint at launch (§11).
- Fully keyboard operable; move focus to the new step heading on advance.

### 7.2 `Estimator` — `/pricing` (client)

Reads `service.pricing` from `services.ts` and returns a **range**, never a
single number.

- Inputs: service, measurement (unit comes from `pricing.unit`), condition
  modifier (light / moderate / heavy).
- Output: `from`–`to` range, respecting `pricing.minimum`.
- Must display the honesty disclaimer (see `faqs.ts` → `quote-accuracy`). The
  credibility of publishing prices at all depends on not overpromising.
- Deep-link into `/quote` carrying the selections.

### 7.3 Section components

Build in `src/components/sections/`, each taking props rather than reading
content directly where reuse across pages is expected:

`Hero` · `TrustBar` · `ServicesGrid` · `HowItWorks` · `BeforeAfterShowcase` ·
`Testimonials` · `GuaranteeBand` · `ServiceAreaSection` · `FaqSection` ·
`CtaBand` · `BlogPreview` · `StatsRow` · `SymptomChecker`

---

## 8. Page specifications

Section order matters — it's the argument the page makes. Alternate `tone` down
each page per §3.2.

### 8.1 Homepage `/`

1. **Hero** — `tone="ink"`, `.blueprint-grid` + `.hydro-mesh`. Headline, one-line
   lede, primary CTA (`/quote`) + secondary (`tel:`), `RatingBadge`,
   `BeforeAfterSlider` as the hero visual. The slider *is* the hero image —
   it demonstrates the product in the first viewport.
2. **TrustBar** — `tone="light"`, `size="compact"`. `site.credentials` as chips.
3. **ServicesGrid** — `featuredServices` first, link to `/services`.
4. **SymptomChecker** — "Is this you?" Pulls `service.symptoms`. Maps a problem
   the visitor recognises to the service that fixes it. Nobody searches for
   "soft washing"; they search for "green stuff on my siding."
5. **BeforeAfterShowcase** — `tone="ink"`, `featuredProjects`.
6. **HowItWorks** — 4 steps: quote → schedule → clean → walkthrough. Removes the
   "what actually happens" uncertainty that stalls bookings.
7. **GuaranteeBand** — `tone="hydro"`. `site.guarantee`.
8. **Testimonials** — `featuredTestimonials` + link to `/reviews`.
9. **ServiceAreaSection** — city chips linking to `/service-areas/[city]`.
10. **FaqSection** — 5–6 highest-intent FAQs + link to `/faq`.
11. **CtaBand** — final conversion push.

### 8.2 Service detail `/services/[service]`

Hero (name, blurb, `method` badge, price-from, CTA) → intro prose → what's
included (`includes`) → symptoms → process steps → before/after filtered by
service → pricing range + estimator link → service-specific FAQs (`faqIds`) →
"available in these cities" grid linking to the `[service]/[city]` matrix →
related services (`related`) → CTA.

Metadata: `generateMetadata` from the service. Schema: `serviceSchema` +
`faqSchema` + `breadcrumbSchema`.

### 8.3 Service × city `/services/[service]/[city]`

The template that must not read as generated. Required beats:

- H1: `{service.name} in {city}, {region}`
- Opening prose that **combines** `location.localChallenge` with
  `service.name` — this sentence must be different for every city
- `location.housingStock` woven into why the method suits local properties
- Neighbourhoods served, as prose plus links
- Reviews filtered via `testimonialsFor({serviceSlug, citySlug})`
- Projects via `projectsFor({serviceSlug, citySlug})`
- `driveMinutes` proximity signal
- Links to: the parent service, the parent city, and sibling services in that city

Schema: `serviceSchema(service, location)` + breadcrumbs.

### 8.4 City page `/service-areas/[city]`

Hero with `intro` → `topServices` grid (ordered per city) → local challenge
explainer → neighbourhoods + landmarks → local reviews → local projects →
"all services in {city}" full grid → CTA.

### 8.5 Remaining pages

- **`/services`** — hub, residential and commercial split, each service as a
  `Card` with icon, `method` badge, blurb and price-from.
- **`/gallery`** — filter chips (service, city), grid of `BeforeAfterSlider`
  cards with `summary`, duration and area stats.
- **`/pricing`** — estimator, per-service range table read from `services.ts`,
  "what changes a price" explainer, red-flags section, pricing FAQs.
- **`/reviews`** — `RatingBadge`, source breakdown, filterable list, CTA to
  leave a review.
- **`/about`** — story, team placeholders, credentials, equipment/method,
  service-area map, guarantee.
- **`/blog`** + **`/blog/[slug]`** — index with category filter; post renders
  `sections[]` as `h2` + prose, with related services/cities in a sidebar.
- **`/faq`** — grouped by `faqCategories`, `Accordion` per group, `faqSchema`
  over all items.
- **`/contact`** — form, map placeholder, hours from `site.hours`, all contact
  channels including WhatsApp.
- **Legal pages** — real content required before launch; the footer already
  links to all three.

---

## 9. SEO

- `generateMetadata` on **every** dynamic route. No page inherits a generic title.
- Canonical URL on every page. The `[service]/[city]` matrix must not compete
  with its parent `[service]` page.
- `app/sitemap.ts` enumerating all static + generated routes from the content
  arrays. `app/robots.ts` alongside it.
- Schema per page type as noted in §8. Validate at validator.schema.org.
- **`robots: { index: false }` is currently set in `layout.tsx`.** That is
  deliberate — it keeps placeholder content out of the index. Flipping it to
  `true` is a launch-checklist item (§11), not something to do while building.
- Internal linking is the whole SEO strategy here: service ↔ city ↔ project ↔
  review ↔ post. The content model already carries the relationships
  (`related`, `relatedServices`, `topServices`, `faqIds`) — use them.

---

## 10. Accessibility & performance

Non-negotiable, and cheap if done during rather than after:

- Skip link exists in `layout.tsx`. Keep `#main` as the target.
- One `<h1>` per page; never skip heading levels.
- Focus ring is defined globally — never remove it without a replacement.
- All interactive elements reachable and operable by keyboard. The wizard in
  particular must move focus to the new step heading on advance.
- Colour contrast ≥ 4.5:1 for body text. `signal-400` on `ink-950` is the CTA
  pairing and passes; `signal-400` on white does **not** — never do that.
- Every `Placeholder` and image needs a real `alt`.
- Target Lighthouse ≥ 95 across the board. Static rendering plus the near-zero
  dependency footprint means the only realistic regressions are unoptimised
  images and stray client components.
- Use `next/image` for all real photography with explicit `width`/`height`.
  Hero images `priority`, everything else lazy.

---

## 11. Launch checklist

Placeholders that must be resolved before this site goes live:

- [ ] Replace every `PLACEHOLDER` in `src/content/site.ts` — name, phone,
      WhatsApp, email, address, coordinates, hours, founding year
- [ ] Replace `site.rating` with real aggregate figures
- [ ] Verify or remove each claim in `site.credentials` — these are legal claims
- [ ] Replace **all** testimonials with genuine attributable reviews (§5.4)
- [ ] Real pricing in `services.ts` — every figure is invented
- [ ] Rewrite `locations.ts` for the actual service area
- [ ] Real photography into `/public/gallery/`, paths filled in `gallery.ts`
- [ ] `/public/og-default.jpg` at 1200×630
- [ ] Real logo replacing the placeholder mark in `Header` and `Footer`
- [ ] Write the three legal pages
- [ ] Wire quote + contact forms to a real endpoint
- [ ] Swap fonts per §3.3
- [ ] **Flip `robots.index` to `true` in `layout.tsx`**
- [ ] Analytics + call tracking
- [ ] Google Business Profile NAP matched exactly to `site.ts`

---

## 12. Suggested build order

1. `app/page.tsx` — even a stub. Gets the build green immediately.
2. `sitemap.ts`, `robots.ts`, `not-found.tsx`.
3. Section components (§7.3) — the homepage assembles from them.
4. Homepage.
5. `/services` hub → `/services/[service]`.
6. `QuoteWizard` and `/quote` — highest conversion value, build it early.
7. `/service-areas` → `/service-areas/[city]`.
8. `/services/[service]/[city]` — priority cities only.
9. `/gallery`, `/reviews`, `/pricing` + `Estimator`.
10. `/about`, `/contact`, `/faq`, `/blog`.
11. Legal pages.

Run `npx tsc --noEmit` after each step. It passes today; it should never be the
thing that breaks.
