/**
 * Everything the contact hub's assistant can say, and every channel it can hand
 * off to. Content lives here rather than inside `ContactHub.tsx` for the same
 * reason the service catalogue does: the copy is the thing that will change
 * weekly, and it should be editable without reading a line of React.
 *
 * WHAT THIS IS. A scripted assistant — a decision tree with real answers, not a
 * language model. That distinction is load-bearing:
 *
 *   - Every answer below is written by a human and is true. A visitor asking
 *     about roof warranties gets the ARMA answer from `faqs.ts`, not a
 *     plausible-sounding paragraph.
 *   - It cannot be asked something it doesn't know, because there is no free
 *     text input. Every turn is a tap. Nothing to hallucinate into.
 *   - The greeting says what it is. We are not dressing a FAQ up as a person.
 *
 * ── SWAPPING IN A REAL MODEL ────────────────────────────────────────────────
 * If a model is wired up later, this file is the seam. `ContactHub` only ever
 * calls `getTopic(id)` and renders what comes back, so the change is: add a
 * free-text composer, route it to an API route, and map the response into the
 * same `{ reply, actions }` shape. The scripted tree stays as the offline path
 * — a chat that answers nothing when the model is down or the key expired is
 * worse than the menu it replaced.
 *
 * Keep every answer grounded in something that already exists on the site
 * (`faqs.ts`, `services.ts`, `site.ts`). If an answer here contradicts a page,
 * the page wins and this file is the bug.
 * ──────────────────────────────────────────────────────────────────────────── */

import { site, waLink } from "@/content/site";

/** A link rendered as a row inside a chat answer or the contact directory. */
export type AssistantAction = {
  label: string;
  /** Secondary line. Optional — omit rather than pad it with filler. */
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
   * R2 — filled means `hydro`, never `signal`. Orange stays reserved for the
   * in-flow CTA the visitor scrolled to; this hub is the one they didn't.
   */
  primary?: boolean;
};

export type AssistantTopic = {
  id: string;
  /** The chip the visitor taps — and verbatim what their own bubble then says. */
  chip: string;
  /** One bubble per string, in order. Two is the ceiling; three is a wall of text. */
  reply: string[];
  actions?: AssistantAction[];
  /** Chips offered after this answer. Omit to fall back to the root set. */
  followUps?: readonly string[];
};

/* ---------------------------------------------------------------------------
   Opening hours, derived rather than retyped

   `site.hours` is the source of truth and feeds LocalBusiness schema, so a
   second hand-written copy of it in chat copy is a guaranteed future
   contradiction — the kind nobody notices until a customer turns up on a
   Sunday.
   ------------------------------------------------------------------------- */

const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

const shortDays = (d: string) =>
  d.replace(/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/g, (_, stem) => stem.slice(0, 3)).replace(" – ", "–");

/** e.g. "Mon–Fri 7am–6pm · Sat 8am–4pm" — closed days drop out. */
export const hoursLine = site.hours
  .filter((h) => h.close)
  .map((h) => `${shortDays(h.days)} ${to12h(h.open)}–${to12h(h.close)}`)
  .join(" · ");

/* ---------------------------------------------------------------------------
   The script
   ------------------------------------------------------------------------- */

export const greeting =
  `Hi — I'm ${site.shortName} assistant. I'm not a person, but I do know the ` +
  `answers, and I'll put you through to the crew the moment you want one.`;

/** Prompt above the opening chips. Mirrors what a good receptionist opens with. */
export const greetingPrompt = "What can I help with?";

/**
 * The opening chips. Four, deliberately — this is the "pick one" moment and a
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
      "The estimator asks a few questions about your property and gives you a real range in about a minute. It's built from our own job data — if the surfaces measure up as you describe them, the final quote lands inside it.",
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
  },

  {
    id: "services",
    chip: "What do you clean?",
    // Mirrors the catalogue in `services.ts`. If a service is added there and
    // this line isn't updated, this line is the one that's wrong.
    reply: [
      "Residential: roofs, siding, driveways and walkways, decks, patios, fences, gutters, windows and pool enclosures.",
      "Commercial: building envelopes, storefronts and parking lots — usually overnight, so nothing happens during trading hours.",
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
  },

  {
    id: "booking",
    chip: "How soon can you come out?",
    reply: [
      `Most quotes go out same day, and typical lead time to the visit itself is a few days. We're on the phones ${hoursLine}.`,
      "You don't need to be home — we need an outdoor spigot and access to any gated areas, that's it. Heavy rain or lightning means we reschedule, and we call you that morning rather than leave you waiting.",
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
  },

  {
    id: "human",
    chip: "Talk to a real person",
    reply: [
      `Of course. Fastest is the phone — someone picks up on the truck ${hoursLine}. Outside those hours, text or WhatsApp and you'll have a reply first thing.`,
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
  },

  {
    id: "method",
    chip: "Soft wash or pressure wash?",
    // Condensed from the `soft-vs-pressure` FAQ.
    reply: [
      "Pressure removes dirt with force; soft washing removes it with chemistry, at about garden-hose pressure.",
      "Anything alive — algae, mildew, lichen — has to be killed or it regrows in months. Anything porous or fragile gets damaged by high pressure. So: pressure on hard flatwork like concrete, soft wash on nearly everything else.",
    ],
    actions: [{ label: "Read the full FAQ", href: "/faq", icon: "chat", internal: true }],
    followUps: ["safety", "lasts", "price"],
  },

  {
    id: "safety",
    chip: "Is it safe for my plants and roof?",
    // Condensed from `plants-safe`, `roof-warranty` and `wood-damage`.
    reply: [
      "Plants: detergents are biodegradable and break down on contact with water. We saturate every bed and lawn edge before we start and rinse again at the end — dilution is what keeps them safe. Pets indoors while we work, back out once surfaces are dry.",
      "Roofs: our no-pressure method follows the ARMA standard your shingle warranty is written against — most manufacturers require algae removal and specifically prohibit pressure washing. Timber gets the lowest pressure we run, wide fan, along the grain.",
    ],
    actions: [{ label: "All safety questions", href: "/faq", icon: "shield", internal: true }],
    followUps: ["lasts", "trust", "booking"],
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
  },

  {
    id: "area",
    chip: "Do you cover my area?",
    reply: [
      `We work across ${site.serviceRegion}. The coverage map has every city we run routes through — if you're on the edge of it, ask anyway, we'll tell you straight.`,
    ],
    actions: [{ label: "Check the coverage map", href: "/service-areas", icon: "pin", internal: true }],
    followUps: ["booking", "price", "human"],
  },

  {
    id: "payment",
    chip: "When do I pay?",
    reply: [
      "After the work is done and you've seen the result — no deposit on standard residential jobs. Card, bank transfer and the usual digital wallets, with an itemised invoice by email.",
    ],
    followUps: ["price", "booking", "trust"],
  },

  {
    id: "bundles",
    chip: "Is there a package deal?",
    reply: [
      "Yes — bundling surfaces into one visit is cheaper than booking them separately, because most of the cost is getting the truck and the crew to you.",
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
  },

  {
    id: "other",
    chip: "Something else",
    reply: [
      "Then I'm the wrong thing to ask — I only know what I've been taught. Send it to a human and you'll get a proper answer.",
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
];

export const getTopic = (id: string) => assistantTopics.find((t) => t.id === id);

/* ---------------------------------------------------------------------------
   The contact directory — the hub's second tab

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
