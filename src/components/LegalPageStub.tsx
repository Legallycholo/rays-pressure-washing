import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

/**
 * PHASE 1 STUB shared by the three legal pages, so the footer links resolve
 * (CHECKLIST.md Phase 1). Real legal content is a Phase 9/13 item and must be
 * reviewed by the business — do not draft binding legal text here.
 */
export function LegalPageStub({ title, summary }: { title: string; summary: string }) {
  return (
    <Section tone="light" containerSize="prose">
      <h1 className="text-display-sm text-ink-900">{title}</h1>
      <p className="mt-6 leading-relaxed text-ink-500">{summary}</p>
      <div className="mt-10 rounded-card bg-sand-50 p-6 ring-1 ring-ink-900/5">
        <p className="text-sm font-semibold text-ink-700">This page is a placeholder.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Final {title.toLowerCase()} content must be provided and reviewed by{" "}
          {site.legalName} before launch. See CHECKLIST.md Phase 13.
        </p>
      </div>
    </Section>
  );
}
