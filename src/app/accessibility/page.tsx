import type { Metadata } from "next";
import { LegalPageStub } from "@/components/LegalPageStub";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Our commitment to an accessible website for all visitors.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPageStub
      title="Accessibility Statement"
      summary="This page will describe our commitment to WCAG conformance, the measures taken on this site, known limitations, and how to reach us if you encounter a barrier."
    />
  );
}
