import type { OlfactoryNotes, Product, Recommendation } from "@/lib/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

interface ApiProduct extends Omit<Product, "id" | "notes" | "volumeMl" | "offerPrice"> {
  notes: OlfactoryNotes;
  volumeMl: number | null;
  offerPrice: number | null;
}

function toProduct(p: ApiProduct): Product {
  const hasNotes = Object.values(p.notes).some((list) => list.length > 0);
  return {
    ...p,
    id: p.slug,
    notes: hasNotes ? p.notes : undefined,
    volumeMl: p.volumeMl ?? undefined,
    offerPrice: p.offerPrice ?? undefined,
  };
}

async function api(path: string): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
}

export async function getAllProducts(): Promise<Product[]> {
  const res = await api("/api/products");
  if (!res.ok) throw new Error(`Falha ao carregar produtos: HTTP ${res.status}`);
  return ((await res.json()) as ApiProduct[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await api(`/api/products/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Falha ao carregar produto: HTTP ${res.status}`);
  return toProduct((await res.json()) as ApiProduct);
}

/** Recomendação por similaridade de conteúdo (serviço Flask). Falha vira lista vazia: a página não depende dela. */
export async function getRecommendations(slugs: string[], limit = 4): Promise<Recommendation[]> {
  try {
    const res = await api(`/api/recommendations?slugs=${encodeURIComponent(slugs.join(","))}&limit=${limit}`);
    if (!res.ok) return [];
    const items = (await res.json()) as (ApiProduct & { score: number; sharedNotes: string[] })[];
    return items.map((item) => ({ ...toProduct(item), score: item.score, sharedNotes: item.sharedNotes }));
  } catch {
    return [];
  }
}

export function getAllBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getAllLines(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.line))).sort();
}
