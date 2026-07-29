import Link from "next/link";
import { pressMentions, type PressMention } from "@/content/press";
import { Section } from "@/components/ui/Section";

/**
 * "As seen in" row. Fails closed: with no mentions it renders nothing, not an
 * empty band, not placeholder logos. See `src/content/press.ts` for why that
 * is the only acceptable empty state for this particular section.
 *
 * `tone="sand"` keeps R3 intact between `Testimonials` (light) and
 * `ServiceAreaSection` (ink), and when the array is empty those two simply
 * sit next to each other exactly as they did before, so this phase is a no-op
 * on the live page until there is something true to put here.
 */
export function PressBar({
  mentions = pressMentions,
  tone = "sand",
}: {
  mentions?: PressMention[];
  tone?: "light" | "sand";
}) {
  if (mentions.length === 0) return null;

  return (
    <Section tone={tone} size="compact">
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-400">
        As seen in
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {mentions.map((m) => {
          const logo = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.logoSrc}
              alt={m.outlet}
              className="h-8 w-auto max-w-[10rem] object-contain opacity-70 transition-opacity hover:opacity-100"
            />
          );
          return (
            <li key={m.outlet}>
              {m.href ? (
                <Link href={m.href} target="_blank" rel="noopener noreferrer">
                  {logo}
                </Link>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
