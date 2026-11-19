"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { CartRecommendations } from "@/components/cart/CartRecommendations";
import type { CartLine, Product } from "@/lib/types";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
}

export function CartDrawer({ open, onOpenChange, products }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const lines: CartLine[] = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? [{ item, product }] : [];
  });

  const total = lines.reduce(
    (sum, { item, product }) => sum + (product.offerPrice ?? product.price) * item.quantity,
    0,
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-graphite/40 backdrop-blur-[2px] transition-opacity duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-slate-light px-6 py-5">
            <Dialog.Title className="font-display text-xl">Seu carrinho</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ivory-deep"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-10 w-10 text-slate" strokeWidth={1.25} />
              <div>
                <p className="font-display text-lg">Seu carrinho está vazio</p>
                <p className="mt-1 text-sm text-slate">
                  Explore o catálogo e monte seu pedido antes de enviar pelo WhatsApp.
                </p>
              </div>
              <Dialog.Close asChild>
                <Link
                  href="/catalogo"
                  className="mt-2 text-sm font-medium text-gold-deep underline underline-offset-4"
                >
                  Ver catálogo
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto px-6 py-4">
                {lines.map(({ item, product }) => {
                  const unitPrice = product.offerPrice ?? product.price;
                  return (
                    <li
                      key={product.id}
                      className="flex gap-4 border-b border-slate-light/60 py-4 first:pt-0 last:border-none"
                    >
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-ivory-deep">
                        <Image
                          src={product.images[0]}
                          alt={`${product.brand} ${product.name}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate">
                              {product.brand}
                            </p>
                            <p className="text-sm font-medium leading-tight">{product.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="text-slate transition-colors hover:text-gold-deep"
                            aria-label={`Remover ${product.name} do carrinho`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-slate-light px-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-slate transition-colors hover:text-graphite"
                              aria-label={`Diminuir quantidade de ${product.name}`}
                            >
                              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <span className="w-4 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-slate transition-colors hover:text-graphite"
                              aria-label={`Aumentar quantidade de ${product.name}`}
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-sm font-medium tabular-nums">
                            {formatPrice(unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <CartRecommendations slugs={lines.map(({ product }) => product.slug)} />

              <div className="border-t border-slate-light px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate">Total</span>
                  <span className="font-display text-xl tabular-nums">{formatPrice(total)}</span>
                </div>
                <a
                  href={buildWhatsAppOrderUrl(lines)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-sm bg-graphite px-6 py-4 text-sm font-medium tracking-wide text-gold-on-dark transition-colors duration-150 hover:bg-graphite/90"
                >
                  Enviar pedido pelo WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-slate">
                  Você finaliza a compra direto com a vendedora, sem pagamento pelo site.
                </p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
