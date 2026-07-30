import { site, openDaysCount } from "./site";
import { services } from "./services";
import { locations } from "./locations";

/**
 * StatsRow data (SECTIONS.md §2.16, open decision #2).
 *
 * ── Every figure here is derived. That is the point. ────────────────────────
 *
 * This lived in site.ts and carried two invented numbers: "3,400+ properties
 * cleaned" and "1.2M sq ft cleaned last year", both marked PLACEHOLDER, both
 * rendered on the homepage and the about page as statements of fact. They were
 * the same class of problem as the fabricated 4.9-from-218 review count removed
 * during the SEO pass — a public claim about the business that nothing on the
 * site or anywhere else could support.
 *
 * So the row was rebuilt out of things that are true by construction. Add a
 * service and the services tile moves. Add a city and the coverage tile moves.
 * Nothing here can go stale, and nothing here can be wrong.
 *
 * What that costs: the numbers are smaller than invented volume claims. A
 * "3,400+ properties" tile is more impressive than "13 cities" right up until a
 * customer asks which 3,400. Reach, rating and availability are the honest
 * version of the same reassurance, and all three are checkable from the site
 * itself in about ten seconds.
 *
 * Replace any of these with a real operational figure the moment one exists —
 * genuine job counts are stronger than derived ones. Sourced from Ray's records,
 * not estimated.
 *
 * No "Years in business" tile: the founding year it was computed from was
 * placeholder data and the business does not want to claim one yet. Add the
 * tile back only alongside a confirmed year.
 *
 * Lives in its own module rather than site.ts because it reads from the service
 * catalog and the service area. site.ts is business *identity* and should not
 * depend on the content that describes the work — the arrow points this way, not
 * the other.
 */

export const stats = [
  {
    value: String(locations.length),
    label: "Midlands cities covered",
  },
  {
    value: site.rating.value.toFixed(1),
    suffix: " ★",
    label: "Average review score",
  },
  {
    value: String(services.length),
    label: "Services, one visit",
  },
  {
    value: String(openDaysCount),
    suffix: " days",
    label: "Booking every week",
  },
];
