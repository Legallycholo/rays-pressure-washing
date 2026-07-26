import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type Step = { icon: string; title: string; body: string };

export const defaultSteps: Step[] = [
  { icon: "calendar", title: "Get your quote", body: "Four questions online, or one phone call. Same-day in most cases." },
  { icon: "clock", title: "Pick your date", body: "We confirm a window that works and call ahead on the day." },
  { icon: "spray", title: "We clean", body: "The right method for each surface — you don't even need to be home." },
  { icon: "check", title: "Walk it with us", body: "You inspect the result before we leave. That's the guarantee in action." },
];

/** SECTIONS.md §2.8 — four steps, no more. */
export function HowItWorks({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <Section tone="light">
      <SectionHeading
        eyebrow="How it works"
        title="From quote to clean in four steps"
      />
      <ol className="relative mt-12 flex flex-col gap-8 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        {/* base: vertical rail through the circles */}
        <span
          aria-hidden="true"
          className="absolute left-6 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-ink-100 sm:hidden"
        />
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
            {/* lg: horizontal connector between circles only — none after the last */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[calc(50%+2rem)] top-6 hidden h-0.5 w-[calc(100%-4rem)] bg-ink-100 lg:block"
              />
            )}
            <span
              className={cn(
                "relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full",
                "bg-ink-900 font-display text-lg font-bold text-white",
              )}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 sm:justify-center">
                <Icon name={step.icon} className="h-5 w-5 text-hydro-600" />
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
