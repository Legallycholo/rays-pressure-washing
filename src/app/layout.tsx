import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
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
import Script from "next/script";
import { PhoneClickTracker } from "@/components/analytics/PhoneClickTracker";

const GOOGLE_ADS_ID = "AW-18151841356";
const GA4_MEASUREMENT_ID = "G-BS8J59041J";

/**
 * The two faces STRUCTURE.md §10.3 specified and nothing ever loaded.
 *
 * `globals.css` listed "Barlow Condensed" and "Inter" in its font stacks with
 * no `@font-face` and no loader behind either, so unless a visitor happened to
 * have them installed locally, every heading on the site fell through to
 * `ui-sans-serif`. The display face is most of the brand's voice, and it was
 * rendering as the same system sans as every competitor's template.
 *
 * `next/font/google` downloads both at BUILD time and serves them from this
 * origin: no runtime request to fonts.googleapis.com, no render-blocking
 * stylesheet in <head>, and no third-party connection to negotiate before text
 * can paint. It also generates a metric-matched local fallback, so `display:
 * swap` swaps without the reflow that normally comes with it — which is the
 * whole reason this is safe to do on a site that guards LCP as carefully as
 * this one.
 *
 * Weights are enumerated for Barlow Condensed because it ships as static
 * instances, not a variable font; Inter is variable, so its axis covers 400–700
 * from one file. 400 is on the display list because `.font-display` is applied
 * to a few non-heading elements that inherit body weight, and a missing weight
 * would be synthesised into a smeared faux-bold.
 */
const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-display-family",
});

const sansFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-family",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /**
   * Title tag strategy: BEST + Primary category + cityname + near me phrases + business name (~200 chars).
   */
  title: {
    default: `BEST Pressure Washing Service Lexington SC - If you're looking for Pressure Washing near me or Soft Washing & Window Cleaning near me - Ray's Window Cleaning & Pressure Washing is the place to be`,
    template: `%s | Ray's Window Cleaning & Pressure Washing`,
  },
  /**
   * The fallback description for any page that doesn't set its own.
   */
  description:
    `Professional pressure washing service, soft washing, and window cleaning for homes ` +
    `across ${site.serviceRegion}. Backed by the ${guaranteeName}.`,
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
    other: {
      "msvalidate.01": "B48039C27D548BB35223EC04C4D43B49",
    },
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
    <html
      lang="en"
      suppressHydrationWarning
      // The two `--font-*-family` custom properties `globals.css` reads. On
      // <html> rather than <body> so anything portalled outside the body tree
      // still inherits them.
      className={`${displayFont.variable} ${sansFont.variable}`}
    >
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
        <PhoneClickTracker />
        {/* Google tag (gtag.js) for Google Ads conversion tracking, and GA4
            riding the same loader and dataLayer — one config call each,
            same script, same tag ID isn't required on both. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            gtag('config', '${GA4_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
