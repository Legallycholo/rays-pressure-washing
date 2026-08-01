import Link from "next/link";
import { serviceCategories } from "@/content/service-categories";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * The three Google Business Profile categories, each with its named
 * sub-services underneath. Reads from `content/service-categories.ts`.
 *
 * HEADING STRUCTURE IS THE POINT OF THIS COMPONENT, so don't "tidy" it:
 * each category is an `<h2>` and each sub-service an `<h3>` nested under it.
 * That hierarchy is what tells a crawler these eighteen named services belong
 * to those three categories — which are the same three set on the GBP listing —
 * and flattening it to styled `<div>`s or promoting the H3s to H2s throws away
 * the entire reason the section exists.
 *
 * The section renders on `/services` below the card grid: the grid sells the
 * services that have a page, this names everything the business actually does.
 *
 * Sub-services that map to a real service page render as links; the rest render
 * as plain headings. That difference is deliberate and visible — see the note
 * at the top of `content/service-categories.ts` about why eighteen catalog
 * entries would be the wrong fix.
 */
export function ServicesByCategory({
  tone = "sand",
  heading = {
    eyebrow: "Everything we clean",
    title: "Pressure Washing, Gutter Cleaning & Window Cleaning",
    lede: "Three categories, one crew, one visit. Here is the full list under each.",
  },
}: {
  tone?: "light" | "sand";
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
}) {
  return (
    <Section tone={tone}>
      <Reveal>
        <SectionHeading {...heading} />
      </Reveal>

      <div className="mt-12 flex flex-col gap-8 sm:mt-16">
        {serviceCategories.map((category, i) => (
          <Reveal key={category.id} delay={i * 80}>
            <article className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-harbor-50 text-harbor-600">
                  <Icon name={category.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
                  {category.title}
                </h2>
                {/* Names the GBP category verbatim. This is the string that has
                    to match the profile — see service-categories.ts. */}
                <Badge tone={category.primary ? "mint" : "hydro"}>
                  {category.primary ? "Primary service" : category.gbpCategory}
                </Badge>
              </div>

              <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">{category.lede}</p>

              <ul className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.subServices.map((sub) => {
                  const body = (
                    <>
                      <h3
                        className={cn(
                          "flex items-start gap-2 font-semibold text-ink-900",
                          sub.slug && "transition-colors group-hover:text-harbor-700",
                        )}
                      >
                        {sub.name}
                        {sub.slug && (
                          <Icon
                            name="arrow"
                            className="mt-1 h-3.5 w-3.5 shrink-0 text-harbor-500 transition-transform group-hover:translate-x-0.5"
                          />
                        )}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{sub.blurb}</p>
                    </>
                  );

                  return (
                    <li
                      key={sub.name}
                      className="border-t border-ink-100 pt-4 first:border-t-0 first:pt-0 sm:border-t sm:pt-4 sm:first:border-t sm:first:pt-4"
                    >
                      {sub.slug ? (
                        <Link href={`/services/${sub.slug}`} className="group block">
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
