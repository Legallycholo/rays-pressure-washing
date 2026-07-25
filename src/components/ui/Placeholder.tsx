import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Stands in for photography that doesn't exist yet.
 *
 * This is load-bearing for a structure-first build: it reserves the exact
 * aspect ratio the real image will occupy, so layout, spacing and CLS are all
 * final before a single photo is taken. Swapping in <Image> later changes
 * nothing about the surrounding layout.
 */
export function Placeholder({
  label,
  ratio = "4/3",
  className,
  icon = "camera",
  tone = "light",
}: {
  label: string;
  ratio?: "1/1" | "4/3" | "3/2" | "16/9" | "3/4" | "21/9";
  className?: string;
  icon?: string;
  tone?: "light" | "dark";
}) {
  const ratios: Record<string, string> = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-video",
    "3/4": "aspect-[3/4]",
    "21/9": "aspect-[21/9]",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-card p-4 text-center",
        ratios[ratio],
        tone === "dark"
          ? "bg-ink-800 text-ink-300 ring-1 ring-inset ring-white/10"
          : "img-placeholder text-ink-400 ring-1 ring-inset ring-ink-900/5",
        className,
      )}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <Icon name={icon} className="h-7 w-7 opacity-50" />
      <span className="max-w-[22ch] text-xs font-medium leading-snug opacity-70">{label}</span>
    </div>
  );
}
