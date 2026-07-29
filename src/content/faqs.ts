/**
 * FAQ bank. Services reference these by id (see services.ts → faqIds), and the
 * /faq page renders all of them grouped by category. Also feeds FAQPage JSON-LD,
 * which is what wins the expandable rich result in search.
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
      "Pressure washing removes dirt with force. Soft washing removes it with chemistry, at roughly garden-hose pressure. Anything alive (algae, mildew, lichen) needs to be killed rather than blasted off, or it regrows within months. Anything porous or fragile (siding, roofs, screens, old wood) will be damaged by high pressure. We use pressure on hard flatwork like concrete, and soft washing on almost everything else.",
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
      "It depends on shade, humidity and how much tree cover you have. As a rough guide: house washing holds up 12–18 months, roof treatments 2–3 years, and concrete around 12 months. Heavily shaded north-facing walls are always first to regrow. If you'd rather not track it, our maintenance plan schedules it automatically at a lower rate.",
  },
  {
    id: "need-to-be-home",
    category: "Scheduling",
    question: "Do I need to be home during the service?",
    answer:
      "No. We need access to an outdoor water spigot and to any gated areas, and that's it. Most of our customers are at work. We send a photo set when the job is finished, and payment can be handled online afterwards.",
  },
  {
    id: "roof-warranty",
    category: "Safety",
    question: "Will roof cleaning void my shingle warranty?",
    answer:
      "The opposite. Most shingle manufacturers require periodic algae removal, and specifically prohibit pressure washing. Our no-pressure method follows the ARMA (Asphalt Roofing Manufacturers Association) recommended approach, which is the standard those warranties are written against. We'll document the method used if your manufacturer asks.",
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
  {
    id: "contracts",
    category: "Pricing",
    question: "Am I locked into a contract?",
    answer:
      "No. Recurring visits are month-to-month and you can stop at any time. We'd rather keep the work by doing it well than by locking you in.",
  },
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
