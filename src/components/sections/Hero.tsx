import { site } from "@/content/site";
import type { Project } from "@/content/gallery";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RatingBadge } from "@/components/ui/Rating";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ProjectMedia } from "@/components/ProjectMedia";
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
  /**
   * Homepage entrance stagger. See the "Hero entrance" block in `globals.css`
   * for why the H1 gets `hero-rise` (transform only) while everything around it
   * gets `hero-in` (transform + fade) — that split is what keeps this from
   * costing LCP, and it is the condition on which the "no hero animation" rule
   * was relaxed at all.
   *
   * Scoped to `home`. The `page` variant is mid-journey navigation, not an
   * opening: someone who clicked through to a service page wants the page, not
   * a curtain-raiser, and thirteen pages use that variant.
   *
   * Order is the order the sentence is read in, not source order — eyebrow sets
   * the place, the headline makes the claim, then the proof and the actions
   * arrive under it.
   */
  const home = variant === "home";
  const enter = (ms: number, kind: "in" | "rise" = "in") =>
    home
      ? {
          className: kind === "rise" ? "hero-rise" : "hero-in",
          style: ms ? ({ "--hero-delay": `${ms}ms` } as React.CSSProperties) : undefined,
        }
      : { className: undefined, style: undefined };

  const ctaEnter = enter(230);

  // `flex-wrap` + `shrink-0`: in the split layout the copy column is narrow
  // enough that two lg buttons on one row were being squeezed under their
  // intrinsic width, which wrapped both labels onto two lines inside the pill.
  // Wrapping whole buttons reads as a deliberate stack; a wrapped label reads
  // as broken. `Button` keeps `max-w-full`, so narrow viewports still fit.
  const ctas = (primaryCta || secondaryCta) && (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", ctaEnter.className)}
      style={ctaEnter.style}
    >
      {primaryCta && (
        <Button href={primaryCta.href} size="lg" className="sm:shrink-0">
          {primaryCta.label}
        </Button>
      )}
      {secondaryCta && (
        <Button href={secondaryCta.href} variant="onDark" size="lg" className="sm:shrink-0">
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
          {/* Same curve as the home hero, so no inner page ever renders an H1
              larger than the homepage's. */}
          <h1 className="max-w-3xl text-display-hero text-white">{title}</h1>
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
      innerClassName="py-10 sm:py-14 lg:min-h-[30rem] lg:py-16"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[7fr_6fr]">
        <div className="flex flex-col items-center gap-5 text-center md:mx-auto md:max-w-2xl lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
          {eyebrow && (
            <span
              className={cn(
                "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-leaf-400",
                enter(0).className,
              )}
            >
              <Icon name="pin" className="h-4 w-4" />
              {eyebrow}
            </span>
          )}
          {/* `display-hero`, not `display-md`: one fluid curve sized for the
              split grid's left track rather than for full container width.
              See the token note in globals.css. This was `display-lg`, which
              clamped to 92px here and wrapped the H1 onto six lines.

              `hero-rise` and NOT `hero-in`: this string is the LCP candidate on
              the page and it paints opaque in the first frame. Never put an
              opacity animation on it. */}
          <h1 className={cn("text-display-hero text-white", enter(60, "rise").className)} style={enter(60, "rise").style}>
            {title}
          </h1>
          {lede && (
            <p
              className={cn("max-w-[52ch] text-lg leading-relaxed text-ink-200", enter(150).className)}
              style={enter(150).style}
            >
              {lede}
            </p>
          )}
          {ctas}
          <div className={enter(310).className} style={enter(310).style}>
            <RatingBadge onDark />
          </div>
          <ul
            className={cn(
              "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start",
              enter(370).className,
            )}
            style={enter(370).style}
          >
            {site.credentials.slice(0, 3).map((c) => (
              // `items-start` + `shrink-0`: the middle credential is long enough
              // to wrap on a phone, and centering left the tick floating beside
              // the gap between its own two lines. It belongs on line one.
              <li key={c} className="inline-flex items-start gap-1.5 text-left text-sm text-ink-200">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <figure className={cn("w-full", "lg:pl-4")}>
          {/* `hero-wipe` puts a panel over the frame and slides it off; the
              image itself is never hidden, clipped or faded, so it is painted
              and LCP-eligible from the first frame. See globals.css.

              Routed through `ProjectMedia` rather than straight to
              `BeforeAfterSlider` so the hero can't break silently: it takes
              `featuredProjects[0]`, and a featured project is now allowed to be
              video-led. Hardcoding the slider here would render an empty
              placeholder the day the array order changes. */}
          {project ? (
            <ProjectMedia
              project={project}
              ratio="16/9"
              priority={home}
              className={cn("shadow-lift ring-1 ring-white/10", home && "hero-wipe")}
            />
          ) : (
            <BeforeAfterSlider
              alt="Exterior cleaning before and after"
              ratio="16/9"
              className={cn("shadow-lift ring-1 ring-white/10", home && "hero-wipe")}
            />
          )}
          {project && (
            <figcaption
              className={cn("mt-3 text-center text-sm text-ink-300 lg:text-left", enter(560).className)}
              style={enter(560).style}
            >
              {project.title}
              {projectCity && <span className="text-ink-400">, {projectCity}</span>}
            </figcaption>
          )}
        </figure>
      </div>
    </Section>
  );
}
