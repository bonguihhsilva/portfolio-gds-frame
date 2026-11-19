import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

const CATEGORY_IMAGES: Record<string, string> = {
  "perfumes-importados":
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
  "perfumes-arabe":
    "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=800&q=80",
  "perfumes-nicho":
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  cosmeticos:
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
  "skin-care":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
};

export default async function HomePage() {
  const products = await getAllProducts();
  const offers = products.filter((p) => p.offerPrice != null && p.available).slice(0, 4);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-graphite text-ivory">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-0 lg:pt-0 lg:px-8">
          <div className="relative z-10 lg:py-28">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-on-dark">
              Perfumaria · Cosméticos · Skin Care
            </p>
            <h1 className="mt-6 max-w-xl font-display text-[clamp(2.5rem,4vw+1rem,4.25rem)] leading-[1.05]">
              Perfume é memória.
              <br />
              Escolha a sua com calma.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">
              Importados, árabes e de nicho, ao lado de uma seleção de cosméticos e skin care.
              Monte seu pedido na vitrine e finalize direto com a gente, pelo WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/catalogo"
                className="flex items-center gap-2 rounded-sm bg-gold-on-dark px-7 py-4 text-sm font-medium tracking-wide text-graphite transition-colors duration-150 hover:bg-ivory"
              >
                Ver catálogo
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/catalogo?categoria=perfumes-nicho"
                className="text-sm text-ivory/75 underline-offset-4 transition-colors hover:text-ivory hover:underline"
              >
                Explorar a linha de nicho
              </Link>
            </div>
          </div>

          <div className="relative -mx-4 h-[52vw] max-h-[560px] sm:mx-0 sm:h-[420px] lg:h-[70vh] lg:max-h-none">
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80"
              alt="Frasco de perfume em tom âmbar sobre superfície escura, luz lateral suave"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">Explore por linha</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogo?categoria=${category.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                <Image
                  src={CATEGORY_IMAGES[category.slug]}
                  alt={category.label}
                  fill
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-graphite/10 transition-colors duration-300 group-hover:bg-graphite/0" />
              </div>
              <p className="mt-3 font-display text-sm leading-tight">{category.label}</p>
              <p className="mt-1 text-xs text-slate">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {offers.length > 0 && (
        <section className="border-y border-slate-light bg-ivory-deep/40">
          <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-emerald-deep">
                  Por tempo limitado
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl">Ofertas selecionadas</h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden shrink-0 items-center gap-1 text-sm text-graphite/80 hover:text-gold-deep sm:flex"
              >
                Ver tudo
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {offers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden bg-ivory-deep lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80"
              alt="Frascos de perfume organizados sobre bandeja dourada"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-1">
            <p className="text-xs font-medium uppercase tracking-widest text-gold-deep">
              Como funciona
            </p>
            <h2 className="mt-3 max-w-md font-display text-2xl sm:text-3xl">
              Sem carrinho de pagamento. Sem letra miúda.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate">
              Você navega pela linha, marca ou preço, monta o pedido e envia direto pelo
              WhatsApp. A gente confirma disponibilidade, combina entrega e fecha com você,
              pessoa a pessoa — do jeito que uma boutique de verdade funciona.
            </p>
            <Link
              href="/catalogo"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-graphite underline underline-offset-4 hover:text-gold-deep"
            >
              Começar a montar meu pedido
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
