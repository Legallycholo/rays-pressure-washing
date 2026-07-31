import Link from "next/link";
import { site } from "@/content/site";
import { residentialServices } from "@/content/services";
import { locations } from "@/content/locations";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Rating";
import { cn, formatDate } from "@/lib/utils";
import { lastUpdated } from "@/lib/last-updated";

/**
 * Every link in the footer's stacked lists.
 *
 * The footer is where tap targets go wrong on a phone: four columns of 14px
 * text collapse into one long ladder of 20px-tall rows, ten pixels apart, at
 * the very bottom of the page where the thumb has the least precision. Every
 * one of them failed the 44px floor.
 *
 * Fixed by making the row itself the target rather than the words in it,
 * full-width, 44px tall, no gaps needed between them because the padding is the
 * rhythm. Reverted at `lg`, where there is a cursor and the original density is
 * the better-looking layout. Pair it with `footerList`, which drops the
 * `space-y` that would otherwise stack on top of the new row height.
 */
const footerLink =
  "flex min-h-[44px] items-center transition-colors hover:text-white lg:min-h-0 lg:inline-flex";

const footerList = "mt-2 text-sm lg:mt-4 lg:space-y-2.5";

/**
 * A row in the footer's `<address>`: the same 44px tap target as `footerLink`,
 * but block-level `flex` at every width.
 *
 * These rows are direct children of `<address>` with no `<li>` wrapping them,
 * so `footerLink`'s `lg:inline-flex` — right for the link columns — put the
 * phone and email side by side on one line at `lg`, leaving the email out of
 * line with the street address stacked beneath it.
 */
const footerContactRow =
  "flex min-h-[44px] items-center gap-2.5 transition-colors hover:text-white lg:min-h-0";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-300">
      {/* Final conversion band: the last thing before the link farm. */}
      <div className="border-b border-white/10 bg-ink-900 harbor-mesh">
        <Container size="wide" className="py-14">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Ready to see it clean again?
              </h2>
              <p className="mt-2 max-w-xl text-ink-200">
                Call now, or submit the form and we&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">
                Request a Callback
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
              listing. Inconsistent NAP data actively hurts local ranking. */}
          {/* min-w-0 on every grid child: grid items default to min-width:auto,
              so one long unbreakable string (the email) widens the whole track. */}
          <div className="min-w-0 lg:col-span-2">
            <Logo heightClass="h-14 sm:h-16" />

            {/* No trailing "." because the tagline punctuates itself. */}
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{site.tagline}</p>

            <div className="mt-5 flex items-center gap-2">
              <Stars value={site.rating.value} />
              <span className="text-sm">
                <span className="font-semibold text-white">{site.rating.value.toFixed(1)}</span> from{" "}
                {site.rating.count} reviews
              </span>
            </div>

            <address className="mt-4 text-sm not-italic lg:mt-6 lg:space-y-2.5">
              <a href={`tel:${site.contact.phoneHref}`} className={footerContactRow}>
                <Icon name="phone" className="h-4 w-4 shrink-0 text-harbor-400" />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} className={footerContactRow}>
                <Icon name="mail" className="h-4 w-4 shrink-0 text-harbor-400" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{site.contact.email}</span>
              </a>
              <p className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-harbor-400" />
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
            <ul className={footerList}>
              {residentialServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={footerLink}>
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">
              Company
            </h3>
            <ul className={footerList}>
              <li>
                <Link href="/about" className={footerLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={footerLink}>
                  Before &amp; After
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={footerLink}>
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/articles" className={footerLink}>
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLink}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">
              Service Areas
            </h3>
            <ul className={footerList}>
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/service-areas/${l.slug}`}
                    className={footerLink}
                  >
                    {l.city}, {l.region}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/service-areas"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-harbor-400 hover:text-harbor-300 lg:mt-4 lg:min-h-0"
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
              <Icon name="check" className="h-3.5 w-3.5 text-leaf-400" />
              {c}
            </span>
          ))}
        </div>

        {/* ink-300, not ink-400. On the ink-950 footer, ink-400 measures 3.3:1
            against the background, under the 4.5:1 floor for body text, and
            this row is the smallest text on the site. ink-300 is 6.1:1. */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-ink-300 sm:flex-row sm:items-center sm:justify-between">
          {/* Freshness signal, and the honest kind: the date moves on every
              push because it is read from the last commit at build time, not
              typed in and left to rot. `<time>` so it is machine-readable as
              well as visible. See lib/last-updated.ts. */}
          <p>
            © {year} {site.legalName}. All rights reserved.
            <span className="mx-2 text-ink-500" aria-hidden="true">
              ·
            </span>
            Last updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
          </p>
          <div className="flex flex-wrap gap-x-5 lg:gap-y-0">
            <Link href="/privacy" className={cn(footerLink, "justify-center sm:justify-start")}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={cn(footerLink, "justify-center sm:justify-start")}>
              Terms of Service
            </Link>
            <Link href="/accessibility" className={cn(footerLink, "justify-center sm:justify-start")}>
              Accessibility
            </Link>
            <Link href="/sitemap.xml" className={cn(footerLink, "justify-center sm:justify-start")}>
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
