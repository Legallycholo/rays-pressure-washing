import { cn } from "@/lib/utils";

type Tone = "hydro" | "mint" | "signal" | "neutral" | "onDark";

const tones: Record<Tone, string> = {
  hydro: "bg-harbor-50 text-harbor-700 ring-harbor-500/20",
  mint: "bg-leaf-400/15 text-leaf-700 ring-leaf-500/25",
  signal: "bg-amber-50 text-amber-700 ring-amber-500/20",
  neutral: "bg-sand-100 text-ink-600 ring-ink-900/10",
  onDark: "bg-white/10 text-white ring-white/20",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
