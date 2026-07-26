/** Minimal class-name joiner. Deliberately dependency-free — swap for clsx +
 *  tailwind-merge if conflicting-class resolution becomes a real problem. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 10 ? 2 : 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Time left until an ISO deadline, as "3d 4h 20m". Returns `null` when the
 * deadline has passed, is missing, or doesn't parse — callers render nothing
 * in that case rather than a dishonest "0d 0h 0m".
 *
 * Pure and `now`-injectable so the boundary behaviour is testable without
 * waiting for real clock time to elapse.
 */
export function timeRemaining(endsAt: string | undefined, now: Date = new Date()): string | null {
  if (!endsAt) return null;
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) return null;

  const ms = end - now.getTime();
  if (ms <= 0) return null;

  const minutes = Math.floor(ms / 60_000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  // Drop leading zero units: "4h 20m" beats "0d 4h 20m".
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}
