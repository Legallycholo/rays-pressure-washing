"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { residentialServices, commercialServices } from "@/content/services";
import { priorityLocations } from "@/content/locations";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/gallery", label: "Before & After" },
  { href: "/pricing", label: "Pricing" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Guides" },
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
      {/* Utility bar — phone number above the fold on every page, on purpose.
          In this trade the phone call IS the conversion. */}
      <div className="hidden bg-ink-900 text-ink-200 lg:block">
        <Container size="wide">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2">
                <Icon name="pin" className="h-4 w-4 text-hydro-400" />
                Serving {site.serviceRegion}
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4 text-hydro-400" />
                Mon–Fri 7am–6pm · Sat 8am–4pm
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2 text-mint-400">
                <Icon name="shield" className="h-4 w-4" />
                Licensed &amp; insured
              </span>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="font-semibold text-white transition-colors hover:text-hydro-300"
              >
                {site.contact.phone}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-ink-900/10 bg-white/90 shadow-card backdrop-blur-lg"
            : "border-transparent bg-white",
        )}
      >
        <Container size="wide">
          <nav
            className="flex h-[var(--header-height)] items-center justify-between gap-6"
            aria-label="Main"
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              {/* PLACEHOLDER mark — replace with the real logo lockup. */}
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-hydro-400">
                <Icon name="droplet" filled className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-ink-900">
                  {site.name}
                </span>
                <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-hydro-600">
                  Exterior Cleaning
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-1 xl:flex">
              <li className="group relative">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-50 hover:text-hydro-700"
                >
                  Services
                  <Icon name="chevron" className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Link>

                {/* Mega menu. CSS-driven so there's no JS state to get wrong;
                    focus-within keeps it keyboard-operable. */}
                <div className="invisible absolute left-1/2 top-full w-[46rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white p-6 shadow-lift ring-1 ring-ink-900/10">
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
                        Residential
                      </p>
                      <ul className="space-y-0.5">
                        {residentialServices.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-600 transition-colors hover:bg-sand-50 hover:text-hydro-700"
                            >
                              <Icon name={s.icon} className="h-4 w-4 text-hydro-500" />
                              {s.navLabel}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
                        Commercial
                      </p>
                      <ul className="space-y-0.5">
                        {commercialServices.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-600 transition-colors hover:bg-sand-50 hover:text-hydro-700"
                            >
                              <Icon name={s.icon} className="h-4 w-4 text-hydro-500" />
                              {s.navLabel}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto rounded-xl bg-ink-900 p-4 text-white hydro-mesh">
                        <p className="font-display text-lg">Not sure what you need?</p>
                        <p className="mt-1 text-sm text-ink-200">
                          Answer four questions and get a ballpark in under a minute.
                        </p>
                        <Link
                          href="/quote"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-signal-400 hover:text-signal-300"
                        >
                          Start free quote
                          <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "rounded-pill px-3 py-2 text-sm font-semibold transition-colors hover:bg-sand-50 hover:text-hydro-700",
                      pathname.startsWith(l.href) ? "text-hydro-700" : "text-ink-700",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Button
                href={`tel:${site.contact.phoneHref}`}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Icon name="phone" className="h-4 w-4" />
                {site.contact.phone}
              </Button>
              <Button href="/quote" size="sm" className="hidden sm:inline-flex">
                Free Quote
              </Button>

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
            <Button href="/quote" size="lg" fullWidth>
              Get My Free Quote
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

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
            Residential
          </p>
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {residentialServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex items-center gap-3 py-3.5 font-medium text-ink-800"
                >
                  <Icon name={s.icon} className="h-5 w-5 text-hydro-500" />
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
            Commercial
          </p>
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {commercialServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex items-center gap-3 py-3.5 font-medium text-ink-800"
                >
                  <Icon name={s.icon} className="h-5 w-5 text-hydro-500" />
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
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

          <p className="mt-8 mb-2 text-xs font-bold uppercase tracking-[0.16em] text-hydro-600">
            Popular Areas
          </p>
          <div className="flex flex-wrap gap-2 pb-10">
            {priorityLocations.map((l) => (
              <Link
                key={l.slug}
                href={`/service-areas/${l.slug}`}
                className="rounded-pill bg-sand-100 px-3 py-1.5 text-sm font-medium text-ink-700"
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
