import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const hasOffer = product.offerPrice != null;

  return (
    <Link href={`/produto/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-deep">
        <Image
          src={product.images[0]}
          alt={`${product.brand} — ${product.name}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory/70">
            <span className="text-xs font-medium uppercase tracking-widest text-slate">
              Esgotado
            </span>
          </div>
        )}

        {hasOffer && product.available && (
          <span className="absolute left-3 top-3 rounded-sm bg-emerald-light px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-deep">
            Oferta
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-wide text-slate">{product.brand}</p>
        <h3 className="mt-1 font-display text-base leading-snug text-graphite">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-slate">{product.line}</p>

        <div className="mt-3 flex items-baseline gap-2">
          {hasOffer ? (
            <>
              <span className="text-sm font-medium tabular-nums text-graphite">
                {formatPrice(product.offerPrice as number)}
              </span>
              <span className="text-xs tabular-nums text-slate line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium tabular-nums text-graphite">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
