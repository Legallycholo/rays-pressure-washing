import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

/**
 * SECTIONS.md §2.11, the only use of tone="hydro" on the site, which is what
 * makes it land. No fine print here, by rule.
 */
export function GuaranteeBand({ guarantee }: { guarantee: { title: string; body: string } }) {
  return (
    <Section tone="hydro" containerSize="narrow">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Leaf on the shield, not white. This band is the site's one harbor
            surface, so it is the only place a large green mark can sit against
            blue rather than navy — the single strongest green moment available
            without touching amber's CTA monopoly or ink's dominance. Decorative
            (`aria-hidden` via Icon), so contrast is a judgement call, not a
            floor, and leaf-300 on harbor-700 is legible either way. */}
        <span className="grid h-24 w-24 place-items-center rounded-full bg-white/10 ring-1 ring-leaf-300/30">
          <Icon name="shield" className="h-14 w-14 text-leaf-300" />
        </span>
        <h2 className="text-display-sm text-white sm:text-4xl">{guarantee.title}</h2>
        <p className="text-lg leading-relaxed text-harbor-50">{guarantee.body}</p>
        <Button href="/contact" variant="onDark" size="lg" className="mt-2">
          Put it to the test
        </Button>
      </div>
    </Section>
  );
}
