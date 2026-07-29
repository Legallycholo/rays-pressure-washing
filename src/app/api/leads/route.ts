import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/content/site";

/**
 * Every lead the site produces leaves through here: the contact page's message
 * form is now the only sender. It becomes an email to the business, with
 * validation, a spam floor, and an honest failure when Resend is unreachable.
 *
 * ── SENDING IDENTITY, AND WHY IT LOOKS TEMPORARY ────────────────────────────
 * `from` defaults to Resend's shared sandbox sender, which can only deliver to
 * the address the Resend account was signed up with. That is deliberate: it
 * needs no DNS records, so lead capture works the day the API key is pasted in
 * rather than the day a domain finishes verifying. It is also a hard ceiling,
 * nothing else will ever receive mail from it.
 *
 * Once a domain is verified in Resend, set `LEADS_FROM_EMAIL` to an address on
 * it (e.g. "Website <leads@yourdomain.com>") and the ceiling lifts. Nothing in
 * this file changes.
 *
 */

/* ---------------------------------------------------------------------------
   Configuration
   ------------------------------------------------------------------------- */

/** Read lazily, per request: at module scope this is baked in at build time. */
const config = () => ({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.LEADS_FROM_EMAIL || `${site.shortName} Website <onboarding@resend.dev>`,
  to: process.env.LEADS_TO_EMAIL || site.contact.email,
});

const MAX = { name: 120, email: 200, message: 5_000 } as const;

/* ---------------------------------------------------------------------------
   Rate limiting

   Stricter than `/api/assistant`, because the thing on the other side of this
   one is a person's inbox. A flood there doesn't just cost CPU, it buries real
   leads underneath junk, which is the actual damage.

   Still per-instance and therefore still best-effort on serverless. It stops
   the naive case (a script hammering one endpoint) and the common accident (an
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

   Deliberately shallow. This is the second line: both forms validate before
   they get here, and the point of repeating it server-side is that the client
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
 */
type Lead = { kind: "contact"; name: string; email: string; message: string };

function parse(body: Record<string, unknown>): { lead: Lead } | { error: string } {
  const name = str(body.name, MAX.name);
  const email = str(body.email, MAX.email);

  if (!name) return { error: "A name is required." };
  if (!looksLikeEmail(email)) return { error: "That email address doesn't look right." };

  if (body.kind === "contact") {
    const message = str(body.message, MAX.message);
    if (!message) return { error: "A message is required." };
    return { lead: { kind: "contact", name, email, message } };
  }

  return { error: "Unrecognised submission." };
}

/* ---------------------------------------------------------------------------
   The email

   Written for one reader on a phone in a truck. The answer to "who is this and
   what do they want" is in the subject line and the first row; everything else
   is below it in the order it would be asked on a call.
   ------------------------------------------------------------------------- */

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function rowsFor(lead: Lead): [string, string][] {
  return [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Message", lead.message],
  ];
}

function render(lead: Lead) {
  const rows = rowsFor(lead);
  const heading = "New website message";

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
    <div style="padding:16px 24px;font-size:13px;color:#64748b">
      Reply to this email and it goes straight to ${esc(lead.name)}.
    </div>
  </div>
</body></html>`;

  // Sent alongside the HTML, not instead of it. Plenty of trade inboxes read
  // plain text by default, and a lead nobody can read is a lead nobody calls.
  const text = [`${heading} · ${site.name}`, "", ...rows.map(([l, v]) => `${l}: ${v}`)].join("\n");

  return { subject: `Website message: ${lead.name}`, html, text };
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

  const { apiKey, from, to } = config();
  if (!apiKey) {
    // Loud on the server, honest to the browser. The form shows the phone
    // number rather than a success state it can't back up, a lead that
    // silently evaporates is worse than one that was never submitted, because
    // the customer stops waiting for a call that isn't coming.
    console.error(
      "[api/leads] RESEND_API_KEY is not set. Lead NOT delivered. See .env.example.",
    );
    return NextResponse.json(
      { error: "Our form isn't reaching us right now." },
      { status: 503 },
    );
  }

  const { subject, html, text } = render(lead);
  const resend = new Resend(apiKey);

  // Same payload inside 24h is the same lead, a double-tapped Send button or a
  // retry after a flaky connection. The digest is the entity id because there
  // is no database to take one from.
  const idempotencyKey = `lead-${lead.kind}/${await digest(JSON.stringify(lead))}`;

  // The SDK returns `{ data, error }` and does not throw on API errors, so the
  // try/catch here is only for the network beneath it.
  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: [to],
        subject,
        html,
        text,
        // The whole point: hitting Reply in the inbox answers the customer,
        // not the sandbox sender.
        replyTo: lead.email,
      },
      { idempotencyKey },
    );

    if (error) {
      console.error("[api/leads] Resend rejected the send:", error);
      return NextResponse.json({ error: "We couldn't get that through." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("[api/leads] Network failure sending lead:", err);
    return NextResponse.json({ error: "We couldn't get that through." }, { status: 502 });
  }
}

/** Short, stable hash of the payload. Not security, just an identity for the key. */
async function digest(input: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(bytes).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
