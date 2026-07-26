import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { StickyQuoteRail } from "@/components/layout/StickyQuoteRail";
import { ChatLauncher } from "@/components/ChatLauncher";
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
    `Licensed, insured, and backed by the Spotless Guarantee. Free same-day quotes.`,
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
    // PLACEHOLDER — add /public/og-default.jpg at 1200×630.
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: site.name }],
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
    <html lang="en">
      <body className="flex min-h-dvh flex-col pb-[68px] lg:pb-0">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={localBusinessSchema()} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Mobile bar and desktop rail are mutually exclusive by breakpoint. */}
        <StickyCallBar />
        <StickyQuoteRail />
        {/* Bottom-left: the one corner the other two don't occupy. */}
        <ChatLauncher />
      </body>
    </html>
  );
}
