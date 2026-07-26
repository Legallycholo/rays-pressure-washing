import type { Project } from "@/content/gallery";
import { getService } from "@/content/services";
import { getLocation } from "@/content/locations";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function ProjectCard({ project }: { project: Project }) {
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
        <h3 className="mt-3 font-display text-lg text-ink-900">{project.title}</h3>
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
 * SECTIONS.md §2.9 — server version for homepage/service/city pages.
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
            <ProjectCard project={p} />
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
