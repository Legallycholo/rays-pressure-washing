import type { Bundle } from "@/content/packages";
import { getService } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export function BundleCard({ bundle, anchor = false }: { bundle: Bundle; anchor?: boolean }) {
  const services = bundle.serviceSlugs
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-900/5",
        anchor && bundle.mostPopular && "ring-2 ring-mint-400 lg:scale-105 lg:shadow-lift",
      )}
    >
      {bundle.mostPopular && (
        <p className="bg-mint-400 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-ink-950">
          Most popular
        </p>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-ink-900">{bundle.name}</h3>
        <p className="mt-1 text-sm italic text-ink-500">{bundle.trigger}</p>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {services.map((s) => (
            <li key={s.slug} className="flex w-14 flex-col items-center gap-1 text-center">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-hydro-50 text-hydro-600">
                <Icon name={s.icon} className="h-4.5 w-4.5" />
              </span>
              <span className="text-xs leading-tight text-ink-500">{s.navLabel}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-3">
          {/* mint, not signal — the card's CTA below owns the orange (§2.6) */}
          <Badge tone="mint">Save {bundle.savingsPercent}%</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
            <Icon name="clock" className="h-4 w-4" />
            {bundle.duration}
          </span>
        </div>

        <div className="mt-auto pt-6">
          {/* Only the anchor card gets the orange — R2: one primary per viewport */}
          <Button
            href={`/packages/${bundle.slug}`}
            variant={bundle.mostPopular ? "primary" : "secondary"}
            fullWidth
          >
            See what&apos;s included
          </Button>
        </div>
      </div>
    </div>
  );
}

/** SECTIONS.md §2.6 — the revenue lever gets a full dark section. */
export function BundlesSection({
  bundles,
  heading,
  anchorPopular = true,
}: {
  bundles: Bundle[];
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
  anchorPopular?: boolean;
}) {
  const sorted = [...bundles].sort((a, b) => Number(b.mostPopular ?? 0) - Number(a.mostPopular ?? 0));
  const display = anchorPopular
    ? // popular card centred at lg: [other, popular, other]
      sorted.length === 3
      ? [sorted[1], sorted[0], sorted[2]]
      : sorted
    : bundles;

  return (
    <Section tone="ink">
      <Reveal>
        <SectionHeading
          onDark
          {...(heading ?? {
            eyebrow: "Do it once, do it all",
            title: "Package it and save",
            lede: "The truck's already there — every extra surface cleaned on the same visit costs less than booking it alone.",
          })}
        />
      </Reveal>
      {/* Stays a grid on purpose. Packages are bought by comparison, and a
          linear stack works against reading three of them side by side. */}
      <Reveal delay={100} className="mt-12 sm:mt-16">
        <ul className="grid items-stretch gap-6 lg:grid-cols-3">
          {display.map((b) => (
            <li key={b.slug}>
              <BundleCard bundle={b} anchor={anchorPopular} />
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
