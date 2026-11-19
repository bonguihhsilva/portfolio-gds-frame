export type ProductCategory =
  | "perfumes-importados"
  | "perfumes-arabe"
  | "perfumes-nicho"
  | "cosmeticos"
  | "skin-care";

export interface OlfactoryNotes {
  saida: string[];
  coracao: string[];
  fundo: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  line: string;
  description: string;
  notes?: OlfactoryNotes;
  volumeMl?: number;
  price: number;
  offerPrice?: number;
  available: boolean;
  images: string[];
}

export interface Recommendation extends Product {
  score: number;
  sharedNotes: string[];
}

export interface CategoryInfo {
  slug: ProductCategory;
  label: string;
  description: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine {
  item: CartItem;
  product: Product;
}
