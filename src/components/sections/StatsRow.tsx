import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export type Stat = { value: string; label: string; suffix?: string };

/**
 * SECTIONS.md §2.16 — no count-up animation, by rule.
 *
 * The row fades in as one block; the numbers themselves never animate. A
 * count-up delays the figure being readable and re-triggers every time the row
 * scrolls back into view, which is exactly the toy behaviour the rule exists
 * to prevent. Revealing the container is not the same thing.
 */
export function StatsRow({ stats, tone = "hydro" }: { stats: readonly Stat[]; tone?: "hydro" | "ink" }) {
  return (
    <Section tone={tone} size="compact">
      <Reveal>
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center">
              <dd className="font-display text-display-sm font-bold text-white">
                {s.value}
                {s.suffix && <span className="text-mint-300">{s.suffix}</span>}
              </dd>
              <dt
                className={cn(
                  "text-sm uppercase tracking-wide",
                  tone === "hydro" ? "text-hydro-100" : "text-ink-300",
                )}
              >
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
