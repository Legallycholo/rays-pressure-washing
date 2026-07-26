"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { projects } from "@/content/gallery";
import { services } from "@/content/services";
import { locations } from "@/content/locations";
import { ProjectCard } from "./BeforeAfterShowcase";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { replaceQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

/**
 * Filterable gallery (SECTIONS.md §2.9). Filter state lives in the URL query
 * (open decision #3) so a filtered view is linkable and shareable.
 * Must render inside <Suspense> — useSearchParams requires it.
 */
export function GalleryExplorer() {
  const pathname = usePathname();
  const params = useSearchParams();
  const serviceFilter = params.get("service") ?? "";
  const cityFilter = params.get("city") ?? "";

  // `replaceQuery` rather than `router.replace` — see src/lib/url.ts. The
  // router version silently no-ops on the exact case this feature exists for:
  // someone opening a shared, already-filtered URL and then changing a filter.
  const setFilter = useCallback(
    (key: "service" | "city", value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value && next.get(key) !== value) next.set(key, value);
      else next.delete(key);
      // Changing the filter set can orphan an open lightbox — clear it too.
      next.delete("project");
      replaceQuery(pathname, next);
    },
    [params, pathname],
  );

  const filtered = projects.filter(
    (p) =>
      (!serviceFilter || p.serviceSlug === serviceFilter) &&
      (!cityFilter || p.citySlug === cityFilter),
  );

  // Lightbox links carry the current filters through, so closing the dialog
  // returns to the same filtered view rather than resetting it.
  const expandHref = (id: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("project", id);
    return `/gallery?${next}`;
  };

  // Only offer filter values that exist in the data.
  const serviceOptions = services.filter((s) => projects.some((p) => p.serviceSlug === s.slug));
  const cityOptions = locations.filter((l) => projects.some((p) => p.citySlug === l.slug));

  const chip = (active: boolean) =>
    cn(
      "rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors",
      active ? "bg-ink-900 text-white" : "bg-sand-100 text-ink-600 hover:bg-sand-200",
    );

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by service">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-400">Service</span>
          <button type="button" onClick={() => setFilter("service", "")} className={chip(!serviceFilter)}>
            All
          </button>
          {serviceOptions.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setFilter("service", s.slug)}
              className={chip(serviceFilter === s.slug)}
              aria-pressed={serviceFilter === s.slug}
            >
              {s.navLabel}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by city">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-400">City</span>
          <button type="button" onClick={() => setFilter("city", "")} className={chip(!cityFilter)}>
            All
          </button>
          {cityOptions.map((l) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => setFilter("city", l.slug)}
              className={chip(cityFilter === l.slug)}
              aria-pressed={cityFilter === l.slug}
            >
              {l.city}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} expandHref={expandHref(p.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-card bg-sand-50 p-10 text-center ring-1 ring-ink-900/5">
          <p className="font-semibold text-ink-700">No projects yet for that combination.</p>
          <button
            type="button"
            onClick={() => replaceQuery(pathname, new URLSearchParams())}
            className="mt-2 text-sm font-semibold text-hydro-700 underline underline-offset-2 hover:no-underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Prev/next inside the dialog walks the *filtered* set, so the arrow
          keys agree with what the grid behind the scrim is showing. */}
      <GalleryLightbox projects={filtered} />
    </div>
  );
}
