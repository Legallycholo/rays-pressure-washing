import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { ContactHub } from "@/components/ContactHub";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Pressure Washing & Exterior Cleaning in ${site.serviceRegion}`,
    template: `%s | ${site.name}`,
  },
  description:
    `Professional pressure washing, soft washing and exterior cleaning across ${site.serviceRegion}. ` +
    `Licensed, insured, and backed by the Spotless Guarantee. Call now, or submit the form and we will get back to you within 24 hours.`,
  applicationName: site.name,
  keywords: [
    "pressure washing",
    "power washing",
    "soft washing",
    "house washing",
    "roof cleaning",
    "driveway cleaning",
    site.serviceRegion,
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
  robots: {
    // NOTE: flip to true once real content and real business details are in.
    index: false,
    follow: false,
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
        <JsonLd data={localBusinessSchema()} />
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
      </body>
    </html>
  );
}
