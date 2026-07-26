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

---

## Phase 1 — Homepage video

The single most-requested item. fullpowerwash.com opens on a looping video;
ours currently opens on the `BeforeAfterSlider`. Rather than replace the
slider (it's the highest-converting asset per `gallery.ts`'s own comment),
add video as a **second, equally strong proof point** further down the page.

### 1.1 Content model

- [ ] Add an optional `video` field to `Project` in `src/content/gallery.ts`:
      `video?: { src: string; poster: string; alt: string }`. Empty/absent by
      default — same placeholder-safe pattern as `before`/`after`.
- [ ] Add a standalone `siteVideo` export to `src/content/site.ts` (or a new
      `src/content/media.ts` if that reads cleaner) for a general "who we
      are" reel not tied to one project: `{ src: string; poster: string;
      captionsSrc?: string; alt: string }`. All fields placeholder empty
      strings until Ryan supplies footage.

### 1.2 Component — `src/components/VideoPlayer.tsx` (new)

- [ ] Client component wrapping a native `<video>` element. Props: `src`,
      `poster`, `alt`/`aria-label`, `captionsSrc?`, `variant?: "background" |
      "showcase"`.
- [ ] `background` variant: `autoPlay muted loop playsInline`, no controls,
      used only as decorative motion — never carries information a
      screen-reader user would miss (the surrounding copy carries the
      message).
- [ ] `showcase` variant: `controls`, no autoplay, real content — must ship
      with a `<track kind="captions">` slot even if `captionsSrc` is empty
      (render the `<track>` only when the src is non-empty).
- [ ] Respect `prefers-reduced-motion`: when set, `background` variant
      renders the `poster` image only (no video element mounted at all, not
      just paused — save the download).
- [ ] When `src` is empty, render the existing `.img-placeholder` motif at
      the correct aspect ratio (reuse the same visual language as
      `BeforeAfterSlider`'s empty state) so the layout is final before
      footage exists.
- [ ] No new dependency — this is a bare `<video>` tag. If Ryan's footage
      ends up hosted on YouTube/Vimeo instead of a direct file, that's a
      separate follow-up (needs an iframe + consent consideration for
      third-party cookies) — do not silently swap to an embed here.

### 1.3 Section — `src/components/sections/VideoShowcase.tsx` (new)

- [ ] Server component (video element itself is the only client boundary,
      isolated inside `VideoPlayer`). Follows `SECTIONS.md` conventions:
      wraps in `<Section>`, heading via `<SectionHeading>`.
- [ ] Layout: split section, `showcase`-variant video on one side, a short
      list of what's visible in the reel on the other (reuse the
      icon+checkmark list pattern already used in `Hero`'s credentials row).
- [ ] Insert into `src/app/page.tsx` between `BeforeAfterShowcase` and
      `HowItWorks` — process proof (photos) leads into motion proof (video)
      leads into the process explanation. Confirm no two adjacent `<Section>`
      share a `tone` (R3) once inserted.

### 1.4 Optional — ambient background video in `Hero`

- [ ] Only attempt this after 1.2–1.3 ship and real footage exists. Add an
      optional `backgroundVideo` prop to `Hero` (home variant only) that, if
      passed, renders `<VideoPlayer variant="background">` behind the
      existing gradient/mesh treatment instead of it, with the
      `BeforeAfterSlider` staying exactly where it is on the right. Do not
      replace the slider — it stays.
- [ ] Keep this optional/off until footage lands: mark `[~]` with reason
      "needs real footage" until then, rather than leaving the box unticked
      forever.

**GATE 1** — `npx tsc --noEmit` passes. Homepage renders correctly with
`video` fields empty (placeholder frame, no console errors, no layout
shift). `prefers-reduced-motion: reduce` verified in devtools to suppress
autoplay.

---

## Phase 2 — Gallery lightbox

`GalleryExplorer` currently links each `ProjectCard`'s slider inline in the
grid. A lightbox turns the gallery into a proper portfolio.

- [ ] Use the native `<dialog>` element — zero dependencies, built-in focus
      trap and `Esc`-to-close, `::backdrop` for the scrim. Do not reach for a
      modal library.
- [ ] New component `src/components/GalleryLightbox.tsx`, client. Opens on
      `ProjectCard` click, shows the full `BeforeAfterSlider` at a larger
      size plus `project.summary`, `durationHours`, `surfaceArea`.
- [ ] Keyboard: arrow keys move to next/previous project without closing;
      `Esc` closes; focus returns to the triggering card on close.
- [ ] Update `src/components/sections/BeforeAfterShowcase.tsx`'s
      `ProjectCard` (and `GalleryExplorer`'s usage of it) to open the
      lightbox instead of (or in addition to) the inline slider — keep the
      inline slider on the card itself so the grid still previews motion
      before a click.
- [ ] URL state: reuse the existing query-param pattern from
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

- [ ] Wrap each city `<g>` pin in `CoverageMap` in a real `<a href="/service-
      areas/[slug]">` (SVG supports anchors natively) instead of a bare
      `<g>`. Add `<title>{city}</title>` for a native tooltip and a visible
      focus ring (`:focus-visible` stroke) since this becomes keyboard-
      tabbable.
- [ ] Add hover/focus state: pin radius grows slightly, city label weight
      increases. Pure CSS (`:hover`/`:focus-visible` on the anchor), no JS
      needed — `CoverageMap` can stay a server component.
- [ ] Add a short caption under the map linking to `/service-areas` for the
      full list, for users who don't discover the pins are clickable.
- [ ] Do not swap this for a real cartographic embed (Google Maps/Mapbox) —
      that would be a new runtime dependency and a third-party script; flag
      it in this doc as "considered, deferred" rather than doing it, unless
      the user asks for a real map explicitly.

**GATE 3** — Every pin is a real link, reachable by keyboard, correct
`href`. `npx tsc --noEmit` passes.

---

## Phase 4 — Trust badges row & "as seen in" bar

Two related but separate additions — do not merge them into one component,
they have different truthfulness rules.

### 4.1 Trust badges (credentials as logos)

- [ ] `site.credentials` (`src/content/site.ts`) is currently plain text in
      `TrustBar`. Add a parallel `site.credentialBadges` array of `{ label:
      string; issuer: string; logoSrc: string }` — `logoSrc` empty string
      until Ryan supplies the actual badge art from the issuing body (BBB,
      state license board, insurer, etc).
- [ ] Extend `TrustBar` (or add a `CredentialBadges` component beside it) to
      render `logoSrc` as an `<img>` when present, falling back to the
      existing text-badge treatment when empty — same placeholder pattern as
      everywhere else. **Never fabricate a badge image or use a generic
      stock BBB/Google logo as a stand-in** — the FTC warning already on
      `testimonials.ts` applies here too: an unverified trust mark is a
      liability, not a placeholder.

### 4.2 "As seen in" press bar

- [ ] New content file `src/content/press.ts` exporting `pressMentions:
      { outlet: string; logoSrc: string; href?: string }[]`. Ships **empty**
      (`[]`) until Ryan has real press coverage — this section must not
      render at all when the array is empty, not render with placeholder
      logos. Fake press mentions are a worse trust violation than an absent
      section.
- [ ] New component `src/components/sections/PressBar.tsx`, server,
      `return null` when `pressMentions.length === 0`. Wire into
      `src/app/page.tsx` conditionally (or just add it and let the null
      guard handle it) between `Testimonials` and `ServiceAreaSection`.

**GATE 4** — `tsc` passes. Homepage with empty `pressMentions` renders
identically to before this phase (no empty section, no layout gap).

---

## Phase 5 — Seasonal campaign countdown

`SeasonalBanner` (`src/components/sections/SeasonalBanner.tsx`) shows a
campaign but no urgency signal.

- [ ] Add `endsAt?: string` (ISO date) to `SeasonalCampaign` in
      `src/content/packages.ts`. Optional — campaigns without a hard
      deadline (most maintenance-plan promos) simply omit it.
- [ ] Add a small `<Countdown>` client component
      (`src/components/Countdown.tsx`) that takes an ISO date and renders
      `Nd Nh Nm` remaining, updating once a minute (`setInterval`, cleared on
      unmount) — not once a second, no need to burn battery on a banner.
- [ ] When `endsAt` has passed, render nothing (don't show "0d 0h" — the
      `activeCampaign` selection logic in `packages.ts` should already be
      excluding expired campaigns from `activeCampaign`, so this is a
      defensive fallback, not the primary guard).
- [ ] Insert into `SeasonalBanner` only when `campaign.endsAt` is present,
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

- [ ] New component `src/components/layout/StickyQuoteRail.tsx`, client,
      `hidden lg:block` (mirrors `StickyCallBar`'s mobile-only pattern in
      reverse). Fixed to the right edge, vertically centered, collapsed to
      an icon by default, expands to show "Get My Free Quote" +
      phone on hover/focus.
- [ ] Must respect **R2** (no two `variant="primary"` buttons visible in one
      viewport) — check what's already in view before this renders as a
      *third* primary CTA alongside the hero's and header's. Likely
      resolution: use `variant="secondary"` or `onDark` for the rail, primary
      stays reserved for the in-flow CTAs.
- [ ] Only mount after scrolling past the hero (`IntersectionObserver` on
      the hero's bottom edge, same technique already implicit in
      `SeasonalBanner`'s mount-after-storage-read pattern) — don't duplicate
      the hero's own CTA above the fold.
- [ ] Add to `src/app/layout.tsx` next to where `StickyCallBar` is already
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

- [ ] Do **not** add a live Google Places widget yet — flag it here as
      "needs API key + billing decision from Ryan", not something to fake
      with a static screenshot or invented review count.
- [ ] Instead, upgrade `Testimonials` (`src/components/sections/
      Testimonials.tsx`) from its current static grid to a lightweight
      carousel over the *existing* `testimonials.ts` data — CSS scroll-snap
      (`overflow-x-auto snap-x`), no JS library, matching the zero-dependency
      pattern already used elsewhere (`Accordion` via `<details>`,
      `CoverageMap` via raw SVG).
- [ ] Add prev/next buttons that scroll the container via
      `scrollBy({ behavior: "smooth" })` — this is the one bit that needs
      `"use client"`; keep the rest of the section server-rendered.
- [ ] Once Ryan supplies a Google Business Profile place ID and approves the
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

- [ ] New component `src/components/ChatLauncher.tsx`, client, a floating
      button (bottom-left, so it doesn't collide with `StickyCallBar`
      bottom-right on mobile or the Phase 6 rail on desktop).
- [ ] Default behaviour with no vendor configured: clicking it opens the
      existing `/contact` flow (or a `mailto:`/`tel:` quick-menu, reusing
      `site.contact`) — a functional fallback, not a dead button.
- [ ] Structure the component so a real widget's mount call is a single,
      clearly-marked swap point (a comment, not a feature flag system — no
      speculative config layer for a vendor that isn't chosen yet).
- [ ] Leave disabled/uninstalled until Ryan picks a vendor. Ticking this box
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
