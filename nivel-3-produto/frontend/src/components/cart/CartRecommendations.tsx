"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Recommendation } from "@/lib/types";

export function CartRecommendations({ slugs }: { slugs: string[] }) {
  const [items, setItems] = useState<Recommendation[]>([]);
  const key = slugs.join(",");

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetch(`/api/recommendations?slugs=${encodeURIComponent(key)}&limit=3`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then(setItems)
      .catch(() => {});
    return () => controller.abort();
  }, [key]);

  if (!key || items.length === 0) return null;

  return (
    <section className="border-t border-slate-light px-6 py-4" aria-label="Recomendados para você">
      <p className="text-xs font-medium uppercase tracking-widest text-slate">Combina com o seu carrinho</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Dialog.Close asChild>
              <Link href={`/produto/${item.slug}`} className="flex items-baseline justify-between gap-3 text-sm hover:text-gold-deep">
                <span className="truncate">
                  {item.brand} — {item.name}
                </span>
                <span className="shrink-0 tabular-nums text-slate">{formatPrice(item.offerPrice ?? item.price)}</span>
              </Link>
            </Dialog.Close>
          </li>
        ))}
      </ul>
    </section>
  );
}
