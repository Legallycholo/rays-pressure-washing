"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, hoursLine } from "@/content/site";
import { residentialServices } from "@/content/services";
import { priorityLocations } from "@/content/locations";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/gallery", label: "Before & After" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/articles", label: "Articles" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * R2: never two Signal primaries in one viewport.
   *
   * The header CTA is permanent; in-flow primaries (the hero's, `CtaBand`'s,
   * `GuaranteeBand`'s) scroll past it, and wherever they overlap there were two
   * oranges competing. The header is the one that yields: it stands down while
   * any in-flow primary is on screen and takes over the moment none is.
   *
   * Keyed off `data-cta="primary"` from `Button`, not off "is the hero
   * visible", five pages have a hero with no primary at all, and hiding the
   * header CTA on those would cost a conversion path to avoid a conflict that
   * isn't there.
   */
  const [inFlowPrimary, setInFlowPrimary] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setInFlowPrimary(visible.size > 0);
    });
    // Every primary except the header's own. Not scoped to <main>: the footer
    // carries the closing conversion band (R4), and scoping this to main left
    // the header competing with it at the bottom of every page.
    document.querySelectorAll("[data-cta='primary']").forEach((el) => {
      if (!el.closest("header")) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Utility bar: phone number above the fold on every page, on purpose.
          In this trade the phone call IS the conversion.

          What is NOT here: "Licensed & insured". It is `site.credentials[0]`,
          which already renders in the TrustBar directly under the hero, in the
          hero's own credential list and in the footer — four impressions of one
          claim before a visitor has scrolled once. What survives is the set that
          can't be got anywhere else at a glance: where we go, when we answer,
          and the two ways to reach us.

          The email sits beside the phone but is deliberately quieter — icon,
          regular weight, `ink-300` — while the phone keeps `text-white
          font-semibold` and the rightmost slot. Two contact details styled the
          same would read as a choice; styled like this they read as the number
          to call, with a fallback. Do not level them up.

          `ink-300` on `ink-950` is 6.1:1, so the quieter treatment still clears
          the 4.5:1 body-text floor — same reasoning as the footer's bottom row. */}
      <div className="hidden bg-ink-950 text-ink-300 lg:block">
        <Container size="wide">
          <div className="flex h-9 items-center justify-between gap-6 text-[0.8125rem]">
            <span className="inline-flex shrink-0 items-center gap-2">
              <Icon name="pin" className="h-3.5 w-3.5 text-leaf-400" />
              Serving {site.serviceRegion}
            </span>
            <div className="flex shrink-0 items-center gap-6">
              <span className="inline-flex items-center gap-2">
                <Icon name="clock" className="h-3.5 w-3.5 text-harbor-400" />
                {hoursLine}
              </span>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Icon name="mail" className="h-3.5 w-3.5 text-harbor-400" />
                {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="font-semibold text-white transition-colors hover:text-harbor-300"
              >
                {site.contact.phone}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300 ease-out-expo",
          scrolled
            ? "border-ink-900/10 bg-white/90 shadow-card backdrop-blur-lg"
            : "border-transparent bg-white",
        )}
      >
        <Container size="wide">
          <nav
            className="flex h-[var(--header-height)] items-center justify-between gap-10"
            aria-label="Main"
          >
            <Logo linked className="min-w-0" />

            {/* Desktop nav.

                Density, not size, was the problem (OPTIMIZATION.md item 1 made
                the logo bigger on purpose and that stands). Three changes, all
                spacing: the row gets `gap-10` instead of `gap-6` so the logo,
                the links and the actions read as three separate zones; the
                links themselves sit on `gap-1.5`/`px-3.5`; and the active state
                is now an underline rather than a colour swap, so "where am I"
                survives for anyone who can't separate harbor from ink. */}
            <ul className="hidden items-center gap-1.5 xl:flex">
              <li className="group relative">
                <Link
                  href="/services"
                  className={cn(
                    "relative inline-flex items-center gap-1 rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors",
                    "hover:bg-sand-50 hover:text-harbor-700",
                    "after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-leaf-500 after:transition-transform after:duration-200 after:ease-out-expo",
                    pathname.startsWith("/services")
                      ? "text-harbor-700 after:scale-x-100"
                      : "text-ink-700 after:scale-x-0",
                  )}
                >
                  Services
                  <Icon name="chevron" className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Link>

                {/* Mega menu. CSS-driven so there's no JS state to get wrong;
                    focus-within keeps it keyboard-operable.

                    Services run two columns rather than one, which halves the
                    panel's height — seven stacked rows next to a short promo
                    card left a column of dead white space and made the menu the
                    tallest thing on the page. Icons plus the short `navLabel`
                    carry each row; nothing here needs a sentence. */}
                <div className="invisible absolute left-1/2 top-full w-[50rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 ease-out-expo group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid grid-cols-3 gap-8 rounded-2xl bg-white p-7 shadow-lift ring-1 ring-ink-900/10">
                    <div className="col-span-2">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">
                        Services
                      </p>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        {residentialServices.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-sand-50 hover:text-harbor-700"
                            >
                              <Icon name={s.icon} className="h-4 w-4 text-harbor-500" />
                              {s.navLabel}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="harbor-mesh flex flex-col justify-center rounded-xl bg-ink-900 p-5 text-white">
                      <p className="font-display text-xl leading-tight">
                        Own a big place on the lake?
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-200">
                        Send your address. We come back with a price.
                      </p>
                      <a
                        href={`tel:${site.contact.phoneHref}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300"
                      >
                        Call {site.contact.phone}
                        <Icon name="arrow" className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-sand-50 hover:text-harbor-700",
                      "after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-leaf-500 after:transition-transform after:duration-200 after:ease-out-expo",
                      pathname.startsWith(l.href)
                        ? "text-harbor-700 after:scale-x-100"
                        : "text-ink-700 after:scale-x-0",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-2">
              {/* Visibility lives on wrappers: Button's own `inline-flex` beats a
                  passed-in `hidden` in the cascade (same-specificity conflict).
                  Phone hides again at xl; the utility bar already shows it. */}
              <span className="hidden sm:block xl:hidden">
                <Button href={`tel:${site.contact.phoneHref}`} variant="outline" size="sm">
                  <Icon name="phone" className="h-4 w-4" />
                  {site.contact.phone}
                </Button>
              </span>
              <span
                // Fades rather than unmounts so the header doesn't reflow on
                // every scroll past a CTA band; `inert` keeps it out of the tab
                // order while it's standing down.
                inert={inFlowPrimary}
                className={cn(
                  "hidden transition-opacity duration-300 sm:block",
                  inFlowPrimary ? "opacity-0" : "opacity-100",
                )}
              >
                <Button href="/contact" size="sm">
                  Request a Callback
                </Button>
              </span>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid h-11 w-11 place-items-center rounded-xl text-ink-800 ring-1 ring-ink-900/10 xl:hidden"
              >
                <span className="relative block h-4 w-5">
                  <span
                    className={cn(
                      "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                      open ? "top-[7px] rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-all duration-200",
                      open && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                      open ? "top-[7px] -rotate-45" : "top-[14px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-[var(--header-height)] z-40 overflow-y-auto bg-white xl:hidden"
      >
        <Container className="py-6">
          <div className="flex flex-col gap-2">
            <Button href="/contact" size="lg" fullWidth>
              Request a Callback
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button href={`tel:${site.contact.phoneHref}`} variant="secondary" size="md">
                <Icon name="phone" className="h-4 w-4" />
                Call
              </Button>
              <Button href={`sms:${site.contact.phoneHref}`} variant="outline" size="md">
                Text Us
              </Button>
            </div>
          </div>

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">
            Services
          </p>
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {residentialServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex items-center gap-3 py-3.5 font-medium text-ink-800"
                >
                  <Icon name={s.icon} className="h-5 w-5 text-harbor-500" />
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">
            Explore
          </p>
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3.5 font-medium text-ink-800">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">
            Popular Areas
          </p>
          <div className="flex flex-wrap gap-2 pb-10">
            {priorityLocations.map((l) => (
              <Link
                key={l.slug}
                href={`/service-areas/${l.slug}`}
                // The rest of this drawer is `py-3.5` rows that clear 44px
                // comfortably; these pills were the one thing in it that
                // didn't, at 32px, in the one menu that only ever gets used
                // by a thumb.
                className="inline-flex min-h-[44px] items-center rounded-pill bg-sand-100 px-4 py-1.5 text-sm font-medium text-ink-700"
              >
                {l.city}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
