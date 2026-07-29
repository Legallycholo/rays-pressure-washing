"use client";

import { useState } from "react";
import type { Service } from "@/content/services";
import { ServiceCard } from "./ServicesGrid";
import { cn } from "@/lib/utils";

/**
 * Residential/commercial toggle for the /services hub, tabs, not routes
 * (open decision #6: two routes split link equity for no benefit).
 */
export function ServicesTabs({
  residential,
  commercial,
}: {
  residential: Service[];
  commercial: Service[];
}) {
  const [segment, setSegment] = useState<"residential" | "commercial">("residential");
  const shown = segment === "residential" ? residential : commercial;

  return (
    <div>
      <div role="tablist" aria-label="Service type" className="flex justify-center gap-2">
        {(["residential", "commercial"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={segment === s}
            onClick={() => setSegment(s)}
            className={cn(
              "inline-flex min-h-[44px] items-center rounded-pill px-6 py-2.5 text-sm font-bold capitalize transition-colors",
              segment === s
                ? "bg-ink-900 text-white"
                : "bg-sand-100 text-ink-600 hover:bg-sand-200",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.slug}>
            <ServiceCard service={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
