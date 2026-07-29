import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Tailwind height class, width follows the logo aspect ratio. */
  heightClass?: string;
  linked?: boolean;
};

/**
 * The lockup is height-constrained everywhere it appears (h-10 → h-12), so its
 * real rendered width is about 105–125px, never more. The master is 1024px
 * wide, which meant every visit downloaded roughly eight times the pixels it
 * could display; Lighthouse scored it as the single largest wasted payload on
 * the homepage at ~90KiB.
 *
 * These are the same artwork resampled, generated from `logo.png` with sharp.
 * The 1024 master stays as the last `srcset` entry and as the `src` fallback,
 * so nothing regresses on a browser that ignores `srcset`, and regenerating
 * them after the real branding lands is one command against the new master.
 */
const WIDTHS = [256, 384, 512, 1024] as const;
const srcSetFor = (ext: "webp" | "png") =>
  WIDTHS.map((w) => `${w === 1024 ? `/logo.${ext}` : `/logo-${w}.${ext}`} ${w}w`).join(", ");

/**
 * Widest the lockup is ever laid out, the footer's `h-12` at the logo's 2.61
 * aspect ratio, rounded up. A fixed `sizes` rather than a breakpoint list
 * because the height classes vary per call site while the *ceiling* does not,
 * and over-declaring here costs one step up the srcset at most.
 */
const SIZES = "130px";

export function Logo({ className, heightClass = "h-10 sm:h-11", linked = false }: LogoProps) {
  // WebP first (93kB vs 159kB at full size, and it stays ahead at every width),
  // PNG as the fallback. Both carry a real alpha channel, the supplied
  // artwork's black matte was knocked out, so the lockup drops onto the white
  // header and the near-black footer with no box around it.
  const image = (
    <picture>
      <source srcSet={srcSetFor("webp")} sizes={SIZES} type="image/webp" />
      <img
        src={site.logoSrc}
        srcSet={srcSetFor("png")}
        sizes={SIZES}
        alt={site.logoAlt}
        width={705}
        height={354}
        className={cn(
          "w-auto max-w-[min(100%,14rem)] object-contain sm:max-w-[min(100%,18rem)]",
          heightClass,
          className,
        )}
      />
    </picture>
  );

  if (linked) {
    return (
      <Link href="/" className="inline-flex min-h-[44px] min-w-0 shrink items-center">
        {image}
      </Link>
    );
  }

  return image;
}
