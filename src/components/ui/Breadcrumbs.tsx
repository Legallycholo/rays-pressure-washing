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
                <Link href={c.href} className="transition-colors hover:text-hydro-400">
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
