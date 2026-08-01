# Claude in Chrome — prompts for the Google Business Profile

Copy-paste prompts for doing the GBP work with Claude in Chrome, which drives a
real browser in a session you are already signed into. That is the part I cannot
do from a code environment: I have no access to Google, and the profile can only
be edited by a signed-in human (or an agent acting in their browser).

The service list these prompts refer to lives in `GBP_SERVICES.md`.

---

## Before you start — read this once

**Rules to keep in every session.** Claude in Chrome is acting inside a live
account that affects a real business's search visibility. A mistake here is not
a broken build, it is a ranking drop or a suspended profile.

- **Never let it change the business name, primary category, address, phone
  number or hours.** Those are the highest-risk fields on the profile. The
  workflow doc is explicit that the name should not be touched.
- **Only ADD services. Never delete an existing one** without checking with Ray
  first — something already there may be earning traffic.
- **Do not add anything from the ⚠️ list** in `GBP_SERVICES.md` until Ray has
  confirmed it. Eight entries are waiting on him.
- **Never add roof cleaning, roof soft washing, or shingle treatment**, however
  strongly any tool suggests them. The business does not sell them.
- **Work in batches and verify after each.** GBP's editor drops entries silently
  when pushed too fast, and a half-saved batch is worth catching early.

**Watch the first batch happen.** Don't walk away until you've seen it add ten
services correctly.

---

## Prompt 1 — Recon (changes nothing)

Run this first. It is read-only and tells you what state the profile is in
before anything is edited.

```
I'm working on the Google Business Profile for Ray's Window Cleaning And
Pressure Washing LLC in Lexington, SC. I'm signed in already.

For this task, do NOT change anything. This is read-only recon. Report back:

1. The business name exactly as it appears
2. The primary category, and any secondary categories
3. Every service currently listed, grouped by the category it sits under
4. Which profile fields are incomplete or flagged by Google
5. Whether the Bookings / appointment link is set, and to what
6. The number of photos on the profile, and the date of the most recent one

Give me the service list as plain text, one per line, so I can diff it against
the list I'm about to add. Don't edit, don't save, don't click anything that
modifies the profile.
```

**Why first:** you need the existing list so the next step doesn't create
duplicates, and the completeness check tells you which profile features are
still missing.

---

## Prompt 2 — Add the services, one category at a time

Run this **three times**, once per category, swapping in the block each time.
Do not paste all 96 at once — batching is what makes it verifiable.

```
Same Google Business Profile as before (Ray's Window Cleaning And Pressure
Washing LLC, Lexington SC). Now I want to add services.

Go to Edit profile → Services → the "<CATEGORY NAME>" category, and add every
service in the list below that is not already there.

Rules:
- ADD ONLY. Do not remove, rename or reorder anything already on the profile.
- Do not touch the business name, categories, address, phone or hours.
- If a service already exists, skip it and tell me which ones you skipped.
- Add them as custom services if they aren't offered as predefined options.
- Work through the list in order. After every 10, pause and tell me how many
  you've added so far.
- If the interface errors, rate-limits, or stops saving, STOP and tell me
  rather than retrying in a loop.

When you're done, list back exactly what you added and what you skipped.

Services to add:
<PASTE ONE BLOCK FROM BELOW>
```

### Block A — Pressure washing service (53 items)

Pressure Washing
Power Washing
Soft Wash Cleaning
Soft Washing
House Washing
Exterior House Cleaning
Vinyl Siding Cleaning
Brick Cleaning
Stucco Cleaning
Hardie Board Cleaning
Wood Siding Cleaning
Aluminum Siding Cleaning
Soffit and Fascia Cleaning
Shutter Cleaning
Garage Door Cleaning
Driveway Cleaning
Driveway Pressure Washing
Sidewalk Cleaning
Walkway Cleaning
Concrete Cleaning
Concrete Pressure Washing
Patio Cleaning
Deck Cleaning
Wood Deck Cleaning
Composite Deck Cleaning
Porch Cleaning
Screened Porch Cleaning
Fence Cleaning
Wood Fence Cleaning
Vinyl Fence Cleaning
Paver Cleaning
Brick Paver Cleaning
Stone Cleaning
Masonry Cleaning
Retaining Wall Cleaning
Pool Deck Cleaning
Pool Enclosure Cleaning
Screen Enclosure Cleaning
Outdoor Furniture Cleaning
Algae Removal
Mold Removal
Mildew Removal
Moss Removal
Black Streak Removal
Pollen Removal
Red Clay Stain Removal
Rust Removal
Rust Stain Removal
Oil Stain Removal
Efflorescence Removal
Commercial Pressure Washing
Storefront Cleaning
Commercial Building Washing

### Block B — Gutter cleaning service (12 items)

Gutter Cleaning
Gutter Washing
Gutter Brightening
Gutter Whitening
Gutter Face Cleaning
Gutter Debris Removal
Downspout Cleaning
Downspout Flushing
Gutter Flow Testing
Gutter Guard Cleaning
Leaf Removal
Roof Debris Removal

### Block C — Window cleaning service (23 items)

Window Cleaning
Window Washing
Residential Window Cleaning
Commercial Window Cleaning
Exterior Window Cleaning
Interior Window Cleaning
Storefront Window Cleaning
Pure Water Window Cleaning
Streak-Free Window Cleaning
High Window Cleaning
Second Story Window Cleaning
Window Screen Cleaning
Screen Cleaning
Window Track Cleaning
Window Sill Cleaning
Window Frame Cleaning
Skylight Cleaning
Glass Door Cleaning
Sliding Glass Door Cleaning
French Pane Cleaning
Storm Window Cleaning
Hard Water Stain Removal
Mineral Deposit Removal

> **88 services across the three blocks** (53 + 12 + 23) — the ✅ entries only.
> The 8 ⚠️ ones are held back pending Ray's confirmation, and 3 of the 99 slots
> stay free for whatever the competitor scrape turns up.
>
> This note is not part of Block C. When copying a block, take only the lines
> between its heading and the next blank line.

---

## Prompt 3 — Descriptions for the top 20

Descriptions are the step almost nobody does, which is exactly why they are
worth the effort. Google caps them at 300 characters; all twenty below are
under, longest is 276.

```
Same profile. Now add descriptions to services that already exist on it.

For each service named below, open it and paste the matching description into
its description field, then save. Do not create new services here — every one
of these should already exist from the previous step. If one is missing, tell
me instead of adding it.

Do them in order, pause after every 5 and confirm progress. If saving fails,
stop and tell me.

<PASTE THE TOP-20 TABLE FROM GBP_SERVICES.md>
```

The table is in `GBP_SERVICES.md` under "Descriptions for the top 20". Paste it
as-is — the service name and its description are on the same row, which is
enough for it to match them up.

---

## Prompt 4 — Verify

Run this after everything. It is the check that catches silent drops.

```
Read-only again — do not change anything.

Go through the Services section of this Google Business Profile and report:

1. The total number of services listed
2. The full list, grouped by category, as plain text one per line
3. Which of them have a description filled in
4. Any duplicates or near-duplicates you notice
5. Anything that looks mangled — truncated names, descriptions in the wrong
   field, services filed under the wrong category

Don't fix anything yet. Just report.
```

Diff that list against `GBP_SERVICES.md`. Anything missing was silently dropped
on save — re-add just those with Prompt 2.

---

## Prompt 5 — The competitor scrape I couldn't run

This closes the gap noted at the top of `GBP_SERVICES.md`. The workflow doc's
method is to pull competitors' service lists out of the local pack; I have no
access to Google, but Claude in Chrome does.

```
I'm doing local SEO research for a pressure washing company in Lexington, South
Carolina. Read-only research task — don't sign into or modify anything.

1. Search Google for "pressure washing Lexington SC" and open the local pack /
   map results.
2. For each of the top 10 businesses, open its Business Profile and copy the
   full list of services it lists.
3. Also note, for each: the number of reviews, the star rating, the number of
   photos, and its primary category.

Then give me:
- One combined, de-duplicated list of every distinct service across all 10,
  one per line, with no rewording
- Which services appear on the most profiles, ranked
- The average number of services, reviews and photos across the 10
- Anything that looks like a keyword-stuffed or fake listing (business names in
  all caps, names stuffed with keywords, addresses that don't match the trade)
```

Send me the combined list and I'll diff it against the 96 we already have. If it
turns up terms we missed, they go in the three free slots — and the review and
photo averages are the benchmark the workflow doc asks for.

**One caution:** whatever comes back, do not add roof cleaning, roof soft washing
or shingle treatment. Competitors will list them. Ray doesn't sell them.

---

## Order to run these

1. **Prompt 1** — recon, so you know the starting point
2. **Prompt 5** — the scrape, so anything it finds gets added in one pass rather than two
3. Send Ray the ⚠️ confirmation email from `GBP_SERVICES.md`
4. **Prompt 2** ×3 — the three category blocks
5. **Prompt 3** — the top-20 descriptions
6. **Prompt 4** — verify
7. Add Ray's confirmed ⚠️ services once he replies

Expect step 4 to take a couple of sittings. Ninety-odd services through a web
form is genuinely slow, agent or not.
