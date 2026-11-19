import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllProducts } from "@/lib/products";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts().catch(() => []);
  return [
    "",
    "/catalogo",
    "/blog",
    "/autenticidade",
    ...getAllPosts().map((p) => `/blog/${p.slug}`),
    ...products.map((p) => `/produto/${p.slug}`),
  ].map((route) => ({ url: `${SITE}${route}` }));
}
