import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "blog");

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  html: string;
}

function parse(slug: string, raw: string): Post {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Post sem frontmatter: ${slug}`);
  const meta = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    html: marked.parse(match[2], { async: false }),
  };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parse(file.replace(/\.md$/, ""), fs.readFileSync(path.join(DIR, file), "utf-8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
