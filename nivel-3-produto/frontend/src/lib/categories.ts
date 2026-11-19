import type { CategoryInfo } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "perfumes-importados",
    label: "Perfumes Importados",
    description: "Grandes casas europeias, direto para o seu perfume favorito.",
  },
  {
    slug: "perfumes-arabe",
    label: "Perfumes Árabes",
    description: "Fixação longa e notas densas das casas do Golfo.",
  },
  {
    slug: "perfumes-nicho",
    label: "Perfumes de Nicho",
    description: "Assinaturas autorais, produção limitada, raridade real.",
  },
  {
    slug: "cosmeticos",
    label: "Cosméticos",
    description: "Make que sustenta o clima do perfume o dia inteiro.",
  },
  {
    slug: "skin-care",
    label: "Skin Care",
    description: "Rotina que prepara a pele antes de qualquer fragrância.",
  },
];

export function getCategoryInfo(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
