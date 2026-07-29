import { NextResponse } from "next/server";
import {
  getTopic,
  matchTopic,
  rootTopics,
  type AssistantAction,
} from "@/content/assistant";

/**
 * The assistant's free-text endpoint, everything the chat composer in
 * `ContactHub.tsx` says back to a visitor comes through here.
 *
 * WHY IT IS A ROUTE AND NOT A FUNCTION IN THE COMPONENT. It doesn't need to be
 * one today: the matcher below is pure and would run happily in the browser.
 * It is one so that the day a real model is wired up, the change is confined to
 * this file, the component already speaks HTTP, already renders a pending
 * state, already handles a failure. Moving the boundary later, with a live
 * site, is the expensive version of this.
 *
 * ── VENDOR SWAP POINT ───────────────────────────────────────────────────────
 * Replace the keyword matcher below with a call to Google Cloud Conversational
 * Agents (Dialogflow CX), or Vertex AI, once the project ID, agent ID and
 * service-account credentials exist. Nothing outside this file changes.
 *
 * Three things the replacement has to keep, because the UI and the site's
 * honesty guarantees are both built on them:
 *
 *   1. Return the same `AssistantReply` shape. `ContactHub` renders `reply`
 *      as one bubble per string and `actions` as a link card; `followUps` are
 *      the chips it offers next.
 *   2. Ground every answer in this site's own content. The scripted tree in
 *      `content/assistant.ts` is the corpus, a model that free-associates
 *      about roof warranties is a liability, not an upgrade.
 *   3. Keep the fallback. If confidence is low, return the `other` topic and
 *      hand off to a person. "I'll get someone" is always a better answer than
 *      a confident wrong one.
 *
 * Keep the matcher as the offline path behind whatever replaces it. A chat that
 * answers nothing when the model is down or the key expired is worse than the
 * menu it replaced.
 * ──────────────────────────────────────────────────────────────────────────── */

export type AssistantReply = {
  /** Which topic answered. Useful for analytics; the UI uses it to de-dupe chips. */
  topicId: string;
  reply: string[];
  actions?: AssistantAction[];
  followUps: string[];
};

/** Long enough for any real question, short enough that nobody pastes a novel. */
const MAX_MESSAGE = 500;

/* ---------------------------------------------------------------------------
   Rate limiting

   In-memory and per-instance, which on a serverless platform means it is a
   speed bump rather than a guarantee: instances are reused but not shared, so
   a determined flood spread across cold starts gets through. That is an
   acceptable trade here: this endpoint sends no email, costs nothing per call
   and touches no database, so the thing being protected is CPU, not spend or a
   customer's inbox. `/api/leads` is the one where that calculus changes, and it
   is stricter accordingly.
   ------------------------------------------------------------------------- */

const RATE = { windowMs: 60_000, max: 30 } as const;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    // Opportunistic sweep. Without it a long-lived instance accumulates one
    // entry per IP forever, which is a slow memory leak on a busy site.
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

/* ------------------------------------------------------------------------- */

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many messages. Give it a moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const message = (body as { message?: unknown })?.message;
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Nothing to answer." }, { status: 400 });
  }

  // `history` is accepted and deliberately unused. The matcher is stateless, so
  // reading it would be theatre, but the client already sends it, which means
  // a conversational model can be dropped in here without a client change on
  // the same day it needs the context.
  const reply = answer(message.slice(0, MAX_MESSAGE));
  return NextResponse.json(reply);
}

/**
 * ── THE PART THAT GETS REPLACED ─────────────────────────────────────────────
 * Keyword scoring over the scripted tree (`matchTopic`), falling back to the
 * `other` topic (which hands off to a human) when nothing scores. Swap the
 * body of this function; leave its signature and its fallback alone.
 */
function answer(message: string): AssistantReply {
  const topic = matchTopic(message) ?? getTopic("other")!;

  return {
    topicId: topic.id,
    reply: topic.reply,
    actions: topic.actions,
    // Same rule the chip path uses: never re-offer the question just answered,
    // and always leave a route out to a person.
    followUps: [...(topic.followUps ?? rootTopics)]
      .filter((id) => id !== topic.id)
      .concat(topic.id === "other" ? [] : ["other"]),
  };
}
