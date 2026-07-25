import { cn } from "@/lib/utils";

type Tone = "hydro" | "mint" | "signal" | "neutral" | "onDark";

const tones: Record<Tone, string> = {
  hydro: "bg-hydro-50 text-hydro-700 ring-hydro-500/20",
  mint: "bg-mint-400/15 text-mint-700 ring-mint-500/25",
  signal: "bg-signal-50 text-signal-700 ring-signal-500/20",
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
