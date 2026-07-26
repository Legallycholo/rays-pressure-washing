import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "onDark";
type Size = "sm" | "md" | "lg";

/**
 * `primary` is Signal orange and is reserved for the main conversion action.
 * Never put two primaries in the same viewport — if everything is primary,
 * nothing is.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-signal-400 text-ink-950 hover:bg-signal-300 active:bg-signal-500 shadow-card font-semibold",
  secondary:
    "bg-hydro-600 text-white hover:bg-hydro-500 active:bg-hydro-700 shadow-card font-semibold",
  outline:
    "border-2 border-ink-200 text-ink-700 hover:border-hydro-400 hover:text-hydro-700 bg-white/60 font-semibold",
  onDark:
    "border-2 border-white/25 text-white hover:bg-white/10 hover:border-white/50 font-semibold backdrop-blur-sm",
  ghost: "text-hydro-700 hover:bg-hydro-50 font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-2.5",
};

// No `whitespace-nowrap`: it turns a long label into a hard min-width that
// overflows narrow viewports (and grid tracks, whose items are min-width:auto).
// Labels should be short enough not to wrap; when one does, wrapping beats
// breaking the page.
const base =
  "inline-flex max-w-full items-center justify-center rounded-pill text-center transition-all duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "disabled:opacity-50 disabled:pointer-events-none";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  fullWidth,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  // R2 is "never two primaries in one viewport", which is only enforceable if
  // primaries are findable at runtime. This marks them. `Header` uses it to
  // stand its own CTA down while an in-flow primary is on screen, and the gate
  // scripts use it to audit R2 without sniffing Tailwind class names.
  const cta = variant === "primary" ? "primary" : undefined;

  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("sms:");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          data-cta={cta}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} data-cta={cta}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} data-cta={cta} {...rest}>
      {children}
    </button>
  );
}
