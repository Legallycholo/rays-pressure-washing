import { cn } from "@/lib/utils";

/**
 * Inline SVG set — no icon library dependency, no runtime cost, no flash.
 * Service icons are referenced by name from content/services.ts.
 *
 * These are functional line icons at a consistent 24px grid / 1.75 stroke.
 * STRUCTURE.md § Iconography covers replacing them with a custom set.
 */

const paths: Record<string, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V21H3z M9 21v-7h6v7" />,
  roof: (
    <>
      <path d="M2 12 12 4l10 8" />
      <path d="M5 12v8h14v-8" />
      <path d="M9 16h6" />
    </>
  ),
  driveway: (
    <>
      <path d="M7 21 9 3h6l2 18" />
      <path d="M12 7v2M12 12v2M12 17v2" />
    </>
  ),
  deck: (
    <>
      <path d="M3 9h18M3 14h18M3 19h18" />
      <path d="M7 9v10M17 9v10" />
      <path d="M3 5h18" />
    </>
  ),
  fence: (
    <>
      <path d="M5 21V8l2-3 2 3v13M15 21V8l2-3 2 3v13" />
      <path d="M3 11h18M3 16h18" />
    </>
  ),
  gutter: (
    <>
      <path d="M3 7h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
      <path d="M8 14v4M16 14v7" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
  pool: (
    <>
      <path d="M3 17c1.5 0 1.5 1.5 3 1.5s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
      <path d="M7 14V5a2 2 0 0 1 4 0M13 14V5a2 2 0 0 1 4 0" />
      <path d="M7 9h10" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    </>
  ),
  storefront: (
    <>
      <path d="M3 9h18l-1.5-5h-15z" />
      <path d="M4.5 9v11h15V9" />
      <path d="M9.5 20v-6h5v6" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  phone: (
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  star: (
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  ),
  arrow: <path d="M4 12h15m0 0-6-6m6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8h4l1.5-2.5h7L17 8h4v12H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  spray: (
    <>
      <path d="M9 8h5v13H9z" />
      <path d="M9 5h5V3H9zM14 5h3M17 5v3" />
      <path d="M19 9h1M19 12h1M20.5 10.5h1" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3z M8.8 8.2c.3-.6.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.8 2c.1.3 0 .5-.1.7l-.4.5c-.1.2-.3.3-.1.6a7 7 0 0 0 3 2.6c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.3.4.5 0 .8-.6 1.6-1.4 1.8-1.4.3-3.3-.5-5-2a9 9 0 0 1-2.6-4.2c-.2-1 .1-1.9.4-2.5z" />
  ),
  sparkle: (
    <>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="m6.5 6.5 3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" />
    </>
  ),
  droplet: <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3z" />,
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className,
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  const d = paths[name] ?? paths.droplet;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  );
}
