# improvement.md — Post-Launch Feature Backlog

Companion to `STRUCTURE.md` (what and why), `SECTIONS.md` (what it looks
like) and `CHECKLIST.md` (the build that shipped). That build is complete —
84 static routes, all gates through Phase 12 verified. This document is the
**next** backlog: features visible on reference sites in this category
(fullpowerwash.com and peers) that were deliberately left out of the v1 scope
and are now candidates to add.

**Every item here is additive.** None of them touch the content model's
existing shape, none require a backend, and none require a new runtime
dependency unless the item explicitly says so and gives the reason (per rule
R9 in `CHECKLIST.md`). Everything stays placeholder-safe: components must
render a correct, non-broken layout when the underlying media/data is empty,
exactly like `BeforeAfterSlider` and the gallery cards already do.

---

## How to use this

1. **Work items in priority order within a phase**, phases top to bottom.
   Each phase ends in a **GATE** — don't start the next phase until the gate
   passes.
2. **Tick boxes as you go**, in this file, and commit the ticks with the
   work. This file is the progress record, same convention as `CHECKLIST.md`.
3. **Never skip a box silently.** If something can't be done yet (e.g. it
   needs a real asset from Ryan), replace `[ ]` with `[~]` and add a one-line
   reason.
4. `npx tsc --noEmit` must pass at every gate.
5. Re-run the **nine standing rules** from `CHECKLIST.md` on every component
   you touch or add — they are not repeated here, they still apply in full.
   The two most relevant to this backlog: **R6** (server components by
   default, `"use client"` only where interaction genuinely requires it) and
   **R8** (no hardcoded business data — everything reads from `src/content/`).
6. At every viewport, test at **320px, 360px, 768px, 1024px, 1440px** — the
   build history in `CHECKLIST.md` includes three separate overflow bugs
   found at narrow widths. Don't repeat them.

**Counts:** 8 phases · 8 gates · placeholder-first throughout.

> **Status: complete.** All 8 phases built, all 8 gates pass, 2 boxes deferred
> with reasons (`[~]`, Phase 1.4 — needs real footage). See the **Build log**
> at the foot of this file for what was verified, which open decisions were
> resolved and how, two pre-existing bugs found and fixed, and the findings
> left for Ryan.

---

## Phase 1 — Homepage video

The single most-requested item. fullpowerwash.com opens on a looping video;
ours currently opens on the `BeforeAfterSlider`. Rather than replace the
slider (it's the highest-converting asset per `gallery.ts`'s own comment),
add video as a **second, equally strong proof point** further down the page.

### 1.1 Content model

- [x] Add an optional `video` field to `Project` in `src/content/gallery.ts`:
      `video?: { src: string; poster: string; alt: string }`. Empty/absent by
      default — same placeholder-safe pattern as `before`/`after`.
- [x] Add a standalone `siteVideo` export to `src/content/site.ts` (or a new
      `src/content/media.ts` if that reads cleaner) for a general "who we
      are" reel not tied to one project: `{ src: string; poster: string;
      captionsSrc?: string; alt: string }`. All fields placeholder empty
      strings until Ryan supplies footage.

### 1.2 Component — `src/components/VideoPlayer.tsx` (new)

- [x] Client component wrapping a native `<video>` element. Props: `src`,
      `poster`, `alt`/`aria-label`, `captionsSrc?`, `variant?: "background" |
      "showcase"`.
- [x] `background` variant: `autoPlay muted loop playsInline`, no controls,
      used only as decorative motion — never carries information a
      screen-reader user would miss (the surrounding copy carries the
      message).
- [x] `showcase` variant: `controls`, no autoplay, real content — must ship
      with a `<track kind="captions">` slot even if `captionsSrc` is empty
      (render the `<track>` only when the src is non-empty).
- [x] Respect `prefers-reduced-motion`: when set, `background` variant
      renders the `poster` image only (no video element mounted at all, not
      just paused — save the download).
- [x] When `src` is empty, render the existing `.img-placeholder` motif at
      the correct aspect ratio (reuse the same visual language as
      `BeforeAfterSlider`'s empty state) so the layout is final before
      footage exists.
- [x] No new dependency — this is a bare `<video>` tag. If Ryan's footage
      ends up hosted on YouTube/Vimeo instead of a direct file, that's a
      separate follow-up (needs an iframe + consent consideration for
      third-party cookies) — do not silently swap to an embed here.

### 1.3 Section — `src/components/sections/VideoShowcase.tsx` (new)

- [x] Server component (video element itself is the only client boundary,
      isolated inside `VideoPlayer`). Follows `SECTIONS.md` conventions:
      wraps in `<Section>`, heading via `<SectionHeading>`.
- [x] Layout: split section, `showcase`-variant video on one side, a short
      list of what's visible in the reel on the other (reuse the
      icon+checkmark list pattern already used in `Hero`'s credentials row).
- [x] Insert into `src/app/page.tsx` between `BeforeAfterShowcase` and
      `HowItWorks` — process proof (photos) leads into motion proof (video)
      leads into the process explanation. Confirm no two adjacent `<Section>`
      share a `tone` (R3) once inserted.

### 1.4 Optional — ambient background video in `Hero`

- [~] Needs real footage. The item's own precondition is "after 1.2–1.3 ship
      *and real footage exists*", and `siteVideo.src` is still an empty
      string. Building an unused `backgroundVideo` prop now would mean
      shipping a code path nobody can look at. `VideoPlayer` already
      implements `variant="background"` (autoplay/muted/loop, poster-only
      under `prefers-reduced-motion`), so the remaining work when footage
      lands is the `Hero` prop and nothing else.
- [~] Needs real footage — see above. Recorded as deferred rather than left
      unticked.

**GATE 1** — `npx tsc --noEmit` passes. Homepage renders correctly with
`video` fields empty (placeholder frame, no console errors, no layout
shift). `prefers-reduced-motion: reduce` verified in devtools to suppress
autoplay.

---

## Phase 2 — Gallery lightbox

`GalleryExplorer` currently links each `ProjectCard`'s slider inline in the
grid. A lightbox turns the gallery into a proper portfolio.

- [x] Use the native `<dialog>` element — zero dependencies, built-in focus
      trap and `Esc`-to-close, `::backdrop` for the scrim. Do not reach for a
      modal library.
- [x] New component `src/components/GalleryLightbox.tsx`, client. Opens on
      `ProjectCard` click, shows the full `BeforeAfterSlider` at a larger
      size plus `project.summary`, `durationHours`, `surfaceArea`.
- [x] Keyboard: arrow keys move to next/previous project without closing;
      `Esc` closes; focus returns to the triggering card on close.
- [x] Update `src/components/sections/BeforeAfterShowcase.tsx`'s
      `ProjectCard` (and `GalleryExplorer`'s usage of it) to open the
      lightbox instead of (or in addition to) the inline slider — keep the
      inline slider on the card itself so the grid still previews motion
      before a click.
- [x] URL state: reuse the existing query-param pattern from
      `GalleryExplorer` (`open decision #3` in its own comment) — a
      `?project=<id>` param opens the lightbox directly, so a single project
      is linkable/shareable. Must still work inside the required
      `<Suspense>` boundary.

**GATE 2** — Lightbox opens/closes via mouse, keyboard, and back button
(popstate). No focus trap leaks. Works at 320px (full-bleed, not a fixed
small box).

---

## Phase 3 — Interactive service-area map

`CoverageMap` is a static, non-interactive SVG (its own comment flags it as
"open decision #1"). Make the pins functional.

- [x] Wrap each city `<g>` pin in `CoverageMap` in a real `<a href="/service-
      areas/[slug]">` (SVG supports anchors natively) instead of a bare
      `<g>`. Add `<title>{city}</title>` for a native tooltip and a visible
      focus ring (`:focus-visible` stroke) since this becomes keyboard-
      tabbable.
- [x] Add hover/focus state: pin radius grows slightly, city label weight
      increases. Pure CSS (`:hover`/`:focus-visible` on the anchor), no JS
      needed — `CoverageMap` can stay a server component.
- [x] Add a short caption under the map linking to `/service-areas` for the
      full list, for users who don't discover the pins are clickable.
- [x] Do not swap this for a real cartographic embed (Google Maps/Mapbox) —
      that would be a new runtime dependency and a third-party script; flag
      it in this doc as "considered, deferred" rather than doing it, unless
      the user asks for a real map explicitly.
      ***Considered, deferred.*** *A Google Maps or Mapbox embed means an API
      key, a billing account, a third-party script and third-party cookies,
      for information the page already conveys better as a list of linked
      city names. Not done. The reasoning is repeated in `CoverageMap.tsx`'s
      header comment so nobody re-opens it from the code side.*

**GATE 3** — Every pin is a real link, reachable by keyboard, correct
`href`. `npx tsc --noEmit` passes.

---

## Phase 4 — Trust badges row & "as seen in" bar

Two related but separate additions — do not merge them into one component,
they have different truthfulness rules.

### 4.1 Trust badges (credentials as logos)

- [x] `site.credentials` (`src/content/site.ts`) is currently plain text in
      `TrustBar`. Add a parallel `site.credentialBadges` array of `{ label:
      string; issuer: string; logoSrc: string }` — `logoSrc` empty string
      until Ryan supplies the actual badge art from the issuing body (BBB,
      state license board, insurer, etc).
      *Shipped as a standalone `credentialBadges` export in the same file
      rather than a key inside the `site` object — `site` is `as const` and
      cannot self-reference, and the labels are read back out of
      `site.credentials` so the claim text has exactly one source. Same
      pattern `cityState` and `stats` already use.*
- [x] Extend `TrustBar` (or add a `CredentialBadges` component beside it) to
      render `logoSrc` as an `<img>` when present, falling back to the
      existing text-badge treatment when empty — same placeholder pattern as
      everywhere else. **Never fabricate a badge image or use a generic
      stock BBB/Google logo as a stand-in** — the FTC warning already on
      `testimonials.ts` applies here too: an unverified trust mark is a
      liability, not a placeholder.

### 4.2 "As seen in" press bar

- [x] New content file `src/content/press.ts` exporting `pressMentions:
      { outlet: string; logoSrc: string; href?: string }[]`. Ships **empty**
      (`[]`) until Ryan has real press coverage — this section must not
      render at all when the array is empty, not render with placeholder
      logos. Fake press mentions are a worse trust violation than an absent
      section.
- [x] New component `src/components/sections/PressBar.tsx`, server,
      `return null` when `pressMentions.length === 0`. Wire into
      `src/app/page.tsx` conditionally (or just add it and let the null
      guard handle it) between `Testimonials` and `ServiceAreaSection`.

**GATE 4** — `tsc` passes. Homepage with empty `pressMentions` renders
identically to before this phase (no empty section, no layout gap).

---

## Phase 5 — Seasonal campaign countdown

`SeasonalBanner` (`src/components/sections/SeasonalBanner.tsx`) shows a
campaign but no urgency signal.

- [x] Add `endsAt?: string` (ISO date) to `SeasonalCampaign` in
      `src/content/packages.ts`. Optional — campaigns without a hard
      deadline (most maintenance-plan promos) simply omit it.
- [x] Add a small `<Countdown>` client component
      (`src/components/Countdown.tsx`) that takes an ISO date and renders
      `Nd Nh Nm` remaining, updating once a minute (`setInterval`, cleared on
      unmount) — not once a second, no need to burn battery on a banner.
- [x] When `endsAt` has passed, render nothing (don't show "0d 0h" — the
      `activeCampaign` selection logic in `packages.ts` should already be
      excluding expired campaigns from `activeCampaign`, so this is a
      defensive fallback, not the primary guard).
- [x] Insert into `SeasonalBanner` only when `campaign.endsAt` is present,
      next to `campaign.ctaLabel`. Keep the dismiss-per-slug `localStorage`
      behaviour unchanged.

**GATE 5** — Banner with no `endsAt` behaves exactly as before. Banner with
a future `endsAt` counts down and updates. Banner with a past `endsAt`
renders no countdown (and ideally isn't `activeCampaign` at all).

---

## Phase 6 — Desktop sticky quote rail

`StickyCallBar` (`src/components/layout/StickyCallBar.tsx`) is mobile-only
by design. Desktop has no persistent conversion path once the hero scrolls
away.

- [x] New component `src/components/layout/StickyQuoteRail.tsx`, client,
      `hidden lg:block` (mirrors `StickyCallBar`'s mobile-only pattern in
      reverse). Fixed to the right edge, vertically centered, collapsed to
      an icon by default, expands to show "Get My Free Quote" +
      phone on hover/focus.
- [x] Must respect **R2** (no two `variant="primary"` buttons visible in one
      viewport) — check what's already in view before this renders as a
      *third* primary CTA alongside the hero's and header's. Likely
      resolution: use `variant="secondary"` or `onDark` for the rail, primary
      stays reserved for the in-flow CTAs.
- [x] Only mount after scrolling past the hero (`IntersectionObserver` on
      the hero's bottom edge, same technique already implicit in
      `SeasonalBanner`'s mount-after-storage-read pattern) — don't duplicate
      the hero's own CTA above the fold.
- [x] Add to `src/app/layout.tsx` next to where `StickyCallBar` is already
      mounted.

**GATE 6** — Rail is invisible below `lg`. Above `lg`, it appears only after
scrolling past the hero, disappears (or stays — decide and document) near
the footer's own conversion band so it doesn't visually collide with
`CtaBand`/the footer. No R2 violation at any scroll position.

---

## Phase 7 — Google reviews carousel

Real third-party review embeds (Google, in particular) require either a paid
Places API key or a script embed from a review-aggregation vendor
(Trustindex, Elfsight, etc) — both are **new runtime/network dependencies**
per rule R9 and both cost money or require API credentials Ryan hasn't
provided. Scope this phase accordingly:

- [x] Do **not** add a live Google Places widget yet — flag it here as
      "needs API key + billing decision from Ryan", not something to fake
      with a static screenshot or invented review count.
- [x] Instead, upgrade `Testimonials` (`src/components/sections/
      Testimonials.tsx`) from its current static grid to a lightweight
      carousel over the *existing* `testimonials.ts` data — CSS scroll-snap
      (`overflow-x-auto snap-x`), no JS library, matching the zero-dependency
      pattern already used elsewhere (`Accordion` via `<details>`,
      `CoverageMap` via raw SVG).
- [x] Add prev/next buttons that scroll the container via
      `scrollBy({ behavior: "smooth" })` — this is the one bit that needs
      `"use client"`; keep the rest of the section server-rendered.
- [x] Once Ryan supplies a Google Business Profile place ID and approves the
      spend, come back and swap the data source — the carousel UI built here
      is the container either way.

**GATE 7** — Carousel scrolls by mouse, touch, and the prev/next buttons.
Keyboard-scrollable via native scroll-snap focus behaviour. No new
`package.json` dependency added.

---

## Phase 8 — Live chat entry point (structural only)

Same constraint as Phase 7: a real chat widget (Intercom, Tidio, Crisp, etc)
is a third-party script — new dependency, and it also means live-chatting
with actual customers, which needs Ryan staffing it. Build the **door**, not
the live system behind it.

- [x] New component `src/components/ChatLauncher.tsx`, client, a floating
      button (bottom-left, so it doesn't collide with `StickyCallBar`
      bottom-right on mobile or the Phase 6 rail on desktop).
- [x] Default behaviour with no vendor configured: clicking it opens the
      existing `/contact` flow (or a `mailto:`/`tel:` quick-menu, reusing
      `site.contact`) — a functional fallback, not a dead button.
- [x] Structure the component so a real widget's mount call is a single,
      clearly-marked swap point (a comment, not a feature flag system — no
      speculative config layer for a vendor that isn't chosen yet).
- [x] Leave disabled/uninstalled until Ryan picks a vendor. Ticking this box
      means "the launcher exists and degrades correctly," not "a live chat
      widget is running."

**GATE 8** — Launcher visible on all breakpoints, doesn't collide with
`StickyCallBar` or the Phase 6 rail, fallback action works with zero
external scripts loaded. `npx tsc --noEmit` passes. Full site smoke test
(`npm run build`) succeeds.

---

## Priority order (if building sequentially, not all at once)

1. **Phase 1** (video) — directly requested, highest visual impact
2. **Phase 2** (lightbox) — cheap, native-HTML, immediate polish
3. **Phase 3** (map links) — small, fixes a flagged "open decision"
4. **Phase 5** (countdown) — small, reuses existing banner infra
5. **Phase 6** (desktop rail) — conversion lift, needs the R2 check
6. **Phase 4** (badges/press) — mostly blocked on real assets from Ryan
7. **Phase 7** (reviews carousel) — UI now, real data later
8. **Phase 8** (chat) — structural placeholder, real vendor is a business
   decision for Ryan, not a build decision

## What's explicitly out of scope here

- Any third-party embed that loads an external script (maps, chat, review
  widgets) beyond what's scoped above as "structure only" — each is a
  distinct dependency + cost + credentials decision for Ryan.
- Fabricated trust signals of any kind (press logos, review counts, badge
  art) — every instance above is written to fail closed (render nothing)
  rather than fail open (render a fake).
- Replacing the `BeforeAfterSlider` hero visual with video — it's additive,
  not a swap.

---

## Build log

All 8 phases built. **8 of 8 gates pass.** 42 boxes ticked, 2 deferred (`[~]`,
both in 1.4, both blocked on real footage). `npm run typecheck` and
`npm run build` pass; 84 routes still prerender; `package.json` is byte-for-byte
unchanged, so R9 was never in play.

### How the gates were verified

Not by eye. Each gate was scripted against the **production build**
(`next build && next start`) driven headlessly, because three of these features
(the lightbox's history behaviour, the rail's `IntersectionObserver`, the
carousel's snap positions) behave differently in dev and cannot be judged from
source. Every viewport in the "test at" list above was exercised.

| Gate | What was asserted |
| --- | --- |
| 1 | Typecheck + build; homepage renders the video placeholder at the final 16/9 with no video element mounted and no layout shift |
| 2 | 22 assertions — open by click/deep-link, close by Esc/button/back button, focus trap holds through 15 tabs, focus returns to the triggering card, scroll lock applies and releases, arrows move projects *except* inside the comparison slider, full-bleed at 320px |
| 3 | All 8 pins are real anchors on all 3 pages that render the map, every `href` returns 200, keyboard-focusable, focus grows the pin and draws a ring |
| 4 | Empty state renders identically to before (no band, no gap, no zero-height section) — **and** the populated state was verified against a temporary fixture, then reverted |
| 5 | `timeRemaining` unit-tested across 11 boundary cases; then all three banner states verified in-browser against temporary fixtures, then reverted |
| 6 | Invisible below `lg`; appears past the hero, hides at the footer; expands on keyboard focus; never renders in Signal orange at any scroll position |
| 7 | Every review present in the *server-rendered* HTML; snap active, buttons scroll and disable correctly at both ends, keyboard-scrollable, at all 5 viewports; `/reviews` and detail pages still use the grid |
| 8 | Launcher visible and ≥44px at all 5 viewports, no overlap with `StickyCallBar` or the rail, all 4 menu destinations real, Esc/click-outside close and restore focus, **zero external network requests site-wide** |

Plus a cross-phase smoke test: 18 pages × 5 viewports with no horizontal
overflow, no console or page errors, R3 tones still alternating, exactly one
`<h1>` per page.

### Decisions this backlog left open, and how they were resolved

- **Phase 6, "disappears (or stays — decide and document)" near the footer.**
  **Decided: it hides.** The footer carries its own conversion band; two
  "get a quote" affordances a hundred pixels apart compete rather than
  reinforce. Implemented with a second `IntersectionObserver` on `<footer>`.
- **Phase 6, R2.** The rail is `hydro`, never `signal`, and it is `inert`
  while hidden so it never enters the tab order. Verified across every scroll
  position on the homepage.
- **Phase 7 vs `SECTIONS.md` §2.10 ("Don't carousel it").** These genuinely
  conflicted. Resolved by reading what that rule was *for*: it targets
  auto-rotating carousels that mount one slide at a time — neither is true of
  a scroll-snap rail. `SECTIONS.md` §2.10 has been amended in place to record
  the exception, its two conditions, and the fact that it reverts if either
  condition is lost. `layout="grid"` stays the default; only the homepage
  opts in.

### Two bugs found and fixed on the way through

Neither was in this backlog's scope; both were sitting in shipped code.

1. **`router.replace()` silently no-ops on `/gallery` after a hard load with
   search params** (Next 16.2, statically prerendered route). Meaning: open a
   shared `/gallery?service=roof-cleaning` link and *every filter chip on the
   page is dead* — the exact scenario the URL-state design (open decision #3)
   exists to serve. Invisible in normal clicking, because soft navigations
   into the same route are unaffected. Fixed with `replaceQuery()`
   (`src/lib/url.ts`), the documented App Router escape hatch; the reasoning
   and the reproduction are recorded in that file.
2. **`scroll-px` missing on the new scroll rail.** `snap-start` aligns to the
   padding box, so the rail rested at `scrollLeft: 20` and the Previous button
   could never report itself as being at the start. Caught by Gate 7, not by
   looking at it.

### Findings for Ryan — not fixed, deliberately

- ~~**Pre-existing R2 overlap, 23 scroll positions on the homepage.**~~
  **Fixed.** `Button` now emits `data-cta="primary"` on the primary variant,
  which makes R2 enforceable at runtime instead of by eye, and `Header`
  observes every primary outside itself and stands its own CTA down (faded +
  `inert`) while any of them is on screen. Keyed off "is a primary visible"
  rather than "is the hero visible" deliberately: five pages have a hero with
  no primary at all, and blanket-hiding would have cost a conversion path on
  those to avoid a conflict that wasn't there. Homepage, `/services/*`,
  `/pricing` and `/faq` now hold R2 at every scroll position, at 360/768/1440.

  **Three in-flow-vs-in-flow overlaps remain.** All predate this backlog, all
  are in components this work didn't touch, so they are reported rather than
  redesigned unasked:

  1. **`/gallery` ends with `CtaBand`** — which is a straight **R4** violation
     ("no page ends with `CtaBand`; the footer band is the closer"), and it is
     also what puts `CtaBand`'s primary and the footer's primary on screen
     together. Fixing R4 fixes the R2 overlap for free: drop the `CtaBand`
     from `src/app/gallery/page.tsx` and let the footer close the page, as
     every other page does.
  2. **`/packages`** — the hero's primary and the bundle cards' "See what's
     included" primaries share a viewport near the top. Cleanest fix is the
     card CTAs going `variant="outline"`; a card grid where every card shouts
     is a grid where none does.
  3. **Mobile only — `StickyCallBar`'s orange "Free Quote" cell coexists with
     the hero's primary.** Not a `Button`, so it carries no `data-cta` and the
     header logic doesn't see it. Arguably the accepted cost of a persistent
     mobile action bar, but it is the same rule.
- ~~**`/favicon.ico` and `/og-default.jpg` both 404.**~~ **Fixed.**
  `src/app/icon.svg` reuses the exact placeholder mark the `Header` already
  renders (ink-900 tile, hydro-400 droplet), and `src/app/opengraph-image.tsx`
  generates the social card at build time from `site.ts` via `next/og` — which
  ships inside Next, so still no new dependency. The dangling
  `images: ["/og-default.jpg"]` key is gone from `layout.tsx`; every share of
  this site was 404ing its own preview image. Both are still *placeholder
  identity* — replace them when the real logo lockup lands, and once there is
  photography a real 1200×630 job shot will beat the typographic card.
- **Everything added here is still placeholder-fed.** The video, the badge
  art and the press bar are all structurally complete and all still empty.
  What unblocks them is Ryan supplying assets, not more code.

### Real business data received

Phone and email are now live in `site.ts` and propagate everywhere — nav,
footer, `tel:` links, the chat launcher, schema.org. Three things about them
still need confirming:

- **The WhatsApp number is an assumption.** `site.contact.whatsapp` was set to
  the same line as the phone because that is the only number given. `wa.me`
  does not degrade gracefully — if that number has no WhatsApp account, both
  the `StickyCallBar` and `ChatLauncher` entry points open an error page.
  Confirm, or remove the two WhatsApp entry points.
- **The area code doesn't match the service area.** 803 is South Carolina;
  the site says Springfield, FL / "Central Florida", and `site.address` and
  `serviceRegion` are still PLACEHOLDER. Every city in `locations.ts` is
  invented. This needs the real address and the real list of towns before
  launch — it currently drives 40+ generated location routes.
- **The email suggests a different business name.** `rayswindows81@gmail.com`
  against a site titled "Ryan's Pressure Washing". If the business is Ray's,
  or if windows are the primary trade rather than one service among twelve,
  that changes `site.name`, the whole title/schema layer, and arguably which
  services lead.

`site.url` is still `ryanspressurewashing.example` — no domain was supplied.
It sets canonical URLs, the sitemap and every og: tag, so it is required
before `robots.index` is flipped to true in `layout.tsx`.
