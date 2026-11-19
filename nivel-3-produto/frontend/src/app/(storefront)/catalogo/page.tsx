import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getAllBrands, getAllLines, getAllProducts } from "@/lib/products";
import { CatalogView } from "@/components/catalog/CatalogView";
import type { ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catálogo — GDS Boutique",
  description: "Perfumes importados, árabes e de nicho, cosméticos e skin care.",
};

const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.slug));

interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { categoria } = await searchParams;
  const initialCategory =
    categoria && VALID_CATEGORIES.has(categoria as ProductCategory)
      ? (categoria as ProductCategory)
      : null;

  const products = await getAllProducts();

  return (
    <CatalogView
      products={products}
      categories={CATEGORIES}
      brands={getAllBrands(products)}
      lines={getAllLines(products)}
      initialCategory={initialCategory}
    />
  );
}
