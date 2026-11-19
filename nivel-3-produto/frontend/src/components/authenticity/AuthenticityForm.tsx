"use client";

import { useState } from "react";

interface Option {
  slug: string;
  label: string;
}

type Outcome =
  | { kind: "valid"; issuedAt: number }
  | { kind: "missing" }
  | { kind: "mismatch" }
  | { kind: "revoked" }
  | { kind: "error"; message: string };

const MESSAGES: Record<Exclude<Outcome["kind"], "valid" | "error">, string> = {
  missing: "Nenhum certificado registrado para este lote.",
  mismatch: "Há um certificado para este lote, mas os dados do produto não conferem com o registro.",
  revoked: "Este certificado foi revogado pela loja.",
};

export function AuthenticityForm({ products, initialSlug }: { products: Option[]; initialSlug?: string }) {
  const [slug, setSlug] = useState(products.some((p) => p.slug === initialSlug) ? initialSlug! : products[0]?.slug ?? "");
  const [lot, setLot] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch(`/api/certificates/${slug}/${encodeURIComponent(lot.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setOutcome({ kind: "error", message: data.error ?? "Falha ao consultar a blockchain." });
      } else if (data.valid) {
        setOutcome({ kind: "valid", issuedAt: data.issuedAt });
      } else if (data.revoked) {
        setOutcome({ kind: "revoked" });
      } else if (!data.exists) {
        setOutcome({ kind: "missing" });
      } else {
        setOutcome({ kind: "mismatch" });
      }
    } catch {
      setOutcome({ kind: "error", message: "Não foi possível falar com o servidor." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={verify} className="mt-8 space-y-5">
      <div>
        <label htmlFor="produto" className="text-xs font-medium uppercase tracking-wide text-slate">
          Produto
        </label>
        <select
          id="produto"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-2 w-full rounded-sm border border-slate-light bg-ivory px-3 py-3 text-sm"
        >
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lote" className="text-xs font-medium uppercase tracking-wide text-slate">
          Número do lote
        </label>
        <input
          id="lote"
          required
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          placeholder="ex.: DEMO-001"
          className="mt-2 w-full rounded-sm border border-slate-light bg-ivory px-3 py-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !lot.trim()}
        className="w-full rounded-sm bg-graphite px-6 py-4 text-sm font-medium tracking-wide text-gold-on-dark transition-colors hover:bg-graphite/90 disabled:opacity-50"
      >
        {loading ? "Consultando..." : "Verificar"}
      </button>

      <div role="status" aria-live="polite">
        {outcome?.kind === "valid" && (
          <p className="rounded-sm bg-emerald-light px-4 py-3 text-sm text-emerald-deep">
            Lote autêntico. Certificado registrado em {new Date(outcome.issuedAt * 1000).toLocaleDateString("pt-BR")}.
          </p>
        )}
        {outcome && outcome.kind !== "valid" && outcome.kind !== "error" && (
          <p className="rounded-sm bg-gold-light px-4 py-3 text-sm text-graphite">{MESSAGES[outcome.kind]}</p>
        )}
        {outcome?.kind === "error" && (
          <p className="rounded-sm bg-gold-light px-4 py-3 text-sm text-graphite">{outcome.message}</p>
        )}
      </div>
    </form>
  );
}
