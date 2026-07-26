import type { Service } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn, currency } from "@/lib/utils";

type HeadingProps = { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };

export function ServiceCard({ service, promoted = false }: { service: Service; promoted?: boolean }) {
  return (
    <Card href={`/services/${service.slug}`} className="h-full p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-hydro-50 text-hydro-600">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {promoted && <Badge tone="mint">In season</Badge>}
          <Badge tone="hydro">{service.method}</Badge>
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl text-ink-900">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
        {service.blurb}
      </p>
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between border-t border-ink-100 pt-4">
          <span className="text-sm font-semibold text-ink-800">
            From {currency(service.pricing.minimum)}
          </span>
          <Icon
            name="arrow"
            className="h-4 w-4 text-hydro-600 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Card>
  );
}

/**
 * SECTIONS.md §2.5. `promote` (activeCampaign.promoteServices) sorts those
 * services first and badges them "In season". The /services hub's segment
 * toggle lives in ServicesTabs.tsx, keeping this a Server Component.
 */
export function ServicesGrid({
  services,
  columns = 3,
  promote = [],
  heading,
  tone = "light",
}: {
  services: Service[];
  columns?: 3 | 4;
  promote?: readonly string[];
  heading?: HeadingProps;
  tone?: "light" | "sand";
}) {
  const sorted = promote.length
    ? [...services].sort(
        (a, b) =>
          (promote.includes(a.slug) ? 0 : 1) - (promote.includes(b.slug) ? 0 : 1),
      )
    : services;

  return (
    <Section tone={tone}>
      {heading && <SectionHeading {...heading} />}
      <ul
        className={cn(
          "grid items-stretch gap-6",
          heading && "mt-12 sm:mt-16",
          columns === 4 ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {sorted.map((s) => (
          <li key={s.slug}>
            <ServiceCard service={s} promoted={promote.includes(s.slug)} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
