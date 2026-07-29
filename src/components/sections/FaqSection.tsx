import type { Faq } from "@/content/faqs";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";

/** SECTIONS.md §2.13, sticky heading rail at lg, native-details accordion. */
export function FaqSection({
  items,
  limit = 6,
  heading,
  groupName = "faq",
  showAllLink = true,
}: {
  items: Faq[];
  limit?: number;
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
  groupName?: string;
  showAllLink?: boolean;
}) {
  return (
    <Section tone="sand">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="flex flex-col items-start gap-4 lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              {...(heading ?? {
                eyebrow: "Straight answers",
                title: "Questions we hear every week",
              })}
            />
            <p className="text-ink-500">Still not sure? Ask a human. No obligation, no hard sell.</p>
            <Button href={showAllLink ? "/faq" : "/contact"} variant="ghost">
              {showAllLink ? "See every question" : "Get in touch"}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Accordion
            items={items.slice(0, limit).map((f) => ({ id: `${groupName}-${f.id}`, question: f.question, answer: f.answer }))}
            singleOpen
            groupName={groupName}
          />
        </div>
      </div>
    </Section>
  );
}
