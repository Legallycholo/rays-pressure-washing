/**
 * Everything the contact hub's assistant can say, and every channel it can hand
 * off to. Content lives here rather than inside `ContactHub.tsx` for the same
 * reason the service catalog does: the copy is the thing that will change
 * weekly, and it should be editable without reading a line of React.
 *
 * WHAT THIS IS. A scripted assistant, a decision tree with real answers, not a
 * language model. That distinction is load-bearing:
 *
 *   - Every answer below is written by a human and is true. A visitor asking
 *     about roof warranties gets the ARMA answer from `faqs.ts`, not a
 *     plausible-sounding paragraph.
 *   - There is a free-text composer, but it does not generate text. It runs
 *     `matchTopic()` below (keyword scoring over this same tree) and returns
 *     one of these hand-written answers or hands off to a human. Still nothing
 *     to hallucinate into.
 *   - It speaks in the company's voice rather than narrating its own
 *     architecture at someone who just wants a driveway quoted. But the
 *     `identity` topic answers straight if anyone actually asks what it is.
 *
 * ── SWAPPING IN A REAL MODEL ────────────────────────────────────────────────
 * The seam is now `src/app/api/assistant/route.ts`, and it is one file wide.
 * `ContactHub` POSTs free text there and renders the `{ reply, actions }` that
 * comes back, the same shape a topic has. Replace the matcher inside that
 * route with a Dialogflow CX / Vertex AI call and nothing in this file or in
 * the component moves. The scripted tree stays as the offline path, a chat
 * that answers nothing when the model is down or the key expired is worse than
 * the menu it replaced.
 *
 * Keep every answer grounded in something that already exists on the site
 * (`faqs.ts`, `services.ts`, `site.ts`). If an answer here contradicts a page,
 * the page wins and this file is the bug.
 * ──────────────────────────────────────────────────────────────────────────── */

import { site, waLink } from "@/content/site";
import { locations } from "@/content/locations";

/** A link rendered as a row inside a chat answer or the contact directory. */
export type AssistantAction = {
  label: string;
  /** Secondary line. Optional, omit rather than pad it with filler. */
  detail?: string;
  href: string;
  /** Name from `components/ui/Icon.tsx`. */
  icon: string;
  /** `true` routes through next/link; `false` is a plain anchor (tel:, mailto:, external). */
  internal?: boolean;
  /** Opens in a new tab. Only true for genuinely off-site destinations. */
  external?: boolean;
  /**
   * The one filled row in its group.
   *
   * R2: filled means `hydro`, never `signal`. Orange stays reserved for the
   * in-flow CTA the visitor scrolled to; this hub is the one they didn't.
   */
  primary?: boolean;
};

export type AssistantTopic = {
  id: string;
  /** The chip the visitor taps, and verbatim what their own bubble then says. */
  chip: string;
  /** One bubble per string, in order. Two is the ceiling; three is a wall of text. */
  reply: string[];
  actions?: AssistantAction[];
  /** Chips offered after this answer. Omit to fall back to the root set. */
  followUps?: readonly string[];
  /**
   * Free-text triggers, scored by `matchTopic`. Lowercase, no punctuation.
   *
   * Write the words a customer would type, not the words we'd use, "how much",
   * "ballpark", "expensive" beat "pricing schedule". Multi-word entries are
   * matched as phrases and score higher than single words, which is what stops
   * "how long does a quote take" landing on `lasts` because of "how long".
   */
  keywords?: readonly string[];
};

/* ---------------------------------------------------------------------------
   Opening hours, derived rather than retyped

   `site.hours` is the source of truth and feeds LocalBusiness schema, so a
   second hand-written copy of it in chat copy is a guaranteed future
   contradiction, the kind nobody notices until a customer turns up on a
   Sunday.
   ------------------------------------------------------------------------- */

const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

const shortDays = (d: string) =>
  d.replace(/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/g, (_, stem) => stem.slice(0, 3)).replace(" – ", "–");

/** e.g. "Mon–Fri 7am–6pm · Sat 8am–4pm", closed days drop out. */
export const hoursLine = site.hours
  .filter((h) => h.close)
  .map((h) => `${shortDays(h.days)} ${to12h(h.open)}–${to12h(h.close)}`)
  .join(" · ");

/* ---------------------------------------------------------------------------
   The script
   ------------------------------------------------------------------------- */

export const greeting =
  `Hey, you've reached ${site.shortName}. Ask away about pricing, what we ` +
  `clean, or getting on the schedule, and if you'd rather talk it through ` +
  `I'll put you straight onto the crew.`;

/** Prompt above the opening chips. Mirrors what a good receptionist opens with. */
export const greetingPrompt = "What can I help with?";

/**
 * The opening chips. Four, deliberately, this is the "pick one" moment and a
 * list long enough to need reading is a list that gets ignored. Everything else
 * in the tree is reachable as a follow-up.
 */
export const rootTopics = ["price", "services", "booking", "human"] as const;

export const assistantTopics: AssistantTopic[] = [
  {
    id: "price",
    chip: "How much will it cost?",
    reply: [
      "Almost everything we do prices off measured surface area, so a number guessed from here would be worth nothing to you.",
      "The estimator asks a few questions about your property and gives you a real range in about a minute. It's built from our own job data. If the surfaces measure up as you describe them, the final quote lands inside it.",
    ],
    actions: [
      {
        label: "Get my free estimate",
        detail: "About a minute · no card, no callback trap",
        href: "/quote",
        icon: "sparkle",
        internal: true,
        primary: true,
      },
      {
        label: "See the pricing guide",
        detail: "What moves the number up or down",
        href: "/pricing",
        icon: "arrow",
        internal: true,
      },
    ],
    followUps: ["payment", "bundles", "booking", "human"],
    keywords: [
      "how much",
      "how much does",
      "what does it cost",
      "cost",
      "price",
      "pricing",
      "prices",
      "quote",
      "estimate",
      "ballpark",
      "rate",
      "rates",
      "charge",
      "expensive",
      "cheap",
      "afford",
      "budget",
      "per square foot",
    ],
  },

  {
    id: "services",
    chip: "What do you clean?",
    // Mirrors the catalog in `services.ts`. If a service is added there and
    // this line isn't updated, this line is the one that's wrong.
    reply: [
      "Residential: roofs, siding, driveways and walkways, decks, patios, fences, gutters, windows and pool enclosures.",
      "Commercial: building envelopes, storefronts and parking lots. Usually overnight, so nothing happens during trading hours.",
    ],
    actions: [
      { label: "Browse every service", href: "/services", icon: "spray", internal: true },
      {
        label: "See before & afters",
        detail: "Real jobs, same camera position",
        href: "/gallery",
        icon: "camera",
        internal: true,
      },
    ],
    followUps: ["method", "safety", "area", "price"],
    keywords: [
      "what do you clean",
      "what do you do",
      "services",
      "service",
      "do you clean",
      "do you wash",
      "do you do",
      "roof",
      "shingle",
      "siding",
      "house wash",
      "driveway",
      "concrete",
      "walkway",
      "sidewalk",
      "patio",
      "deck",
      "fence",
      "gutter",
      "window",
      "windows",
      "pool cage",
      "pool enclosure",
      "lanai",
      "screen",
      "paver",
      "brick",
      "stucco",
      "commercial",
      "storefront",
      "parking lot",
      "dumpster",
      "awning",
      "solar panel",
    ],
  },

  {
    id: "booking",
    chip: "How soon can you come out?",
    reply: [
      `Most quotes go out same day, and typical lead time to the visit itself is a few days. We're on the phones ${hoursLine}.`,
      "You don't need to be home. We need an outdoor spigot and access to any gated areas, and that's it. Heavy rain or lightning means we reschedule, and we call you that morning rather than leave you waiting.",
    ],
    actions: [
      {
        label: "Book my visit",
        detail: "Pick a service and a window",
        href: "/quote",
        icon: "calendar",
        internal: true,
        primary: true,
      },
      { label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}`, icon: "phone" },
    ],
    followUps: ["area", "payment", "human"],
    keywords: [
      "how soon",
      "how quickly",
      "when can you",
      "availability",
      "available",
      "book",
      "booking",
      "schedule",
      "appointment",
      "next week",
      "tomorrow",
      "today",
      "lead time",
      "do i need to be home",
      "rain",
      "weather",
      "reschedule",
      "cancel",
      "how long does it take",
      "hours",
      "weekend",
      "saturday",
      "sunday",
    ],
  },

  {
    id: "human",
    chip: "Rather talk it through?",
    reply: [
      `Of course. Fastest is the phone: someone picks up on the truck ${hoursLine}. Outside those hours, text or WhatsApp and you'll have a reply first thing.`,
    ],
    actions: [
      {
        label: `Call ${site.contact.phone}`,
        detail: "Fastest during working hours",
        href: `tel:${site.contact.phoneHref}`,
        icon: "phone",
        primary: true,
      },
      { label: "Text us", href: `sms:${site.contact.phoneHref}`, icon: "chat" },
      { label: "WhatsApp us", href: waLink(), icon: "whatsapp", external: true },
      { label: "Send a message", detail: "We reply by email", href: "/contact", icon: "mail", internal: true },
    ],
    followUps: ["price", "booking", "trust"],
    keywords: [
      "talk to someone",
      "speak to someone",
      "call you",
      "call me",
      "phone number",
      "number",
      "phone",
      "text",
      "whatsapp",
      "email",
      "contact",
      "get in touch",
      "reach you",
      "manager",
      "owner",
    ],
  },

  {
    id: "method",
    chip: "Soft wash or pressure wash?",
    // Condensed from the `soft-vs-pressure` FAQ.
    reply: [
      "Pressure removes dirt with force; soft washing removes it with chemistry, at about garden-hose pressure.",
      "Anything alive (algae, mildew, lichen) has to be killed or it regrows in months. Anything porous or fragile gets damaged by high pressure. So: pressure on hard flatwork like concrete, soft wash on nearly everything else.",
    ],
    actions: [{ label: "Read the full FAQ", href: "/faq", icon: "chat", internal: true }],
    followUps: ["safety", "lasts", "price"],
    keywords: [
      "soft wash",
      "soft washing",
      "pressure wash",
      "power wash",
      "psi",
      "what method",
      "how do you clean",
      "chemicals",
      "chemical",
      "detergent",
      "bleach",
      "sodium hypochlorite",
      "algae",
      "mildew",
      "mold",
      "lichen",
      "moss",
      "black streaks",
      "green stuff",
    ],
  },

  {
    id: "safety",
    chip: "Is it safe for my plants and roof?",
    // Condensed from `plants-safe`, `roof-warranty` and `wood-damage`.
    reply: [
      "Plants: detergents are biodegradable and break down on contact with water. We saturate every bed and lawn edge before we start and rinse again at the end. Dilution is what keeps them safe. Pets indoors while we work, back out once surfaces are dry.",
      "Roofs: our no-pressure method follows the ARMA standard your shingle warranty is written against. Most manufacturers require algae removal and specifically prohibit pressure washing. Wood gets the lowest pressure we run, wide fan, along the grain.",
    ],
    actions: [{ label: "All safety questions", href: "/faq", icon: "shield", internal: true }],
    followUps: ["lasts", "trust", "booking"],
    keywords: [
      "safe",
      "safety",
      "damage",
      "harm",
      "plants",
      "garden",
      "grass",
      "lawn",
      "flower",
      "shrub",
      "pets",
      "dog",
      "cat",
      "kids",
      "children",
      "warranty",
      "void",
      "arma",
      "shingles",
      "paint",
      "wood",
      "will it strip",
      "eco",
      "environment",
      "biodegradable",
    ],
  },

  {
    id: "lasts",
    chip: "How long do results last?",
    reply: [
      "Depends on shade, humidity and tree cover. Roughly: house washing 12–18 months, roof treatments 2–3 years, concrete about a year. Shaded north-facing walls always regrow first.",
    ],
    actions: [
      {
        label: "See the maintenance plan",
        detail: "Scheduled automatically, at a lower rate",
        href: "/maintenance-plan",
        icon: "clock",
        internal: true,
      },
    ],
    followUps: ["price", "bundles", "booking"],
    keywords: [
      "how long does it last",
      "how long will it last",
      "last",
      "lasts",
      "come back",
      "regrow",
      "grow back",
      "how often",
      "frequency",
      "every year",
      "maintenance",
    ],
  },

  {
    id: "trust",
    chip: "Are you licensed and insured?",
    reply: [
      `Licensed and insured, crews are background-checked, and we've been doing this locally since ${site.foundedYear}. Commercial clients can have a certificate of insurance naming your management company, usually within a business day.`,
      `And ${site.guarantee.title}: ${site.guarantee.body}`,
    ],
    actions: [
      { label: `Read the reviews`, detail: `${site.rating.value}★ from ${site.rating.count}+ customers`, href: "/reviews", icon: "star", internal: true },
      { label: "About the crew", href: "/about", icon: "shield", internal: true },
    ],
    followUps: ["safety", "booking", "human"],
    keywords: [
      "licensed",
      "license",
      "insured",
      "insurance",
      "liability",
      "certificate of insurance",
      "coi",
      "bonded",
      "background check",
      "reviews",
      "review",
      "rating",
      "reputation",
      "how long have you",
      "trust",
      "legit",
      "guarantee",
      "warranty on the work",
      "if im not happy",
      "not happy",
      "complaint",
    ],
  },

  {
    id: "area",
    chip: "Do you cover my area?",
    reply: [
      `We work across ${site.serviceRegion}. The coverage map has every city we run routes through. If you're on the edge of it, ask anyway and we'll tell you straight.`,
    ],
    actions: [{ label: "Check the coverage map", href: "/service-areas", icon: "pin", internal: true }],
    followUps: ["booking", "price", "human"],
    // City names come from `locations.ts` rather than a second hand-typed list:
    // adding a city to the coverage map should teach the matcher its name in
    // the same commit, not the one after someone notices.
    keywords: [
      "do you cover",
      "do you service",
      "do you come out to",
      "my area",
      "area",
      "service area",
      "travel",
      "how far",
      "located",
      "where are you",
      "zip code",
      "neighborhood",
      site.serviceRegion.toLowerCase(),
      ...locations.map((l) => l.city.toLowerCase()),
    ],
  },

  {
    id: "payment",
    chip: "When do I pay?",
    reply: [
      "After the work is done and you've seen the result. No deposit on standard residential jobs. Card, bank transfer and the usual digital wallets, with an itemized invoice by email.",
    ],
    followUps: ["price", "booking", "trust"],
    keywords: [
      "when do i pay",
      "pay",
      "payment",
      "deposit",
      "upfront",
      "invoice",
      "card",
      "credit card",
      "cash",
      "venmo",
      "zelle",
      "apple pay",
      "financing",
      "bank transfer",
    ],
  },

  {
    id: "bundles",
    chip: "Is there a package deal?",
    reply: [
      "Yes. Bundling surfaces into one visit is cheaper than booking them separately, because most of the cost is getting the truck and the crew to you.",
    ],
    actions: [
      { label: "See the packages", href: "/packages", icon: "check", internal: true },
      {
        label: "Recurring maintenance",
        detail: "15–25% under one-off rates, month-to-month",
        href: "/maintenance-plan",
        icon: "clock",
        internal: true,
      },
    ],
    followUps: ["price", "booking", "human"],
    keywords: [
      "package",
      "packages",
      "bundle",
      "deal",
      "discount",
      "combo",
      "together",
      "everything at once",
      "whole house",
      "coupon",
      "special",
      "offer",
      "cheaper if",
      "subscription",
      "plan",
      "recurring",
    ],
  },

  {
    id: "other",
    chip: "Something else",
    reply: [
      "Let me get you to someone who can dig into that properly. Quickest is the phone, or write it out and we'll come back to you by email.",
    ],
    actions: [
      {
        label: `Call ${site.contact.phone}`,
        href: `tel:${site.contact.phoneHref}`,
        icon: "phone",
        primary: true,
      },
      { label: "Write it out instead", detail: "We reply by email", href: "/contact", icon: "mail", internal: true },
    ],
    followUps: ["price", "services", "booking"],
  },

  /**
   * Reachable from free text only, never offered as a chip, because nobody
   * taps "what are you" off a menu, and putting it on one would make the whole
   * hub about itself instead of about their driveway.
   *
   * It exists because the rest of this file now speaks in the company's voice
   * with no "I am not a person" clause in it, which is a brand-voice decision,
   * not a license to answer this question dishonestly. Someone who asks
   * directly gets a direct answer and a route to a human in the same breath.
   * California's B.O.T. Act (Bus. & Prof. Code §17941) is the specific reason
   * this topic is not optional, do not delete it to tidy up the tree.
   */
  {
    id: "identity",
    chip: "Am I talking to a person?",
    reply: [
      "Straight answer: no. I'm the automated assistant on the website, and everything I say is written by the crew ahead of time.",
      "If you'd rather have an actual person, that's one tap away and they're quick.",
    ],
    actions: [
      {
        label: `Call ${site.contact.phone}`,
        detail: `Someone picks up · ${hoursLine}`,
        href: `tel:${site.contact.phoneHref}`,
        icon: "phone",
        primary: true,
      },
      { label: "Text us", href: `sms:${site.contact.phoneHref}`, icon: "chat" },
      { label: "Send a message", detail: "We reply by email", href: "/contact", icon: "mail", internal: true },
    ],
    followUps: ["price", "services", "booking"],
    keywords: [
      "are you a bot",
      "are you a robot",
      "are you human",
      "are you a human",
      "are you a person",
      "are you real",
      "am i talking to a person",
      "am i talking to a human",
      "am i talking to a bot",
      "is this a bot",
      "is this a real person",
      "is this a human",
      "is this automated",
      "bot",
      "robot",
      "chatbot",
      "ai",
      "artificial intelligence",
      "chatgpt",
      "automated",
      "real person",
      "who am i talking to",
      "what are you",
    ],
  },
];

export const getTopic = (id: string) => assistantTopics.find((t) => t.id === id);

/* ---------------------------------------------------------------------------
   Free-text matching

   Deliberately dumb, and that is the feature. Everything this returns is a
   topic from the array above, so the worst case is the wrong hand-written
   answer plus a route to a human, never an invented one. See the route file
   for where a real model would replace this.
   ------------------------------------------------------------------------- */

/**
 * Lowercase, punctuation to spaces, single-spaced, and padded at both ends.
 *
 * The padding is what makes `includes(" cost ")` a word-boundary test: without
 * it "cost" matches inside "costume" and, worse, "ai" matches inside "rain" and
 * "paint", which would route half the roof questions to the identity answer.
 */
const normalize = (text: string) =>
  ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;

/**
 * Phrases outscore words, quadratically. A four-word phrase is worth 16 and a
 * bare word is worth 1, so "how long does it last" reaches `lasts` even though
 * "how long does it take" would have put the same five words on `booking`.
 * Without that gap the two questions are decided by array order.
 */
const scoreOf = (keyword: string) => {
  const words = keyword.split(" ").length;
  return words * words;
};

/**
 * Best topic for a free-text question, or `null` if nothing matched.
 *
 * `null` is a real answer, the caller is expected to fall back to the `other`
 * topic, which hands off to a person. Guessing at a low-confidence match would
 * trade a useful "let me get someone" for a confident irrelevance.
 */
export function matchTopic(text: string): AssistantTopic | null {
  const haystack = normalize(text);
  if (haystack.trim().length < 2) return null;

  let best: AssistantTopic | null = null;
  let bestScore = 0;

  for (const topic of assistantTopics) {
    let score = 0;
    for (const keyword of topic.keywords ?? []) {
      if (haystack.includes(` ${keyword} `)) score += scoreOf(keyword);
    }
    // Strictly greater, so ties go to the earlier topic, which is the order
    // the root chips are in, i.e. the questions we most expect.
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return best;
}

/* ---------------------------------------------------------------------------
   The contact directory, the hub's second tab

   Same channels the hub always offered, grouped by what the visitor is actually
   choosing between: "I want an answer now" versus "I'll leave it with you".
   Ordered fastest-first inside each group, because that ordering is the only
   advice we can give without them having to ask for it.
   ------------------------------------------------------------------------- */

export const quoteAction: AssistantAction = {
  label: "Get my free quote",
  detail: "About a minute · no obligation",
  href: "/quote",
  icon: "sparkle",
  internal: true,
  primary: true,
};

export const channelGroups: { heading: string; channels: AssistantAction[] }[] = [
  {
    heading: "Answer me now",
    channels: [
      {
        label: site.contact.phone,
        detail: `Someone picks up · ${hoursLine}`,
        href: `tel:${site.contact.phoneHref}`,
        icon: "phone",
      },
      { label: "Text us", detail: "Send a photo of the problem", href: `sms:${site.contact.phoneHref}`, icon: "chat" },
      { label: "WhatsApp us", detail: "Same number, same crew", href: waLink(), icon: "whatsapp", external: true },
    ],
  },
  {
    heading: "Leave it with us",
    channels: [
      {
        label: "Send a message",
        detail: "The form gets it to the right person",
        href: "/contact",
        icon: "mail",
        internal: true,
      },
      { label: site.contact.email, detail: "Usually answered within the hour", href: `mailto:${site.contact.email}`, icon: "mail" },
    ],
  },
];
