import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { GalleryExplorer } from "@/components/sections/GalleryExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Before & After Gallery",
  description:
    "Real properties, real results. Drag the divider on any project to compare before and after.",
  alternates: { canonical: "/gallery" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Before & After", href: "/gallery" },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Drag the line. That's the sales pitch."
        lede="Every project below is a real property. Filter by service or city, and drag the divider on any card to compare."
      />
      <Section tone="light">
        {/* useSearchParams requires Suspense; filters live in the URL so views are linkable */}
        <Suspense>
          <GalleryExplorer />
        </Suspense>
      </Section>
      <CtaBand
        title="Want yours in this gallery?"
        lede="Free quote, same-day response, and the before photo is on us."
      />
    </>
  );
}
