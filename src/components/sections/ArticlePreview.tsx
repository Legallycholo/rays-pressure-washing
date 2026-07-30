import Link from "next/link";
import type { Post } from "@/content/posts";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card href={`/blog/${post.slug}`} className="h-full">
      <Placeholder label={post.title} ratio="16/9" className="rounded-b-none" />
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="hydro" className="self-start">
          {post.category}
        </Badge>
        <h3 className="mt-3 font-display text-lg leading-snug text-ink-900">{post.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {post.excerpt}
        </p>
        <p className="mt-auto flex gap-3 pt-4 text-xs font-medium text-ink-400">
          <span>{post.readMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date)}</span>
        </p>
      </div>
    </Card>
  );
}

/** SECTIONS.md §2.15, never more than three on the homepage. */
export function BlogPreview({ posts }: { posts: Post[] }) {
  return (
    <Section tone="light">
      <SectionHeading
        eyebrow="Guides"
        title="Know what you're paying for"
        lede="Straight answers on methods, costs and timing. Written to make you a sharper buyer, whoever you hire."
      />
      <ul className="mt-12 grid items-stretch gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center">
        <Link href="/blog" className="font-semibold text-harbor-700 underline underline-offset-2 hover:no-underline">
          All guides
        </Link>
      </p>
    </Section>
  );
}
