"use client";

import { useEffect, useState } from "react";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

type Ratio = "1/1" | "4/3" | "3/2" | "16/9" | "21/9";

const ratios: Record<Ratio, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

/**
 * A bare <video> element with the two behaviours this site actually needs.
 * No player library: everything below is native browser behaviour, and a
 * dependency here would buy skinning we don't want and ship ~40kB we don't need.
 *
 * `showcase`, real content. Controls on, autoplay off, captions when supplied.
 * `background`, decorative motion only. Muted, looping, no controls, and
 * `aria-hidden`, because it must never be the only carrier of a message; the
 * surrounding copy says everything the clip says.
 *
 * Reduced motion: the `background` variant renders the poster still and never
 * mounts a <video> at all. Pausing would still cost the download, and someone
 * who asked for less motion did not ask for a slower page as well.
 *
 * Empty `src` renders the same placeholder frame as `BeforeAfterSlider`, at the
 * final aspect ratio, so layout is settled before footage exists.
 */
export function VideoPlayer({
  src,
  poster,
  alt,
  captionsSrc,
  variant = "showcase",
  ratio = "16/9",
  fit = "cover",
  className,
}: {
  src?: string;
  poster?: string;
  alt: string;
  captionsSrc?: string;
  variant?: "background" | "showcase";
  ratio?: Ratio;
  /**
   * `cover` fills the frame and crops — right for footage shot in the frame's
   * own orientation, and the original behaviour.
   *
   * `contain` letterboxes instead. Ray's two gallery clips are portrait phone
   * video (720x1280) sitting in the gallery's landscape `3/2` card, and
   * covering those crops to a narrow horizontal band that cuts off both the
   * ladder and the roofline — i.e. the entire subject. Pillarboxing against the
   * frame's `ink-900` reads as deliberate on a dark card and shows the whole
   * shot. Keeps the card grid uniform, which a portrait `ratio` would not.
   */
  fit?: "cover" | "contain";
  className?: string;
}) {
  // Starts false so the server render and the first client render agree
  // (poster only). The effect flips it on when motion is actually welcome.
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    if (variant !== "background") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionAllowed(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [variant]);

  const frame = cn("relative overflow-hidden rounded-card bg-ink-900", ratios[ratio], className);

  if (!src) {
    return (
      <Placeholder
        label={`VIDEO: ${alt}`}
        ratio={ratio}
        tone="dark"
        icon="camera"
        className={className}
      />
    );
  }

  if (variant === "background") {
    // Poster-only path: reduced motion, or the pre-hydration render.
    if (!motionAllowed) {
      return (
        <div className={frame} aria-hidden="true">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")} />
          ) : null}
        </div>
      );
    }
    return (
      <div className={frame} aria-hidden="true">
        <video
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <video
        src={src}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        aria-label={alt}
        className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
      >
        {/* Rendered only when a real .vtt exists: an empty track src is a
            broken request, not a graceful fallback. */}
        {captionsSrc ? (
          <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
        ) : null}
      </video>
    </div>
  );
}
