import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href: string };

/** Always mirrored by breadcrumbSchema on the page (SECTIONS.md §3.1). */
export function Breadcrumbs({ crumbs, onDark = false }: { crumbs: Crumb[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", onDark ? "text-ink-300" : "text-ink-400")}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {last ? (
                <span aria-current="page" className={onDark ? "text-white" : "text-ink-700"}>
                  {c.name}
                </span>
              ) : (
                // 14px text is a 20px-tall tap target, well under the 44px
                // floor. Grown with a pseudo-element rather than padding
                // because the crumbs sit in a horizontal row: vertical
                // expansion is free real estate, and expanding the box itself
                // would push a breadcrumb bar to 44px tall on every page.
                // Vertical only, horizontal would overlap the next crumb and
                // hand taps to the wrong link.
                <Link
                  href={c.href}
                  className="relative transition-colors after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] hover:text-harbor-400"
                >
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
