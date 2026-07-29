import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * When `href` is set the whole card becomes a click target via a stretched
 * overlay link. That keeps the accessible name on a single real anchor while
 * making the entire surface clickable, better than wrapping the card in <a>,
 * which would swallow any nested interactive elements.
 */
export function Card({
  children,
  className,
  href,
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-900/5",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-harbor-500/25",
        className,
      )}
    >
      {children}
      {href && (
        <Link href={href} className="absolute inset-0 z-10" aria-hidden="true" tabIndex={-1}>
          <span className="sr-only" />
        </Link>
      )}
    </div>
  );
}
