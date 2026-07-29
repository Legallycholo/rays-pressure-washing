# Optimization Implementation Plan

## Status

**All sections implemented.** `npm run build` and `tsc --noEmit` both pass; every page returns 200 and `/quote` and `/pricing` return 404.

Decisions made during the pass that go beyond the original scope, worth confirming with Geni:

- **`/pricing` route deleted entirely** (not just stripped). Section 3 confirmed "no actual prices get shown anywhere", which the published rate table and the ballpark estimator both contradicted. Removed with it: the `From $X` badge on every service card and service hero, the "typical range" block on service pages, and the "the maths, openly" price panel on bundle pages. `bundleOfferSchema` no longer emits `lowPrice`, because markup that contradicts the page is worse than no markup.
- **Testimonial `t7` removed.** It was a real Google review, but its text advertises recurring commercial storefront work, which Section 5 drops. Restore it from git history if commercial comes back.
- **`ServicesTabs.tsx` deleted**, not collapsed: with one segment left the residential/commercial toggle had nothing to toggle, so `/services` renders `ServicesGrid` directly.
- **Window cleaning promoted to `featured: true`**, so it appears in the homepage services grid. It is one of the two service families Section 6 names and it leads the business name.
- **Commercial FAQs removed except `contracts`**, which was rewritten residentially ("Am I locked into a contract?") because the new trust bar promises "No Contracts". `quote-accuracy` was rewritten away from the deleted estimator rather than deleted, since several pages reference it by id.
- **"background-checked crews" removed from `about/page.tsx` and `assistant.ts`** as well as from `site.credentials`, per Section 7. Section 3 only named the credentials array, but the same unverifiable claim appeared in prose in both places.

**Not verified:** the ContactHub notification sound fires on a real bot reply. The asset serves (`/sounds/notification.wav`, 200) and the call site is in `land()`, but the widget interaction was not driven in a browser. Worth one manual click-through.

## Context

Directives from Geni (business owner), collected in one working session, that change the site from a generic 11-service, residential-plus-commercial, quote-driven site into a focused lake-house pressure washing business:

1. Logo/navbar felt too small, size both up.
2. Real business address is now known: **257 Riglaw Cir, Lexington, SC 29073, USA**. This is a Lake Murray shoreline town, which grounds the new positioning below in a real fact rather than an invented one.
3. **No quotes.** The business does not want to give quotes or estimates anywhere on the site right now (may return later). Every CTA becomes either "Call now" or "Submit the form, get contacted within 24 hours."
4. **Target big lake houses.** First advertising push is aimed at large homes on Lake Murray, not the general public and not commercial accounts.
5. **Drop commercial services for now, including storefronts.** No commercial accounts of any kind right now, explicitly including storefront/awning cleaning. Advertising starts lake-house-first; commercial can come back later. Delete commercial services, commercial nav/footer entries, commercial packages, and commercial FAQ/assistant content.
6. **Lake homes, window cleaning, and pressure washing only.** The business focus for this pass is large lake houses, and the two service families that already exist in the catalog: window cleaning, and the pressure-washing-method services (house washing, roof cleaning, driveway/concrete, deck/patio, fence cleaning, gutter cleaning, pool deck). No new service types get added, no commercial services of any kind remain.
7. **Trust bar swap.** Remove the "$2M liability coverage" and "background-checked crews" credential claims (unverifiable/unwanted right now). Add in their place: "Same-Day Availability · Instant Pricing · No Contracts", a trust-bar phrase only, not a real-time pricing engine. Confirmed with Geni: no actual prices get shown anywhere; this is tone, not a promise of an on-site calculator.
8. **Chatbot sound.** The ContactHub assistant widget should play a short notification sound when a new bot message lands, so a visitor who isn't looking at the tab still notices it's responding.

All copy changes follow `Copywriting.md`'s existing rules: no em dashes, no banned hype phrases, no superlative without a number, plainspoken and specific, don't invent unconfirmed business facts (rating, founded year, review count, guarantee wording stay as-is).

## Scope and files

### 1. Logo / navbar size
- `src/components/ui/Logo.tsx` — bump default `heightClass` (`h-10 sm:h-11` → `h-12 sm:h-14`), update the `SIZES` constant/comment to match the new largest rendered height.
- `src/app/globals.css` — `--header-height` (`4.5rem` → `5.5rem`), used by scroll-padding, dropdown offset, and mobile drawer top offset, so no other file needs a separate edit.

### 2. Real address + Lake Murray positioning
- `src/content/site.ts` — `address.street/city/postalCode` become the real values; `region`/`regionName` stay `SC`/`South Carolina` (already correct). `serviceRegion` updates to reference Lake Murray, since Lexington sits on it. `lat/lng` updated to Lexington, SC town coordinates (best available without a geocoding call; flagged as approximate in a comment).
- Everything downstream (`schema.ts`, `Footer.tsx`, `ServiceAreaSection.tsx`, `CoverageMap.tsx`, `contact/page.tsx`, `about/page.tsx`) reads from `site.ts`/`cityState` and needs no direct edit.
- `reviews/page.tsx` has one hardcoded lede mentioning "Lexington, Columbia, and the SC Midlands" — leave as-is, it's already consistent.

### 3. Credentials / trust bar
- `src/content/site.ts` `credentials` array — remove the `$2M liability coverage` and `background-checked crews` entries. Add the new trust-bar line as its own display, not folded into the legal-sounding credential list: "Same-Day Availability · Instant Pricing · No Contracts" rendered wherever `credentialBadges`/trust bar currently shows (Hero credentials list, `CtaBand.tsx` trust line).
- No pricing feature is added. "Instant Pricing" is tone copy only, confirmed with Geni.

### 4. Remove quotes/estimates
- Delete `src/app/quote/` route, `src/components/QuoteWizard.tsx`, `src/components/Estimator.tsx` (ballpark calculator conflicts with "no quotes").
- Repoint every CTA currently linking to `/quote` or reading "Get my free quote" / "Free Estimate" / "Start my quote" / etc. to one of two actions:
  - **Call**: `tel:` link using `site.phone`.
  - **Form**: anchor to the existing contact form (`/contact`, `ContactForm.tsx`) with copy "Submit the form. We'll get back to you within 24 hours."
- Touches: `Header.tsx`, `Footer.tsx`, `StickyCallBar.tsx`, `CtaBand.tsx` (default props), `GuaranteeBand.tsx`, `HowItWorks.tsx`, `SymptomChecker.tsx`, `VideoShowcase.tsx`, `not-found.tsx`, `content/assistant.ts` (`quoteAction` + topic replies/keywords), and every page passing a quote-flavored `primaryCta`/`secondaryCta` into `Hero`/`CtaBand` (home, services hub, service detail, service×city, service-areas hub + city, packages hub + bundle, about, maintenance-plan, reviews).
- Meta/structured copy: `layout.tsx` description, `opengraph-image.tsx`, `sitemap.ts` (drop `/quote` entry).

### 5. Remove commercial services
- `src/content/services.ts` — delete the 3 commercial entries and the `commercialServices` derived export; `segment` can drop to residential-only if nothing else depends on the union type.
- `Header.tsx` mega-menu commercial column, `Footer.tsx` commercial link column, `ServicesTabs.tsx` residential/commercial toggle (collapse to residential grid only).
- `src/content/packages.ts` — remove `storefront-refresh` and `property-envelope` bundles; `packages/page.tsx` commercial column.
- `src/content/locations.ts` — Cedar Park's `topServices`/blurb currently lean on commercial framing; rewrite to residential/lake-house framing.
- `src/content/faqs.ts` — remove the "Commercial" category entries.
- `src/content/assistant.ts` — remove commercial keyword/mentions from topic replies.
- Dynamic routes (`services/[service]`, `services/[service]/[city]`) shrink automatically once the commercial slugs are gone from `generateStaticParams`.

### 6. Big-lake-house copy pass
- Hero, services grid ordering/blurbs, and location copy shift emphasis toward large lake homes (docks, boat lifts, algae/mineral staining off stone and stucco, big driveways/motor courts) without inventing facts not in `site.ts`/`services.ts`. Applies Copywriting.md Section 4 voice and Section 5 style rules; no new claims added to `site.credentials` or pricing.

### 7. Chatbot notification sound
- Add a short notification sound asset under `public/sounds/`.
- `src/components/ContactHub.tsx` — play it inside `land()` (where bot messages are appended), guarded for browser autoplay policy (only plays if the user has already interacted with the page, e.g. widget already opened).

## Verification
- `npm run build` (or `next build`) after all edits to catch broken imports from deleted routes/components and TypeScript errors from removed `commercialServices`/`segment` usages.
- Manually click through: header/nav on desktop + mobile (logo size, no commercial menu, CTA buttons say Call/Submit), homepage hero, a service page, `/services` hub (no commercial tab), `/packages` (no commercial bundle), `/contact` form, and open the ContactHub widget to confirm the notification sound fires on a bot reply.
- Confirm no `/quote` links remain (`grep -rn "/quote" src`) and no leftover "quote"/"estimate" CTA text (`grep -rniE "get.*quote|free estimate|start.*quote" src`).
