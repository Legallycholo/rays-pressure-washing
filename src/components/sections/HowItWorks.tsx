import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { StackingCards } from "@/components/StackingCards";
import { cn } from "@/lib/utils";

export type Step = { icon: string; title: string; body: string };

export const defaultSteps: Step[] = [
  { icon: "calendar", title: "Reach out", body: "Call now, or submit the form and we'll get back to you within 24 hours." },
  { icon: "clock", title: "Pick your date", body: "We confirm a window that works and call ahead on the day." },
  { icon: "spray", title: "We clean", body: "The right method for each surface, and you don't even need to be home." },
  { icon: "check", title: "Walk it with us", body: "You inspect the result before we leave. That's the guarantee in action." },
];

/**
 * SECTIONS.md §2.8, four steps, no more.
 *
 * The one section on this site whose content is genuinely sequential, which is
 * why it's the one that gets the stacking deck (`StackingCards`) rather than a
 * grid: each card lands on the last in the same order the customer experiences
 * the steps. Desktop only. On phones a four-card deck would need most of the
 * page's scroll budget to say what a vertical list with a connecting rail
 * already says in one screen, so below `lg` this stays exactly the layout it
 * has always been, same markup, different CSS, no duplicated DOM.
 */
export function HowItWorks({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <Section tone="light">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="From first call to clean in four steps"
        />
      </Reveal>
      <StackingCards
        as="ol"
        className="relative mt-12 flex flex-col gap-8 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-10 lg:mt-20 lg:block"
      >
        {/* base: vertical rail through the circles */}
        <span
          aria-hidden="true"
          className="absolute left-6 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-ink-100 sm:hidden"
        />
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-stack-card
            className="stack-card"
            // Drives the cascading pin offset in CSS. Inline because it has to
            // be right on first paint, before any JS runs.
            style={{ "--i": i } as React.CSSProperties}
          >
            <div
              className={cn(
                "stack-card__inner flex gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center",
                // lg: the step becomes a real card surface, the deck needs an
                // edge and a shadow to read as one card landing on another.
                // Sand rather than white so the recede-into-the-page dimming
                // is visible against this section's white background.
                "lg:flex-row lg:items-center lg:gap-8 lg:rounded-card lg:bg-sand-50 lg:p-10 lg:text-left",
                "lg:shadow-card lg:ring-1 lg:ring-ink-900/5",
              )}
            >
              <span
                className={cn(
                  "relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full",
                  "bg-ink-900 font-display text-lg font-bold text-white",
                  "lg:h-20 lg:w-20 lg:text-3xl",
                )}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 sm:justify-center lg:justify-start lg:text-3xl">
                  <Icon name={step.icon} className="h-5 w-5 text-harbor-600 lg:h-7 lg:w-7" />
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500 lg:max-w-xl lg:text-lg">
                  {step.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </StackingCards>
    </Section>
  );
}
