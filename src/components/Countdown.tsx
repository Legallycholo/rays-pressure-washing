"use client";

import { useEffect, useState } from "react";
import { timeRemaining } from "@/lib/utils";

/**
 * "3d 4h 20m remaining" for a campaign with a hard deadline.
 *
 * Ticks once a minute, not once a second. The smallest unit shown is minutes,
 * so a per-second interval would re-render 59 times for no visible change and
 * keep a phone's CPU awake to do it.
 *
 * Renders nothing until after mount: the server has no idea what time it is in
 * the reader's timezone, and a server/client disagreement about a clock is a
 * hydration mismatch by construction. Renders nothing once the deadline passes
 * either, a expired campaign should have been filtered out upstream by
 * `activeCampaign`, and this is the belt to that pair of braces.
 */
export function Countdown({ endsAt, className }: { endsAt?: string; className?: string }) {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => setRemaining(timeRemaining(endsAt));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!remaining) return null;

  return (
    <span className={className}>
      <time dateTime={endsAt}>{remaining}</time> left
    </span>
  );
}
