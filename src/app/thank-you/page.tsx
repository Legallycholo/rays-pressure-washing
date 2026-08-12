import type { Metadata } from "next";
import { site, hoursLine } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/Reveal";

/**
 * `noindex, follow`.
 *
 * A conversion confirmation has nothing a searcher wants and everything a
 * ranking signal doesn't: it is thin, it duplicates the promise already made on
 * `/contact`, and a visitor who lands here from a search result arrives at a
 * "thanks!" for a form they never filled in. `follow` stays on so the links out
 * of here still pass equity to the pages that should rank.
 *
 * It is deliberately absent from `app/sitemap.ts` for the same reason — a URL in
 * the sitemap is a request to index it, which directly contradicts this. Do not
 * add it there.
 */
export const metadata: Metadata = {
  title: "Thank You",
  description: `Your callback request reached ${site.name}. We'll be in touch within 24 hours.`,
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: true },
};

/**
 * What actually happens next, in the order it happens.
 *
 * Three steps, not the homepage's four: this page picks the story up after
 * "reach out" is already done, and repeating a step the visitor has just
 * completed makes the list read as generic filler rather than as their job.
 *
 * Every line is a commitment the business can keep without knowing anything
 * about the specific job. Nothing here quotes, estimates or implies a price —
 * same standing directive that governs `ContactForm` and `/contact`.
 */
const nextSteps = [
  {
    icon: "mail",
    title: "It's already through",
    body: "Your details landed with us the moment you hit send. No confirmation link to click, nothing sitting in a queue waiting on you.",
  },
  {
    icon: "phone",
    title: "We call you back",
    body: "Within 24 hours, usually a lot sooner, on the number you gave us and in the window you picked.",
  },
  {
    icon: "calendar",
    title: "We book a time",
    body: "You pick the day. We confirm what we're cleaning and call ahead on the morning. No obligation until you say go.",
  },
];

/** Somewhere useful to go instead of the back button. */
const meanwhile = [
  {
    href: "/gallery",
    icon: "camera",
    title: "Before & after",
    body: "Real local jobs, dragged side by side.",
  },
  {
    href: "/reviews",
    icon: "star",
    title: "What neighbours say",
    body: `${site.rating.value.toFixed(1)} stars across ${site.rating.count} reviews.`,
  },
  {
    href: "/services",
    icon: "spray",
    title: "Everything we clean",
    body: "Each surface on the method it can actually take.",
  },
];

export default function ThankYouPage() {
  return (
    <>
      {/*
        Same entrance vocabulary as the hero — `hero-in` for the surrounding
        elements, `hero-rise` for the H1 — because this is the same situation the
        hero animation was built for: content that is above the fold on arrival,
        so there is nothing to wait to scroll into view. The H1 gets the
        transform-only variant since it is the LCP candidate here and must paint
        opaque in the first frame. See the "Hero entrance" block in globals.css.

        No breadcrumbs and no `Hero variant="page"`: this is the end of a
        journey, not a stop inside one, and offering a trail back up to a form
        that has just been submitted invites a second submission.
      */}
      <Section tone="ink" size="spacious" className="blueprint-grid">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="hero-in grid h-20 w-20 place-items-center rounded-full bg-leaf-400/15 ring-1 ring-leaf-400/30">
            <Icon name="check" className="h-10 w-10 text-leaf-400" />
          </span>

          <h1
            className="hero-rise max-w-3xl text-display-hero text-white"
            style={{ "--hero-delay": "60ms" } as React.CSSProperties}
          >
            That&apos;s with us
          </h1>

          <p
            className="hero-in max-w-xl text-lg leading-relaxed text-ink-200"
            style={{ "--hero-delay": "150ms" } as React.CSSProperties}
          >
            We&apos;ll call you back within 24 hours, usually a lot sooner. Nothing else to
            do on your end.
          </p>

          <div
            className="hero-in flex flex-col items-center gap-3"
            style={{ "--hero-delay": "230ms" } as React.CSSProperties}
          >
            {/*
              `onDark`, not `primary`. The conversion on this page already
              happened; an orange Signal button here would be the loudest thing
              on screen asking someone to convert a second time. The phone is an
              impatience valve, so it reads as one.
            */}
            <Button href={`tel:${site.contact.phoneHref}`} variant="onDark" size="lg">
              <Icon name="phone" className="h-5 w-5" />
              {site.contact.phone}
            </Button>
            <p className="text-sm text-ink-300">
              Rather not wait? We answer {hoursLine}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <Reveal>
          <SectionHeading eyebrow="What happens next" title="Here's how the rest goes" />
        </Reveal>

        <Reveal delay={90}>
          <ol className="relative mx-auto mt-12 flex max-w-2xl flex-col gap-8 sm:mt-16">
            {/* Rail through the numbers, so three separate rows read as one
                sequence. Inset by half the circle so it starts and ends inside
                the first and last, never poking out past them. */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 bg-ink-100"
            />
            {nextSteps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-900 font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="flex items-center gap-2 font-display text-xl text-ink-900">
                    <Icon name={step.icon} className="h-5 w-5 shrink-0 text-harbor-600" />
                    {step.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink-500">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* The one thing on this page that can genuinely go wrong: we call the
            number that was typed in, and a typo is invisible until the call
            doesn't come. Say so plainly and give them the way to fix it. */}
        <Reveal delay={180}>
          <p className="mx-auto mt-12 max-w-2xl rounded-card bg-sand-50 p-5 text-center text-sm leading-relaxed text-ink-600 ring-1 ring-ink-900/5">
            Spotted a typo in your number or need to change something?{" "}
            <a
              href={`tel:${site.contact.phoneHref}`}
              className="font-bold text-harbor-700 underline underline-offset-2"
            >
              Call {site.contact.phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-bold text-harbor-700 underline underline-offset-2 [overflow-wrap:anywhere]"
            >
              {site.contact.email}
            </a>{" "}
            and we&apos;ll sort it before we call.
          </p>
        </Reveal>
      </Section>

      <Section tone="sand">
        <Reveal>
          <SectionHeading eyebrow="While you wait" title="Have a look around" />
        </Reveal>

        <Reveal delay={90}>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {meanwhile.map((m) => (
              <li key={m.href} className="flex">
                {/* `self-start` on both spans, and `flex` on the <li>: the card
                    is a column flex container inside a stretched grid item, so
                    without it a 44px icon badge and a one-line link both blow
                    out to the full card width. `mt-auto` pins the link to the
                    bottom edge so three cards of unequal copy still line their
                    calls to action up. */}
                <Card href={m.href} className="w-full p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center self-start rounded-xl bg-harbor-50 text-harbor-600 ring-1 ring-ink-900/5">
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink-900">{m.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{m.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-semibold text-harbor-700">
                    Take a look
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}
