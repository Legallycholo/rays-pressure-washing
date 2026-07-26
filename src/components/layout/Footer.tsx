import Link from "next/link";
import { site, waLink } from "@/content/site";
import { residentialServices, commercialServices } from "@/content/services";
import { locations } from "@/content/locations";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Rating";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-300">
      {/* Final conversion band — the last thing before the link farm. */}
      <div className="border-b border-white/10 bg-ink-900 hydro-mesh">
        <Container size="wide" className="py-14">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Ready to see it clean again?
              </h2>
              <p className="mt-2 max-w-xl text-ink-200">
                Free, no-obligation quote. Most estimates are back with you the same day.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/quote" size="lg">
                Get My Free Quote
              </Button>
              <Button href={`tel:${site.contact.phoneHref}`} variant="onDark" size="lg">
                <Icon name="phone" className="h-5 w-5" />
                {site.contact.phone}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container size="wide" className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Identity + NAP. Keep this exactly consistent with every directory
              listing — inconsistent NAP data actively hurts local ranking. */}
          {/* min-w-0 on every grid child: grid items default to min-width:auto,
              so one long unbreakable string (the email) widens the whole track. */}
          <div className="min-w-0 lg:col-span-2">
            <Logo heightClass="h-11 sm:h-12" />

            {/* No trailing "." — the tagline punctuates itself. */}
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{site.tagline}</p>

            <div className="mt-5 flex items-center gap-2">
              <Stars value={site.rating.value} />
              <span className="text-sm">
                <span className="font-semibold text-white">{site.rating.value.toFixed(1)}</span> from{" "}
                {site.rating.count} reviews
              </span>
            </div>

            <address className="mt-6 space-y-2.5 text-sm not-italic">
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="phone" className="h-4 w-4 text-hydro-400" />
                {site.contact.phone}
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="whatsapp" filled className="h-4 w-4 text-mint-400" />
                Message us on WhatsApp
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-hydro-400" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{site.contact.email}</span>
              </a>
              <p className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-hydro-400" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.region} {site.address.postalCode}
                </span>
              </p>
            </address>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">
              Residential
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {residentialServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-white">
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">
              Commercial
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {commercialServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-white">
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-display text-sm uppercase tracking-[0.16em] text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition-colors hover:text-white">
                  Before &amp; After
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="transition-colors hover:text-white">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">
              Service Areas
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/service-areas/${l.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {l.city}, {l.region}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/service-areas"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-hydro-400 hover:text-hydro-300"
            >
              All areas
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
          {site.credentials.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-pill bg-white/5 px-3 py-1.5 text-xs font-medium ring-1 ring-inset ring-white/10"
            >
              <Icon name="check" className="h-3.5 w-3.5 text-mint-400" />
              {c}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white">
              Accessibility
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
