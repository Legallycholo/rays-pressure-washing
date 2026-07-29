import type { MaintenancePlan } from "@/content/packages";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * SECTIONS.md §2.7. Placed after results + guarantee, while "keep it looking
 * like this" is the obvious next thought. Teaser only, the three-tier
 * comparison lives on /maintenance-plan.
 */
export function MaintenanceTeaser({ plan, terms }: { plan: MaintenancePlan; terms: string }) {
  return (
    <Section tone="sand">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-harbor-600">
            <span className="h-px w-6 bg-harbor-500/50" aria-hidden="true" />
            Stop thinking about it
          </span>
          <h2 className="text-display-sm text-ink-900 sm:text-4xl">
            Clean once, then keep it that way
          </h2>
          <p className="leading-relaxed text-ink-500">
            Growth comes back on a schedule: 12 to 18 months for siding, faster in
            the shade. A maintenance plan puts the next visit on our calendar instead
            of your to-do list, at a lower rate than booking one-off.
          </p>
          <ul className="space-y-2.5">
            {plan.includes.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-ink-700">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" />
                {item}
              </li>
            ))}
          </ul>
          <Button href="/maintenance-plan" variant="secondary" className="mt-2">
            Compare the plans
          </Button>
        </div>

        <div className="rounded-card bg-white p-8 shadow-lift ring-1 ring-ink-900/5">
          {/* Terms lead: "cancel any time" is the objection, answer it first */}
          <Badge tone="mint">Month-to-month · cancel any time</Badge>
          <h3 className="mt-4 font-display text-2xl text-ink-900">{plan.name}</h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-ink-400">
            {plan.frequency}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink-600">{plan.blurb}</p>
          <p className="mt-6 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-500">
            <span className="font-semibold text-ink-700">Best for:</span> {plan.bestFor}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink-400">{terms}</p>
        </div>
      </div>
    </Section>
  );
}
