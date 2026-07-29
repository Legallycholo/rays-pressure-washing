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
  const ordered = [...locations].sort((a, b) => Number(b.priority ?? 0) - Number(a.priority ?? 0));

  return (
    <Section tone={tone}>
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <span className={cn("inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]", dark ? "text-mint-400" : "text-hydro-600")}>
            <Icon name="pin" className="h-4 w-4" />
            Where we work
          </span>
          <h2 className={cn("text-display-sm sm:text-4xl", dark ? "text-white" : "text-ink-900")}>
            Serving all of {site.serviceRegion}
          </h2>
          <p className={cn("leading-relaxed", dark ? "text-ink-200" : "text-ink-500")}>
            Based in {site.address.city}, on the road across the whole region. If
            you&apos;re near one of these, you&apos;re in our patch, and if you&apos;re not
            sure, ask.
          </p>
          <ul className="flex flex-wrap gap-2">
            {ordered.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/service-areas/${l.slug}`}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-pill px-4 py-1.5 text-sm transition-colors",
                    l.priority ? "font-bold" : "font-medium",
                    dark
                      ? l.priority
                        ? "bg-white/15 text-white hover:bg-white/25"
                        : "bg-white/5 text-ink-200 hover:bg-white/15"
                      : l.priority
                        ? "bg-hydro-50 text-hydro-800 hover:bg-hydro-100"
                        : "bg-sand-100 text-ink-600 hover:bg-sand-200",
                  )}
                >
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
          <p className={cn("text-sm leading-relaxed", dark ? "text-ink-300" : "text-ink-400")}>
            {travelPolicy.note}
          </p>
        </div>
        <CoverageMap locations={locations} onDark={dark} />
      </div>
    </Section>
  );
}
