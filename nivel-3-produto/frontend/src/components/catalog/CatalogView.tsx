"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import type { CategoryInfo, Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

interface PriceBucket {
  label: string;
  min: number;
  max: number | null;
}

const PRICE_BUCKETS: PriceBucket[] = [
  { label: "Até R$ 100", min: 0, max: 100 },
  { label: "R$ 100 – 300", min: 100, max: 300 },
  { label: "R$ 300 – 600", min: 300, max: 600 },
  { label: "R$ 600 – 1000", min: 600, max: 1000 },
  { label: "Acima de R$ 1000", min: 1000, max: null },
];

interface CatalogViewProps {
  products: Product[];
  categories: CategoryInfo[];
  brands: string[];
  lines: string[];
  initialCategory: ProductCategory | null;
}

export function CatalogView({
  products,
  categories,
  brands,
  lines,
  initialCategory,
}: CatalogViewProps) {
  const [category, setCategory] = useState<ProductCategory | null>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [priceBucket, setPriceBucket] = useState<PriceBucket | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableLines = useMemo(() => {
    if (!category) return lines;
    const inCategory = new Set(products.filter((p) => p.category === category).map((p) => p.line));
    return lines.filter((line) => inCategory.has(line));
  }, [category, lines, products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (selectedLines.length > 0 && !selectedLines.includes(product.line)) return false;
      if (onlyAvailable && !product.available) return false;
      if (priceBucket) {
        const effectivePrice = product.offerPrice ?? product.price;
        if (effectivePrice < priceBucket.min) return false;
        if (priceBucket.max != null && effectivePrice >= priceBucket.max) return false;
      }
      return true;
    });
  }, [products, category, selectedBrands, selectedLines, onlyAvailable, priceBucket]);

  const activeFilterCount =
    (category ? 1 : 0) + selectedBrands.length + selectedLines.length + (priceBucket ? 1 : 0) + (onlyAvailable ? 1 : 0);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }

  function toggleLine(line: string) {
    setSelectedLines((prev) =>
      prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line],
    );
  }

  function clearFilters() {
    setCategory(null);
    setSelectedBrands([]);
    setSelectedLines([]);
    setPriceBucket(null);
    setOnlyAvailable(false);
  }

  const filterContent = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate">Categoria</p>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={clsx(
              "rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
              category === null ? "bg-graphite text-gold-on-dark" : "text-graphite/80 hover:bg-ivory-deep",
            )}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategory(cat.slug)}
              className={clsx(
                "rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                category === cat.slug
                  ? "bg-graphite text-gold-on-dark"
                  : "text-graphite/80 hover:bg-ivory-deep",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate">Faixa de preço</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_BUCKETS.map((bucket) => (
            <button
              key={bucket.label}
              type="button"
              onClick={() =>
                setPriceBucket((prev) => (prev?.label === bucket.label ? null : bucket))
              }
              className={clsx(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                priceBucket?.label === bucket.label
                  ? "border-graphite bg-graphite text-gold-on-dark"
                  : "border-slate-light text-graphite/80 hover:border-graphite",
              )}
            >
              {bucket.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate">Marca</p>
        <div className="mt-3 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-graphite/85">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded-none border-slate-light text-gold-deep accent-[oklch(50%_0.135_78)]"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {availableLines.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate">Linha / família</p>
          <div className="mt-3 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {availableLines.map((line) => (
              <label key={line} className="flex items-center gap-2 text-sm text-graphite/85">
                <input
                  type="checkbox"
                  checked={selectedLines.includes(line)}
                  onChange={() => toggleLine(line)}
                  className="h-4 w-4 rounded-none border-slate-light accent-[oklch(50%_0.135_78)]"
                />
                {line}
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-graphite/85">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => setOnlyAvailable(e.target.checked)}
          className="h-4 w-4 rounded-none border-slate-light accent-[oklch(50%_0.135_78)]"
        />
        Somente disponíveis
      </label>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="self-start text-xs font-medium text-gold-deep underline underline-offset-4"
        >
          Limpar filtros ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 border-b border-slate-light pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate">Catálogo</p>
          <h1 className="mt-1 font-display text-3xl">
            {category ? categories.find((c) => c.slug === category)?.label : "Todos os produtos"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-sm border border-slate-light px-4 py-2.5 text-sm lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-graphite text-[11px] text-gold-on-dark">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filterContent}</aside>

        <div>
          <p className="mb-6 text-sm text-slate">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p className="font-display text-xl">Nenhum produto com esses filtros</p>
              <p className="max-w-sm text-sm text-slate">
                Tente remover algum filtro ou explorar outra categoria — o catálogo cresce toda
                semana.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-sm font-medium text-gold-deep underline underline-offset-4"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-graphite/40 backdrop-blur-[2px] transition-opacity duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 lg:hidden" />
          <Dialog.Content
            className="fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-xs flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 lg:hidden"
            aria-describedby={undefined}
          >
            <div className="flex items-center justify-between border-b border-slate-light px-5 py-4">
              <Dialog.Title className="font-display text-lg">Filtros</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ivory-deep"
                  aria-label="Fechar filtros"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterContent}</div>
            <div className="border-t border-slate-light px-5 py-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-sm bg-graphite py-3 text-sm font-medium text-gold-on-dark"
              >
                Ver {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
