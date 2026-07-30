import Link from "next/link";
import type { Article } from "@/content/articles";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card href={`/articles/${article.slug}`} className="h-full">
      <Placeholder label={article.title} ratio="16/9" className="rounded-b-none" />
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="hydro" className="self-start">
          {article.category}
        </Badge>
        <h3 className="mt-3 font-display text-lg leading-snug text-ink-900">{article.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {article.excerpt}
        </p>
        <p className="mt-auto flex gap-3 pt-4 text-xs font-medium text-ink-400">
          <span>{article.readMinutes} min read</span>
          <span aria-hidden="true">·</span>
          {/* The updated date when there is one: it is the more honest signal of
              how current the piece is, and it is what `dateModified` reports. */}
          <span>{formatDate(article.updated ?? article.date)}</span>
        </p>
      </div>
    </Card>
  );
}

/** SECTIONS.md §2.15, never more than three on the homepage. */
export function ArticlePreview({ articles }: { articles: Article[] }) {
  return (
    <Section tone="light">
      <SectionHeading
        eyebrow="Articles"
        title="Know what you're paying for"
        lede="Straight answers on methods, timing and what actually damages a surface. Written to make you a sharper buyer, whoever you hire."
      />
      <ul className="mt-12 grid items-stretch gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((a) => (
          <li key={a.slug}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center">
        <Link
          href="/articles"
          className="font-semibold text-harbor-700 underline underline-offset-2 hover:no-underline"
        >
          All articles
        </Link>
      </p>
    </Section>
  );
}
