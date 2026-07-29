import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Cta = { label: string; href: string };

/**
 * SECTIONS.md §2.14, MID-PAGE conversion break only. Never a page closer
 * (the Footer band is the closer, §1.6) and never within two sections of it.
 */
export function CtaBand({
  title,
  lede,
  primaryCta = { label: "Get my free quote", href: "/quote" },
  secondaryCta = { label: `Call ${site.contact.phone}`, href: `tel:${site.contact.phoneHref}` },
  variant = "full",
}: {
  title: React.ReactNode;
  lede?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  variant?: "full" | "inline";
}) {
  if (variant === "inline") {
    return (
      <Section tone="ink" size="compact" className="blueprint-grid">
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">{title}</h2>
            {lede && <p className="mt-1.5 text-ink-200">{lede}</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
            <Button href={secondaryCta.href} variant="onDark">
              {secondaryCta.href.startsWith("tel:") && <Icon name="phone" className="h-4 w-4" />}
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="ink" className="blueprint-grid">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-display-sm text-white sm:text-4xl">{title}</h2>
        {lede && <p className="max-w-xl text-lg text-ink-200">{lede}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          <Button href={secondaryCta.href} variant="onDark" size="lg">
            {secondaryCta.href.startsWith("tel:") && <Icon name="phone" className="h-5 w-5" />}
            {secondaryCta.label}
          </Button>
        </div>
        <p className="text-sm text-ink-300">
          Free quotes · {site.guarantee.title} · Licensed &amp; insured
        </p>
      </div>
    </Section>
  );
}
