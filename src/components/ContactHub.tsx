"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, waLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * One corner, one hub. Replaces `ChatLauncher` (bottom-left) and
 * `StickyQuoteRail` (right edge, desktop only).
 *
 * Those two were solving the same problem — "give me a way to reach these
 * people from anywhere on the page" — from opposite corners, which on a phone
 * added up to three fixed elements competing for the same thumb. Folding the
 * rail's two actions into the launcher's menu means one launcher, one mental
 * model, at every breakpoint.
 *
 * Two rules survive the merge intact:
 *
 * R2 — the quote action here is `hydro`, never `signal`. Somewhere below the
 * fold there is almost always an in-flow Signal CTA (`CtaBand`,
 * `GuaranteeBand`, a pricing card), and a permanently-visible third orange
 * button would put two primaries in one viewport at some scroll position on
 * nearly every page. Orange stays reserved for the CTA you scrolled to; this
 * is the one you didn't.
 *
 * No hover-to-expand. That interaction doesn't exist on touch, and the rail's
 * labels were invisible to most of this site's traffic as a result. Tap to
 * open, every label always readable, same behaviour on every input device.
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

type View = "menu" | "ai";

export function ContactHub() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [nudge, setNudge] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  const openHub = useCallback(() => {
    setOpen(true);
    setNudge(false);
    // Opening the hub is the nudge's whole purpose. Once someone has found it
    // themselves, pointing at it later is noise.
    markNudgeSeen();
  }, []);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    setView("menu");
    if (refocus) triggerRef.current?.focus();
  }, []);

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

  // Move focus into the panel on open and on every view swap, so the keyboard
  // path through the hub is continuous rather than dumping the user back at
  // the top of the page.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
  }, [open, view]);

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const list = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (!list.length) return;
    e.preventDefault();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const delta = e.key === "ArrowDown" ? 1 : -1;
    const next =
      at === -1 ? (delta === 1 ? 0 : list.length - 1) : (at + delta + list.length) % list.length;
    list[next].focus();
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
      markNudgeSeen();
    };

    // Reading `scrollHeight` forces a layout, so this must not run per scroll
    // event — on a long page on a mid-range phone that's a reflow per frame of
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

  const row =
    "flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors";
  const quiet = cn(row, "text-ink-700 hover:bg-sand-100");

  return (
    <div
      ref={rootRef}
      className={cn(
        "no-tap-flash fixed z-40",
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

        The live region is always mounted — an `aria-live` container inserted
        at the same moment as its content usually doesn't announce at all.
      */}
      <div aria-live="polite" className="pointer-events-none">
        {nudge && !open && (
          <div className="hub-pop pointer-events-auto mb-3 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-card bg-ink-900 py-1.5 pl-4 pr-1.5 text-white shadow-lift">
            <button
              type="button"
              onClick={openHub}
              // 44px tall even though the label is one line: the whole message
              // is a tap target for opening the hub, and a thumb needs the
              // height whether or not the text fills it.
              className="flex min-h-[44px] items-center text-left text-sm font-semibold leading-snug"
            >
              <span aria-hidden="true">👋</span> Questions? We&rsquo;re right here.
            </button>
            <button
              type="button"
              onClick={() => setNudge(false)}
              aria-label="Dismiss"
              // 44px hit area around a deliberately small glyph — the target
              // has to be thumb-sized even though the × shouldn't be loud.
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          onKeyDown={onPanelKeyDown}
          // `overscroll-contain` rather than a body scroll lock: this is a
          // popover, not a modal. Freezing the page behind a non-modal element
          // traps someone who tapped it by accident.
          className="hub-pop mb-3 w-72 max-w-[calc(100vw-2rem)] overscroll-contain rounded-card bg-white p-2 shadow-lift ring-1 ring-ink-900/10"
          {...(view === "menu"
            ? { role: "menu" as const, "aria-label": "Ways to reach us" }
            : { role: "group" as const, "aria-label": "Chat with AI" })}
        >
          {view === "menu" ? (
            <>
              <Link
                href="/quote"
                role="menuitem"
                onClick={() => close()}
                className={cn(row, "bg-hydro-600 text-white hover:bg-hydro-500")}
              >
                <Icon name="sparkle" className="h-4 w-4" />
                Get My Free Quote
              </Link>

              <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-ink-400">
                Talk to a person
              </p>

              <a href={`tel:${site.contact.phoneHref}`} role="menuitem" className={quiet}>
                <Icon name="phone" className="h-4 w-4 text-hydro-600" />
                {site.contact.phone}
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className={quiet}
              >
                <Icon name="whatsapp" filled className="h-4 w-4 text-mint-600" />
                WhatsApp us
              </a>
              <a href={`mailto:${site.contact.email}`} role="menuitem" className={quiet}>
                <Icon name="mail" className="h-4 w-4 text-hydro-600" />
                Email us
              </a>
              <Link href="/contact" role="menuitem" onClick={() => close()} className={quiet}>
                <Icon name="chat" className="h-4 w-4 text-hydro-600" />
                Send a message
              </Link>

              {/*
                ── VENDOR SWAP POINT ──────────────────────────────────────────
                Last in the list on purpose: it is the newest and the only one
                that isn't live yet. Promote it to first once it is.

                When a vendor is chosen the change is: load its script in
                `layout.tsx`, and replace this onClick with the vendor's
                open-widget call. Nothing else in this file moves, and there is
                deliberately no config layer here for a vendor nobody has
                picked. Keep the menu as the fallback for when that script
                fails or is blocked — a launcher that does nothing is worse
                than no launcher.

                Until then it opens an honest placeholder rather than a
                disabled row: a greyed-out option advertises a feature and
                refuses to explain it, and a fake typing indicator would be a
                lie about somebody being there.
                ───────────────────────────────────────────────────────────────
              */}
              <button
                type="button"
                role="menuitem"
                onClick={() => setView("ai")}
                className={cn(quiet, "mt-1 border-t border-ink-100 pt-3")}
              >
                <span className="relative grid h-4 w-4 shrink-0 place-items-center">
                  <Icon name="chat" className="h-4 w-4 text-hydro-600" />
                  {/* Mint, the site's "smart/clean" indicator — not signal,
                      which R1 reserves for conversion actions. */}
                  <Icon
                    name="sparkle"
                    className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 text-mint-500"
                  />
                </span>
                Chat with AI
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setView("menu")}
                className={cn(quiet, "text-ink-500")}
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                Back
              </button>
              <p className="px-3 pt-2 text-sm font-bold text-ink-900">
                Our AI assistant is almost ready
              </p>
              <p className="px-3 pb-2 pt-1 text-sm leading-relaxed text-ink-500">
                Until it is, these reach a real person — usually within the hour.
              </p>
              <a href={`tel:${site.contact.phoneHref}`} className={quiet}>
                <Icon name="phone" className="h-4 w-4 text-hydro-600" />
                Call {site.contact.phone}
              </a>
              <a href={`sms:${site.contact.phoneHref}`} className={quiet}>
                <Icon name="chat" className="h-4 w-4 text-hydro-600" />
                Text us
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={quiet}
              >
                <Icon name="whatsapp" filled className="h-4 w-4 text-mint-600" />
                WhatsApp us
              </a>
            </>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openHub())}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          "ml-auto grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-lift",
          "transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-ink-800 active:scale-[0.97]",
        )}
      >
        <Icon name={open ? "close" : "chat"} className="h-6 w-6 text-hydro-400" />
      </button>
    </div>
  );
}
