"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { clsx } from "clsx";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ productId, disabled, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    if (disabled) return;
    addItem(productId);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-medium tracking-wide transition-colors duration-150",
        disabled
          ? "cursor-not-allowed bg-ivory-deep text-slate"
          : "bg-graphite text-gold-on-dark hover:bg-graphite/90",
        className,
      )}
    >
      {disabled ? (
        "Esgotado"
      ) : justAdded ? (
        <>
          <Check className="h-4 w-4" strokeWidth={1.75} />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
          Adicionar ao carrinho
        </>
      )}
    </button>
  );
}
