"use client";

import { useState } from "react";
import Link from "next/link";
import type { SeasonalCampaign } from "@/content/packages";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/Countdown";

/**
 * SECTIONS.md §2.1. The one sanctioned non-CTA use of `signal` — the whole
 * band is a conversion prompt. Dismissal persists per campaign slug, so a new
 * campaign reappears.
 *
 * ── WHY THE INLINE SCRIPT ───────────────────────────────────────────────────
 * This used to start `dismissed = true` and flip it in an effect once
 * localStorage had been read. That is the obvious way to write it and it was
 * the single biggest layout shift on the site: the banner is 74px tall and
 * sits above the hero, so on every first visit the whole page jumped down a
 * banner's height about 1.5 seconds in. It measured 0.082 CLS on the homepage
 * — the homepage's entire CLS, and all of it avoidable.
 *
 * The visibility decision has to happen before the first paint, and an effect
 * is by definition after it. So the banner now renders visible from the server
 * — the correct answer for every first-time visitor — and the script below
 * runs during HTML parse to hide it again for the returning visitor who
 * already dismissed it. Neither one sees anything move.
 *
 * Same pattern, and same reasoning, as the reveal bootstrap in `layout.tsx`:
 * when the correct first frame depends on something only the client knows,
 * the choice belongs in a synchronous inline script, not in React's lifecycle.
 */
export function SeasonalBanner({ campaign }: { campaign?: SeasonalCampaign }) {
  // Starts visible, matching the server. Only a click moves it to `true`; the
  // stored dismissal is applied by the pre-paint script instead.
  const [dismissed, setDismissed] = useState(false);

  if (!campaign || dismissed) return null;

  return (
    <div className="banner-seasonal bg-signal-400 text-ink-950">
      {/*
        Runs at parse time, before this element is painted. Sets the attribute
        that `globals.css` uses to hide the band, so a returning visitor who
        dismissed this campaign never sees it flash.

        Wrapped in try/catch because Safari's private mode throws on
        `localStorage` access outright — and a banner showing twice is a far
        smaller problem than a homepage that throws before it renders.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            `try{if(localStorage.getItem('banner-${campaign.slug}')==='1')` +
            `document.documentElement.setAttribute('data-banner-dismissed','')}catch(e){}`,
        }}
      />
      <Container size="wide">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:justify-center md:gap-3">
            <span className="inline-flex items-center gap-2 font-bold">
              <Icon name="sparkle" className="h-4 w-4 shrink-0" />
              {campaign.headline}
            </span>
            <span className="hidden text-sm md:inline">{campaign.body}</span>
            <Link
              href={campaign.ctaHref}
              className="-my-2 inline-flex min-h-[44px] items-center gap-1 py-2 text-sm font-bold underline underline-offset-2 hover:no-underline"
            >
              {campaign.ctaLabel}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            {/* Renders nothing without an `endsAt`, so a campaign with no hard
                deadline looks exactly as it did before this existed. */}
            <Countdown
              endsAt={campaign.endsAt}
              className="inline-flex items-center gap-1.5 rounded-pill bg-ink-950/10 px-2.5 py-0.5 text-xs font-bold tabular-nums"
            />
          </div>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={() => {
              try {
                localStorage.setItem(`banner-${campaign.slug}`, "1");
              } catch {
                // Private mode. It reappears next visit; that is acceptable.
              }
              setDismissed(true);
            }}
            className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:bg-ink-950/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </Container>
    </div>
  );
}
