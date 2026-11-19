"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "./cart-store";

const subscribe = () => () => {};

export function useCartCount(): number {
  // false no servidor e na hidratação, true depois: evita divergência com o carrinho do localStorage.
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const items = useCartStore((state) => state.items);

  if (!isClient) return 0;
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
