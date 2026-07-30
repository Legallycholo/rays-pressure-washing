import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, articleSlugs, articles, type ArticleSection } from "@/content/articles";
import { getService } from "@/content/services";
import { getLocation } from "@/content/locations";
import { Hero } from "@/components/sections/Hero";
import { ArticleCard } from "@/components/sections/ArticlePreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    // `metaTitle` when the H1 is too long for a search result; see the note on
    // the field in content/articles.ts. The H1 itself always uses `title`.
    title: article.metaTitle ?? article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    // `article` rather than the sitewide `website`, and the dates a crawler
    // reads for freshness come from here as well as from the Article JSON-LD.
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/articles/${article.slug}`,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      authors: [article.author],
    },
  };
}

/**
 * One section = one question, its direct answer, then the supporting detail.
 *
 * The `answer` paragraph is styled as a visible lead rather than ordinary body
 * copy. That does two jobs at once: a reader skimming for the answer finds it,
 * and an answer engine extracting a quotable block gets a clean one. See the AEO
 * note in content/articles.ts.
 */
function ArticleSectionBlock({ section }: { section: ArticleSection }) {
  return (
    <section className="mt-12 scroll-mt-28 first:mt-0">
      <h2 className="font-display text-2xl text-ink-900">{section.heading}</h2>

      <p className="mt-4 border-l-2 border-harbor-500 pl-4 text-lg font-medium leading-relaxed text-ink-800">
        {section.answer}
      </p>

      {section.body?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-ink-600">
          {paragraph}
        </p>
      ))}

      {section.list && (
        <ul className="mt-4 space-y-3">
          {section.list.map((item) => (
            <li key={item.slice(0, 48)} className="flex gap-3 leading-relaxed text-ink-600">
              <Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-leaf-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        // Wide tables scroll inside their own container so the page body never
        // scrolls horizontally on a phone.
        <div className="mt-6 overflow-x-auto rounded-card ring-1 ring-ink-900/10">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <caption className="sr-only">{section.table.caption}</caption>
            <thead className="bg-sand-100">
              <tr>
                {section.table.columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 font-display text-xs uppercase tracking-[0.12em] text-ink-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row[0]} className="border-t border-ink-100 align-top">
                  {row.map((cell, i) => (
                    <td
                      key={`${row[0]}-${i}`}
                      className={
                        i === 0 ? "px-4 py-3 font-semibold text-ink-900" : "px-4 py-3 text-ink-600"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: article.title, href: `/articles/${article.slug}` },
  ];
  const relatedServices = article.relatedServices
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedCities = (article.relatedCities ?? [])
    .map(getLocation)
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  const moreArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[articleSchema(article), breadcrumbSchema(crumbs)]} />
      <Hero
        variant="page"
        breadcrumbs={crumbs.slice(0, 2)}
        title={article.title}
        lede={article.excerpt}
        extras={
          <>
            <Badge tone="onDark">{article.category}</Badge>
            <Badge tone="onDark">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {article.readMinutes} min read
            </Badge>
            <Badge tone="onDark">{formatDate(article.updated ?? article.date)}</Badge>
          </>
        }
      />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Long-form shell (§3.2): prose column + sticky related rail */}
          <article className="mx-auto w-full max-w-2xl lg:col-span-8">
            {article.sections.map((s) => (
              <ArticleSectionBlock key={s.heading} section={s} />
            ))}
            <p className="mt-12 border-t border-ink-100 pt-5 text-sm text-ink-400">
              By {article.author}
              {article.updated ? " · Updated " : " · Published "}
              <time dateTime={article.updated ?? article.date}>
                {formatDate(article.updated ?? article.date)}
              </time>
            </p>
          </article>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              {relatedServices.length > 0 && (
                <div className="rounded-card bg-sand-50 p-6 ring-1 ring-ink-900/5">
                  <h2 className="font-display text-lg text-ink-900">Related services</h2>
                  <ul className="mt-3 space-y-2">
                    {relatedServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-ink-700 hover:text-harbor-700"
                        >
                          <Icon name={s.icon} className="h-4 w-4 text-harbor-500" />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relatedCities.length > 0 && (
                <div className="rounded-card bg-sand-50 p-6 ring-1 ring-ink-900/5">
                  <h2 className="font-display text-lg text-ink-900">In your area</h2>
                  <ul className="mt-3 space-y-2">
                    {relatedCities.map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/service-areas/${l.slug}`}
                          className="flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-ink-700 hover:text-harbor-700"
                        >
                          <Icon name="pin" className="h-4 w-4 text-harbor-500" />
                          {l.city}, {l.region}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        variant="inline"
        title="Reading done. Problem still there?"
        lede="Call now, or submit the form and we will get back to you within 24 hours."
      />

      {moreArticles.length > 0 && (
        <Section tone="sand">
          <h2 className="mb-8 text-center font-display text-2xl text-ink-900">More like this</h2>
          <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
