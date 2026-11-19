import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategoryInfo } from "@/lib/categories";
import { getProductBySlug, getRecommendations } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { buildWhatsAppProductInquiryUrl } from "@/lib/whatsapp";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado — GDS Boutique" };
  return {
    title: `${product.brand} — ${product.name} | GDS Boutique`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryInfo(product.category);
  const related = await getRecommendations([product.slug], 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.offerPrice ?? product.price,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav className="flex items-center gap-1.5 text-xs text-slate">
        <Link href="/" className="hover:text-graphite">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-graphite">
          {category?.label ?? "Catálogo"}
        </Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        <span className="text-graphite/70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={`${product.brand} — ${product.name}`} />

        <div className="max-w-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-slate">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-slate">
            {product.line}
            {product.volumeMl ? ` · ${product.volumeMl}ml` : ""}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            {product.offerPrice != null ? (
              <>
                <span className="font-display text-2xl tabular-nums">
                  {formatPrice(product.offerPrice)}
                </span>
                <span className="text-base tabular-nums text-slate line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-sm bg-emerald-light px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-deep">
                  Oferta
                </span>
              </>
            ) : (
              <span className="font-display text-2xl tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite/85">
            {product.description}
          </p>

          {product.notes && (
            <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-light py-6">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate">Saída</dt>
                <dd className="mt-1 text-sm leading-snug">{product.notes.saida.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate">Coração</dt>
                <dd className="mt-1 text-sm leading-snug">{product.notes.coracao.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate">Fundo</dt>
                <dd className="mt-1 text-sm leading-snug">{product.notes.fundo.join(", ")}</dd>
              </div>
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              productId={product.id}
              disabled={!product.available}
              className="flex-1"
            />
            <a
              href={buildWhatsAppProductInquiryUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-sm border border-slate-light px-5 py-3 text-sm font-medium text-graphite transition-colors hover:border-graphite"
            >
              Perguntar no WhatsApp
            </a>
          </div>

          {!product.available && (
            <p className="mt-3 text-xs text-slate">
              Esgotado no momento — pergunte pelo WhatsApp sobre previsão de reposição.
            </p>
          )}

          <Link
            href={`/autenticidade?produto=${product.slug}`}
            className="mt-6 inline-block text-xs text-slate underline underline-offset-4 hover:text-gold-deep"
          >
            Verificar autenticidade do lote (blockchain)
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-slate-light pt-12">
          <h2 className="font-display text-2xl">Quem gosta deste também gosta</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <div key={item.id}>
                <ProductCard product={item} />
                {item.sharedNotes.length > 0 && (
                  <p className="mt-2 text-xs text-slate">Notas em comum: {item.sharedNotes.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
