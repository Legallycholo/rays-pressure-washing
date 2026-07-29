# Animations & Contact-Hub Implementation Plan

**Status:** Built. All seven phases implemented; §12 answered with the documented
defaults (see that section). Per-item verification status lives in
`CHECKLIST.md` § Phase 14 — including the five items that need a real browser or
device and are therefore *not* verified.
**Intended executor:** Opus 5 (Cursor or Claude Code), working through this file top to bottom.
**Scope:** (1) an Apple-grade motion system, (2) an n8n.io-style scroll-stacking card
pattern, (3) merging `ChatLauncher` + `StickyQuoteRail` into one right-side "Contact
Hub" with a reserved AI-chat slot, (4) a proactive nudge that surfaces the hub after a
delay, (5) a mobile-optimization pass so all of the above is clean on small screens.

## How to use this document

Work phase by phase, in order. Each phase ends with a checklist — check every box
before starting the next phase. Do not skip a box because it "looks done"; verify it.
If a phase reveals that an earlier decision was wrong, stop and update this file's
"Open decisions" section (§12) rather than silently improvising.

---

## 0. Current state — read this before touching anything

The codebase has **zero animation dependencies today** (no Framer Motion, no GSAP).
Every transition is hand-rolled Tailwind + a handful of vanilla-JS patterns:

- `--ease-out-expo` is already defined in `src/app/globals.css` (`@theme` block) and
  used on `.coverage-pin` transitions.
- `prefers-reduced-motion` is already handled **globally** in `globals.css` (kills all
  animation/transition duration site-wide). Do not add per-component guards — extend
  the global rule if a new case needs special handling.
- `IntersectionObserver` is already used twice: `Header.tsx` (swaps the header CTA
  when an in-flow `signal` CTA is on screen — the "R2" rule) and
  `StickyQuoteRail.tsx` (shows/hides the rail based on hero/footer visibility).
- `ScrollRail.tsx` is the existing zero-dependency horizontal-scroll pattern
  (`scroll-snap` + buttons that call `scrollBy`). Its own comment states the
  project's philosophy explicitly: *"Zero dependencies, matching how the rest of this
  site does interaction."* Follow that precedent — do not reach for a library by
  default (see §2 for the one exception worth considering).

**Existing right/left corner map (this is what §5 changes):**

| Component | File | Position | Breakpoint |
|---|---|---|---|
| `ChatLauncher` | `src/components/ChatLauncher.tsx` | bottom-**left** | all |
| `StickyQuoteRail` | `src/components/layout/StickyQuoteRail.tsx` | **right**-middle, hover-to-expand | desktop only (`lg:`) |
| `StickyCallBar` | `src/components/layout/StickyCallBar.tsx` | bottom, full-width, 3-col | mobile only (`<lg`) |

`ChatLauncher.tsx` already documents a **"VENDOR SWAP POINT"** — the intended seam for
plugging in a real chat/AI vendor later. Preserve that pattern in the merged
component (§5); don't lose it.

### ⚠️ Conflicts with documented project rules

`STRUCTURE.md` §10.4 (Motion) currently says:

> 200–300ms, `--ease-out-expo`. Cards lift `-translate-y-1`, buttons `-translate-y-0.5`.
> `prefers-reduced-motion` is handled globally — no per-component guards. **No
> scroll-jacking, no parallax, no entrance animations that delay content.**

This request asks for scroll-driven stacking cards and entrance reveals, which is a
deliberate expansion of that rule, not a violation of its *intent* — the distinction
that matters is real scroll-jacking (JS intercepting and remapping scroll deltas) vs.
native scroll-linked effects (`position: sticky`, CSS scroll-driven animations) that
never take control away from the user's scroll. §1 below rewrites this rule. **Phase 0
checklist includes updating `STRUCTURE.md` §10.4 in place** so the docs and the code
don't contradict each other again.

`CHECKLIST.md` and `improvement.md` also codify "no entrance animation on the hero"
and "don't animate the stats count-up — it delays LCP." Both survive unchanged in the
new policy (see the LCP rule in §1).

### Phase 0 checklist
- [ ] Read this whole document once before writing code.
- [ ] Confirm the "Open decisions" in §12 with the user, or note the assumed answer.
- [ ] Update `STRUCTURE.md` §10.4 with the rewritten rule in §1.

---

## 1. Motion policy (replaces `STRUCTURE.md` §10.4)

Replace the current §10.4 with:

> **Durations/easing:** micro-interactions 150–250ms; section reveals 400–600ms;
> stacking-card transitions scrub with scroll (no fixed duration). Standard ease
> `--ease-out-expo`; add `--ease-spring` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for
> playful pops (nudge bubble, hub menu open). `prefers-reduced-motion` stays handled
> globally — no per-component guards.
>
> **Compositor-only:** animate `transform` and `opacity` exclusively. Never animate
> `width`, `height`, `top`/`left`, `margin`, or box-shadow spread directly — use
> `transform: scale()`/`translate()` and a precomputed shadow swap instead.
>
> **LCP is sacred:** the hero image/slider and any above-the-fold text never wait on
> JS to become visible. Entrance reveals apply only to content that scrolls into view
> *after* first paint, driven by `IntersectionObserver`, and the underlying content
> must already be in the DOM (progressive enhancement — CSS-disabled or JS-failed
> should still show fully readable content, just without the fade/slide).
>
> **No JS scroll-jacking:** never intercept wheel/touch events to remap scroll
> position or speed. Native scroll-linked techniques are allowed and encouraged:
> `position: sticky`, `IntersectionObserver`-driven CSS custom properties, and (as
> progressive enhancement) the native CSS Scroll-Driven Animations spec
> (`animation-timeline: view()` / `scroll()`). The user's scrollbar and scroll speed
> are never touched.
>
> **Stacking-card sections reserve their full height up front** (explicit
> `min-height`, computed from card count) so there is zero layout shift as the effect
> initializes.

### Checklist
- [ ] Add `--ease-spring` to the `@theme` block in `globals.css`.
- [ ] Paste the rewritten rule into `STRUCTURE.md` §10.4.
- [ ] Skim `CHECKLIST.md` / `improvement.md` motion-related lines (grep `-i
      "animat\|motion"`) and confirm nothing there contradicts the new policy — they
      currently don't, but re-check after any further edits.

---

## 2. Build-from-scratch animation toolkit

Two small, dependency-free primitives cover everything in §3 and §4. Build them once,
reuse everywhere.

### 2a. `useRevealOnScroll` (or a `<Reveal>` wrapper) — Apple-style entrance
- One shared `IntersectionObserver` (not one per element — instantiate once, observe
  many nodes, and use a `WeakMap`/dataset to look up per-node animation state).
- `rootMargin: "0px 0px -10% 0px"` so items animate slightly before they're fully in
  view (feels anticipatory, not laggy).
- On intersect: add a class (`.is-revealed`) that transitions `opacity` + a small
  `translateY` (`8–16px`) via the tokens in §1. `unobserve` immediately after — never
  re-trigger on scroll-back.
- Ship as a **client component wrapper** (`src/components/Reveal.tsx`) that takes
  `children` and an optional `delay`/`stagger index`, so server components (which is
  most of this codebase — see `HowItWorks.tsx`, `BundlesSection.tsx`, all server by
  default) can opt individual sections into the effect without becoming client
  components themselves. Pattern: `Reveal` is the only client boundary; it renders
  its (server-rendered) children unchanged, just adds the observer + class toggling.
- Base state (`opacity-0 translate-y-3`) must be applied via a class that's
  **removed** once JS confirms it's running (e.g. add `.js-reveal-ready` on `<html>`
  via a tiny inline script or `useEffect` on mount) — otherwise a JS error or slow
  hydration leaves content permanently invisible. This is the progressive-enhancement
  guarantee from §1.

### 2b. Stacking-card scroll engine
Two tiers — build tier 1, tier 2 is optional polish once tier 1 ships and is verified.

**Tier 1 (required, works everywhere):**
- Wrapper component `src/components/StackingCards.tsx`. Container height =
  `(cardCount) * 100vh` on desktop, tunable per breakpoint (mobile likely wants a
  shorter per-card scroll distance — see §7).
- Each card is `position: sticky; top: <header-height + n*16px>` (slight cascading
  offset so the stack reads as a deck, not a single flat overlap).
- A single `scroll` listener (passive, `requestAnimationFrame`-throttled — never run
  the calculation more than once per frame) computes each card's progress
  (`0` = not yet stacked, `1` = fully stacked-under) from `getBoundingClientRect()`
  and writes it to a CSS custom property on the card (`el.style.setProperty('--p',
  progress)`).
- CSS reads `--p` to drive `transform: scale(calc(1 - var(--p) * 0.06))` and
  `opacity: calc(1 - var(--p) * 0.4)` on the card *underneath* the one currently
  scrolling over it — that's the visual "next card slides on top, previous card
  recedes" effect n8n.io uses.
- Clean up the listener on unmount; use `{ passive: true }`.

**Tier 2 (optional progressive enhancement, do after Tier 1 ships):**
- Behind `@supports (animation-timeline: scroll())`, replace the JS scroll listener
  with native CSS Scroll-Driven Animations (`animation-timeline: view()` per card),
  removing the main-thread scroll handler entirely for supporting browsers (better
  scroll performance, especially on lower-end mobile). Keep Tier 1 as the fallback
  path inside `@supports not (...)`.

**Reduced motion / accessibility for both:**
- Under `prefers-reduced-motion: reduce`, stacking cards render as a plain vertical
  stack with normal document flow (no `position: sticky`, no scale/opacity scrub) —
  detect via `matchMedia` at mount and branch, don't rely on the CSS-only global kill
  switch alone for this one (it kills *duration*, but a sticky layout with no
  animation still visually behaves oddly without an explicit layout branch).
- Reading order in the DOM must match visual/logical order regardless of visual
  stacking — screen readers ignore `position: sticky`, so this is free, just don't
  break it with `order` or absolute positioning tricks.
- Each card needs real, generous `min-height` so nothing is quietly still-clipped.

### Decision flagged for §12
A library (Framer Motion for `useScroll`/`useTransform`, or GSAP + ScrollTrigger)
would make Tier 1 meaningfully faster to build and more robust across edge cases
(fast flicks, resize mid-scroll, RTL). The recommendation above is "from scratch" to
match the codebase's existing zero-dependency posture — confirm this is still wanted
before Opus 5 starts, since it's more implementation work either way.

### Checklist
- [ ] `src/components/Reveal.tsx` built and used on at least one section as proof.
- [ ] `src/components/StackingCards.tsx` (Tier 1) built.
- [ ] Reduced-motion branch verified in both (toggle the OS setting, reload, confirm
      no sticky/scale behavior and content is fully present).
- [ ] Confirm with the user: from-scratch (default) vs. a motion library. Record the
      answer in §12.

---

## 3. Sitewide Apple-style micro-interactions

Apply `Reveal` and small hover/press refinements broadly, but each one individually —
do not do a mass find-replace.

- [ ] **Section entrances:** wrap each major section's heading + first row of content
      in `Reveal` (not every single card — stagger 2–4 groups per section max, via a
      small `delay`/index prop, so it doesn't turn into a slot-machine cascade).
      Candidates, in priority order: `HowItWorks`, `ServicesGrid`, `Testimonials`,
      `BundlesSection`, `TrustBar`, `StatsRow` (see the existing "don't animate the
      count-up" rule — reveal the *row*, not the number).
- [ ] **Card hover:** `Card.tsx` already does `hover:-translate-y-1 hover:shadow-lift`
      at 300ms — leave as-is, it's already correct per the new tokens.
- [ ] **Button press feedback:** add a `active:scale-[0.97]` (compositor-only, ~100ms)
      to `Button.tsx` variants that don't already have one, for a tactile "it
      registered" feel on tap — this is the single highest-leverage Apple-ism for
      mobile, where hover doesn't exist.
- [ ] **Header polish:** `Header.tsx`'s scrolled-state transition (`border/bg/shadow`
      at 300ms) is already good — no change needed. Consider adding the same
      treatment's easing token (`--ease-out-expo`) explicitly if it isn't already
      inheriting it.
- [ ] **Mega menu / mobile drawer:** already CSS-driven (`invisible`/`opacity`
      pattern) — fine as-is, just confirm it now uses the shared easing token instead
      of Tailwind's default.
- [ ] **Gallery lightbox open/close** (`GalleryLightbox.tsx`): audit — if it currently
      snaps open with no transition, add a `scale-95 → scale-100` + `opacity`
      transition on the `<dialog>` (respecting reduced motion).
- [ ] **BeforeAfterSlider**: leave untouched — it's LCP content per the existing rule
      ("Hero slider is LCP: no lazy-load, no entrance animation").

### Stretch (optional, do last if time remains)
- [ ] Investigate the View Transitions API for cross-page navigation polish
      (`next/link` + native `document.startViewTransition`, Next 16 App Router
      supports this experimentally). Not required for this pass — flag as a follow-up
      if it doesn't fit cleanly with the current routing.

---

## 4. n8n.io-style stacking cards — where and what

**Primary target: `HowItWorks.tsx`.** Its four steps (`Get your quote → Pick your
date → We clean → Walk it with us`) are a linear narrative — the single best fit on
this site for a "cards stack as you scroll through a sequence" treatment, the same
shape n8n.io uses for its workflow-step story and Apple uses on feature pages.

- [ ] Rebuild `HowItWorks` to use `StackingCards` (§2b) instead of the current
      `<ol>` grid, **on `lg:` and up only** — keep the existing simple vertical list
      with the connecting rail on mobile (a 4-card scroll-stack needs real vertical
      scroll runway that's a poor trade on small screens; see §7). Use a
      `useMediaQuery`-style check or a CSS-only fallback (render both, hide one via
      breakpoint classes, gated so the JS scroll listener never attaches on mobile).
- [ ] Each stacked card keeps the existing content (numbered badge, icon, title,
      body) — this is a layout/motion change, not a content or copy change.
- [ ] Secondary candidate (do only if the primary lands well and there's appetite for
      more): `BundlesSection`'s three package cards could use the same effect instead
      of the current static 3-up grid. Lower priority — a 3-card static grid already
      reads fine, and packages benefit from side-by-side comparison, which a
      linear stack actively works against. Recommend leaving `BundlesSection` as a
      grid unless the user asks for it explicitly.
- [ ] Confirm `min-height` on the `HowItWorks` stacking container is generous enough
      that fast scrolling (trackpad flick, mobile fling) doesn't blow through all four
      cards in one gesture with no visible stacking motion — tune empirically.

### Checklist
- [ ] `HowItWorks` stacking version built behind `lg:`, mobile keeps current layout.
- [ ] Tested with fast scroll, slow scroll, and scroll-back-up (all directions).
- [ ] Tested with reduced motion on (falls back to plain stacked content, per §2b).
- [ ] `BundlesSection` explicitly left alone unless the user asks otherwise.

---

## 5. Contact Hub — merge `ChatLauncher` + `StickyQuoteRail`, move to the right

### Why merge instead of just moving `ChatLauncher` to the right
`StickyQuoteRail` already owns the right edge on desktop. Moving the chat widget
there without merging creates two competing right-side elements — exactly the
clutter the user flagged on mobile. Folding the rail's two actions (quote, call)
into the same hub the chat/contact options already live in is both the fix for that
conflict and the "hub" the user described: one launcher, one mental model, everywhere.

### New component: `src/components/ContactHub.tsx`
Replaces both `src/components/ChatLauncher.tsx` and
`src/components/layout/StickyQuoteRail.tsx`. Delete both old files once the new one
is verified on every breakpoint — don't leave dead code behind.

- [ ] **Position:** `fixed`, bottom-**right**, all breakpoints (mirrors
      `ChatLauncher`'s current bottom-left math, flipped: `right-4` mobile /
      `right-6` desktop). Same 68px `StickyCallBar` clearance on mobile
      (`bottom-[76px] lg:bottom-6`) that `ChatLauncher` already accounts for.
- [ ] **Always visible**, not scroll-gated. This drops `StickyQuoteRail`'s
      show/hide-past-hero logic — simpler, and consistent with `ChatLauncher`'s
      current always-on behavior. (If it visually collides with the footer's own
      contact block during QA, revisit — don't preemptively add the hide-near-footer
      logic back in.)
- [ ] **Single FAB trigger**, one size, no hover-to-expand-labels interaction (that
      pattern doesn't exist on touch — replacing it with tap-to-open is simpler on
      every input type, which is the "simpler and easier to understand" ask).
- [ ] **Menu items**, all labels always visible (no hover-reveal), in this order:
      1. **Get My Free Quote** → `/quote`. Style **`hydro`, not `signal`** — carry
         forward `StickyQuoteRail`'s existing R2 rationale verbatim: this is a
         persistent utility, not the in-flow conversion action, and orange stays
         reserved for whatever `signal` CTA is in view.
      2. **Call** → `tel:` link, existing phone icon/number.
      3. **WhatsApp** → existing `waLink()`.
      4. **Email** → existing `mailto:`.
      5. **Send a message** → `/contact`.
      6. **Chat with AI** → reserved slot, see below. Keep it last (newest, most
         speculative option) or first (most prominent) — default to **last**, since
         it isn't live yet; promote it to first once the AI is actually wired up.
- [ ] **"Chat with AI" slot — build the UI now, wire the backend later.** This is the
      direct descendant of `ChatLauncher`'s existing "VENDOR SWAP POINT" comment —
      preserve that comment block, moved onto this menu item specifically. Ship it as
      a real, clickable menu item styled identically to the others, but its
      `onClick` opens a **lightweight placeholder panel** (not a dead link, not a
      disabled/greyed-out row) that says something like *"Our AI assistant is
      almost ready — for now, [call/text/WhatsApp] and we'll answer directly."* with
      the three fastest contact options inline. This keeps the affordance honest
      (nothing fakes a live chat) while making the eventual swap a pure drop-in: when
      the AI vendor is chosen, this `onClick` becomes "open the vendor's widget" and
      nothing else in the file changes.
- [ ] **Icon:** reuse the existing `chat` icon (`Icon.tsx`) for the "Chat with AI"
      row, differentiated from the FAB trigger's own `chat` icon with a small badge
      or the `sparkle` glyph as an accent (already the site's "smart/automated" motif
      — used on the quote-wizard CTA in `Header.tsx`'s mega menu) so it doesn't read
      as a duplicate of "Send a message."
- [ ] **Open/close motion:** `--ease-spring` (§1) on the menu's mount — Apple/n8n-ish
      pop rather than a flat fade, ~200ms.
- [ ] **Accessibility:** carry forward everything `ChatLauncher` already does
      correctly — `role="menu"`/`role="menuitem"`, `Escape` to close +
      refocus trigger, click-outside to close, `aria-expanded`/`aria-controls`. Audit
      touch target size on every row (44×44px minimum — see §7).
- [ ] **Update `layout.tsx`:** remove the `StickyQuoteRail` and `ChatLauncher`
      imports/usages, add `ContactHub`. Update its comment
      (`{/* Bottom-left: the one corner the other two don't occupy. */}`) — that
      rationale no longer applies once there's one hub instead of three components
      dividing the corners.
- [ ] **Update docs:** any reference to `StickyQuoteRail`'s "R2 — the rail is hydro,
      never signal" rule or `ChatLauncher`'s "bottom-left deliberately" reasoning in
      `STRUCTURE.md`/`SECTIONS.md`/`CHECKLIST.md` should be found (grep for
      `StickyQuoteRail`, `ChatLauncher`, `bottom-left`) and updated to describe
      `ContactHub` instead, so the docs don't describe deleted components.

### Checklist
- [ ] `ContactHub.tsx` built, all 6 menu items functional (5 real + 1 honest
      placeholder).
- [ ] `StickyQuoteRail.tsx` and `ChatLauncher.tsx` deleted.
- [ ] `layout.tsx` updated.
- [ ] Verified no double-rendering / leftover corner elements on any breakpoint.
- [ ] Docs grep-and-update pass done (§ references above).
- [ ] Keyboard-only pass: tab to trigger, open with Enter/Space, arrow through items
      (optional but nice), Escape closes and refocuses trigger.

---

## 6. Proactive nudge — "you have an assistant" after a delay

Goal: tell first-time visitors the hub exists without being an intrusive popup.

- [ ] **Trigger:** whichever comes first — **24 seconds** on page, **or** 60% scroll
      depth. (Two triggers so a fast scroller and a slow reader both get it at a
      sensible moment, not just a flat timer.) Make the constants easy to find/tune
      (top of `ContactHub.tsx` or a small config object).
- [ ] **Suppression rules:**
  - Never show if the hub has already been opened this session.
  - Only show **once per session** (`sessionStorage`, not `localStorage` — don't
    nag returning visitors across days, but don't repeat it on every internal page
    nav within one visit either).
  - Suppress entirely on `/quote` and `/contact` — the visitor is already mid
    conversion-flow there; a chat nudge is a distraction, not a help.
- [ ] **Visual form:** a small speech-bubble/tooltip anchored to the FAB (not a modal,
      not a full-width banner) — something like *"👋 Questions? We're right here."*
      with a visible close (×) button. Auto-dismiss after ~8s if not interacted with,
      or immediately on any click (open the hub, or dismiss it).
  - Under `prefers-reduced-motion: reduce`: appear instantly (no slide/pop-in), still
    auto-dismiss on the same timer — motion is decorative here, the message itself
    isn't motion-dependent.
  - Under normal motion: `--ease-spring` pop-in, matching §5's menu-open feel so the
    whole hub feels like one coherent system.
- [ ] **Accessibility:** `aria-live="polite"` region (not `assertive` — it shouldn't
      interrupt a screen reader mid-sentence), and it must not steal focus. It's an
      ambient notice, not a dialog.
- [ ] **Don't couple this to the AI slot specifically** — the copy should read as
      "a person/assistant is here," not "our AI is ready," since the AI option is
      still the placeholder described in §5. Once the AI vendor is live, revisit the
      copy.

### Checklist
- [ ] Timer + scroll-depth dual trigger implemented, constants tunable.
- [ ] Session-storage gating verified (open once, reload page, confirm it doesn't
      reappear same session; clear session storage, confirm it does).
- [ ] Suppressed correctly on `/quote` and `/contact`.
- [ ] Reduced-motion variant verified.
- [ ] Screen reader pass: confirm it announces without stealing focus or blocking
      interaction with the rest of the page.

---

## 7. Mobile optimization checklist

Cross-cutting — apply throughout, not just to the hub.

- [ ] **Safe-area insets:** add `env(safe-area-inset-bottom)` /
      `env(safe-area-inset-right)` to `ContactHub`'s and `StickyCallBar`'s fixed
      positioning so neither sits under the home-indicator/notch area on iOS. Use
      `max(1rem, env(safe-area-inset-bottom))`-style fallbacks so non-notch devices
      keep their current spacing.
- [ ] **Touch targets:** audit every interactive element touched in this plan for a
      44×44px minimum hit area (`ContactHub` menu rows, FAB, nudge close button,
      stacking-card content if anything inside becomes tappable).
- [ ] **`StackingCards` on mobile:** confirmed off (§4) — verify the JS scroll
      listener genuinely never attaches below `lg:`, not just visually hidden (a
      hidden-but-attached listener still burns battery/CPU).
- [ ] **Overscroll behavior:** confirm the `ContactHub` menu and any new modal/panel
      (the AI placeholder panel) don't allow body scroll-through on iOS Safari —
      apply the same body-scroll-lock pattern `Header.tsx`'s mobile drawer already
      uses (`document.body.style.overflow = "hidden"` while open).
- [ ] **Reveal animations on low-end devices:** `Reveal` (§2a) should stay cheap —
      one shared observer, transform/opacity only, no per-element listeners. Sanity
      check on a throttled CPU (Chrome DevTools 4x–6x slowdown) that scroll stays
      smooth on a long page (`/pricing` or `/service-areas` are the longest).
- [ ] **Tap highlight:** confirm `-webkit-tap-highlight-color` isn't leaving a grey
      flash on the new hub/nudge elements (project likely already resets this
      globally — verify, don't assume).
- [ ] **Viewport height:** layout already uses `min-h-dvh` (`layout.tsx`) — keep
      using `dvh`, not `vh`, for anything new (stacking-card container height on any
      mobile-visible variant, if ever added) so mobile browser chrome
      show/hide doesn't cause jumpy sizing.
- [ ] **Total fixed-element inset math:** with `StickyCallBar` (68px, mobile) +
      `ContactHub` FAB, confirm nothing overlaps and the last section of every page
      (footer content, final CTA) isn't visually hidden behind the bar — this was
      already handled via `body`'s `pb-[68px] lg:pb-0`, just re-verify after any
      hub-height changes.
- [ ] **Real-device pass**, not just DevTools emulation: at minimum one iOS Safari
      and one Android Chrome device, checking safe-area insets, tap targets, and the
      nudge bubble specifically (emulators are notoriously unreliable for
      safe-area-inset values).

---

## 8. File-by-file task list

| File | Change |
|---|---|
| `src/app/globals.css` | Add `--ease-spring`; keep `--ease-out-expo`; no changes to the reduced-motion block. |
| `STRUCTURE.md` | Rewrite §10.4 (§1 above); update any `StickyQuoteRail`/`ChatLauncher` mentions elsewhere in the doc. |
| `src/components/Reveal.tsx` | **New.** Shared IntersectionObserver entrance wrapper (§2a). |
| `src/components/StackingCards.tsx` | **New.** Tier 1 sticky-stack engine + optional Tier 2 `@supports` branch (§2b). |
| `src/components/sections/HowItWorks.tsx` | Rebuilt on `StackingCards` for `lg:`+, unchanged on mobile (§4). |
| `src/components/ContactHub.tsx` | **New.** Merges `ChatLauncher` + `StickyQuoteRail` (§5). Includes the nudge (§6) — or split the nudge into its own small `ContactHubNudge` component if `ContactHub.tsx` gets unwieldy; either is fine, keep it co-located. |
| `src/components/ChatLauncher.tsx` | **Delete** once `ContactHub` is verified. |
| `src/components/layout/StickyQuoteRail.tsx` | **Delete** once `ContactHub` is verified. |
| `src/app/layout.tsx` | Swap imports/usages per §5. |
| `src/components/ui/Button.tsx` | Add `active:scale-[0.97]` press state where missing (§3). |
| `src/components/GalleryLightbox.tsx` | Audit + add open/close transition if missing (§3). |
| `CHECKLIST.md` | Add QA items from §9/§10 below once written; remove any now-stale `StickyQuoteRail`/`ChatLauncher`-specific lines. |

---

## 9. Master build checklist (sequenced)

Work top to bottom. Each box should be checked by the person/agent who did the work,
not pre-checked speculatively.

**Phase 0 — groundwork**
- [ ] Confirm open decisions in §12 (or record assumed defaults).
- [ ] Update `STRUCTURE.md` §10.4.
- [ ] Add `--ease-spring` token.

**Phase 1 — toolkit**
- [ ] Build `Reveal.tsx`.
- [ ] Build `StackingCards.tsx` (Tier 1).
- [ ] Verify both under `prefers-reduced-motion: reduce`.

**Phase 2 — sitewide polish**
- [ ] Apply `Reveal` to the section list in §3.
- [ ] Add button press state.
- [ ] Audit/fix gallery lightbox transition.

**Phase 3 — stacking cards**
- [ ] Rebuild `HowItWorks` on `StackingCards`, desktop-only.
- [ ] Verify mobile is unaffected (old layout, no JS attached).
- [ ] Fast-scroll / slow-scroll / scroll-back-up testing.

**Phase 4 — Contact Hub**
- [ ] Build `ContactHub.tsx` with all 6 menu items.
- [ ] Wire the "Chat with AI" placeholder panel.
- [ ] Delete `ChatLauncher.tsx` + `StickyQuoteRail.tsx`.
- [ ] Update `layout.tsx`.
- [ ] Docs grep-and-update pass.

**Phase 5 — proactive nudge**
- [ ] Implement dual trigger (timer + scroll depth).
- [ ] Implement session-storage + page-suppression rules.
- [ ] Verify reduced-motion + screen-reader behavior.

**Phase 6 — mobile pass**
- [ ] Work through the full §7 checklist.
- [ ] Real-device verification (iOS + Android).

**Phase 7 — QA close-out**
- [ ] Full §10 testing checklist.
- [ ] `npm run lint` and `npm run typecheck` clean.
- [ ] Remove dead code (old components, unused icons/comments referencing them).

---

## 10. Testing & QA checklist

- [ ] Lighthouse (mobile + desktop) on `/` and one long content page — confirm no
      CLS regression from stacking cards or reveals, LCP unaffected.
- [ ] `prefers-reduced-motion: reduce` toggled at the OS level (not just DevTools
      emulation, at least once) — confirm every new effect degrades gracefully.
- [ ] Keyboard-only pass through `ContactHub` (open, navigate items, close, refocus).
- [ ] Screen reader pass (VoiceOver or NVDA) through `ContactHub` and the nudge.
- [ ] JS-disabled pass: confirm `HowItWorks` content is fully present and readable
      (no permanently-hidden-by-JS content anywhere touched in this plan).
- [ ] All breakpoints checked visually: 375px, 768px, 1024px, 1440px+.
- [ ] Verify R2 (never two `signal`/orange primaries visible at once) still holds
      with the hub's hydro-styled quote button in the mix.
- [ ] Verify no leftover references to deleted components in code or docs
      (`grep -r "ChatLauncher\|StickyQuoteRail"`).
- [ ] Nudge suppression re-tested end to end (session storage cleared → shows once →
      reload → doesn't repeat → new session → shows again).

---

## 11. Explicit non-goals for this pass

- **No real AI backend.** The "Chat with AI" slot is UI-only — a placeholder panel,
  not a connected assistant. Wiring an actual vendor/model is a separate, later task.
- **No new npm dependencies** unless §12's library question is answered "yes" —
  default plan is dependency-free.
- **No changes to `BundlesSection`'s layout** unless explicitly requested (§4).
- **No changes to page copy/content** — this is a motion/layout/consolidation pass.

---

## 12. Open decisions — resolved

All four went to the documented default. None was confirmed with the user first;
each is a one-line change if a different answer is wanted.

- [x] **From-scratch vs. library** — from scratch. `StackingCards.tsx` is ~90
      lines of engine and the whole thing is one rAF-throttled scroll listener
      writing one custom property. Framer Motion would have been ~40kB to do
      less than the browser's own `position: sticky` already does here.
- [x] **Nudge delay** — 24s / 60% scroll, whichever fires first. Both constants,
      plus the 8s auto-dismiss and the suppressed paths, are in the `NUDGE`
      object at the top of `ContactHub.tsx`.
- [x] **"Chat with AI" copy** — "Our AI assistant is almost ready. Until it is,
      these reach a real person — usually within the hour." Deliberately makes
      no claim about *when*; if Ryan can't answer within the hour, change that
      clause, because it's the only promise on the panel.
- [x] **Secondary stacking-card section** — `HowItWorks` only. `BundlesSection`
      stays a grid: packages are bought by side-by-side comparison, which a
      linear stack actively works against.
