import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { AuthenticityForm } from "@/components/authenticity/AuthenticityForm";

export const metadata: Metadata = {
  title: "Verificar autenticidade | GDS Boutique",
  description:
    "Confira na blockchain se o lote do seu produto foi registrado pela GDS Boutique. O registro guarda só um hash, nunca dados pessoais.",
};

export default async function AuthenticityPage({
  searchParams,
}: {
  searchParams: Promise<{ produto?: string }>;
}) {
  const { produto } = await searchParams;
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl sm:text-4xl">Verificar autenticidade</h1>
      <p className="mt-4 text-sm leading-relaxed text-graphite/85">
        Cada lote que a loja registra gera um certificado em um smart contract. O contrato guarda apenas o hash dos
        dados do produto naquele lote. Informe o produto e o número do lote impresso na embalagem: se os dados
        conferirem com o registro, o lote é autêntico.
      </p>
      <AuthenticityForm
        products={products.map(({ slug, brand, name }) => ({ slug, label: `${brand} — ${name}` }))}
        initialSlug={produto}
      />
    </div>
  );
}
