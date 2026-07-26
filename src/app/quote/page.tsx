import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Free Quote in Under a Minute",
  description:
    "Four quick questions, a live ballpark estimate, and a firm quote back the same day. No obligation.",
  alternates: { canonical: "/quote" },
};

/**
 * Tool page (SECTIONS.md §3.3): full-bleed, single-purpose, the calmest page
 * on the site. No banner, no CtaBand, no competing sections.
 */
export default function QuotePage() {
  return (
    <Section tone="sand" size="default">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="text-display-sm text-ink-900">Your quote, four questions away</h1>
        <p className="mt-3 text-ink-500">
          Under a minute to fill in. Live ballpark as you go. Firm quote the same day.
        </p>
      </div>
      <Suspense>
        <QuoteWizard />
      </Suspense>
    </Section>
  );
}
