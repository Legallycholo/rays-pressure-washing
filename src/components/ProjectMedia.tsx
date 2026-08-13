import type { Project } from "@/content/gallery";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { VideoPlayer } from "@/components/VideoPlayer";

/**
 * The one place that decides how a project's media renders.
 *
 * `Project.video` had been typed on every project since the gallery was built
 * and read by nothing: both `ProjectCard` and `GalleryLightbox` hardcoded
 * `BeforeAfterSlider`, so a project carrying real footage would silently have
 * rendered an empty placeholder frame instead. Wiring the field in two places
 * would have left the same trap for the next media type, so the branch lives
 * here and both consumers call this.
 *
 * Video wins when present. A job with footage but no before/after pair (both of
 * Ray's clips are exactly that) has nothing for the slider to compare, and an
 * empty slider beside a real clip is worse than no slider.
 *
 * Server component — it only picks a child. Both children are the client
 * components they already were, so nothing new crosses the boundary.
 */
export function ProjectMedia({
  project,
  ratio = "3/2",
  className,
  priority = false,
}: {
  project: Project;
  ratio?: "4/3" | "3/2" | "16/9" | "1/1" | "3/4" | "4/5";
  className?: string;
  /** Set on the homepage hero only — the one project image that is LCP. */
  priority?: boolean;
}) {
  const effectiveRatio = project.ratio ?? ratio;
  const effectiveFit = project.fit ?? "cover";

  if (project.video?.src) {
    return (
      <VideoPlayer
        variant="showcase"
        src={project.video.src}
        poster={project.video.poster}
        alt={project.video.alt}
        ratio={effectiveRatio}
        // Ray's clips are portrait phone video in a landscape card. See the
        // `fit` note in VideoPlayer.
        fit={project.fit ?? "contain"}
        className={className}
      />
    );
  }

  return (
    <BeforeAfterSlider
      before={project.before}
      after={project.after}
      alt={project.alt}
      ratio={effectiveRatio}
      fit={effectiveFit}
      priority={priority}
      className={className}
    />
  );
}
