import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-light bg-graphite text-ivory">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl">
            GDS <span className="text-gold-on-dark">Boutique</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
            Perfumaria, cosméticos e skin care selecionados como em uma boutique de bairro nobre.
            Cada pedido é fechado direto com a gente, sem intermediário.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-on-dark">
            Categorias
          </p>
          <ul className="mt-4 space-y-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogo?categoria=${category.slug}`}
                  className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                >
                  {category.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="text-sm text-ivory/70 transition-colors hover:text-ivory">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/autenticidade" className="text-sm text-ivory/70 transition-colors hover:text-ivory">
                Verificar autenticidade
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-on-dark">
            Atendimento
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            Dúvidas sobre disponibilidade, notas olfativas ou prazo? Fale direto pelo WhatsApp,
            o mesmo canal onde o pedido é fechado.
          </p>
        </div>
      </div>

      <div className="border-t border-ivory/10 px-4 py-6 text-center text-xs text-ivory/50 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} GDS Boutique. Vitrine virtual — pedidos fechados via WhatsApp.
      </div>
    </footer>
  );
}
