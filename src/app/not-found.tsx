import Link from "next/link";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <Section tone="ink" size="spacious" className="blueprint-grid">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="font-display text-display-lg text-harbor-400">404</span>
        <h1 className="text-display-sm text-white">That page got washed away</h1>
        <p className="max-w-md text-ink-200">
          The page you&apos;re after doesn&apos;t exist, but the cleaning does. Start from
          our services, or ask us directly.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/services" variant="secondary">
            Browse Services
          </Button>
          <Button href="/quote">Get a Free Quote</Button>
        </div>
        <Link
          href={`tel:${site.contact.phoneHref}`}
          className="inline-flex items-center gap-2 text-sm text-ink-200 transition-colors hover:text-white"
        >
          <Icon name="phone" className="h-4 w-4 text-harbor-400" />
          Or call us: {site.contact.phone}
        </Link>
      </div>
    </Section>
  );
}
