import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

/**
 * SECTIONS.md §2.11 — the only use of tone="hydro" on the site, which is what
 * makes it land. No fine print here, by rule.
 */
export function GuaranteeBand({ guarantee }: { guarantee: { title: string; body: string } }) {
  return (
    <Section tone="hydro" containerSize="narrow">
      <div className="flex flex-col items-center gap-5 text-center">
        <Icon name="shield" className="h-16 w-16 text-white opacity-90" />
        <h2 className="text-display-sm text-white sm:text-4xl">{guarantee.title}</h2>
        <p className="text-lg leading-relaxed text-hydro-50">{guarantee.body}</p>
        <Button href="/quote" variant="onDark" size="lg" className="mt-2">
          Put it to the test
        </Button>
      </div>
    </Section>
  );
}
