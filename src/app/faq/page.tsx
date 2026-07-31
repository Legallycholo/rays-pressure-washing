import type { Metadata } from "next";
import { faqs, faqCategories } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ: Every Question We Get",
  description: "Soft washing vs pressure washing, pricing, plants and pets, scheduling. All of it, answered straight.",
  alternates: { canonical: "/faq" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "FAQ", href: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      {/* Full FAQPage schema over every item: the expandable rich result */}
      <JsonLd data={[faqSchema(faqs), breadcrumbSchema(crumbs)]} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Ask us anything. These got asked first."
        lede="Grouped so you can skip to what you care about. If yours isn't here, the phone works."
      />
      <Section tone="light" containerSize="narrow">
        {faqCategories.map((cat, i) => {
          const items = faqs.filter((f) => f.category === cat);
          return (
            <section key={cat} className={i > 0 ? "mt-14" : undefined} aria-labelledby={`faq-${cat}`}>
              <h2 id={`faq-${cat}`} className="mb-5 font-display text-2xl text-ink-900">
                {cat}
              </h2>
              <Accordion
                items={items.map((f) => ({ id: `all-${f.id}`, question: f.question, answer: f.answer }))}
                singleOpen
                groupName={`faq-page-${cat}`}
              />
            </section>
          );
        })}
        <div className="mt-14 text-center">
          <p className="text-ink-500">Didn&apos;t find it?</p>
          <Button href="/contact" variant="secondary" className="mt-3">
            Ask us your question
          </Button>
        </div>
      </Section>
    </>
  );
}
