"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { site, waLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The door, not the room behind it.
 *
 * A real chat widget (Intercom, Tidio, Crisp) is a third-party script, a
 * monthly bill, and — the part that actually decides it — a promise that
 * somebody is there to answer. That is Ryan's call to make, not a build
 * decision. So this ships as a working contact menu: every option below does
 * something real, right now, with zero external scripts loaded.
 *
 * Bottom-LEFT deliberately. `StickyCallBar` owns the bottom edge on mobile and
 * `StickyQuoteRail` owns the right edge on desktop; this is the one corner
 * left, at every breakpoint.
 *
 * ── VENDOR SWAP POINT ──────────────────────────────────────────────────────
 * When a vendor is chosen, the change is: load its script in `layout.tsx`, and
 * replace the `setOpen(!open)` in the trigger's onClick with the vendor's
 * open-widget call. Keep the menu as the fallback for when the script fails or
 * is blocked — a launcher that does nothing is worse than no launcher. Nothing
 * else in this file needs to move, and there is deliberately no config layer
 * here for a vendor nobody has picked yet.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const item =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100";

  return (
    <div
      ref={rootRef}
      // Clears StickyCallBar's 68px on mobile; sits at the normal inset above it.
      className="fixed bottom-[76px] left-4 z-40 lg:bottom-6 lg:left-6"
    >
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Ways to reach us"
          className="mb-3 w-64 max-w-[calc(100vw-2rem)] rounded-card bg-white p-2 shadow-lift ring-1 ring-ink-900/10"
        >
          <p className="px-3 pb-2 pt-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
            Talk to a person
          </p>
          <a href={`tel:${site.contact.phoneHref}`} role="menuitem" className={item}>
            <Icon name="phone" className="h-4 w-4 text-hydro-600" />
            {site.contact.phone}
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={item}
          >
            <Icon name="whatsapp" filled className="h-4 w-4 text-mint-600" />
            WhatsApp us
          </a>
          <a href={`mailto:${site.contact.email}`} role="menuitem" className={item}>
            <Icon name="mail" className="h-4 w-4 text-hydro-600" />
            Email us
          </a>
          <Link href="/contact" role="menuitem" className={item} onClick={() => setOpen(false)}>
            <Icon name="chat" className="h-4 w-4 text-hydro-600" />
            Send a message
          </Link>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          // hydro, not signal — R1 reserves orange for in-flow conversion
          // actions, and this is a help affordance, not a CTA.
          "grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-lift",
          "transition-all duration-200 hover:bg-ink-800 hover:-translate-y-0.5",
        )}
      >
        <Icon name={open ? "close" : "chat"} className="h-6 w-6 text-hydro-400" />
      </button>
    </div>
  );
}
