# Google Business Profile — Services List

Working document for the GBP "Services" section, per the local SEO workflow doc
(the *New Local SEO Client Workflow* Google Doc).

**This is not website content.** Nothing here renders on the site. It exists to
be pasted into the Google Business Profile, which is a separate system that has
to be edited by hand while signed in as the business.

---

## How this list was produced — read this first

The workflow doc's method is: pull the services lists off the top 10 competitors
in the local pack, paste them into an AI, dedupe, prune.

**I could not do the pulling step.** The environment I run in has no access to
Google, so I could not open the local pack for "pressure washing Lexington SC"
and read competitors' actual service lists. This list is therefore built from
the standard service vocabulary of the pressure washing / gutter cleaning /
window cleaning trades, cross-checked against what Ray's site already says the
business does.

Two consequences worth being clear about:

1. **It is not competitor-derived**, so it may miss a locally-popular term a
   real Lexington competitor uses. Running the doc's scrape step later, and
   adding anything this list missed, is still worth doing.
2. **Every ✅ item is safe to add. Every ⚠️ item must be confirmed with Ray
   before it goes near the profile.** A service listed on a GBP is a service the
   business is publicly claiming to sell, and one that has to be turned down on
   the phone costs more than it earns.

### What is deliberately NOT in this list

**Nothing roof-related except debris removal.** No roof cleaning, no roof soft
washing, no shingle treatment, no roof stain removal. This is a standing rule of
the business, stated in `content/services.ts` and in the answer-engine notes in
`app/llms.txt/route.ts`. Roof cleaning is one of the highest-volume search terms
in this trade and it will be tempting to add it — don't, unless the business has
actually changed what it sells.

---

## Confirmed profile state — recon, 1 Aug 2026

Run via Claude in Chrome (Prompt 1 in `GBP_CHROME_PROMPTS.md`), read-only.

**Categories are exactly as assumed**, which validates the whole structure in
`content/service-categories.ts`:

- Primary: **Pressure washing service**
- Secondary: **Gutter cleaning service**, **Window cleaning service**

**Services currently on the profile: 22 entries, 18 unique.** The 18 are
precisely the 18 sub-services in `content/service-categories.ts` — the site and
the profile already mirror each other, which is what the whole GBP-alignment
pass was for.

Four entries are the *same service cross-listed under several categories*
("Gutter cleaning" appears under all three; "Power/pressure washing" under all
three). That is not an error to fix — it is how a service gets attributed to
more than one category — but it means the raw count of 22 overstates coverage.

**18 unique against a top-20 average of roughly 30** (per the workflow doc) is
below par, which is exactly the gap the 88-service list closes.

Other findings worth acting on:

| Finding | Action |
|---|---|
| **Booking link → `www.rayspropertywash.com`** | See the domain note below. This is the important one. |
| No cover photo set | Easy profile-completeness win. Set one. |
| Red notification dot on the listing | Open it — Google has a pending suggested edit. Review before it auto-applies. |
| 18 photos, most recent today | Healthy. Keep the weekly cadence. |
| Opening date Feb 11 2009 | Established business — good trust signal, leave it. |
| Attributes empty (Accessibility, Amenities, Crowd, Parking, Planning) | **Deliberately skip.** The workflow doc's own GMB Everywhere data shows most top-10 profiles have zero attributes, i.e. near-zero correlation with ranking. Not worth the time. |

### ⚠️ The domain question this raises

The profile's booking link points at **`www.rayspropertywash.com`**, and
`app/api/leads/route.ts` already refers to `rayspropertywash.com` as Ray's
domain. Meanwhile `site.url` falls back to `ryan-pressure-washing.vercel.app`
because `NEXT_PUBLIC_SITE_URL` is unset.

So every canonical, every sitemap URL and every schema `@id` this site emits
currently points at a Vercel preview domain rather than the business's real one.
**Nothing else in the SEO workflow matters until that is resolved**, because
Google is being told the site lives somewhere it doesn't.

What needs deciding, by a human who knows the setup:

1. Is `rayspropertywash.com` where this Next.js site will live, or is there an
   older site there now that this one replaces?
2. Once that's settled: point the domain at this Vercel project and set
   `NEXT_PUBLIC_SITE_URL` to the canonical form (with or without `www`, picking
   one and redirecting the other).

No code change is needed for any of it — `site.url` reads the env var already.

### Note on near-duplicates when adding the list below

The profile currently uses two *combined* entries that this list splits apart:

- "Driveway & sidewalk cleaning" → we list `Driveway Cleaning` + `Sidewalk Cleaning`
- "Patio & deck cleaning" → we list `Patio Cleaning` + `Deck Cleaning`

These won't be detected as duplicates, so you'll end up with both forms. That is
fine and mildly useful — each variant is its own longtail target — and the
standing rule against deleting existing services applies. Leave all of them.

---

## The list — 96 services

Grouped by the GBP category each belongs under. If the profile has one category,
they all go under it; with three, add each group to its matching category.

Legend: ✅ = matches what the site already claims · ⚠️ = **confirm with Ray**

### Pressure washing service (primary) — 57

| # | Service | |
|---|---|---|
| 1 | Pressure Washing | ✅ |
| 2 | Power Washing | ✅ |
| 3 | Soft Wash Cleaning | ✅ |
| 4 | Soft Washing | ✅ |
| 5 | House Washing | ✅ |
| 6 | Exterior House Cleaning | ✅ |
| 7 | Vinyl Siding Cleaning | ✅ |
| 8 | Brick Cleaning | ✅ |
| 9 | Stucco Cleaning | ✅ |
| 10 | Hardie Board Cleaning | ✅ |
| 11 | Wood Siding Cleaning | ✅ |
| 12 | Aluminum Siding Cleaning | ✅ |
| 13 | Soffit and Fascia Cleaning | ✅ |
| 14 | Shutter Cleaning | ✅ |
| 15 | Garage Door Cleaning | ✅ |
| 16 | Driveway Cleaning | ✅ |
| 17 | Driveway Pressure Washing | ✅ |
| 18 | Sidewalk Cleaning | ✅ |
| 19 | Walkway Cleaning | ✅ |
| 20 | Concrete Cleaning | ✅ |
| 21 | Concrete Pressure Washing | ✅ |
| 22 | Patio Cleaning | ✅ |
| 23 | Deck Cleaning | ✅ |
| 24 | Wood Deck Cleaning | ✅ |
| 25 | Composite Deck Cleaning | ✅ |
| 26 | Porch Cleaning | ✅ |
| 27 | Screened Porch Cleaning | ✅ |
| 28 | Fence Cleaning | ✅ |
| 29 | Wood Fence Cleaning | ✅ |
| 30 | Vinyl Fence Cleaning | ✅ |
| 31 | Paver Cleaning | ✅ |
| 32 | Brick Paver Cleaning | ✅ |
| 33 | Stone Cleaning | ✅ |
| 34 | Masonry Cleaning | ✅ |
| 35 | Retaining Wall Cleaning | ✅ |
| 36 | Pool Deck Cleaning | ✅ |
| 37 | Pool Enclosure Cleaning | ✅ |
| 38 | Screen Enclosure Cleaning | ✅ |
| 39 | Outdoor Furniture Cleaning | ✅ |
| 40 | Algae Removal | ✅ |
| 41 | Mold Removal | ✅ |
| 42 | Mildew Removal | ✅ |
| 43 | Moss Removal | ✅ |
| 44 | Black Streak Removal | ✅ |
| 45 | Pollen Removal | ✅ |
| 46 | Red Clay Stain Removal | ✅ |
| 47 | Rust Removal | ✅ |
| 48 | Rust Stain Removal | ✅ |
| 49 | Oil Stain Removal | ✅ |
| 50 | Efflorescence Removal | ✅ |
| 51 | Commercial Pressure Washing | ✅ |
| 52 | Storefront Cleaning | ✅ |
| 53 | Commercial Building Washing | ✅ |
| 54 | Concrete Sealing | ⚠️ |
| 55 | Paver Sealing | ⚠️ |
| 56 | Deck Staining or Sealing | ⚠️ |
| 57 | Graffiti Removal | ⚠️ |

### Gutter cleaning service — 13

| # | Service | |
|---|---|---|
| 58 | Gutter Cleaning | ✅ |
| 59 | Gutter Washing | ✅ |
| 60 | Gutter Brightening | ✅ |
| 61 | Gutter Whitening | ✅ |
| 62 | Gutter Face Cleaning | ✅ |
| 63 | Gutter Debris Removal | ✅ |
| 64 | Downspout Cleaning | ✅ |
| 65 | Downspout Flushing | ✅ |
| 66 | Gutter Flow Testing | ✅ |
| 67 | Gutter Guard Cleaning | ✅ |
| 68 | Leaf Removal | ✅ |
| 69 | Roof Debris Removal | ✅ |
| 70 | Gutter Guard Installation | ⚠️ |

### Window cleaning service — 26

| # | Service | |
|---|---|---|
| 71 | Window Cleaning | ✅ |
| 72 | Window Washing | ✅ |
| 73 | Residential Window Cleaning | ✅ |
| 74 | Commercial Window Cleaning | ✅ |
| 75 | Exterior Window Cleaning | ✅ |
| 76 | Interior Window Cleaning | ✅ |
| 77 | Storefront Window Cleaning | ✅ |
| 78 | Pure Water Window Cleaning | ✅ |
| 79 | Streak-Free Window Cleaning | ✅ |
| 80 | High Window Cleaning | ✅ |
| 81 | Second Story Window Cleaning | ✅ |
| 82 | Window Screen Cleaning | ✅ |
| 83 | Screen Cleaning | ✅ |
| 84 | Window Track Cleaning | ✅ |
| 85 | Window Sill Cleaning | ✅ |
| 86 | Window Frame Cleaning | ✅ |
| 87 | Skylight Cleaning | ✅ |
| 88 | Glass Door Cleaning | ✅ |
| 89 | Sliding Glass Door Cleaning | ✅ |
| 90 | French Pane Cleaning | ✅ |
| 91 | Storm Window Cleaning | ✅ |
| 92 | Hard Water Stain Removal | ✅ |
| 93 | Mineral Deposit Removal | ✅ |
| 94 | Glass Restoration | ⚠️ |
| 95 | Post-Construction Window Cleaning | ⚠️ |
| 96 | Solar Panel Cleaning | ⚠️ |

**96 of the 99 maximum**, leaving three slots for anything the competitor scrape
turns up later.

---

## The ⚠️ list — email to send Ray

Copy this, fill in the greeting, send. It follows the workflow doc's pattern of
asking which services the client does **not** do, which gets a faster answer
than asking them to confirm ninety-six.

> Hi Ray,
>
> I'm filling out the Services section of your Google Business Profile — it's one
> of the bigger ranking factors and yours is thin right now.
>
> Most of the list is straight off what's already on your site. But there are a
> few I want to check before I put them up, because once they're on the profile
> you're publicly offering them. Can you tell me which of these you **don't** do?
>
> - Concrete sealing
> - Paver sealing
> - Deck staining or sealing
> - Graffiti removal
> - Gutter guard installation
> - Glass restoration (removing hard water damage that's etched into the glass)
> - Post-construction window cleaning
> - Solar panel cleaning
>
> Also — I've deliberately left roof cleaning, roof soft washing and shingle
> treatment off entirely, since the site says you don't do those. Roof cleaning
> gets searched a lot around here, so tell me if that's changed.
>
> One more: I've listed "roof debris removal", meaning clearing leaves and grit
> off the roof when you're doing the gutters. Let me know if that's not something
> you do.
>
> Thanks

---

## Descriptions for the top 20

The GBP allows a description per service, **300 characters max**. The workflow
doc notes almost nobody fills these in, which is exactly why it is worth doing.

All are under 300 characters. None quotes a price — the business does not
publish figures, and a description is published data.

| # | Service | Description |
|---|---|---|
| 1 | Pressure Washing | Exterior cleaning across the SC Midlands, with the method chosen per surface. Pressure where the material can take it, soft washing where it can't. Licensed and insured, locally owned, and backed by the Spotless Guarantee: if you can still see it after we leave, we come back. |
| 2 | House Washing | A low-pressure soft wash that lifts algae, mildew and mineral film off siding, brick and stucco without forcing water behind it. Siding, soffits, fascia, gutter faces, frames and sills all in one visit. The green comes off; the house doesn't. |
| 3 | Soft Wash Cleaning | Low pressure and the right chemistry for siding, stucco, painted surfaces and anything a pressure wand would damage. It kills organic growth at the root rather than blasting the top layer off, so it stays clean far longer than a pressure wash. |
| 4 | Driveway Cleaning | A rotating surface cleaner lifts years of grey out of concrete evenly across the whole slab, then we hand-detail the edges and expansion joints. No wand stripes and no zebra marks to look at every time you pull in. |
| 5 | Concrete Cleaning | Driveways, walkways, patios and entry paths cleaned with a surface cleaner for an even result, plus pre-treatment on oil and rust spots. Edges and joints finished by hand, because that's where a rushed job always shows. |
| 6 | Sidewalk Cleaning | Walkways and entry paths brought back to an even colour, with the edges and joints hand-detailed. The approach to your front door is the first thing anyone sees and the first thing to go grey. |
| 7 | Deck Cleaning | Wood, composite and stone each get their own pressure and chemistry, so boards come back clean rather than furred, etched or stripped. Railings, steps and balusters included, and we move the furniture and put it back. |
| 8 | Patio Cleaning | Pavers, stone, brick and concrete cleaned at a setting the material can take, with moss cleared out of the joints. Joints re-sanded on request. Furniture moved and replaced as part of the job. |
| 9 | Fence Cleaning | Vinyl, wood or aluminium, cleaned on both faces from the top rail down to the green line at the base. Gates, hardware and post caps included, and we don't skip the side your neighbour looks at. |
| 10 | Gutter Cleaning | Debris removed by hand rather than blown into your flowerbeds, then every downspout flushed and flow-tested so water actually moves away from the foundation. You get before-and-after photos of every run. |
| 11 | Gutter Brightening | The black vertical tiger-striping down the outward face of a gutter is oxidation, and ordinary washing leaves it behind. This is the treatment that lifts it, so the gutters match the house again. |
| 12 | Downspout Cleaning | The blockage is usually in the elbow rather than the trough. We clear and flush each downspout and confirm flow, so rain leaves the roof and the foundation instead of spilling over the front edge. |
| 13 | Window Cleaning | Deionized pure water means the glass dries clear on its own with nothing left behind to squeegee or towel off. Second-storey panes reached from the ground, so no ladders in your flowerbeds. Frames, sills and screens included. |
| 14 | Window Washing | Exterior glass, frames and sills cleaned with a pure-water pole system that leaves no detergent residue and dries spot-free. Cobwebs cleared from every corner, screens removed, rinsed and refitted in the same visit. |
| 15 | Screen Cleaning | Screens are removed, washed, dried and refitted in the opening they came from. Clean glass behind a grey screen still reads as dirty, which is why this is part of a window clean rather than an upsell. |
| 16 | Commercial Pressure Washing | Facades, entryways and walkways for local businesses, with the method matched to your cladding. Scheduled early, late or at the weekend so nobody steps over a hose to get through your door. Certificate of insurance on request. |
| 17 | Commercial Window Cleaning | Storefront and low-rise glass on a monthly or quarterly round, cleaned from the ground with pure water so no ladder ever blocks your entrance. No contract required — recurring visits only for as long as you want them. |
| 18 | Storefront Cleaning | The twenty feet a customer sees before they decide: entry glass, frames, door hardware and the sidewalk out front. Gum and grease spot-treated at the threshold, where the traffic path always goes grey first. |
| 19 | Pool Deck Cleaning | Deck, coping and screen enclosure cleaned as one job, because cleaning the deck alone means the spores overhead reseed it inside a season. Pool covered and protected throughout. |
| 20 | Rust Removal | Irrigation rust, fertilizer stains and battery marks on concrete and masonry, treated with chemistry rather than pressure. Most lift out completely; some only lighten, and we tell you which before we start rather than after. |

---

## Doing the data entry

The workflow doc is blunt that this part is tedious, and it is: ninety-six
services plus twenty descriptions, pasted one at a time into the profile.

Two things make it less painful:

- **Claude in Chrome** can drive the browser while you are signed in to the
  Business Profile and do the repetitive add-and-paste. That is the single
  biggest time saver available for this step.
- **Do the top 20 with descriptions first.** If you run out of patience, the
  twenty that carry a description are the twenty that matter most, and the
  remaining seventy-six can go in over a couple of sittings.

---

## Afterwards

- Re-run the Leadsnap heatmap two to three weeks after the profile is complete,
  so the benchmark taken at the start has something to compare against.
- If the competitor scrape from the workflow doc turns up terms this list
  missed, add them — there are three free slots.
- Anything Ray confirms he does that isn't here, add it to this file too, so this
  document stays the record of what the profile claims.
