import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Artigo não encontrado | GDS Boutique" };
  return {
    title: `${post.title} | GDS Boutique`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "GDS Boutique" },
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <time dateTime={post.date} className="text-xs text-slate">
        {new Date(post.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
      </time>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{post.title}</h1>
      <div className="article mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
