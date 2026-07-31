import Link from "next/link";
import type { Location } from "@/content/locations";
import { site } from "@/content/site";
import { travelPolicy } from "@/content/packages";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { CoverageMap } from "./CoverageMap";
import { cn } from "@/lib/utils";

/** SECTIONS.md §2.12, static SVG map, never a live embed. */
export function ServiceAreaSection({
  locations,
  tone = "ink",
}: {
  locations: Location[];
  tone?: "ink" | "light";
}) {
  const dark = tone === "ink";

  /**
   * Two groups, not one sorted list.
   *
   * Thirteen pills in a single `flex-wrap` block wrapped into a four-line slab
   * that read as one undifferentiated mass, and the priority/non-priority
   * distinction — which is real, those four cities are the ones with their own
   * service pages — survived only as a font-weight change inside it. Splitting
   * the list is what actually gives the section air; a bigger `gap` on one
   * block would just have made the same slab taller.
   */
  const priority = locations.filter((l) => l.priority);
  const rest = locations.filter((l) => !l.priority);

  const pill = (isPriority: boolean) =>
    cn(
      "inline-flex min-h-[44px] items-center rounded-pill px-4 py-1.5 text-sm transition-colors",
      isPriority ? "font-bold" : "font-medium",
      dark
        ? isPriority
          ? "bg-white/15 text-white hover:bg-white/25"
          : "bg-white/5 text-ink-200 hover:bg-white/15"
        : isPriority
          ? "bg-leaf-50 text-leaf-800 hover:bg-leaf-100"
          : "bg-sand-100 text-ink-600 hover:bg-sand-200",
    );

  return (
    <Section tone={tone}>
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <span
            className={cn(
              "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
              dark ? "text-leaf-400" : "text-leaf-600",
            )}
          >
            <Icon name="pin" className="h-4 w-4" />
            Where we work
          </span>
          <h2 className={cn("text-display-sm sm:text-4xl", dark ? "text-white" : "text-ink-900")}>
            Serving all of {site.serviceRegion}
          </h2>
          {/* Trimmed from three clauses to two. "If you're near one of these,
              you're in our patch" said what the list of cities underneath it
              was already saying. */}
          <p className={cn("leading-relaxed", dark ? "text-ink-200" : "text-ink-500")}>
            Based in {site.address.city}, on the road across the region. Don&apos;t see
            your town? Ask.
          </p>

          <div className="flex w-full flex-col gap-5">
            <ul className="flex flex-wrap gap-2.5">
              {priority.map((l) => (
                <li key={l.slug}>
                  <Link href={`/service-areas/${l.slug}`} className={pill(true)}>
                    {l.city}
                  </Link>
                </li>
              ))}
            </ul>

            {rest.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {/* The label is what lets the second group be visually quieter
                    without reading as "these are afterthoughts" — every one of
                    these is a real service area with its own page. */}
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-[0.18em]",
                    dark ? "text-ink-400" : "text-ink-400",
                  )}
                >
                  Also serving
                </p>
                <ul className="flex flex-wrap gap-2">
                  {rest.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/service-areas/${l.slug}`} className={pill(false)}>
                        {l.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className={cn("text-sm leading-relaxed", dark ? "text-ink-300" : "text-ink-400")}>
            {travelPolicy.note}
          </p>
        </div>
        <CoverageMap locations={locations} onDark={dark} />
      </div>
    </Section>
  );
}
