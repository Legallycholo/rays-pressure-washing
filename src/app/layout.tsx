import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site, cityState, guaranteeName } from "@/content/site";
import { locations } from "@/content/locations";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { ContactHub } from "@/components/ContactHub";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { INDEXABLE } from "@/lib/indexing";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /**
   * The default was `${site.name} | Pressure Washing & Exterior Cleaning in
   * ${site.serviceRegion}` — 103 characters, against the ~60 Google shows before
   * truncating. Everything that identified the business sat past the cut. This
   * leads with what someone searched and the city, and puts the short brand name
   * last where a truncation costs nothing.
   *
   * The `%s | Ray's` template keeps child titles short for the same reason —
   * check any new page title lands under about 60 characters including the suffix.
   */
  title: {
    default: `Pressure Washing & Window Cleaning in ${cityState} | ${site.shortName}`,
    template: `%s | ${site.shortName}`,
  },
  /**
   * The fallback description for any page that doesn't set its own. Was 218
   * characters — past the ~160 Google renders — so the call to action at the end
   * was never shown. Trimmed to fit; the pages that most need a CTA in the
   * snippet set their own description anyway.
   */
  description:
    `Soft washing, pressure washing and window cleaning for big lake houses and the ` +
    `homes around them, across ${site.serviceRegion}. Backed by the ${guaranteeName}.`,
  applicationName: site.name,
  /**
   * Google has ignored the keywords meta since 2009, so this earns its place
   * only as a cheap hint to the smaller engines and scrapers that still read it.
   * Which means the useful entries are the ones a human would actually type:
   * service plus place. `site.serviceRegion` alone ("the SC Midlands") was doing
   * nothing — the city names are the terms with search behind them.
   */
  keywords: [
    "pressure washing",
    "power washing",
    "soft washing",
    "house washing",
    "window cleaning",
    "driveway cleaning",
    "lake house pressure washing",
    "Lake Murray pressure washing",
    "waterfront home washing",
    `pressure washing ${cityState}`,
    ...locations.slice(0, 5).map((l) => `pressure washing ${l.city} ${l.region}`),
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    // No `images` key: `src/app/opengraph-image.tsx` is the file-convention
    // source and Next injects it automatically. Listing one here as well would
    // emit two og:image tags, and the old value pointed at a JPEG that was
    // never added, so every share 404'd its own preview.
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "-G-b-F6PaBVkTb_Ns5yMUL6JD_0weuqYgIsT5LopW5s",
  },
  // Read from lib/indexing.ts, which app/robots.ts also reads. The two files
  // must agree and the failure mode when they don't is silent, so there is one
  // switch rather than two settings. Flip INDEXABLE to launch.
  robots: {
    index: INDEXABLE,
    follow: INDEXABLE,
    googleBot: {
      index: INDEXABLE,
      follow: INDEXABLE,
      // Let Google use full-length text snippets and large image previews once
      // indexing is on. The defaults are conservative, and for a business that
      // wins on straight answers a truncated snippet is a lost click.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#06131d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The reveal bootstrap below writes an attribute onto <html> before React
    // hydrates, which is a mismatch by construction, suppress it here rather
    // than let it surface as a false alarm on every page.
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col pb-[calc(var(--callbar-height)+var(--safe-bottom))] lg:pb-0">
        {/*
          Arms the entrance-reveal base state before first paint (see
          Reveal.tsx). It has to be inline and synchronous: setting this from a
          `useEffect` would flash the content in, then hide it, then fade it
          back, which is worse than no animation.

          The timer is the failure valve. `data-reveal-live` is set by the
          first `Reveal` that mounts, so if hydration never happens or throws,
          nothing claims it, the base state is dropped, and every revealed
          section becomes plainly visible. Content is never left hidden behind
          a script that didn't run.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.setAttribute('data-reveal-ready','');" +
              "setTimeout(function(){if(!d.hasAttribute('data-reveal-live'))" +
              "d.removeAttribute('data-reveal-ready')},4000)})()",
          }}
        />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {/* The two sitewide nodes every other page's markup points at by @id:
            #business and #website. Emitted once, here, so a crawler resolves one
            business and one publication rather than a copy per page. */}
        <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Two persistent affordances, not three: the mobile-only action bar
            along the bottom edge, and one hub in the bottom-right corner at
            every breakpoint. */}
        <StickyCallBar />
        <ContactHub />
        <Analytics />
      </body>
    </html>
  );
}
