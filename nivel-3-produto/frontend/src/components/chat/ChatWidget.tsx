"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { buildWhatsAppSupportUrl } from "@/lib/whatsapp";

interface ChatProduct {
  slug: string;
  name: string;
  available: boolean;
}

interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
  handoff?: boolean;
  products?: ChatProduct[];
  suggestions?: string[];
}

const GREETING: ChatMessage = {
  id: 0,
  role: "bot",
  text: "Olá! Sou o assistente virtual da GDS Boutique. Posso ajudar com pedidos, escolha de perfume e autenticidade.",
  suggestions: ["Como faço um pedido?", "Quero ajuda para escolher um perfume", "Como sei se é original?", "Falar com a vendedora"],
};

const FALLBACK: Omit<ChatMessage, "id"> = {
  role: "bot",
  text: "Não consegui falar com o atendimento automático agora. A vendedora atende você pelo WhatsApp.",
  handoff: true,
};

// Caminhos internos que o bot cita viram links navegáveis.
const PATH = /(\/(?:catalogo|autenticidade|blog)(?:\/[a-z0-9-]+)?(?:\?[a-z0-9=&-]+)?)/g;

function renderText(text: string) {
  return text.split(PATH).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} className="underline underline-offset-2 hover:text-gold-deep">
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;

    const history = messages.slice(1).map(({ role, text: t }) => ({ role, text: t }));
    setMessages((m) => [...m, { id: nextId.current++, role: "user", text }]);
    setInput("");
    setLoading(true);

    let reply: Omit<ChatMessage, "id"> = FALLBACK;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (typeof data.reply === "string") {
        reply = { role: "bot", text: data.reply, handoff: data.handoff === true, products: data.products, suggestions: data.suggestions };
      }
    } catch {
      // mantém FALLBACK
    }
    setMessages((m) => [...m, { id: nextId.current++, ...reply }]);
    setLoading(false);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-graphite text-gold-on-dark shadow-lg transition-colors hover:bg-graphite/90"
          aria-label="Abrir atendimento"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
        </button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Atendimento GDS Boutique"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="fixed inset-x-0 bottom-0 z-40 flex h-[min(34rem,85dvh)] flex-col border border-slate-light bg-ivory shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[24rem] sm:rounded-sm"
        >
          <header className="flex items-center justify-between bg-graphite px-4 py-3 text-ivory">
            <div>
              <p className="font-display text-base">Atendimento</p>
              <p className="text-xs text-ivory/60">Assistente virtual</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar atendimento" className="rounded-full p-1 hover:bg-ivory/10">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-sm px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-graphite text-ivory" : "bg-ivory-deep text-graphite"}`}>
                  {m.role === "bot" ? renderText(m.text) : m.text}

                  {m.products && m.products.length > 0 && (
                    <ul className="mt-2 space-y-1 border-t border-slate-light pt-2">
                      {m.products.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/produto/${p.slug}`} className="underline underline-offset-2 hover:text-gold-deep">
                            {p.name}
                          </Link>
                          {!p.available && <span className="text-xs text-slate"> (esgotado)</span>}
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.handoff && (
                    <a
                      href={buildWhatsAppSupportUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block rounded-sm bg-graphite px-3 py-2 text-center text-xs font-medium text-gold-on-dark"
                    >
                      Falar com a vendedora no WhatsApp
                    </a>
                  )}

                  {m.suggestions && m.suggestions.length > 0 && i === messages.length - 1 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-slate-light bg-ivory px-3 py-1 text-xs hover:border-graphite">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-slate">Digitando...</p>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex gap-2 border-t border-slate-light p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Sua mensagem
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Escreva sua dúvida"
              className="min-w-0 flex-1 rounded-sm border border-slate-light bg-ivory px-3 py-2 text-sm"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar" className="rounded-sm bg-graphite px-3 text-gold-on-dark disabled:opacity-50">
              <Send className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
