"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/content/gallery";
import { getService } from "@/content/services";
import { getLocation } from "@/content/locations";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { replaceQuery } from "@/lib/url";

/**
 * Full-size project viewer, built on the native <dialog>.
 *
 * `showModal()` gives us the focus trap, the inert background, `Esc`-to-close
 * and `::backdrop` for free, all of which a modal library reimplements, less
 * well, for ~15kB. There is nothing here a dependency would improve.
 *
 * State lives in `?project=<id>`, the same convention `GalleryExplorer` already
 * uses for its filters, so a single project is linkable, shareable, and closes
 * on the browser back button without any popstate wiring of our own.
 */
export function GalleryLightbox({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openId = params.get("project");
  const index = projects.findIndex((p) => p.id === openId);
  const project = index >= 0 ? projects[index] : undefined;

  // Whether this open state came from a click in the page (the trigger <Link>
  // pushed a history entry, so closing should pop it) or from someone landing
  // on a shared ?project= URL (nothing was pushed, popping would walk them
  // off the site). Detected from the click itself rather than inferred from
  // render order, which is not reliable: a statically prerendered page can
  // render once with empty search params before hydration fills them in, and
  // that alone looks exactly like an in-page open.
  const openedByClick = useRef(false);
  // Which card to hand focus back to when the dialog closes.
  const lastOpenId = useRef<string | null>(null);

  const setProject = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (id) next.set("project", id);
      else next.delete("project");
      replaceQuery(pathname, next);
    },
    [params, pathname],
  );

  const close = useCallback(() => {
    if (openedByClick.current) router.back();
    else setProject(null);
  }, [router, setProject]);

  const step = useCallback(
    (delta: number) => {
      if (index < 0 || projects.length < 2) return;
      const next = (index + delta + projects.length) % projects.length;
      setProject(projects[next].id);
    },
    [index, projects, setProject],
  );

  useEffect(() => {
    const onTriggerClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.("[data-project-trigger]")) {
        openedByClick.current = true;
      }
    };
    document.addEventListener("click", onTriggerClick, true);
    return () => document.removeEventListener("click", onTriggerClick, true);
  }, []);

  useEffect(() => {
    if (!openId) openedByClick.current = false;
  }, [openId]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (project && !dlg.open) dlg.showModal();
    if (!project && dlg.open) dlg.close();

    // showModal() blocks interaction but not scrolling, lock it ourselves.
    document.documentElement.classList.toggle("overflow-hidden", Boolean(project));

    if (project) {
      lastOpenId.current = project.id;
    } else if (lastOpenId.current) {
      document
        .querySelector<HTMLElement>(`[data-project-trigger="${lastOpenId.current}"]`)
        ?.focus();
      lastOpenId.current = null;
    }
  }, [project]);

  useEffect(() => () => document.documentElement.classList.remove("overflow-hidden"), []);

  const service = project ? getService(project.serviceSlug) : undefined;
  const city = project ? getLocation(project.citySlug) : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-label={project ? `Project: ${project.title}` : "Project viewer"}
      onClose={() => {
        // Fires for Esc and for our own close() call. Only act on the former:
        // when we closed it deliberately the URL is already clean.
        if (openId) close();
      }}
      onKeyDown={(e) => {
        // The comparison slider inside is an <input type="range">, arrow keys
        // there belong to the slider, not to project navigation.
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      }}
      // `dialog-pop` is the open/close transition (globals.css). It has to be
      // plain CSS rather than Tailwind utilities because it needs
      // `@starting-style` and `allow-discrete`, neither of which a utility
      // class can express.
      className={
        "dialog-pop m-auto w-[calc(100vw-1.5rem)] max-w-3xl rounded-card bg-white p-0 text-ink-800 shadow-lift " +
        "max-h-[calc(100dvh-1.5rem)] overflow-y-auto " +
        "backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
      }
    >
      {project && (
        <div className="flex flex-col">
          <div className="relative">
            <BeforeAfterSlider
              before={project.before}
              after={project.after}
              alt={project.alt}
              ratio="3/2"
              className="rounded-b-none"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close project viewer"
              className="absolute right-3 bottom-3 z-30 grid h-11 w-11 place-items-center rounded-full bg-ink-950/75 text-white backdrop-blur-sm transition-colors hover:bg-ink-950"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {service && <Badge tone="hydro">{service.name}</Badge>}
              {city && <Badge tone="neutral">{`${city.city}, ${city.region}`}</Badge>}
            </div>
            <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">{project.title}</h2>
            <p className="leading-relaxed text-ink-600">{project.summary}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Icon name="clock" className="h-4 w-4 text-ink-400" />
                <dt className="sr-only">Time on site</dt>
                <dd className="font-medium text-ink-700">{project.durationHours} hours</dd>
              </div>
              {project.surfaceArea && (
                <div className="flex items-center gap-1.5">
                  <Icon name="sparkle" className="h-4 w-4 text-ink-400" />
                  <dt className="sr-only">Surface cleaned</dt>
                  <dd className="font-medium text-ink-700">{project.surfaceArea}</dd>
                </div>
              )}
            </dl>

            {projects.length > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-hydro-700 transition-colors hover:bg-hydro-50"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                  Previous
                </button>
                <span className="text-xs font-medium text-ink-400">
                  {index + 1} of {projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-hydro-700 transition-colors hover:bg-hydro-50"
                >
                  Next
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
