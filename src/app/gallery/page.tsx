import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { GalleryExplorer } from "@/components/sections/GalleryExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/gallery";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, imageObjectSchema } from "@/lib/schema";

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
      {/* imageObjectSchema returns [] while gallery.ts still ships empty image
          paths, so this emits breadcrumbs alone today and starts emitting
          ImageObject nodes the moment real photography lands — no edit here. */}
      <JsonLd data={[...imageObjectSchema(projects), breadcrumbSchema(crumbs)]} />
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
        lede="Call now, or submit the form and we will get back to you within 24 hours."
      />
    </>
  );
}
