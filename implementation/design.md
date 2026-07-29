# design.md — Rebrand to the new logo (blue + green)

**Status:** Planning document only. No code, tokens, or components have been
changed. This is the implementation plan for whoever picks it up next
(referred to below as "the implementer" — intended to be Claude Code running
inside Cursor).

**Scope:** Recolor the existing, already-built design system around the new
logo and reconcile the one real asset gap that blocks it (see §0). Layout,
routes, copy, content model, and component behavior are out of scope — this
is a palette + brand-mark change layered onto the site that already exists,
not a rebuild.

---

## 0. Read this first — the asset gap

The logo you pasted in chat (blue arc over the wordmark, green arc under it,
cartoon mascot in a green polo holding a pressure washer wand, white outline
stars) is **not the file currently in this repo.**

`public/logo.png` (and its `-256`/`-384`/`-512`/`.webp`/`.jpg` siblings) today
contain a *different* mark entirely: an orange-and-black industrial
gear-and-hose design with the tagline "It's not pressure. It's precision."
That's the logo `Logo.tsx`, `Header`, `Footer`, and `opengraph-image.tsx` all
currently render.

I don't have a file-system path to the image you pasted — it exists only in
this conversation, not on disk — so I can't place it in `/public` myself.

**This is the actual first task, and it blocks everything else in this
document:**

1. Export the new logo as a transparent-background PNG (the mascot currently
   has a lot of surrounding whitespace/bleed on the right — crop tight to the
   badge, or keep a version with the mascot bleeding out if that's the
   intended hero treatment, see §5).
2. Drop the master at `public/logo.png` (and a matching `logo.jpg` flattened
   fallback, matching today's convention).
3. Regenerate the three resized variants (`logo-256`, `logo-384`, `logo-512`,
   in both `.png` and `.webp`) from that new master — `Logo.tsx` already has
   the `sharp`-based resize convention documented inline; the same script
   just needs to point at the new source file.
4. Re-check the aspect ratio. `Logo.tsx` hardcodes `width={1024} height={392}`
   (a 2.61:1 wide lockup) and the `SIZES` constant assumes that ratio at every
   call site. The new artwork's oval lockup reads roughly similarly wide, but
   confirm the real exported ratio and update those two numbers together —
   they're the one place the ratio is asserted.
5. Update `public/icon.png` / `src/app/icon.png` (favicon) — at 32px the
   current favicon is presumably the old gear mark; at that size the new
   mascot won't read at all, so the favicon should almost certainly be a
   simplified badge (the star-and-arc frame alone, or a single letter mark),
   not the full illustration. Flagged as a design decision, not just a resize.
6. `opengraph-image.tsx` reads `public/logo.png` directly at build time
   (`readFile(join(process.cwd(), "public/logo.png"))`) — no code change
   needed there once the file is swapped, but the surrounding canvas color
   needs to change too (see §4.4).

Everything below assumes step 1–4 are done. Where I reference "the new logo,"
I mean the file that will exist at `public/logo.png` once this gap is closed.

---

## 1. What's actually being decided here

The current site (see `STRUCTURE.md` §10, `globals.css` `@theme`) already has
a deliberate, documented color strategy:

> Competitors in this trade are almost universally white-background +
> mid-blue. We invert it: deep marine navy (`ink`) carries the page, a bright
> hydro blue (`hydro`) does the brand work, and a single scarce orange
> (`signal`) is reserved *exclusively* for conversion actions — the highest-
> contrast pairing available, so the CTA never competes with the brand color.

The new logo has **no orange in it at all** — it's blue, green, black, and
white. So this isn't a coat of paint, it's a real decision: what replaces
`signal`, and does the "navy-dominant, invert the industry" strategy still
make sense next to a friendly cartoon mascot logo (as opposed to the old
industrial gear mark it was designed to sit on)?

I'm proceeding with a specific recommendation for each decision below so this
plan is buildable as-is, but three of them are genuine judgment calls I
couldn't get a live answer on (this session had no way to collect your
response mid-task). Each is called out as **OPEN QUESTION** where it appears,
with the default I'm building the rest of the plan around. If you want a
different answer, the fix is a one-paragraph edit to this file before the
implementer starts, not a redo of the analysis.

### OPEN QUESTION 1 — What color is the CTA button?

Today, `Button`'s `primary` variant (`bg-signal-400`, used for every "Get my
free quote" / "Free Quote" button — the single most important click target on
every page) is orange specifically *because* orange appears nowhere else on
the site. That scarcity is the whole mechanism: your eye finds the one orange
thing.

Three options, once orange is gone:

| Option | How it works | Tradeoff |
|---|---|---|
| **A — Warm accent stays, retuned (recommended default, used below)** | Keep a small, scarce warm color (amber/gold, see §3) exclusively for the primary CTA. Blue and green both become full brand-identity colors (header, footer, section backgrounds, icons, checkmarks) with no conversion-only role. | Preserves the site's existing, tested contrast strategy exactly — a warm color against an all-cool-tone brand. Costs one more color in the system; the new accent doesn't come from the logo itself, though this is extremely common (a blue/green logo with a distinct "book now" accent color is a standard, well-tested pattern in local-service sites). |
| **B — Green becomes the CTA color** | Blue stays the brand identity color; green (from the logo) becomes the exclusive conversion-action color, same governance rule the old orange had. | Fully logo-derived palette, nothing invented. Directly competes with the existing `mint` token, which the codebase already uses as a *different* semantic — "clean / verified" (checkmarks, credential badges, WhatsApp icon, guarantee ticks; see `Footer.tsx:95` and `:219`). Two different meanings for "green" on the same page is confusing unless the CTA green and the "clean" green are visibly distinct shades, which then makes it not-quite-the-CTA-scarcity-rule anymore. |
| **C — Blue becomes the CTA color** | Green covers identity/background/checkmarks; the logo's blue becomes the CTA color. | Blue is also the dominant *brand* color in this option (header accents, links, icons per `hover:text-hydro-700` etc. throughout `Header.tsx`), so a blue CTA sits on a blue-branded page — the lowest-contrast, least-scarce option of the three. Not recommended. |

**I'm building this document around Option A.** It's the option that changes
the least of what already works (the contrast/scarcity rule is proven on this
site already, just re-skinned), and it avoids the `mint` collision in Option
B. If you'd rather have Option B, swap `amber` for `leaf` wherever this doc
says "CTA" below — the token math and file list barely change.

### OPEN QUESTION 2 — Does the "navy-dominant, invert-the-industry" strategy still apply?

The current design deliberately makes navy the *dominant* surface, not white
— dark hero, dark footer, dark `CtaBand`/`GuaranteeBand` sections, "sand"
warm-neutral for the light alternating sections instead of plain white. That
strategy was built to differentiate from an industrial, function-first
competitor. The new logo is a friendly cartoon mascot on a plain white/
transparent background — a warmer, more approachable mark than the old gear
logo, and it's going to look most "at home" in a lighter, white/blue/green
UI, not sitting on a deep navy field.

**Recommended default (used below): keep the dark-dominant architecture.**
It's load-bearing across a lot of already-built, already-tested work —
`hydro-mesh`, `blueprint-grid`, the `Section tone="ink"` alternation rule,
motion/reveal timing tuned against it, the footer's "final conversion band,"
`GuaranteeBand`'s one `tone="hydro"` use. Re-deriving the whole visual
architecture around a light theme is a much bigger, riskier job than
recoloring the existing one, and nothing about "design around this logo"
requires abandoning it — the logo's white background doesn't mean the *site*
has to be white-dominant, plenty of brand marks sit on backgrounds unlike
their own canvas.

I'm flagging §8 (an appendix) with a sketch of the lighter alternative in case
you disagree — it's a bigger job and I didn't want to default into it
silently.

### OPEN QUESTION 3 — Tone/typography

The old logo's tagline ("It's not pressure. It's precision.") and the
existing display font choice (`Barlow Condensed` — "industrial, trade-
professional rather than corporate-generic," per `STRUCTURE.md` §10.3) were
picked to match a mechanical, technical-looking mark. The new logo is a
cartoon person with a friendly grin — a different personality.

**Recommended default (used below): color + logo only.** Keep
`Barlow Condensed`/`Inter`, keep the existing copy voice, don't touch
`Copywriting.md`. This is the smaller, lower-risk change, and typography/copy
tone is a separate decision that deserves its own pass rather than riding
along with a palette swap. Noted once here so it isn't lost — if a friendlier
display face or a warmer copy pass is wanted later, that's a follow-up
document, not a rewrite of this one.

---

## 2. Reading the logo's actual colors

I sampled the logo you pasted visually (I don't have a file to run a pixel
histogram against — see §0). For reference, here's the actual method for
getting exact values once the real source file exists, so the implementer
isn't guessing either:

```bash
python3 -c "
from PIL import Image
from collections import Counter
im = Image.open('public/logo.png').convert('RGBA')
c = Counter()
for x in range(0, im.width, 2):
    for y in range(0, im.height, 2):
        r, g, b, a = im.getpixel((x, y))
        if a < 200: continue
        if r > 235 and g > 235 and b > 235: continue          # skip white
        if abs(r-g) < 15 and abs(g-b) < 15: continue           # skip gray/black
        c[(r, g, b)] += 1
for color, count in c.most_common(20):
    print('#%02x%02x%02x' % color, count)
"
```

Run that against the real master once it's in `/public` and sanity-check it
against the token values in §3 — nudge the ramps if the real file reads
noticeably bluer/greener/warmer than what's below.

**Read from the image:** a clean, moderately saturated royal/cobalt blue for
the top arc and water-splash accents; a grass/kelly green for the bottom arc
and the mascot's polo shirt; black for both wordmark lines; white for the
outline stars; transparent background.

---

## 3. New color tokens

Same shape as the existing system (`globals.css` `@theme`, 50→900 ramps,
matching `ink`/`hydro`'s pattern) so this is a like-for-like swap, not a new
architecture.

### 3.1 Proposed `@theme` block

```css
@theme {
  /* Ink — unchanged. Deep marine navy stays the dominant dark surface;
     nothing about the new logo requires changing this family. */
  --color-ink-50: #eef4f9;
  --color-ink-100: #d3e2ef;
  --color-ink-200: #a3c0d8;
  --color-ink-300: #6b93b6;
  --color-ink-400: #3d6789;
  --color-ink-500: #234a67;
  --color-ink-600: #16334a;
  --color-ink-700: #0e2537;
  --color-ink-800: #0a1b28;
  --color-ink-900: #06131d;
  --color-ink-950: #030b12;

  /* Harbor — replaces `hydro`. Recalibrated to the logo's actual arc blue
     rather than the old placeholder hydro-blue. Same role: links, icons,
     eyebrows, secondary buttons, header accents. Rename kept deliberately
     close to the old name's *meaning* (water) while making clear it's been
     re-sourced from the real brand mark. */
  --color-harbor-50: #edf6fc;
  --color-harbor-100: #d3e7f8;
  --color-harbor-200: #9fcbef;
  --color-harbor-300: #61aae5;
  --color-harbor-400: #2489db;
  --color-harbor-500: #1e73b8;
  --color-harbor-600: #185d95;
  --color-harbor-700: #134a76;
  --color-harbor-800: #0f395c;
  --color-harbor-900: #0c2e4b;

  /* Leaf — new. The logo's grass/kelly green (bottom arc, mascot's polo).
     Takes over the site's "clean / verified" semantic that `mint` used to
     carry (checkmarks, credential badges, guarantee ticks, WhatsApp icon)
     AND becomes a full brand-identity color (alternating section tone,
     before/after divider). See §4 for the mint migration. */
  --color-leaf-50: #f0f9f0;
  --color-leaf-100: #daf1db;
  --color-leaf-200: #ade1af;
  --color-leaf-300: #79cd7c;
  --color-leaf-400: #45ba49;
  --color-leaf-500: #3a9c3d;
  --color-leaf-600: #2f7f31;
  --color-leaf-700: #256527;
  --color-leaf-800: #1d4e1f;
  --color-leaf-900: #173f19;

  /* Amber — replaces `signal`. CTA ONLY, same hard rule as the old orange:
     if it isn't a conversion action, it isn't this color. See Open Question
     1 — swap this block for the `leaf` values above if Option B is chosen
     instead. */
  --color-amber-50: #fef8ec;
  --color-amber-100: #fcecc8;
  --color-amber-200: #f9da96;
  --color-amber-300: #f8c563;
  --color-amber-400: #f6ae1e;
  --color-amber-500: #e0961a;
  --color-amber-600: #c17f16;
  --color-amber-700: #a06712;
  --color-amber-800: #82530f;
  --color-amber-900: #6b440d;

  /* Sand — unchanged. Warm neutral for alternating light sections. */
  --color-sand-50: #faf8f5;
  --color-sand-100: #f4f0e9;
  --color-sand-200: #e8e0d4;
  --color-sand-300: #d6c9b6;

  /* Typography, fluid sizes, radii, shadows, easing — all unchanged.
     Nothing about the rebrand touches these. */
}
```

**`mint` is retired**, folded into `leaf` (see §4.3 for exactly which call
sites move where). Don't keep both — two green families for slightly
different jobs is exactly the confusion Open Question 1 / Option B flags,
and `leaf` alone can carry every job `mint` did.

### 3.2 Contrast, checked against real math (not eyeballed)

The existing docs assert contrast facts about `signal`/`ink` (e.g. "signal-400
on ink-950 passes contrast; signal-400 on white does not") as a hard rule
implementers have to respect. Same treatment here, computed with the actual
WCAG relative-luminance formula against the hex values above:

| Pairing | Ratio | Passes AA (4.5:1 body / 3:1 large text)? |
|---|---|---|
| `harbor-600` text on white | 6.91:1 | ✅ body text |
| `harbor-700` text on white | 9.26:1 | ✅ body text |
| white text on `harbor-700` bg | 9.26:1 | ✅ body text |
| white text on `harbor-900` bg | 13.93:1 | ✅ body text |
| `leaf-600` text on white | 5.00:1 | ✅ body text (the floor — don't go lighter) |
| `leaf-700` text on white | 7.07:1 | ✅ body text, more margin |
| white text on `leaf-500` bg | 3.50:1 | ❌ body text, ⚠️ large text (18px+ bold) only |
| white text on `leaf-600` bg | 5.00:1 | ✅ body text — **use this as the floor for any solid green button/badge with white text** |
| white text on `leaf-700` bg | 7.07:1 | ✅ body text, more margin |
| `amber-400` on `ink-950` (button label reversed, i.e. `ink-950` text on `amber-400` fill) | 10.36:1 | ✅ — this is the actual `Button` `primary` pairing (dark text on the amber pill), not amber text on a page background |

**Hard rule carried forward from the old system:** the CTA color's contrast
is between the button's own fill and its own label — `ink-950` text on
`amber-400` fill — never between the accent color and whatever section
background the button happens to sit on. That's exactly how `Button.tsx`'s
`primary` variant already works (`bg-signal-400 text-ink-950`); nothing about
this changes, just the two hex values.

**One real constraint this surfaces:** if any component uses `leaf` as a
*solid button or badge fill* with white label text (as opposed to `leaf` used
for icons/checkmarks/borders against a light background), it must be
`leaf-600` or darker — `leaf-500` fails AA for normal-size text at 3.5:1.
Check this specifically wherever `mint-400`/`mint-500` are used as a filled
background today, not just as an icon color (icons/checks have no separate
foreground-contrast requirement in the same way, but verify each against
`WCAG non-text contrast, 3:1` if they're meaningful UI, not decorative).

---

## 4. Where these colors land — component by component

Grounded in what's actually in the repo today (`src/components/**`,
`src/app/globals.css`), not a generic rewrite. "Today" below cites the real
line; "New" is the token swap.

### 4.1 Global tokens & utilities (`src/app/globals.css`)

| Today | New | Notes |
|---|---|---|
| `@theme` `--color-hydro-*` | `--color-harbor-*` | §3.1 |
| `@theme` `--color-signal-*` | `--color-amber-*` | §3.1, Open Question 1 |
| `@theme` `--color-mint-*` | Retired → `--color-leaf-*` | §4.3 |
| `:focus-visible { outline-color: var(--color-hydro-400) }` (`globals.css:151`) | `--color-harbor-400` | Focus ring stays global, never removed |
| `::selection { background: var(--color-hydro-200) }` (`globals.css:157`) | `--color-harbor-200` | |
| `.hydro-mesh` radial gradients — `rgb(11 143 214 / .35)`, `rgb(63 224 191 / .16)` (`globals.css:191-196`) | Recompute both stops from `harbor-500`/`leaf-400` at the same alpha values | This is the signature dark-section texture (hero, footer band, mega-menu callout). Keep the *shape* (two blue-leaning radials + one accent), just resource the hex. |
| `.blueprint-grid` | Unchanged | Pure white-alpha lines, not color-dependent |
| `.img-placeholder` stripes — `rgb(11 143 214 / .07)` (`globals.css:211`) | `harbor-500` at the same alpha | |
| `.coverage-pin` hover/focus states — `var(--color-hydro-300)` stroke (`globals.css:246`) | `--color-harbor-300` | |

### 4.2 `Button.tsx` (§full file already read)

```
primary:   bg-signal-400 text-ink-950 hover:bg-signal-300 active:bg-signal-500
        → bg-amber-400  text-ink-950 hover:bg-amber-300  active:bg-amber-500

secondary: bg-hydro-600 text-white hover:bg-hydro-500 active:bg-hydro-700
        → bg-harbor-600 text-white hover:bg-harbor-500 active:bg-harbor-700

outline:   hover:border-hydro-400 hover:text-hydro-700
        → hover:border-harbor-400 hover:text-harbor-700

ghost:     text-hydro-700 hover:bg-hydro-50
        → text-harbor-700 hover:bg-harbor-50
```

`onDark` is white-on-transparent already — untouched. The `data-cta="primary"`
marker and the R2 rule ("never two primaries in one viewport," enforced live
by `Header.tsx`'s `IntersectionObserver`) don't change at all — they key off
the `variant`, not the color.

### 4.3 `mint` retirement — every call site, moved to `leaf`

Confirmed usages found via `grep -rn "mint-"`:

- `Footer.tsx:95` — WhatsApp icon color (`text-mint-400`) → `text-leaf-400`
- `Footer.tsx:219` — credential badge checkmark (`text-mint-400`) → `text-leaf-500` (verify against sand/white chip background — this one sits on `bg-white/5`, a near-black background, so `leaf-400` likely still reads fine; re-check once styled)
- `Header.tsx:98` — utility-bar "Licensed & insured" text (`text-mint-400`) → `text-leaf-400` (this is on the `bg-ink-900` utility bar — dark background, light green text, fine)
- `opengraph-image.tsx:57` — inline SVG checkmark stroke (`#3fe0bf`, the raw hex for old `mint-400`) → the equivalent `leaf-400` hex, `#45ba49`
- `BeforeAfterSlider.tsx`, `GuaranteeBand.tsx`, `Badge.tsx`, and any `tone="mint"`-style badge/checkmark call sites not enumerated above by line — the implementer should re-run `grep -rn "mint-" src` once the token exists and confirm every hit is covered; the intent is zero remaining `mint-*` references anywhere in `src/`.

### 4.4 Dark-section gradients (`opengraph-image.tsx`, `Header.tsx` mega-menu callout, `Footer.tsx`'s `hydro-mesh` band)

`opengraph-image.tsx:31-33` hardcodes the mesh gradient inline (it can't read
`globals.css`, since `next/og` renders in an isolated Satori runtime):

```
backgroundColor: "#06131d",                                          // = ink-900, unchanged
"radial-gradient(1000px 700px at 10% -10%, rgba(11,143,214,0.45), transparent)"   // hydro-500 → harbor-500: rgba(30,115,184,0.45)
"radial-gradient(800px 600px at 95% 10%, rgba(63,224,191,0.20), transparent)"     // mint-400 → leaf-400: rgba(69,186,73,0.20)
```

Same file's inline SVG checkmark (`stroke="#3fe0bf"`, line 57) → `#45ba49`
(`leaf-400`). The credential-row text color `#d3e2ef` (`ink-100`) and lede
color `#a3c0d8` (`ink-200`) are unchanged.

### 4.5 `Header.tsx`

- Utility bar icons (`text-hydro-400`, lines 89/93) → `text-harbor-400`
- Utility bar phone hover (`hover:text-hydro-300`, line 104) → `hover:text-harbor-300`
- Nav hover/active states (`hover:text-hydro-700`, `text-hydro-700`, lines 133/144/152/162/170/203/205) → `harbor-700`
- Service icons in mega-menu (`text-hydro-500`, lines 154/172) and mobile drawer (lines 303/320) → `text-harbor-500`
- Mega-menu callout box (`bg-ink-900 hydro-mesh`, line 179) → unchanged bg, mesh recolored per §4.4
- "Start free quote" link inside that callout (`text-signal-400 hover:text-signal-300`, line 186) → `text-amber-400 hover:text-amber-300` — this is a text link masquerading as the primary action inside a dark card, so it should track whatever §Open Question 1 lands on, same as `Button`'s primary
- `<Logo linked />` at line 126 — no code change once the asset is swapped (§0)

### 4.6 `Footer.tsx`

- "Final conversion band" (`bg-ink-900 hydro-mesh`, line 37) — mesh recolored per §4.4, `Button` primary/onDark already covered by §4.2
- Phone/email/address icons (`text-hydro-400`, lines 86/102/106) → `text-harbor-400`
- WhatsApp icon (`text-mint-400`, line 95) → `text-leaf-400` (§4.3)
- "All areas" link (`text-hydro-400 hover:text-hydro-300`, line 205) → `text-harbor-400 hover:text-harbor-300`
- Credential checkmarks (`text-mint-400`, line 219) → `text-leaf-500` (§4.3)
- `<Logo heightClass="h-11 sm:h-12" />` at line 68 — no code change (§0)

### 4.7 `GuaranteeBand.tsx` — the one `tone="hydro"` section on the site

`Section tone="hydro"` currently renders `bg-hydro-700 text-white`
(`Section.tsx:10`) — this is deliberately the *one* place the brand blue
becomes a full-bleed background rather than an accent, per the comment "the
only use of tone="hydro" on the site, which is what makes it land." Rename
the tone to `harbor` (or keep the tone key `hydro` as an internal name and
just repoint its class to `bg-harbor-700` — implementer's call, but if the
`Tone` type and prop name change, every `tone="hydro"` call site needs
updating, and there's only the one, so renaming cleanly is low-risk here).

The lede text (`text-hydro-50`, line 15) → `text-harbor-50`. The shield icon
stays white.

### 4.8 `Section.tsx` tone table

```
light: "bg-white text-ink-800"          → unchanged
sand:  "bg-sand-50 text-ink-800"        → unchanged
ink:   "bg-ink-900 text-ink-100 hydro-mesh"  → same classes, `hydro-mesh` recolored per §4.4 (rename the utility class too if you want the naming to stay honest — `hydro-mesh` → `brand-mesh` or similar; purely cosmetic, no visual difference either way)
hydro: "bg-hydro-700 text-white"        → "bg-harbor-700 text-white" (§4.7)
```

### 4.9 `CtaBand.tsx`

No direct color classes of its own — it's `Section tone="ink"` +
`className="blueprint-grid"` + `Button` (primary/onDark). Fully covered by
§4.2 and §4.8; no additional edits needed here beyond those two files
propagating correctly.

### 4.10 Everything else referencing `hydro-`/`signal-`/`mint-`

The full list of files touching these tokens (55 files beyond the ones
detailed above — every section component, every `ui/` primitive, every page
under `src/app/`) is mechanical once the token names exist: it's a
find-and-replace of `hydro-` → `harbor-`, `signal-` → `amber-`, `mint-` →
`leaf-` across `src/`, *then* a manual pass to catch the handful of spots
(cited above) that need a shade adjustment rather than a straight rename —
specifically anywhere `mint`/`leaf` ends up as a solid fill with white text
(§3.2's `leaf-600` floor) and the two inline-hex spots in
`opengraph-image.tsx` that can't pick up a Tailwind class at all.

**Practical order for the implementer:**

1. Add the new `@theme` tokens alongside the old ones (don't delete `hydro`/
   `signal`/`mint` yet).
2. Global find-and-replace `hydro-` → `harbor-`, `signal-` → `amber-`,
   `mint-` → `leaf-` across `src/**/*.tsx` and `src/app/globals.css`.
3. Delete the now-unused `--color-hydro-*`, `--color-signal-*`,
   `--color-mint-*` blocks from `@theme`.
4. Manually fix the two inline-hex spots in `opengraph-image.tsx` (§4.4) —
   these won't be caught by the rename since they're raw hex, not class names.
5. Manually re-check every solid-fill usage of `leaf`/`amber` against §3.2's
   contrast floors — the rename doesn't know which shade a given call site
   needs.
6. `npx tsc --noEmit` (should be untouched by a pure class-name/CSS change,
   but it's the project's own gate — see `STRUCTURE.md` §15) and a visual pass
   through the pages listed in §5 below.

---

## 5. Logo placement & sizing

Once the real asset exists (§0), a few placement notes specific to *this*
logo's shape (a wide oval badge with a mascot bleeding out past the right
edge, versus the old logo's tighter rectangular lockup):

- **Header (`Header.tsx:126`)** and **footer (`Footer.tsx:68`)** use the
  height-constrained lockup (`h-10`/`h-11`/`h-12`) — this is where the tight-
  cropped badge version belongs (§0 step 1), not the version with the mascot
  bleeding past the frame, or the mascot will get clipped at those heights.
- **`/about`** (per `STRUCTURE.md` §8.6: "story, team, credentials, equipment
  and method") is the natural home for the *full* illustrated version with
  the mascot bleeding out, at a much larger size than the header ever uses it
  — this is closer to what the artwork is actually drawn for.
- **Favicon (`src/app/icon.png`, `public/icon.png`)** needs its own
  simplified mark, not a downscale of the full lockup (§0 step 5).
- **`opengraph-image.tsx`** — currently places the logo at `width={760}
  height={290}` top-left on the mesh canvas (`objectFit: "contain"`). Same
  treatment works with the new file; just confirm the new aspect ratio
  doesn't leave awkward empty space at that fixed box size once the real
  ratio is known (§0 step 4).

---

## 6. Documentation debt

Two docs describe the *current* palette as settled fact and will be wrong the
moment §3 ships:

- **`STRUCTURE.md` §10.2–10.3** — the whole "ink/hydro/signal/mint/sand,
  orange-is-the-inversion" narrative needs a rewrite once the new tokens land,
  not just the token table. This document (`design.md`) can mostly replace
  that section once implemented — worth linking the two rather than
  maintaining the rationale twice.
- **`SECTIONS.md`** — wasn't re-read in full for this plan (it's the
  component-anatomy spec, not the token spec), but it near-certainly
  references `hydro`/`signal`/`mint` by name in describing individual
  sections' visual treatment. Grep it for the same three token names once
  the rename lands and update inline.

---

## 7. What this plan deliberately does *not* touch

- Route structure, content model (`src/content/*.ts`), copy, or the
  `PLACEHOLDER` business-data gaps tracked in `STRUCTURE.md` §4/§13 — none of
  that is a color or logo concern.
- `QuoteWizard`, `Estimator`, `ContactForm` logic — recolor their buttons via
  §4.2, don't touch their behavior.
- Motion/reveal timing, `StackingCards`, `Reveal` — untouched; they're
  transform/opacity mechanics, not color.
- The seasonal-campaign system, bundles/packages content, service-area matrix
  — all content-layer, unaffected by this rebrand.
- Typography and copy tone (Open Question 3's default).

---

## 8. Appendix — the lighter alternative (not the recommended path)

Flagged in Open Question 2, sketched here in case you want it instead of the
"keep navy-dominant" default this document is built around:

Since the new logo is a light-background, friendly mark, an alternative
system would make **white the dominant surface** (like the reference
competitor site `STRUCTURE.md` §5 describes and the current site deliberately
inverts away from), with `harbor` blue and `leaf` green as section-tone
accents instead of navy, and `ink` demoted to text-color-only duty. This
would touch every `Section tone="ink"` call site's *treatment* (not just its
color), `hydro-mesh`/`blueprint-grid` (both built as dark-background
textures — they'd need a from-scratch light-mode equivalent, not a recolor),
and probably the hero's whole visual weight. It's a substantially bigger job
than §1–§7 above, and would need its own pass through `SECTIONS.md`'s per-
breakpoint specs. Not recommending it as the default because "match the
logo's palette" doesn't require "match the logo's background," but noting it
because it's a real, defensible alternative reading of "design around this
logo."
