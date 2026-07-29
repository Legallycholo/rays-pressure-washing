# Copywriting Implementation Plan
## Voice, claims, and line-level copy for ryan-pressure-washing

This is a companion to the docs already in the repo (`STRUCTURE.md`, `SECTIONS.md`, `CHECKLIST.md`, `improvement.md`), not a replacement. Those own the architecture, the route map, and the build sequence. This file owns one thing: the actual words, and whether they sound like a real person or a template. Read the four existing docs first if you haven't, this file assumes their context.

Give this to Claude Code (Opus 5) in Cursor as the prompt for a copywriting pass against the real files in this repo.

---

## 0. Instructions for Claude Code

- Do not restructure pages, components, or routes. That work is done and documented in `STRUCTURE.md` / `SECTIONS.md`. This pass touches copy only: strings in `src/content/*.ts`, JSX text in `src/components/**/*.tsx`, and page metadata in `src/app/**/page.tsx`.
- Never use an em dash (—) in any user-facing string. See Section 5 for the audit method and Section 6 for how to fix each one, since a blind find-and-replace will produce broken sentences.
- Do not invent business facts. Every `PLACEHOLDER` comment in `site.ts` and every open item in `improvement.md` → "Real business data received" is a real gap, not something to fill with a guess.
- Do not touch `testimonials.ts` content beyond what's specified in Section 9. Those are explicitly fabricated placeholders per the repo's own warning, and the fix is real reviews, not better fake ones.
- Work through Sections 6 through 10 in order. Check each against Section 10's checklist before moving on.

---

## 1. What's already real vs. still placeholder

Pulled directly from `src/content/site.ts` and `improvement.md`, so this plan isn't guessing at what's confirmed:

**Real:**
- Phone: (803) 368-3600, live and propagating through nav, footer, tel: links, schema
- Email: rayswindows81@gmail.com
- Guarantee concept exists and is named: "The Spotless Guarantee"
- Site name in code: "Ray's Window Cleaning & Pressure Washing"

**Still placeholder (do not write copy that depends on these as if they're confirmed):**
- Street address, city, postal code, lat/lng
- Service region (currently "Central Florida" as a placeholder string)
- `locations.ts` — every city in it is invented
- Founded year, years-in-business claim
- Rating value and review count
- All four `site.credentials` claims (licensed, insured, $2M coverage, background-checked)
- All social links
- Every testimonial

**A flagged inconsistency worth resolving before writing more copy:** the phone area code (803) is South Carolina, not Florida. That's either a typo, a forwarded number, or a sign the "Central Florida" service region itself needs rechecking. Worth confirming which before it goes further into copy across a couple dozen location pages.

---

## 2. The guarantee: two versions that need to be reconciled

`site.ts` already defines a guarantee:

> **The Spotless Guarantee.** If you can still see it after we leave, we come back and clean it again. No argument, no invoice, no expiry.

Your Yvonne review example is a different promise:

> "We have a 100% money back guarantee even with misunderstandings on pricing."

A free re-clean and a refund are not the same guarantee. Both are legitimate differentiators, but shipping both without reconciling them reads as either confused or as overpromising, and `STRUCTURE.md` §4 already flags that guarantee language carries legal weight, not just tone.

This needs a decision, not a copywriting workaround:

- [ ] Is it one guarantee with two remedies (we re-clean first, refund if that's not enough)?
- [ ] Are these two separate promises (a quality guarantee and a pricing-honesty guarantee)?
- [ ] Does "Spotless Guarantee" stay as the umbrella name either way, since `GuaranteeBand` and `site.ts` already build around that name?

Until this is confirmed, `GuaranteeBand`'s copy should stay as-is (the re-clean promise), since it's already live and coherent. Don't add money-back language to it on a guess.

---

## 3. Naming and identity

`improvement.md` already caught this and left it open: the email (`rayswindows81@gmail.com`) suggests "Ray's," the repo is named `ryan-pressure-washing`, and the business, per that same note, may have windows as the primary trade rather than one of eleven services.

Your review example supports that read. In it, window cleaning is billed first and priced higher than the porch work ($204 vs. $60), and it's specifically window customers the guarantee language is aimed at in that quote.

This changes real copy decisions, not just a name:

- [ ] Confirm the business name and how it's said out loud (Ryan's vs. Ray's vs. legal name)
- [ ] Confirm whether window cleaning should lead the services grid and homepage hero, ahead of house washing (which is currently `featured: true` in `services.ts`), or whether they should carry equal weight
- [ ] If windows lead, the hero headline and the trust bar should say so. Right now nothing in the code signals which of the eleven services is the flagship.

---

## 4. Brand voice

Kept from the original brief, and it happens to already match the tone `GuaranteeBand.tsx`'s own code comment aims for ("no fine print here, by rule"). The voice work is bringing the rest of the copy up to that same bar, not inventing a new one.

Grounded in the Yvonne example:

- **Direct and specific.** Real numbers over vague claims. "$204 for the windows" beats "affordable pricing" every time.
- **Accountable.** Written like someone who answers for their own work personally, not a brand voice.
- **Confident without hype.** No exclamation stacking, no "WOW your neighbors." The confidence comes from specifics, not enthusiasm.
- **Plainspoken.** Contractions are fine. Short sentences carry this tone better than long ones.

---

## 5. Non-negotiable style rules

- No em dashes, anywhere, in any user-facing string.
- En dashes (–) used for genuine ranges are fine and not part of this rule ("2–4 hours," "Monday – Friday"). Don't touch those.
- No banned phrases: "look no further," "elevate your," "unlock," "unparalleled," "seamless," "game-changer," "when it comes to," "boasts," "whether you're X or Y," "at the end of the day," "cutting-edge," "in today's world."
- No superlative without a number behind it. "Top-rated" needs an actual rating attached nearby, not asserted alone.
- Every claim has to be something the business can stand behind if a customer asks about it directly. This matters more here than usual, since `STRUCTURE.md` §4 already flags `site.credentials` and pricing language as carrying legal weight.

---

## 6. The em dash audit

339 em dashes currently exist across 70+ files in `src/`. Most are in `src/content/*.ts` (the actual copy) and in JSX text inside `src/components/**/*.tsx`. A smaller number are in code comments and JSDoc explaining the implementation to developers, not shown to a site visitor.

Priority order:

1. **`src/content/*.ts`** — every field a page renders (blurb, intro, quote, body, title). Highest priority, this is copy a visitor reads.
2. **JSX text inside `src/components/**/*.tsx`** — same priority, some sections have hardcoded strings alongside content-file data (confirmed example: `HowItWorks.tsx`'s default step copy has one in the "We clean" step body).
3. **`src/app/**/page.tsx`** metadata (titles, descriptions) — these are user-facing (search results, tab titles), same priority.
4. **Code comments and JSDoc** — lower priority. Not shown on the site. Clean up as a nice-to-have, don't burn the pass on these first.

Audit command (Python, since grep's Unicode handling is unreliable for this character):

```python
import os
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, encoding='utf-8') as fh:
                content = fh.read()
            if '—' in content:
                print(p, content.count('—'))
```

How to fix each one, since a find-and-replace to a period will break plenty of these:

- Interrupting clause ("X — the biggest lever — Y") → usually becomes a comma pair or a parenthetical
- Two independent clauses joined ("It didn't. It needed washing" style) → a period, new sentence
- A list-style aside → usually a colon
- Read each instance in context. Don't batch-replace blindly.

---

## 7. Where "call, submit the form, and know what happens next" already lives

This isn't a new section to design, the funnel already exists. The copy pass is auditing and tightening what's there, not building new structure:

- **Hero** (`src/components/sections/Hero.tsx`) — primary and secondary CTA buttons, already dual-CTA (call + something else depending on `variant`). Check the button labels read as equal-weight, not one primary and one afterthought.
- **StickyCallBar / ContactHub** (`src/components/ContactHub.tsx`) — 19 em dashes currently, worth a full copy read-through, not just a dash swap.
- **`/quote` — `QuoteWizard.tsx`** — the actual form flow. This is where "submit the form and follow the process" lives mechanically. Confirm each step's copy is as direct as the guarantee voice, not generic form-field labeling.
- **`HowItWorks.tsx`** — the four-step "quote to clean" sequence. This is the clearest existing answer to "what happens after you reach out." It's good copy already (specific: "Four questions online, or one phone call. Same-day in most cases.") and just needs the one em dash fixed in step three.

---

## 8. Pressure washing and window cleaning inside an eleven-service catalog

The original brief assumed a two-service site. The real catalog (`services.ts`) has eleven: house washing, roof cleaning, driveway/concrete, deck/patio, fence cleaning, gutter cleaning, window cleaning, pool deck, plus three commercial services. Pressure washing isn't one service here, it's a method used across most of the residential list; window cleaning is the one service that doesn't fit that method.

Given Section 3's open question about whether windows lead:

- If windows lead: window cleaning's `blurb` and `intro` in `services.ts` should read with the same weight as `house-washing` (currently the only one marked `featured: true`), and the homepage services grid order should reflect it.
- If it's equal billing across the board: no reordering needed, just make sure window cleaning's existing copy is as strong as the pressure-washing services' copy, not thinner.
- Either way, don't write copy that implies this is a two-service business. It isn't, and burying the other nine services under a "we also do pressure washing and windows" framing would undersell what's actually on offer.

---

## 9. Testimonials: replacing the placeholders

`testimonials.ts` already carries its own warning: every entry is fabricated and publishing them live is an FTC violation, not just weak copy. That's not new work this plan is creating, it's a pre-existing blocker in the repo.

What this plan adds: the Yvonne review is a strong candidate for a real, permission-cleared testimonial once it's confirmed usable (posted publicly by the customer, or the business has the right to quote it). It's also the best available reference for what a genuine review sounds like in this business's actual voice, versus the placeholder quotes currently in the file, which read more like generic marketing copy than something a real customer wrote.

- [ ] Confirm whether the Yvonne review (or the underlying interaction) can be used as a testimonial, and get the customer's permission if it's going on the site as a quote
- [ ] Collect additional real reviews before launch, `testimonials.ts` cannot ship with invented ones per the repo's own Phase 13 gate

---

## 10. Execution checklist

- [ ] Read `STRUCTURE.md`, `SECTIONS.md`, and this file before touching any copy
- [ ] Section 2 (guarantee) and Section 3 (naming) decisions confirmed before writing hero, trust bar, or guarantee copy that depends on them
- [ ] Em dash audit run, results triaged by the priority order in Section 6
- [ ] All `src/content/*.ts` em dashes fixed, read in context, not batch-replaced
- [ ] All JSX-embedded em dashes fixed, including the confirmed one in `HowItWorks.tsx`
- [ ] Page metadata (`src/app/**/page.tsx`) checked for em dashes
- [ ] Hero, ContactHub, and QuoteWizard copy read through for voice consistency, not just dash removal
- [ ] Services copy checked against Section 8's leads-vs-equal decision
- [ ] No new claims added to `site.credentials` or pricing without a real source
- [ ] `testimonials.ts` left untouched except as scoped in Section 9
- [ ] Full pass checked against the banned phrase list in Section 5
- [ ] Read-aloud pass on every section that changed

---

## 11. Outstanding decisions needed from Geni

- [ ] Guarantee: one guarantee with two remedies, or two separate promises? (Section 2)
- [ ] Business name as it should read and be said: Ryan's, Ray's, or the full legal name? (Section 3)
- [ ] Does window cleaning lead the services hierarchy, or is it equal billing with the other ten? (Section 3, Section 8)
- [ ] Real street address and service area city list (currently 100% placeholder, blocks `locations.ts` and 40+ generated location pages)
- [ ] Confirm the (803) area code is correct for a Florida business, or whether it needs updating
- [ ] Permission to use the Yvonne review, plus any other real reviews available, to start replacing `testimonials.ts`
