import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { site } from "@/content/site";

/**
 * Every lead the site produces leaves through here: the contact page's callback
 * form is the only sender. It becomes a row in Supabase (`public.ryan_leads`),
 * then an email to the business, with validation, a spam floor, and an honest
 * failure when Supabase is unreachable.
 *
 * ── STORAGE IS THE SOURCE OF TRUTH, EMAIL IS A HEADS-UP ─────────────────────
 * The Supabase insert is what a submission actually being "received" means —
 * it's what determines the response the visitor sees. The Resend send happens
 * after, and if it fails the lead is still safely in the table, so the
 * visitor still gets a real success and the failure is only logged
 * server-side. Do not flip that order or make the email failure surface to
 * the visitor: a customer told "that didn't go through" about a lead that is
 * in fact sitting in the database is worse than a silent email miss.
 *
 * ── WHY THE ANON KEY IS FINE HERE ───────────────────────────────────────────
 * `ryan_leads` has row level security on with exactly one policy: anon may
 * INSERT, and nothing may SELECT, UPDATE or DELETE. So the anon key, even
 * though it's not secret, can only ever add rows — never read back other
 * people's submissions, never edit or remove one. That's the same shape the
 * honeypot and rate limit below are for: this endpoint is reachable by
 * anyone, so the only thing standing between it and abuse is what the
 * database itself will allow.
 *
 * ── SENDING IDENTITY ─────────────────────────────────────────────────────────
 * `from` defaults to a `tanygrowth.com` address — the domain already verified
 * on the Resend account this project uses, not rayspropertywash.com. That's
 * deliberate, not a placeholder: this is an internal notification to the
 * business owner, not a customer-facing email, so the from-address doesn't
 * need to say Ray's. Verifying rayspropertywash.com would need Resend's paid
 * plan (the free tier allows one domain, already spent on tanygrowth.com).
 * Revisit only if that changes.
 */

/* ---------------------------------------------------------------------------
   Configuration
   ------------------------------------------------------------------------- */

/** Read lazily, per request: at module scope this is baked in at build time.
 *  Supabase names match what Vercel's Supabase integration provisions —
 *  NEXT_PUBLIC_ because the same publishable key is safe in a browser bundle,
 *  not because this route runs on the client. It doesn't; it just doesn't
 *  need a second, server-only copy of a key that's already public by design. */
const config = () => ({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  from: process.env.LEADS_FROM_EMAIL || `${site.shortName} Website Leads <leads@tanygrowth.com>`,
  to: process.env.LEADS_TO_EMAIL || site.contact.email,
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

/* ---------------------------------------------------------------------------
   The notification email

   Written for one reader on a phone in a truck. The answer to "who is this and
   what do they want" is in the subject line and the first row; everything else
   is below it in the order it would be asked on a call.
   ------------------------------------------------------------------------- */

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Ordered the way it would be asked on a call, and empty optional fields drop
 *  out entirely rather than rendering a row saying nothing. */
function rowsFor(lead: Lead): [string, string][] {
  return (
    [
      ["Call back on", lead.phone],
      ["Best time", lead.bestTime],
      ["Name", lead.name],
      ["Town", lead.city],
      ["Wants cleaned", lead.services],
      ["Notes", lead.message],
      ["Email", lead.email],
      ["Found us via", lead.howHeard],
    ] as [string, string][]
  ).filter(([, value]) => value);
}

function render(lead: Lead) {
  const rows = rowsFor(lead);
  const heading = "New callback request";

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f1ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#16232e">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:#06131d;padding:20px 24px">
      <div style="color:#ffffff;font-size:18px;font-weight:700">${heading}</div>
      <div style="color:#a3c0d8;font-size:13px;margin-top:4px">${esc(site.name)} · via the website</div>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) => `<tr>
        <td style="padding:12px 24px;border-bottom:1px solid #eef2f6;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#64748b;white-space:nowrap;vertical-align:top">${esc(label)}</td>
        <td style="padding:12px 24px;border-bottom:1px solid #eef2f6;font-size:15px;line-height:1.5;color:#16232e;white-space:pre-wrap">${esc(value)}</td>
      </tr>`,
        )
        .join("")}
    </table>
    <div style="padding:20px 24px 24px">
      <a href="tel:${esc(lead.phone.replace(/[^\d+]/g, ""))}" style="display:block;background:#f6ae1e;color:#030b12;font-size:16px;font-weight:700;text-align:center;text-decoration:none;padding:14px 20px;border-radius:999px">Call ${esc(lead.name)} back</a>
      <div style="font-size:13px;color:#64748b;margin-top:14px;text-align:center">
        Or reply to this email and it goes straight to them.
      </div>
    </div>
  </div>
</body></html>`;

  // Sent alongside the HTML, not instead of it. Plenty of trade inboxes read
  // plain text by default, and a lead nobody can read is a lead nobody calls.
  const text = [`${heading} · ${site.name}`, "", ...rows.map(([l, v]) => `${l}: ${v}`)].join("\n");

  // Name and town in the subject: it is the whole preview on a locked phone,
  // and it is what makes two pending leads distinguishable without opening them.
  const where = lead.city ? ` (${lead.city})` : "";
  return { subject: `Callback request: ${lead.name}${where}`, html, text };
}

/**
 * Best-effort. Storage already succeeded by the time this is called — a
 * failure here is logged loudly and swallowed, never surfaced to the visitor.
 * Missing config is not an error: notifications are optional, storage is not.
 */
async function notify(lead: Lead) {
  const { resendApiKey, from, to } = config();
  if (!resendApiKey) {
    console.error("[api/leads] RESEND_API_KEY is not set. Lead stored, notification NOT sent.");
    return;
  }

  const { subject, html, text } = render(lead);
  const resend = new Resend(resendApiKey);

  // Same payload inside 24h is the same lead, a double-tapped Send button or a
  // retry after a flaky connection. The digest is the entity id because there
  // is no database id available here.
  const idempotencyKey = `lead-${lead.kind}/${await digest(JSON.stringify(lead))}`;

  try {
    const { error } = await resend.emails.send(
      {
        from,
        to: [to],
        subject,
        html,
        text,
        // Hitting Reply in the inbox answers the customer, not tanygrowth.com.
        replyTo: lead.email,
      },
      { idempotencyKey },
    );
    if (error) console.error("[api/leads] Resend rejected the notification:", error);
  } catch (err) {
    console.error("[api/leads] Network failure sending notification:", err);
  }
}

/** Short, stable hash of the payload. Not security, just an identity for the key. */
async function digest(input: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(bytes).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

  const { supabaseUrl, supabaseAnonKey } = config();
  if (!supabaseUrl || !supabaseAnonKey) {
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

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { error } = await supabase.from("ryan_leads").insert(toRow(lead));

  if (error) {
    console.error("[api/leads] Supabase rejected the insert:", error);
    return NextResponse.json({ error: "We couldn't get that through." }, { status: 502 });
  }

  // Awaited so the function doesn't get frozen mid-send after the response
  // goes out, but its outcome never changes that response: the lead is
  // already safely stored, and notify() swallows its own errors.
  await notify(lead);

  return NextResponse.json({ ok: true });
}
