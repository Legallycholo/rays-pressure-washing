import type { Metadata } from "next";
import { posts, postCategories } from "@/content/posts";
import { Hero } from "@/components/sections/Hero";
import { PostCard } from "@/components/sections/BlogPreview";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Guides: Exterior Cleaning, Explained Straight",
  description: "Methods, costs, timing and maintenance. Written to make you a sharper buyer, whoever you end up hiring.",
  alternates: { canonical: "/blog" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Guides", href: "/blog" },
];

/**
 * Static index. Category chips are anchor links to grouped sections (keeps the
 * page fully static, open decision #5's array model doesn't warrant client
 * filtering at 6 posts).
 */
export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Know what you're paying for"
        lede="No fluff, no scare tactics. Just how exterior cleaning actually works, what it costs, and when it's worth doing."
      />
      <Section tone="light">
        <nav aria-label="Categories" className="flex flex-wrap justify-center gap-2">
          {postCategories.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              className="inline-flex min-h-[44px] items-center rounded-pill bg-sand-100 px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-harbor-50 hover:text-harbor-800"
            >
              {cat}
            </a>
          ))}
        </nav>

        {postCategories.map((cat) => {
          const items = posts.filter((p) => p.category === cat);
          return (
            <section
              key={cat}
              id={`cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              className="mt-14 scroll-mt-28"
              aria-label={cat}
            >
              <h2 className="mb-6 font-display text-2xl text-ink-900">{cat}</h2>
              <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <li key={p.slug}>
                    <PostCard post={p} />
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
