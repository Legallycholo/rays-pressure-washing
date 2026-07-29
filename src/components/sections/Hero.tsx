import { site } from "@/content/site";
import type { Project } from "@/content/gallery";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RatingBadge } from "@/components/ui/Rating";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { cn } from "@/lib/utils";

type Cta = { label: string; href: string };

/**
 * SECTIONS.md §2.2. `home` = split hero with the before/after slider as the
 * visual. `page` = compact centred hero with breadcrumbs, used by every
 * detail page (§3.1).
 */
export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  project,
  variant = "home",
  breadcrumbs,
  extras,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  project?: Project;
  variant?: "home" | "page";
  breadcrumbs?: Crumb[];
  extras?: React.ReactNode;
}) {
  const ctas = (primaryCta || secondaryCta) && (
    <div className="flex flex-col gap-3 sm:flex-row">
      {primaryCta && (
        <Button href={primaryCta.href} size="lg">
          {primaryCta.label}
        </Button>
      )}
      {secondaryCta && (
        <Button href={secondaryCta.href} variant="onDark" size="lg">
          {secondaryCta.href.startsWith("tel:") && <Icon name="phone" className="h-5 w-5" />}
          {secondaryCta.label}
        </Button>
      )}
    </div>
  );

  if (variant === "page") {
    return (
      <Section tone="ink" size="compact" className="blueprint-grid">
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} onDark />}
          <h1 className="max-w-3xl text-display-sm text-white sm:text-display-md">{title}</h1>
          {lede && <p className="max-w-2xl text-lg leading-relaxed text-ink-200">{lede}</p>}
          {extras && <div className="flex flex-wrap items-center justify-center gap-3">{extras}</div>}
          {ctas}
        </div>
      </Section>
    );
  }

  const projectCity = project ? getLocation(project.citySlug)?.city : undefined;

  return (
    <Section
      tone="ink"
      size="flush"
      className="blueprint-grid"
      containerSize="wide"
      innerClassName="py-14 sm:py-20 lg:min-h-[34rem] lg:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr]">
        <div className="flex flex-col items-center gap-6 text-center md:mx-auto md:max-w-2xl lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mint-400">
              <Icon name="pin" className="h-4 w-4" />
              {eyebrow}
            </span>
          )}
          <h1 className="text-display-sm text-white sm:text-display-md lg:text-display-lg">
            {title}
          </h1>
          {lede && <p className="max-w-[55ch] text-lg leading-relaxed text-ink-200 sm:text-xl">{lede}</p>}
          {ctas}
          <RatingBadge onDark />
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            {site.credentials.slice(0, 3).map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 text-sm text-ink-200">
                <Icon name="check" className="h-4 w-4 text-mint-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <figure className={cn("w-full", "lg:pl-4")}>
          <BeforeAfterSlider
            before={project?.before}
            after={project?.after}
            alt={project?.alt ?? "Exterior cleaning before and after"}
            ratio="3/2"
            className="shadow-lift ring-1 ring-white/10"
          />
          {project && (
            <figcaption className="mt-3 text-center text-sm text-ink-300 lg:text-left">
              {project.title}
              {projectCity && <span className="text-ink-400">, {projectCity}</span>}
            </figcaption>
          )}
        </figure>
      </div>
    </Section>
  );
}
