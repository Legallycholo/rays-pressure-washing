import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "light" | "sand" | "ink" | "hydro";

const tones: Record<Tone, string> = {
  light: "bg-white text-ink-800",
  sand: "bg-sand-50 text-ink-800",
  ink: "bg-ink-900 text-ink-100 hydro-mesh",
  hydro: "bg-hydro-700 text-white",
};

/**
 * Every page section goes through here so vertical rhythm and the light/dark
 * alternation stay consistent. Alternate tones down the page, never two
 * adjacent sections with the same tone, or the page reads as one long slab.
 */
export function Section({
  children,
  className,
  innerClassName,
  tone = "light",
  size = "default",
  id,
  containerSize,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: Tone;
  size?: "default" | "compact" | "spacious" | "flush";
  id?: string;
  containerSize?: "default" | "wide" | "narrow" | "prose";
}) {
  const sizes = {
    flush: "",
    compact: "py-12 sm:py-16",
    default: "py-16 sm:py-24",
    spacious: "py-24 sm:py-32",
  };
  return (
    <section id={id} className={cn(tones[tone], sizes[size], className)}>
      <Container size={containerSize} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}
