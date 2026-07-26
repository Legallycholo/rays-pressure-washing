import type { Metadata } from "next";
import { site, cityState } from "@/content/site";
import { featuredServices } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RatingBadge } from "@/components/ui/Rating";

export const metadata: Metadata = {
  title: `Pressure Washing & Exterior Cleaning in ${site.serviceRegion}`,
  description:
    `${site.name} — soft washing, roof cleaning, driveway and concrete cleaning across ` +
    `${site.serviceRegion}. Free same-day quotes, backed by the ${site.guarantee.title}.`,
  alternates: { canonical: "/" },
};

/**
 * PHASE 1 STUB — exists to make the build green (CHECKLIST.md Phase 1).
 * The real homepage is Phase 3 and assembles the section components from
 * STRUCTURE.md §8.1 once Phase 2 delivers them. Do not grow this file;
 * replace it.
 */
export default function HomePage() {
  return (
    <>
      <Section tone="ink" size="spacious" className="blueprint-grid">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mint-400">
            <Icon name="pin" className="h-4 w-4" />
            Serving {site.serviceRegion} from {cityState}
          </span>
          <h1 className="max-w-3xl text-display-md text-white">{site.tagline}</h1>
          <p className="max-w-xl text-lg text-ink-200">
            Soft washing, pressure washing and exterior cleaning — quoted free,
            scheduled fast, and backed by the {site.guarantee.title}.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/quote" size="lg">
              Get My Free Quote
            </Button>
            <Button href={`tel:${site.contact.phoneHref}`} variant="onDark" size="lg">
              <Icon name="phone" className="h-5 w-5" />
              {site.contact.phone}
            </Button>
          </div>
          <RatingBadge onDark />
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="What we clean"
          title="Every exterior surface, the right way"
          lede="Full site launching soon — these are the services we're bringing with it."
        />
        <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {featuredServices.map((s) => (
            <li
              key={s.slug}
              className="flex items-center gap-3 rounded-card bg-sand-50 p-4 ring-1 ring-ink-900/5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hydro-50 text-hydro-600">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="font-semibold text-ink-800">{s.name}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
