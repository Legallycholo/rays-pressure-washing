import Link from "next/link";
import type { Project } from "@/content/gallery";
import { getService } from "@/content/services";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

/**
 * `expandHref` turns the card title into the lightbox trigger (Phase 2). It is
 * a plain link, not a click handler, which is what makes a single project
 * linkable and lets a server-rendered card open a client-only dialog without
 * dragging the whole grid across the client boundary.
 *
 * The inline slider stays on the card either way, the grid has to preview the
 * motion before anyone decides to click.
 */
export function ProjectCard({
  project,
  expandHref,
}: {
  project: Project;
  expandHref?: string;
}) {
  const service = getService(project.serviceSlug);
  const city = getLocation(project.citySlug);

  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-ink-900/5">
      <BeforeAfterSlider
        before={project.before}
        after={project.after}
        alt={project.alt}
        ratio="3/2"
        className="rounded-b-none"
      />
      <figcaption className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {service && <Badge tone="hydro">{service.name}</Badge>}
        </div>
        <h3 className="mt-3 font-display text-lg text-ink-900">
          {expandHref ? (
            <Link
              href={expandHref}
              scroll={false}
              data-project-trigger={project.id}
              // `py-1 -my-1` grows the tap target past 44px without moving
              // anything: vertical padding inflates the box, the negative
              // margin cancels it out of the line box, so the heading sits
              // exactly where it did.
              className="group/expand -my-1 inline-flex min-h-[44px] items-start gap-1.5 py-1 hover:text-hydro-700"
            >
              {project.title}
              <Icon
                name="expand"
                className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover/expand:text-hydro-600"
              />
              <span className="sr-only">, open full size</span>
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {project.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-4 text-xs font-medium text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {project.durationHours} hours
          </span>
          {city && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {city.city}, {city.region}
            </span>
          )}
          {project.surfaceArea && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="sparkle" className="h-3.5 w-3.5" />
              {project.surfaceArea}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * SECTIONS.md §2.9, server version for homepage/service/city pages.
 * The filterable /gallery variant is GalleryExplorer (client).
 * Never more than 2-up: a small comparison slider is useless.
 */
export function BeforeAfterShowcase({
  projects,
  heading,
  tone = "sand",
  showAllLink = true,
}: {
  projects: Project[];
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
  tone?: "light" | "sand" | "ink";
  showAllLink?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <Section tone={tone}>
      <SectionHeading
        onDark={tone === "ink"}
        {...(heading ?? {
          eyebrow: "Proof, not promises",
          title: "Drag the line. See the difference.",
          lede: "Every job below is a real property and a real result. Drag the divider to compare.",
        })}
      />
      <ul className="mt-12 grid items-stretch gap-6 sm:mt-16 lg:grid-cols-2">
        {projects.slice(0, 4).map((p) => (
          <li key={p.id}>
            {/* Off-gallery cards deep-link into /gallery, where the lightbox is
                mounted: one extra navigation, and it lands people on the page
                that shows every other job too. */}
            <ProjectCard project={p} expandHref={`/gallery?project=${p.id}`} />
          </li>
        ))}
      </ul>
      {showAllLink && (
        <div className="mt-10 text-center">
          <Button href="/gallery" variant={tone === "ink" ? "onDark" : "outline"}>
            See all before &amp; afters
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Section>
  );
}
