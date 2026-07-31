import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Every lead the site produces leaves through here: the contact page's callback
 * form is the only sender. It becomes a row in Supabase (`public.ryan_leads`),
 * with validation, a spam floor, and an honest failure when Supabase is
 * unreachable.
 *
 * ── STORAGE, NOT NOTIFICATION ────────────────────────────────────────────────
 * This writes the lead and nothing else. Nobody is emailed, texted or paged
 * when a row lands — that used to happen here via Resend, and it's gone for
 * now by request, to come back later. Until it does, a new lead is only
 * visible by looking at the table (Supabase dashboard, or a query), not by
 * waiting for a notification.
 *
 * ── WHY THE ANON KEY IS FINE HERE ───────────────────────────────────────────
 * `ryan_leads` has row level security on with exactly one policy: anon may
 * INSERT, and nothing may SELECT, UPDATE or DELETE. So the anon key, even
 * though it's not secret, can only ever add rows — never read back other
 * people's submissions, never edit or remove one. That's the same shape the
 * honeypot and rate limit below are for: this endpoint is reachable by
 * anyone, so the only thing standing between it and abuse is what the
 * database itself will allow.
 */

/* ---------------------------------------------------------------------------
   Configuration
   ------------------------------------------------------------------------- */

/** Read lazily, per request: at module scope this is baked in at build time.
 *  Names match what Vercel's Supabase integration provisions — NEXT_PUBLIC_
 *  because the same publishable key is safe in a browser bundle, not because
 *  this route runs on the client. It doesn't; it just doesn't need a second,
 *  server-only copy of a key that's already public by design. */
const config = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

const MAX = {
  name: 120,
  email: 200,
  phone: 40,
  city: 120,
  services: 400,
  bestTime: 40,
  howHeard: 80,
  message: 5_000,
} as const;

/* ---------------------------------------------------------------------------
   Rate limiting

   Per-instance and therefore best-effort on serverless. It stops the naive
   case (a script hammering one endpoint) and the common accident (an
   impatient double-tap on Send). A distributed spam run needs a shared store;
   Upstash Redis via the Vercel Marketplace is the small version of that, and
   is worth adding the first time this is actually abused, not before.
   ------------------------------------------------------------------------- */

const RATE = { windowMs: 10 * 60_000, max: 5 } as const;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    if (hits.size > 5_000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE.max;
}

const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

/* ---------------------------------------------------------------------------
   Validation

   Deliberately shallow. This is the second line: the form validates before
   it gets here, and the point of repeating it server-side is that the client
   is not a security boundary, not that we know better than the visitor what
   their address looks like. Anything stricter starts rejecting real customers:
   there is no regex that correctly accepts every valid email address, and the
   ones that try reject more real leads than they block bots.
   ------------------------------------------------------------------------- */

/** Deliberately loose: something, an @, something, a dot, something. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const str = (v: unknown, cap: number) => (typeof v === "string" ? v.trim().slice(0, cap) : "");

/**
 * One shape now. There used to be a second, `kind: "quote"`, carrying property
 * measurements, a matched bundle and the estimate the visitor had been shown;
 * it was the quote wizard's final step, and the wizard, the estimator and the
 * bundles are all gone. Nothing has sent that shape since. Recover it from git
 * history if quoting comes back rather than rebuilding it from memory.
 *
 * `phone` is required and `message` is not, which is the inverse of what this
 * route used to enforce. That follows the form: every CTA on the site asks for
 * a callback, so the number is the lead and the note is a nicety. A submission
 * with a paragraph and no phone number is not something anyone can act on.
 */
type Lead = {
  kind: "contact";
  name: string;
  email: string;
  phone: string;
  city: string;
  services: string;
  bestTime: string;
  howHeard: string;
  message: string;
};

/** Loose on purpose: 7 digits after stripping formatting. Anything stricter
 *  starts rejecting real numbers people type with spaces, dots or a +1. */
const looksLikePhone = (v: string) => (v.match(/\d/g)?.length ?? 0) >= 7;

function parse(body: Record<string, unknown>): { lead: Lead } | { error: string } {
  const name = str(body.name, MAX.name);
  const email = str(body.email, MAX.email);
  const phone = str(body.phone, MAX.phone);

  if (!name) return { error: "A name is required." };
  if (!looksLikeEmail(email)) return { error: "That email address doesn't look right." };
  if (!looksLikePhone(phone)) return { error: "That phone number doesn't look right." };

  if (body.kind === "contact") {
    return {
      lead: {
        kind: "contact",
        name,
        email,
        phone,
        city: str(body.city, MAX.city),
        services: str(body.services, MAX.services),
        bestTime: str(body.bestTime, MAX.bestTime),
        howHeard: str(body.howHeard, MAX.howHeard),
        message: str(body.message, MAX.message),
      },
    };
  }

  return { error: "Unrecognised submission." };
}

/** `lead.services` arrives as one comma-joined string (ContactForm does the
 *  join before it POSTs); the column is `text[]`, so split it back apart. */
function toRow(lead: Lead) {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    services: lead.services
      ? lead.services.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    best_time: lead.bestTime || null,
    how_heard: lead.howHeard || null,
    message: lead.message || null,
  };
}

/* ------------------------------------------------------------------------- */

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "That's a few too many in a row. Give it ten minutes, or call us." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  // Honeypot. A field no human ever sees and no human ever fills. Answer 200 so
  // the bot logs a success and doesn't come back to try a different shape.
  if (typeof body._hp === "string" && body._hp.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parse(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { lead } = parsed;

  const { url, anonKey } = config();
  if (!url || !anonKey) {
    // Loud on the server, honest to the browser. The form shows the phone
    // number rather than a success state it can't back up, a lead that
    // silently evaporates is worse than one that was never submitted, because
    // the customer stops waiting for a call that isn't coming.
    console.error(
      "[api/leads] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set. Lead NOT stored. See .env.example.",
    );
    return NextResponse.json(
      { error: "Our form isn't reaching us right now." },
      { status: 503 },
    );
  }

  const supabase = createClient(url, anonKey);
  const { error } = await supabase.from("ryan_leads").insert(toRow(lead));

  if (error) {
    console.error("[api/leads] Supabase rejected the insert:", error);
    return NextResponse.json({ error: "We couldn't get that through." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
