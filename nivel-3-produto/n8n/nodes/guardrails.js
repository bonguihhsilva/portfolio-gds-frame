// O prompt pede. Aqui o codigo garante. Nunca confiar no modelo pra cumprir regra de negocio.
const res = $input.first().json;
const msg = $('normalizar').first().json;
const catalogo = $('catalogo').all().map((i) => i.json).filter((p) => p && p.slug);
const bySlug = new Map(catalogo.map((p) => [p.slug, p]));

const saida = (o) => [{ json: { handoff: false, suggestions: [], products: [], source: 'llm', ...o } }];
const falha = (motivo) => saida({
  source: 'fallback', handoff: true, intent: 'falha', motivo,
  reply: 'Não consegui responder isso agora. A vendedora atende você pelo WhatsApp.',
});
const barrado = (motivo) => saida({
  source: 'guardrail', handoff: true, intent: 'barrado', motivo,
  reply: 'Para te responder isso com certeza, a vendedora atende você pelo WhatsApp.',
});

const cand = res && res.candidates && res.candidates[0];
let out = null;
if (cand) { try { out = JSON.parse(cand.content.parts.map((p) => p.text || '').join('')); } catch (e) { out = null; } }

// Cota, servico fora e resposta cortada se consertam de jeitos diferentes: o motivo fica no log do n8n.
if (!out) {
  const erro = String((res && res.error && (res.error.message || res.error.description)) || '');
  if (/quota|too many requests|rate limit|429/i.test(erro)) return falha('cota do Gemini estourou');
  if (!cand) return falha(`API do Gemini falhou${erro ? ': ' + erro.slice(0, 120) : ''}`);
  if (cand.finishReason && cand.finishReason !== 'STOP') return falha(`resposta cortada (${cand.finishReason})`);
  return falha('o modelo nao devolveu JSON valido');
}

let reply = String(out.reply || '')
  .replace(/[—–]/g, ',')
  .replace(/[*_`#]/g, '')
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
  .replace(/[ \t]{2,}/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const DINHEIRO = /(r\$|us\$|\breais\b|parcel\w*|desconto|cupom|\bfrete\b|\bpix\b|prazo de entrega)/i;
const PROIBIDO = /(solu[cç][oõ]es inovadoras|transforma[cç][aã]o digital|excel[eê]ncia|parceria estrat[eé]gica|ecossistema|alavancar|potencializar|disruptiv)/i;
const SAUDE = /(alergia|dermatite|irrita[cç][aã]o|trata\w* (a )?pele|cura)/i;

// Repetir o que ja disse e o jeito mais rapido de parecer robo quebrado.
const norma = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
const jaDisse = msg.history.filter((h) => h.role === 'bot').some((h) => norma(h.text) === norma(reply));

if (reply && DINHEIRO.test(reply)) return barrado('o modelo tentou falar de dinheiro ou prazo');
if (reply && PROIBIDO.test(reply)) return barrado('vocabulario proibido');
if (reply && SAUDE.test(reply)) return barrado('o modelo falou de saude');
if (reply && jaDisse) return barrado('repetiu a resposta anterior');
if (reply.length > 600) return barrado('resposta longa demais');
if (!reply) return falha('resposta vazia');

// So recomenda o que existe no catalogo: slug inventado e descartado.
const slugs = Array.isArray(out.product_slugs) ? out.product_slugs : [];
const products = [...new Set(slugs)]
  .filter((s) => bySlug.has(s))
  .slice(0, 3)
  .map((s) => ({ slug: s, name: `${bySlug.get(s).brand} ${bySlug.get(s).name}`, available: bySlug.get(s).available !== false }));

return saida({ reply, handoff: out.handoff === true, products, intent: out.intent || 'outro' });
