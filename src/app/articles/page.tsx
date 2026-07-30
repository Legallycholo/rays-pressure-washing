import type { Metadata } from "next";
import { articles, articleCategories } from "@/content/articles";
import { Hero } from "@/components/sections/Hero";
import { ArticleCard } from "@/components/sections/ArticlePreview";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, articleListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Articles: Exterior Cleaning, Explained Straight",
  description:
    "How exterior cleaning actually works, which method belongs on which surface, and how often it needs doing. Written to make you a sharper buyer.",
  alternates: { canonical: "/articles" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
];

/**
 * Static index. Category chips are anchor links to grouped sections (keeps the
 * page fully static; the array content model doesn't warrant client filtering at
 * three articles).
 */
export default function ArticleIndexPage() {
  return (
    <>
      <JsonLd data={[articleListSchema(articles), breadcrumbSchema(crumbs)]} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Know what you're paying for"
        lede="No fluff, no scare tactics. Just how exterior cleaning actually works, what damages a surface, and when it's worth doing."
      />
      <Section tone="light">
        <nav aria-label="Categories" className="flex flex-wrap justify-center gap-2">
          {articleCategories.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              className="inline-flex min-h-[44px] items-center rounded-pill bg-sand-100 px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-harbor-50 hover:text-harbor-800"
            >
              {cat}
            </a>
          ))}
        </nav>

        {articleCategories.map((cat) => {
          const items = articles.filter((a) => a.category === cat);
          return (
            <section
              key={cat}
              id={`cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              className="mt-14 scroll-mt-28"
              aria-label={cat}
            >
              <h2 className="mb-6 font-display text-2xl text-ink-900">{cat}</h2>
              <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </Section>
    </>
  );
}
