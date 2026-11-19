"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useCartCount } from "@/lib/use-cart-count";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { Product } from "@/lib/types";

interface SiteHeaderProps {
  products: Product[];
}

export function SiteHeader({ products }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useCartCount();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-light/70 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-graphite"
          onClick={() => setIsMenuOpen(false)}
        >
          GDS <span className="text-gold-deep">Boutique</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogo?categoria=${category.slug}`}
              className="text-sm text-graphite/80 transition-colors duration-150 hover:text-gold-deep"
            >
              {category.label}
            </Link>
          ))}
          <Link href="/blog" className="text-sm text-graphite/80 transition-colors duration-150 hover:text-gold-deep">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-ivory-deep"
            aria-label={`Abrir carrinho${cartCount > 0 ? `, ${cartCount} itens` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-graphite text-[10px] font-medium text-gold-on-dark">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-ivory-deep lg:hidden"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col border-t border-slate-light/70 px-4 py-2 lg:hidden">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogo?categoria=${category.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-slate-light/40 py-3 text-sm text-graphite/80 last:border-none"
            >
              {category.label}
            </Link>
          ))}
          <Link
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="py-3 text-sm text-graphite/80"
          >
            Blog
          </Link>
        </nav>
      )}

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} products={products} />
    </header>
  );
}
