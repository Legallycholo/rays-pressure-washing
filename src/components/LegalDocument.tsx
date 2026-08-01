import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

/**
 * Shared shell for the long-form legal pages, replacing `LegalPageStub` on any
 * page that has real content. The stub stays in the codebase for the pages that
 * don't yet.
 *
 * Prose container and a plain heading hierarchy on purpose: these pages are read
 * by someone looking for one specific clause, usually after something has gone
 * wrong, and every design flourish is one more thing between them and the
 * paragraph they came for.
 *
 * `<h2>` per section with no card, no icon and no reveal animation. That is not
 * an oversight — see the note in `LegalPageStub` about what these pages are for.
 */

export type LegalSection = {
  heading: string;
  /** Paragraphs. Each renders as its own <p>. */
  body: string[];
  /** Optional bullets, rendered after the paragraphs. */
  bullets?: string[];
};

export function LegalDocument({
  title,
  summary,
  lastUpdated,
  sections,
}: {
  title: string;
  summary: string;
  /** Human-readable, e.g. "August 1, 2026". Update whenever the terms change. */
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <Section tone="light" containerSize="prose">
      <h1 className="text-display-sm text-ink-900">{title}</h1>
      <p className="mt-6 leading-relaxed text-ink-600">{summary}</p>
      <p className="mt-4 text-sm text-ink-400">Last updated: {lastUpdated}</p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl text-ink-900 sm:text-2xl">{section.heading}</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-ink-600">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Contact block. Reads from content/site.ts rather than repeating the
            NAP, so these details can never drift from the ones in the footer,
            the schema and every directory listing. */}
        <section>
          <h2 className="font-display text-xl text-ink-900 sm:text-2xl">Contact us</h2>
          <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
            <p>
              Questions about these terms, or about work we have done for you, go to the same
              place everything else does:
            </p>
          </div>
          <ul className="mt-4 space-y-2 leading-relaxed text-ink-600">
            <li className="font-semibold text-ink-800">{site.legalName}</li>
            <li>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="font-medium text-harbor-700 underline-offset-2 hover:underline"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="font-medium text-harbor-700 underline-offset-2 hover:underline"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              {site.address.street}, {site.address.city}, {site.address.region}{" "}
              {site.address.postalCode}
            </li>
          </ul>
        </section>
      </div>
    </Section>
  );
}
