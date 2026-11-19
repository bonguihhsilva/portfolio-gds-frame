import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | GDS Boutique",
  description: "Guias sobre perfumes: famílias olfativas, perfumaria árabe e como fazer o perfume durar mais.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl sm:text-4xl">Blog</h1>
      <p className="mt-3 text-sm text-slate">Guias curtos para escolher e usar melhor o seu perfume.</p>
      <ul className="mt-10 divide-y divide-slate-light">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <time dateTime={post.date} className="text-xs text-slate">
              {new Date(post.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
            </time>
            <h2 className="mt-1 font-display text-xl">
              <Link href={`/blog/${post.slug}`} className="hover:text-gold-deep">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite/80">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
