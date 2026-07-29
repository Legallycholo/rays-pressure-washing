"use client";

import { useMemo, useState } from "react";
import { services, getService } from "@/content/services";
import { bundles, travelPolicy } from "@/content/packages";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, currency } from "@/lib/utils";

/**
 * STRUCTURE.md §9.2. Returns a RANGE, never a single number; respects
 * pricing.minimum; adds the travel surcharge beyond the free radius; shows the
 * honesty disclaimer. All figures are placeholder content data.
 */

const CONDITIONS = [
  { id: "light", label: "Light", hint: "annual upkeep", mult: 1 },
  { id: "moderate", label: "Moderate", hint: "a year or two of buildup", mult: 1.15 },
  { id: "heavy", label: "Heavy", hint: "it's been a while", mult: 1.35 },
] as const;

export function Estimator() {
  const [slug, setSlug] = useState(services[0].slug);
  const [amount, setAmount] = useState("");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]["id"]>("light");
  const [farOut, setFarOut] = useState(false);

  const service = getService(slug)!;
  const qty = Number(amount) || 0;

  const range = useMemo(() => {
    if (qty <= 0) return null;
    const mult = CONDITIONS.find((c) => c.id === condition)?.mult ?? 1;
    const surcharge = farOut ? travelPolicy.surcharge : 0;
    const low = Math.max(service.pricing.from * qty * mult, service.pricing.minimum) + surcharge;
    const high = Math.max(service.pricing.to * qty * mult, service.pricing.minimum) + surcharge;
    return {
      low: Math.round(low / 5) * 5,
      high: Math.round(high / 5) * 5,
    };
  }, [service, qty, condition, farOut]);

  const bundleHint = useMemo(() => {
    const b = bundles
      .filter((x) => x.serviceSlugs.includes(slug) && x.serviceSlugs.length > 1)
      .sort((a, z) => z.savingsPercent - a.savingsPercent)[0];
    if (!b) return null;
    const others = b.serviceSlugs
      .filter((s) => s !== slug)
      .map((s) => getService(s)?.navLabel)
      .filter(Boolean);
    return { bundle: b, others };
  }, [slug]);

  const unitLabel =
    service.pricing.unit === "sq ft"
      ? "Approximate area (sq ft)"
      : service.pricing.unit === "linear ft"
        ? "Approximate length (linear ft)"
        : service.pricing.unit === "per item"
          ? "How many (e.g. windows)"
          : "Quantity";

  return (
    <div className="mx-auto max-w-2xl rounded-card bg-white p-6 shadow-lift ring-1 ring-ink-900/5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block min-w-0 sm:col-span-2">
          <span className="text-sm font-bold text-ink-700">Service</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-2 w-full rounded-card border border-ink-200 bg-white p-3.5 text-base sm:text-sm text-ink-800 focus:border-hydro-500"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}, from {currency(s.pricing.from)}/{s.pricing.unit}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-sm font-bold text-ink-700">{unitLabel}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={service.pricing.unit === "per item" ? "e.g. 14" : "e.g. 1200"}
            className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm text-ink-800 placeholder:text-ink-300 focus:border-hydro-500"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-bold text-ink-700">Condition</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCondition(c.id)}
                aria-pressed={condition === c.id}
                title={c.hint}
                className={cn(
                  "flex min-h-[44px] items-center justify-center rounded-card px-2 py-2.5 text-xs font-semibold transition-all",
                  condition === c.id
                    ? "bg-hydro-600 text-white"
                    : "bg-sand-50 text-ink-700 ring-1 ring-ink-900/5 hover:ring-hydro-400",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* The label is the tap target (clicking anywhere in it toggles the
            box) so the row, not the 18px checkbox, is what has to clear 44px.
            The box itself still grows a little: someone aiming at it rather
            than at the words deserves to hit it. */}
        <label className="flex min-h-[44px] items-center gap-2.5 py-1 text-sm text-ink-600 sm:col-span-2">
          <input
            type="checkbox"
            checked={farOut}
            onChange={(e) => setFarOut(e.target.checked)}
            className="h-5 w-5 shrink-0 rounded accent-hydro-600"
          />
          I&apos;m more than {travelPolicy.freeRadiusMinutes} minutes from town (+
          {currency(travelPolicy.surcharge)} travel, waived when a neighbor books too)
        </label>
      </div>

      <div className="mt-6 rounded-card bg-ink-900 p-6 text-white hydro-mesh">
        {range ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-mint-400">Your ballpark</p>
            {/* Small jobs clamp to the minimum on BOTH ends. Rendering that as
                "$250 – $250" reads like a broken widget, so show it as a floor
                instead, still not a point estimate, which is the rule that
                matters (STRUCTURE.md §9.2). */}
            {range.low === range.high ? (
              <>
                <p className="mt-1 font-display text-4xl font-bold">From {currency(range.low)}</p>
                <p className="mt-1.5 text-xs text-ink-300">
                  A job that size lands on our{" "}
                  {currency(service.pricing.minimum)} minimum call-out for{" "}
                  {service.name.toLowerCase()}. It costs us the same to show up.
                </p>
              </>
            ) : (
              <p className="mt-1 font-display text-4xl font-bold">
                {currency(range.low)} – {currency(range.high)}
              </p>
            )}
          </>
        ) : (
          <p className="text-ink-200">
            Enter a rough {service.pricing.unit === "per item" ? "count" : "size"} above, a
            guess is fine, and the range appears here.
          </p>
        )}
        {/* Honesty disclaimer: faqs.ts → quote-accuracy. Non-negotiable (§9.2). */}
        <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-ink-300">
          A genuine ballpark, not a lead-capture trick. If your surfaces measure up as
          described, the final quote lands inside this range. If anything differs on
          site, we tell you before we start, never after.
        </p>
      </div>

      {bundleHint && bundleHint.others.length > 0 && (
        <p className="mt-4 rounded-card bg-mint-400/10 p-3.5 text-sm text-ink-700 ring-1 ring-mint-500/25">
          <Icon name="sparkle" className="mr-1.5 inline h-4 w-4 text-mint-600" />
          Add {bundleHint.others.join(" + ")} and it becomes the{" "}
          <strong>{bundleHint.bundle.name}</strong> package:{" "}
          <strong>{bundleHint.bundle.savingsPercent}% off everything</strong>.
        </p>
      )}

      <div className="mt-6 text-center">
        {/* Buttons are whitespace-nowrap by design, so a long label at size="lg"
            sets a hard min-width and blows out narrow viewports. Keep the label
            short and let it go full-width on mobile. */}
        <Button href={`/quote?services=${slug}`} size="lg" className="w-full sm:w-auto">
          Get my real quote
          <Icon name="arrow" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
