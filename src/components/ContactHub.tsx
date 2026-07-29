"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import {
  channelGroups,
  greeting,
  greetingPrompt,
  getTopic,
  hoursLine,
  quoteAction,
  rootTopics,
  type AssistantAction,
} from "@/content/assistant";
import type { AssistantReply } from "@/app/api/assistant/route";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * One corner, one hub. Replaces `ChatLauncher` (bottom-left) and
 * `StickyQuoteRail` (right edge, desktop only).
 *
 * Those two were solving the same problem, "give me a way to reach these
 * people from anywhere on the page", from opposite corners, which on a phone
 * added up to three fixed elements competing for the same thumb. Folding the
 * rail's two actions into the launcher's menu means one launcher, one mental
 * model, at every breakpoint.
 *
 * ── WHY THE LAUNCHER OPENS THE CHAT, NOT A MENU ─────────────────────────────
 * It used to open a list of six ways to contact us, with the chat buried at the
 * bottom. That asked the visitor to make a decision, phone or email or
 * WhatsApp or form, before they'd been allowed to state their problem, and
 * every one of those options costs them something: a call means talking to
 * someone, an email means waiting. Faced with that bill, most people close it.
 *
 * So the launcher now opens the assistant mid-conversation instead: a question
 * is already on screen and answering it costs one tap. The six channels didn't
 * go anywhere, they moved into a second tab, and the assistant hands off to
 * the right one at the point the visitor actually needs it rather than before
 * they know which one that is.
 *
 * Two rules survive the redesign intact:
 *
 * R1: `signal` (orange) is for conversion actions only. The chat's accents are
 * hydro and mint. Even the unread dot is mint, not orange.
 *
 * R2: the quote action here is `hydro`, never `signal`. Somewhere below the
 * fold there is almost always an in-flow Signal CTA (`CtaBand`,
 * `GuaranteeBand`, a pricing card), and a permanently-visible third orange
 * button would put two primaries in one viewport at some scroll position on
 * nearly every page. Orange stays reserved for the CTA you scrolled to; this is
 * the one you didn't.
 *
 * No hover-to-expand anywhere. That interaction doesn't exist on touch, and the
 * old rail's labels were invisible to most of this site's traffic as a result.
 *
 * Still deliberately NOT a modal: no scrim, no focus trap, no body scroll lock.
 * A visitor who opened this by accident has to be able to get back to the page
 * by tapping it, and freezing a 500px-tall popover over their reading position
 * is a worse failure than the one it would prevent.
 */

/**
 * Nudge tuning, deliberately all in one place at the top of the file.
 *
 * Two triggers rather than a flat timer: a fast scroller reading a long
 * service page and a slow reader on the homepage both want it at "I've been
 * here a while", and neither time nor depth alone catches both.
 */
const NUDGE = {
  /** Whichever of these fires first wins. */
  delayMs: 24_000,
  scrollDepth: 0.6,
  /** Dismisses itself if nobody engages. */
  autoDismissMs: 8_000,
  /**
   * `sessionStorage`, not `localStorage`. A returning visitor next week is a
   * fresh audience and should see it again; the same visitor three internal
   * page-navigations later in one visit should not.
   */
  storageKey: "rays:hub-nudge",
  /** Mid-conversion pages. A chat nudge there is an interruption, not help. */
  suppressOn: ["/quote", "/contact"],
} as const;

/**
 * The pause between the visitor's tap and the answer landing.
 *
 * Not a fake "someone is typing", nothing is typing. It's here because
 * rendering the question and its answer in the same frame reads as a page swap
 * rather than a reply, and the eye loses which bubble is new. Short enough that
 * it never feels like waiting.
 *
 * It doubles as the *floor* on the free-text path: `/api/assistant` answers in
 * single-digit milliseconds today, so without a floor the composer would feel
 * jumpier than the chips it sits under, and the two paths would visibly be two
 * different mechanisms.
 */
const REPLY_MS = 320;

/** Matches `MAX_MESSAGE` in `app/api/assistant/route.ts`. */
const MAX_MESSAGE = 500;

/** Turns handed to the route as context. Unused by the matcher; see the route. */
const HISTORY_TURNS = 8;

/**
 * How much keyboard has to be on screen before the hub gets out of its way.
 *
 * On iOS the software keyboard doesn't resize the layout viewport, so a
 * bottom-anchored `fixed` panel (and the composer inside it) sits underneath
 * it. `visualViewport` is the only thing that reports this. The threshold keeps
 * pinch-zoom and the Safari URL bar's few dozen pixels from nudging the panel
 * around; nothing short of an actual keyboard clears it. Android resizes the
 * layout viewport instead, so this measures ~0 there and the panel moves on its
 * own, which is why the effect must never assume it has work to do.
 */
const KEYBOARD_MIN_PX = 120;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Module scope, not a component method: it closes over nothing, so it can't
 *  become a stale dependency of the effects that call it. */
const markNudgeSeen = () => {
  try {
    sessionStorage.setItem(NUDGE.storageKey, "1");
  } catch {
    // Private mode or storage disabled. Showing the nudge twice in a session
    // is a much smaller problem than throwing here.
  }
};

type Tab = "chat" | "contact";

type Msg = {
  key: string;
  from: "bot" | "you";
  /** Exactly one of these. A message is a sentence or a set of links, never both. */
  text?: string;
  actions?: AssistantAction[];
};

const seedMessages = (): Msg[] => [
  { key: "seed-0", from: "bot", text: greeting },
  { key: "seed-1", from: "bot", text: greetingPrompt },
];

/* -------------------------------------------------------------------------
   Shared bits
   ---------------------------------------------------------------------- */

/**
 * The assistant's face. Hydro gradient + droplet, the brand mark, shrunk.
 *
 * Sizes are a closed set rather than a free `className`, because `cn` is a
 * plain joiner with no conflicting-class resolution (see `lib/utils.ts`): two
 * competing `h-*` utilities on one element would be settled by stylesheet
 * order, not call order. Pairing each box size with its glyph size here means
 * no caller is ever in a position to create that conflict.
 */
const AVATAR = {
  sm: { box: "h-8 w-8", glyph: "h-4 w-4" },
  md: { box: "h-10 w-10", glyph: "h-5 w-5" },
} as const;

function Avatar({
  size = "sm",
  className,
}: {
  size?: keyof typeof AVATAR;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-harbor-400 to-harbor-700 text-white",
        AVATAR[size].box,
        className,
      )}
    >
      <Icon name="droplet" filled className={AVATAR[size].glyph} />
    </span>
  );
}

/**
 * One link row. Used inside chat answers and in the contact directory, so the
 * two never drift apart visually, a channel looks the same wherever the
 * visitor meets it.
 */
function ActionRow({ action, onNavigate }: { action: AssistantAction; onNavigate: () => void }) {
  const body = (
    <>
      <Icon
        name={action.icon}
        filled={action.icon === "whatsapp"}
        className={cn(
          "h-5 w-5",
          action.primary
            ? "text-white"
            : action.icon === "whatsapp"
              ? "text-leaf-600"
              : "text-harbor-600",
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{action.label}</span>
        {action.detail && (
          <span
            className={cn(
              "mt-0.5 block text-xs font-normal leading-snug",
              action.primary ? "text-harbor-100" : "text-ink-400",
            )}
          >
            {action.detail}
          </span>
        )}
      </span>
      <Icon
        name="arrow"
        className={cn("h-4 w-4 shrink-0", action.primary ? "text-harbor-200" : "text-ink-200")}
      />
    </>
  );

  // 48px rather than the usual 44: these rows carry two lines of text often
  // enough that the taller floor stops the one-line ones looking cramped
  // beside them.
  const className = cn(
    "flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
    action.primary
      ? "bg-harbor-600 text-white hover:bg-harbor-500"
      : "text-ink-700 hover:bg-sand-100",
  );

  if (action.internal) {
    return (
      <Link href={action.href} onClick={onNavigate} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={action.href}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {body}
    </a>
  );
}

/* -------------------------------------------------------------------------
   The hub
   ---------------------------------------------------------------------- */

export function ContactHub() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [nudge, setNudge] = useState(false);
  /** Survives the nudge being dismissed, the dot stays until they actually open it. */
  const [unread, setUnread] = useState(false);

  const [messages, setMessages] = useState<Msg[]>(seedMessages);
  const [chips, setChips] = useState<readonly string[]>(rootTopics);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState("");
  /** Pixels of on-screen keyboard the panel has to climb above. See `KEYBOARD_MIN_PX`. */
  const [keyboard, setKeyboard] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef(0);
  const turn = useRef(0);
  /** Aborts an in-flight answer when the conversation is reset or unmounted. */
  const inFlight = useRef<AbortController | null>(null);
  /**
   * Mirrors `messages` so `askFreeText` can read the transcript without taking
   * it as a dependency, otherwise the callback is rebuilt on every bubble and
   * the form's `onSubmit` identity churns for the whole conversation.
   */
  const log = useRef<Msg[]>(messages);
  useEffect(() => {
    log.current = messages;
  }, [messages]);

  const id = useId();
  const panelId = `${id}-panel`;
  const composerId = `${id}-composer`;
  // Distinct from `panelId`: the launcher controls the whole popover, the tabs
  // control only the body inside it. One id for both would have the tabs
  // claiming ownership of their own tab strip.
  const bodyId = `${id}-body`;
  const chatTabId = `${id}-tab-chat`;
  const contactTabId = `${id}-tab-contact`;
  const pathname = usePathname();

  const openHub = useCallback(() => {
    setOpen(true);
    setTab("chat");
    setNudge(false);
    setUnread(false);
    // Opening the hub is the nudge's whole purpose. Once someone has found it
    // themselves, pointing at it later is noise.
    markNudgeSeen();
  }, []);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  /** Back to the opening question. The conversation isn't worth persisting,
   *  it's a lookup, and a stale one is just clutter on the next visit. */
  const restart = useCallback(() => {
    clearTimeout(replyTimer.current);
    inFlight.current?.abort();
    setThinking(false);
    setMessages(seedMessages());
    setChips(rootTopics);
    setDraft("");
  }, []);

  /**
   * The one place an answer becomes bubbles. Both entry points, a tapped chip
   * and a typed question, end here, which is what keeps them looking like one
   * assistant rather than two features that happen to share a panel.
   */
  const land = useCallback(
    (n: number, reply: string[], actions: AssistantAction[] | undefined, next: readonly string[]) => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        ...reply.map((text, i) => ({ key: `bot-${n}-${i}`, from: "bot" as const, text })),
        ...(actions?.length ? [{ key: `act-${n}`, from: "bot" as const, actions }] : []),
      ]);
      setChips(next);
    },
    [],
  );

  const ask = useCallback(
    (topicId: string) => {
      const topic = getTopic(topicId);
      if (!topic) return;

      const n = turn.current++;
      setMessages((prev) => [...prev, { key: `you-${n}`, from: "you", text: topic.chip }]);
      // Chips clear on tap, so a second question can't be queued behind an
      // answer that hasn't landed. One thread, in order.
      setChips([]);
      setThinking(true);

      clearTimeout(replyTimer.current);
      replyTimer.current = window.setTimeout(() => {
        // Never re-offer the question just answered, and always leave a way out
        // to a human, the tree has to bottom out somewhere useful.
        const next = (topic.followUps ?? rootTopics).filter((t) => t !== topicId);
        land(n, topic.reply, topic.actions, topicId === "other" ? next : [...next, "other"]);
      }, REPLY_MS);
    },
    [land],
  );

  /**
   * The typed path. Same thread, same pending indicator, same chips, the only
   * difference from `ask` is that the answer comes over the wire, which is
   * exactly the seam a real model plugs into (`app/api/assistant/route.ts`).
   */
  const askFreeText = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE);
      if (!text || thinking) return;

      const n = turn.current++;
      setMessages((prev) => [...prev, { key: `you-${n}`, from: "you", text }]);
      setDraft("");
      setChips([]);
      setThinking(true);

      clearTimeout(replyTimer.current);
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;

      // Sent, not used, the matcher behind the route is stateless. It's here so
      // that swapping in a conversational model is genuinely a one-file change
      // rather than one file plus a client deploy.
      const history = log.current
        .filter((m) => m.text)
        .slice(-HISTORY_TURNS)
        .map((m) => ({ from: m.from, text: m.text }));

      try {
        // The floor and the request run together rather than in sequence: a
        // reply that takes 400ms shouldn't also wait out the 320ms.
        const [res] = await Promise.all([
          fetch("/api/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history }),
            signal: controller.signal,
          }),
          delay(REPLY_MS),
        ]);
        if (!res.ok) throw new Error(String(res.status));

        const data: AssistantReply = await res.json();
        if (controller.signal.aborted) return;
        land(n, data.reply, data.actions, data.followUps ?? rootTopics);
      } catch (err) {
        // An abort is a reset or an unmount, not a failure, the thread it was
        // going to land in no longer exists, so saying anything would be worse
        // than saying nothing.
        if ((err as Error)?.name === "AbortError") return;
        // Everything else: own it and hand over a channel that doesn't depend
        // on us being up. Never a silent dead input.
        land(
          n,
          ["Sorry, that didn't go through on our end. Quickest way past me is the phone."],
          [
            {
              label: `Call ${site.contact.phone}`,
              detail: `Someone picks up · ${hoursLine}`,
              href: `tel:${site.contact.phoneHref}`,
              icon: "phone",
              primary: true,
            },
            { label: "Text us", href: `sms:${site.contact.phoneHref}`, icon: "chat" },
          ],
          rootTopics,
        );
      } finally {
        if (inFlight.current === controller) inFlight.current = null;
      }
    },
    [land, thinking],
  );

  useEffect(
    () => () => {
      clearTimeout(replyTimer.current);
      inFlight.current?.abort();
    },
    [],
  );

  // Escape closes and hands focus back; a click anywhere outside just closes.
  // Yanking focus to the corner of the screen because someone clicked into the
  // page is the wrong reading of "restore focus".
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  // Focus the panel itself rather than its first control. The first control is
  // the close button, and landing a keyboard or screen-reader user on "close"
  // is an invitation to leave, from the container, the header introduces
  // itself and Tab walks forward through the conversation in reading order.
  //
  // Deliberately NOT the composer, though it is now the obvious candidate:
  // autofocusing a text input on a phone throws up the keyboard the instant the
  // hub opens, burying the greeting and the four chips that are the fast path
  // for most visitors. Typing is the fallback here, not the default, and it is
  // one Tab away.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  /**
   * Lift the whole hub above the software keyboard on browsers that don't
   * resize the layout viewport for it (iOS). Without this the composer is
   * underneath the keys the visitor is pressing.
   */
  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!open || !vv) return;

    const sync = () => {
      // Layout viewport minus what's actually visible: the keyboard, plus any
      // browser chrome below the fold.
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboard(hidden > KEYBOARD_MIN_PX ? Math.round(hidden) : 0);
    };

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      setKeyboard(0);
    };
  }, [open]);

  // Pin to the newest message. Reading `prefers-reduced-motion` per call rather
  // than caching it: the global CSS kill-switch doesn't reach programmatic
  // smooth scrolling, so this is the only place that preference gets honoured
  // here.
  useEffect(() => {
    const el = scrollRef.current;
    if (!open || tab !== "chat" || !el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    // `keyboard` is a dependency because the panel shortens when the keyboard
    // comes up: without re-pinning, the newest bubble ends up above the fold at
    // the exact moment the visitor is typing about it.
  }, [open, tab, messages, thinking, chips, keyboard]);

  /** Standard tabs pattern: arrows move between the two, Tab leaves the strip. */
  const onTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setTab((t) => (t === "chat" ? "contact" : "chat"));
  };

  /** Timer + scroll-depth, first one wins, once per session. */
  useEffect(() => {
    if ((NUDGE.suppressOn as readonly string[]).includes(pathname)) return;
    try {
      if (sessionStorage.getItem(NUDGE.storageKey)) return;
    } catch {
      return;
    }

    let timer = 0;
    let frame = 0;
    let fired = false;

    const teardown = () => {
      clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", onScroll);
    };

    const fire = () => {
      if (fired) return;
      fired = true;
      teardown();
      setNudge(true);
      setUnread(true);
      markNudgeSeen();
    };

    // Reading `scrollHeight` forces a layout, so this must not run per scroll
    // event, on a long page on a mid-range phone that's a reflow per frame of
    // flick momentum, for a measurement that only has to be right once.
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= NUDGE.scrollDepth) fire();
      });
    }

    timer = window.setTimeout(fire, NUDGE.delayMs);
    window.addEventListener("scroll", onScroll, { passive: true });
    return teardown;
  }, [pathname]);

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(false), NUDGE.autoDismissMs);
    return () => clearTimeout(t);
  }, [nudge]);

  const tabClass = (active: boolean) =>
    cn(
      "flex min-h-[52px] flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wide transition-colors",
      active ? "text-ink-900" : "text-ink-300 hover:text-ink-500",
    );

  return (
    <div
      ref={rootRef}
      // Transform rather than `bottom`: it runs on the compositor, so the hub
      // tracks the keyboard's slide-up instead of stuttering a reflow per frame
      // behind it. 0px on every browser that resizes for its own keyboard.
      style={keyboard ? { transform: `translateY(-${keyboard}px)` } : undefined}
      className={cn(
        "no-tap-flash fixed z-40 flex flex-col items-end",
        // Clears StickyCallBar and the iOS home indicator underneath it. The
        // safe-area vars are 0px on hardware without insets, so this is the
        // same 8px gap above the bar it has always been on ordinary screens.
        "bottom-[calc(var(--callbar-height)+8px+var(--safe-bottom))] right-[calc(1rem+var(--safe-right))]",
        "lg:bottom-6 lg:right-6",
      )}
    >
      {/*
        Ambient, not a dialog: it announces politely, never interrupts, and
        never takes focus. Someone reading with a screen reader hears it at the
        end of the current phrase and can carry on ignoring it.

        The live region is always mounted: an `aria-live` container inserted
        at the same moment as its content usually doesn't announce at all.

        Shaped as an actual message preview rather than a speech bubble: it is
        standing in for the conversation waiting behind the launcher, so it
        should look like the first line of it.
      */}
      <div aria-live="polite" className="pointer-events-none">
        {nudge && !open && (
          <div className="hub-pop pointer-events-auto relative mb-3 w-[18rem] max-w-[calc(100vw-2rem)] rounded-card bg-white p-1.5 shadow-lift ring-1 ring-ink-900/10">
            <button
              type="button"
              onClick={openHub}
              className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-sand-50"
            >
              <Avatar className="mt-0.5" />
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wide text-ink-400">
                  {site.shortName} assistant
                </span>
                <span className="mt-0.5 block text-sm font-medium leading-snug text-ink-800">
                  Questions about your place? I can narrow it down in about a minute.
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setNudge(false)}
              aria-label="Dismiss"
              // The visible dot stays small so it doesn't compete with the
              // message; `after` inflates the hit area to a thumb-sized 44px
              // without inflating the graphic.
              className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-ink-800 text-white shadow-card ring-2 ring-white transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:bg-ink-900"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          tabIndex={-1}
          role="group"
          aria-label={`${site.shortName} assistant`}
          // `dvh` tracks the URL bar but not the keyboard, so with one open the
          // CSS height would run off the top of the screen. Cap it by the same
          // measurement that moved the hub up in the first place.
          style={keyboard ? { height: `calc(100dvh - ${keyboard}px - 6rem)` } : undefined}
          className={cn(
            "hub-pop mb-3 flex w-[23rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-card bg-white shadow-lift ring-1 ring-ink-900/10 focus:outline-none",
            // Tall enough for a conversation, never taller than the space
            // between the launcher and the top of the viewport.
            "h-[min(32rem,calc(100dvh-10rem))] lg:h-[min(36rem,calc(100dvh-8rem))]",
          )}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="harbor-mesh flex shrink-0 items-start gap-3 bg-ink-900 px-4 py-3.5 text-white">
            <Avatar size="md" className="mt-0.5 shadow-glow" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-tight">{site.shortName} Assistant</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
                Usually replies in seconds
              </p>
            </div>

            {messages.length > 2 && (
              <button
                type="button"
                onClick={restart}
                aria-label="Start over"
                title="Start over"
                className="-mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon name="arrow" className="h-4 w-4 -scale-x-100" />
              </button>
            )}
            <button
              type="button"
              onClick={() => close(true)}
              aria-label="Close"
              className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div
            ref={scrollRef}
            id={bodyId}
            role="tabpanel"
            aria-labeledby={tab === "chat" ? chatTabId : contactTabId}
            // `overscroll-contain` rather than a body scroll lock: this is a
            // popover, not a modal. Freezing the page behind a non-modal
            // element traps someone who tapped it by accident.
            className={cn(
              "flex-1 overflow-y-auto overscroll-contain",
              tab === "chat" ? "bg-sand-50 p-3" : "bg-white p-2",
            )}
          >
            {tab === "chat" ? (
              <div className="flex flex-col gap-2.5" role="log" aria-live="polite">
                {messages.map((m, i) => {
                  // Avatar once per run of consecutive assistant messages,
                  // repeating it beside every bubble turns a conversation into
                  // a list of notifications.
                  const leads = m.from === "bot" && messages[i - 1]?.from !== "bot";

                  if (m.from === "you") {
                    return (
                      <p
                        key={m.key}
                        className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-harbor-600 px-3.5 py-2.5 text-sm font-semibold leading-relaxed text-white"
                      >
                        {m.text}
                      </p>
                    );
                  }

                  return (
                    <div key={m.key} className={cn("flex items-end gap-2", !leads && "ml-10")}>
                      {leads && <Avatar />}
                      {m.actions ? (
                        <div className="min-w-0 flex-1 space-y-0.5 rounded-2xl rounded-bl-md bg-white p-1.5 shadow-card">
                          {m.actions.map((a) => (
                            <ActionRow key={a.href} action={a} onNavigate={() => close()} />
                          ))}
                        </div>
                      ) : (
                        <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-700 shadow-card">
                          {m.text}
                        </p>
                      )}
                    </div>
                  );
                })}

                {thinking && (
                  <div className="flex items-end gap-2">
                    <Avatar />
                    <span
                      role="img"
                      aria-label="Finding the answer"
                      className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3.5 shadow-card"
                    >
                      {[0, 1, 2].map((n) => (
                        <span
                          key={n}
                          className="hub-dot h-1.5 w-1.5 rounded-full bg-ink-300"
                          style={{ animationDelay: `${n * 140}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                {/* Right-aligned, because these are the visitor's words about to
                    become the visitor's message, so they belong on the visitor's
                    side of the thread before they're tapped, not after. */}
                {chips.length > 0 && !thinking && (
                  <div className="flex flex-col items-end gap-2 pt-1">
                    {chips.map((topicId) => {
                      const topic = getTopic(topicId);
                      if (!topic) return null;
                      return (
                        <button
                          key={topicId}
                          type="button"
                          onClick={() => ask(topicId)}
                          className="hub-pop min-h-[44px] max-w-[90%] rounded-full border border-harbor-200 bg-white px-4 py-2 text-right text-sm font-semibold text-harbor-700 shadow-card transition-colors hover:border-harbor-300 hover:bg-harbor-50"
                        >
                          {topic.chip}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                <ActionRow action={quoteAction} onNavigate={() => close()} />

                {channelGroups.map((group) => (
                  <div key={group.heading}>
                    <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-ink-400">
                      {group.heading}
                    </p>
                    {group.channels.map((channel) => (
                      <ActionRow key={channel.href} action={channel} onNavigate={() => close()} />
                    ))}
                  </div>
                ))}

                <p className="flex items-center gap-2 px-3 pb-1 pt-4 text-xs leading-snug text-ink-400">
                  <Icon name="clock" className="h-3.5 w-3.5 shrink-0" />
                  {hoursLine}
                </p>
              </>
            )}
          </div>

          {/* ── Composer ───────────────────────────────────────────────────
              Additive, not a replacement. The chips above stay the fast path
              for the four questions most visitors actually have (one tap
              beats a sentence) and this is for everything off-script.

              Below the log and above the tab strip, which is where every chat
              app on the visitor's phone has trained them to look for it. */}
          {tab === "chat" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void askFreeText(draft);
              }}
              className="flex shrink-0 items-center gap-2 border-t border-ink-100 bg-white px-2.5 py-2.5"
            >
              <label htmlFor={composerId} className="sr-only">
                Type your question
              </label>
              <input
                id={composerId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask anything…"
                // `send` rather than the default `go`, so the phone's return
                // key says what the button beside it says.
                enterKeyHint="send"
                autoComplete="off"
                maxLength={MAX_MESSAGE}
                disabled={thinking}
                className={cn(
                  "min-h-[44px] min-w-0 flex-1 rounded-full border border-ink-200 bg-sand-50 px-4 text-ink-800",
                  // 16px on mobile, because anything smaller makes iOS Safari
                  // zoom the page on focus, and it never zooms back out.
                  //
                  // Exactly one `text-*` size across this whole list, for the
                  // reason the AVATAR table at the top of this file spells out:
                  // `cn` is a plain joiner with no conflict resolution, so a
                  // stray `text-sm` alongside this would be settled by
                  // stylesheet order rather than by call order, and it was,
                  // silently, until a viewport measurement caught it.
                  "text-base sm:text-sm",
                  "placeholder:text-ink-300 focus:border-harbor-500 focus:bg-white focus:outline-none",
                  "disabled:opacity-60",
                )}
              />
              <button
                type="submit"
                disabled={thinking || !draft.trim()}
                aria-label="Send"
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-colors",
                  // R1 holds here too: hydro, not signal. This sends a message,
                  // it doesn't convert anyone.
                  "bg-harbor-600 hover:bg-harbor-500",
                  "disabled:bg-ink-200 disabled:text-ink-400",
                )}
              >
                <Icon name="send" className="h-5 w-5" />
              </button>
            </form>
          )}

          {/* ── Tabs ───────────────────────────────────────────────────── */}
          <div
            role="tablist"
            aria-label="Contact hub sections"
            onKeyDown={onTabKeyDown}
            className="grid shrink-0 grid-cols-2 border-t border-ink-100 bg-white"
          >
            <button
              type="button"
              role="tab"
              id={chatTabId}
              aria-selected={tab === "chat"}
              aria-controls={bodyId}
              tabIndex={tab === "chat" ? 0 : -1}
              onClick={() => setTab("chat")}
              className={tabClass(tab === "chat")}
            >
              <span className="relative grid h-5 w-5 place-items-center">
                <Icon name="chat" className="h-5 w-5" />
                {/* Mint, the site's "smart/clean" indicator. R1 keeps signal
                    for conversion actions only. */}
                <Icon
                  name="sparkle"
                  className="absolute -right-1 -top-1 h-2.5 w-2.5 text-leaf-500"
                />
              </span>
              Assistant
            </button>
            <button
              type="button"
              role="tab"
              id={contactTabId}
              aria-selected={tab === "contact"}
              aria-controls={bodyId}
              tabIndex={tab === "contact" ? 0 : -1}
              onClick={() => setTab("contact")}
              className={tabClass(tab === "contact")}
            >
              <Icon name="phone" className="h-5 w-5" />
              Contact us
            </button>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openHub())}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close the assistant" : "Chat with us"}
        className={cn(
          "relative grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-lift",
          "transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-ink-800 active:scale-[0.97]",
          "lg:h-16 lg:w-16",
        )}
      >
        {/* Both icons stay mounted and cross-fade, so the launcher morphs
            instead of blinking. Swapping the element would restart layout and
            lose the rotation halfway through. */}
        <Icon
          name="chat"
          className={cn(
            "absolute h-6 w-6 text-harbor-400 transition-all duration-200 ease-out-expo",
            open && "rotate-90 scale-50 opacity-0",
          )}
        />
        <Icon
          name="close"
          className={cn(
            "absolute h-6 w-6 transition-all duration-200 ease-out-expo",
            !open && "-rotate-90 scale-50 opacity-0",
          )}
        />
        {unread && !open && (
          <span
            aria-hidden="true"
            className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full bg-leaf-400 ring-[3px] ring-ink-900 lg:right-1 lg:top-1"
          />
        )}
      </button>
    </div>
  );
}
