/**
 * FAQ bank. Services reference these by id (see services.ts → faqIds), the
 * homepage renders the ten highest-intent questions, and the /faq page renders
 * all of them grouped by category. Also feeds FAQPage JSON-LD.
 *
 * What that JSON-LD is actually for: Google restricted FAQ *rich results* — the
 * expandable question list under a search result — to authoritative government
 * and health sites in August 2023, so this markup will not produce one for a
 * cleaning business, and this comment used to claim it would. It is still worth
 * emitting, for a different reason: it hands answer engines pre-parsed
 * question/answer pairs, which is exactly the shape AI Overviews, Perplexity and
 * ChatGPT lift when they answer a question about pressure washing. Optimise
 * these answers for being quoted, not for an expandable result that no longer
 * exists.
 *
 * Which means: lead every answer with the direct answer in the first sentence,
 * keep the specifics numeric, and never bury the useful part in paragraph three.
 * The existing answers already do this — preserve it when editing.
 *
 * Copy is DRAFT: accurate in structure, needs a real operator's review.
 */

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: "Process" | "Safety" | "Pricing" | "Scheduling";
};

export const faqs: Faq[] = [
  {
    id: "soft-vs-pressure",
    category: "Process",
    question: "What's the difference between soft washing and pressure washing?",
    answer:
      "Pressure washing removes dirt with force. Soft washing removes it with chemistry, at roughly garden-hose pressure. Anything alive (algae, mildew, lichen) needs to be killed rather than blasted off, or it regrows within months. Anything porous or fragile (siding, stucco, screens, old wood) will be damaged by high pressure. We use pressure on hard flatwork like concrete, and soft washing on almost everything else.",
  },
  {
    id: "plants-safe",
    category: "Safety",
    question: "Will the cleaning solutions hurt my plants or pets?",
    answer:
      "Our detergents are biodegradable and break down on contact with water. Before we start we saturate every bed, shrub and lawn edge in the work zone, and we rinse everything again when we finish. Dilution is what keeps plants safe. Pets should stay inside while we work and can come back out as soon as surfaces are dry, usually within an hour.",
  },
  {
    id: "how-long-lasts",
    category: "Process",
    question: "How long will the results last?",
    answer:
      // Closing sentence removed with the plans: it pointed at a maintenance
      // plan "at a lower rate" — a product that is no longer sold and a discount
      // the site no longer claims. The answer is complete without it.
      "It depends on shade, humidity and how much tree cover you have. As a rough guide: house washing holds up 12–18 months, decks and fences around 12 months, and concrete around 12 months. Heavily shaded north-facing walls are always first to regrow, and anything within sight of open water regrows faster than the same surface a mile inland.",
  },
  {
    id: "need-to-be-home",
    category: "Scheduling",
    question: "Do I need to be home during the service?",
    answer:
      "No. We need access to an outdoor water spigot and to any gated areas, and that's it. Most of our customers are at work. We send a photo set when the job is finished, and payment can be handled online afterwards.",
  },
  {
    id: "stripes",
    category: "Process",
    question: "Why does my driveway have stripes after a previous cleaning?",
    answer:
      "That's wand striping. It happens when concrete is cleaned with a straight pressure nozzle instead of a rotating surface cleaner, leaving overlapping arcs of cleaned and uncleaned surface. It can be corrected by re-cleaning the whole slab evenly with a surface cleaner, which is what we use as standard.",
  },
  {
    id: "oil-stains",
    category: "Process",
    question: "Can you remove oil and rust stains from concrete?",
    answer:
      "Usually, but not always. Fresh oil lifts well with a degreaser pre-treatment. Oil that has been soaking in for years has penetrated the slab and may only lighten rather than disappear. Rust from sprinkler water responds to a specific acid treatment we carry. We'll tell you honestly what we expect to achieve before we start rather than after.",
  },
  {
    id: "wood-damage",
    category: "Safety",
    question: "Can pressure washing damage my wood deck or fence?",
    answer:
      "Yes, easily. The wrong pressure furs the grain, raises the fibers and permanently roughens the surface. Wood gets the lowest pressure setting we run, applied with a wide fan tip and always along the grain. If a deck is already soft or rotting we'll tell you before we clean rather than discover it mid-job.",
  },
  {
    id: "furniture",
    category: "Scheduling",
    question: "Do I need to move my outdoor furniture?",
    answer:
      "No, we'll move it and put it back. If you have anything fragile, unusually heavy, or valuable, point it out when we arrive and we'll work around it instead.",
  },
  {
    id: "hard-water",
    category: "Process",
    question: "Can you remove hard-water spots from my windows?",
    answer:
      "Light mineral spotting comes off with our standard pure-water system. Long-term etching, usually from sprinklers hitting the glass for years, has physically damaged the surface and needs a separate abrasive restoration treatment. We quote that individually, and we'll tell you upfront if that's what you're dealing with.",
  },
  {
    id: "interior-windows",
    category: "Pricing",
    question: "Do you clean interior windows too?",
    answer:
      "Yes, as an add-on. Interior work needs someone home and takes longer per pane, so it's priced separately from the exterior service. Add it when you book and we'll schedule the extra time.",
  },
  {
    id: "gutter-frequency",
    category: "Process",
    question: "How often should gutters be cleaned?",
    answer:
      "Twice a year for most properties: once after the fall leaf drop and once after the spring pollen. If you have pines or oaks directly overhead, three times is more realistic. Overflowing gutters are one of the most expensive small problems to ignore, because the water ends up in the fascia and eventually the wall.",
  },
  {
    id: "pool-chemicals",
    category: "Safety",
    question: "Will cleaning the pool cage affect my pool water?",
    answer:
      "We cover the pool surface before we start and rinse the enclosure away from the water. Minor overspray is diluted to the point of irrelevance in a full pool, but we'd still recommend running your filter for a few hours afterwards as normal practice.",
  },
  /*
    The `contracts` entry ("Am I locked into a contract?") was removed with the
    maintenance plans. Its answer — "Recurring visits are month-to-month and you
    can stop at any time" — was entirely about a product that is no longer sold,
    and it was answering an objection nobody can raise once there is nothing to
    sign up to.

    It also lines up with the business already pulling "No Contracts" from
    `site.credentials` (see the note there): this reverses nothing, it finishes
    the same removal.

    It was one of the ten homepage FAQs and came out of `homeFaqIds` in
    app/page.tsx at the same time, so the visible list and the FAQPage JSON-LD
    stay in agreement. Restore both together if plans ever come back.
  */
  {
    id: "quote-accuracy",
    category: "Pricing",
    question: "Will the price change once you're on site?",
    answer:
      "The number we give you is the number you pay. We work it out from the surfaces themselves, so if something on site differs materially from what we discussed, we tell you before we start work, never after.",
  },
  {
    id: "payment",
    category: "Pricing",
    question: "When and how do I pay?",
    answer:
      "After the work is done and you've seen the result. Never a deposit for standard residential jobs. We take card, bank transfer and the usual digital wallets, and you'll get an itemized invoice by email.",
  },
  {
    id: "weather",
    category: "Scheduling",
    question: "What happens if it rains on my scheduled day?",
    answer:
      "Light rain doesn't affect most of what we do, and in some cases it helps. Heavy rain, lightning or high wind means we reschedule. We'll call you the morning of rather than leave you wondering, and you go to the front of the next available slot.",
  },
];

export const getFaqs = (ids: readonly string[]) =>
  ids.map((id) => faqs.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));

export const faqCategories = [...new Set(faqs.map((f) => f.category))];
