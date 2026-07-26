import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Tailwind height class — width follows the logo aspect ratio. */
  heightClass?: string;
  linked?: boolean;
};

export function Logo({ className, heightClass = "h-10 sm:h-11", linked = false }: LogoProps) {
  // WebP first (95kB vs 163kB for the same pixels), PNG as the fallback.
  // Both carry a real alpha channel — the supplied artwork's black matte was
  // knocked out — so the lockup drops onto the white header and the near-black
  // footer with no box around it.
  const image = (
    <picture>
      <source srcSet={site.logoSrcWebp} type="image/webp" />
      <img
        src={site.logoSrc}
        alt={site.logoAlt}
        width={1024}
        height={392}
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
      <Link href="/" className="inline-flex min-w-0 shrink">
        {image}
      </Link>
    );
  }

  return image;
}
