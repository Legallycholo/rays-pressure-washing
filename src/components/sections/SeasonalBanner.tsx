"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SeasonalCampaign } from "@/content/packages";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/Countdown";

/**
 * SECTIONS.md §2.1. The one sanctioned non-CTA use of `signal` — the whole
 * band is a conversion prompt. Dismissal persists per campaign slug, so a new
 * campaign reappears.
 */
export function SeasonalBanner({ campaign }: { campaign?: SeasonalCampaign }) {
  const [dismissed, setDismissed] = useState(true); // hidden until storage read

  useEffect(() => {
    if (!campaign) return;
    setDismissed(localStorage.getItem(`banner-${campaign.slug}`) === "1");
  }, [campaign]);

  if (!campaign || dismissed) return null;

  return (
    <div className="bg-signal-400 text-ink-950">
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
              className="inline-flex items-center gap-1 text-sm font-bold underline underline-offset-2 hover:no-underline"
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
              localStorage.setItem(`banner-${campaign.slug}`, "1");
              setDismissed(true);
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink-950/10"
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
