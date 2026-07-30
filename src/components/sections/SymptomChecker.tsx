import Link from "next/link";
import type { Service } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

/**
 * SECTIONS.md §2.4, the vocabulary bridge. One symptom per service, phrased
 * as what the visitor sees, never as the method that fixes it.
 */
export function SymptomChecker({ services, limit = 6 }: { services: Service[]; limit?: number }) {
  const cards = services.slice(0, limit).map((s) => ({
    symptom: s.symptoms[0],
    service: s,
  }));

  return (
    <Section tone="sand">
      <SectionHeading
        eyebrow="Sound familiar?"
        title="What are you seeing?"
        lede="You don't need to know what the fix is called. Point at the problem and we'll take it from there."
      />
      <ul className="mt-12 grid items-stretch gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ symptom, service }) => (
          <li key={service.slug}>
            <Card href={`/services/${service.slug}`} className="h-full p-6">
              <p className="font-display text-lg text-ink-800">&ldquo;{symptom}&rdquo;</p>
              <div className="mt-auto pt-5">
                <div className="border-t border-ink-100 pt-4">
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-600 transition-colors group-hover:text-harbor-700">
                    <Icon name={service.icon} className="h-5 w-5 text-harbor-500" />
                    That&apos;s {service.name.toLowerCase()}
                    <Icon name="arrow" className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-ink-500">
        None of these?{" "}
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center font-semibold text-harbor-700 underline underline-offset-2 hover:no-underline"
        >
          Describe it and we&apos;ll tell you what it needs
        </Link>
      </p>
    </Section>
  );
}
