// Decide em codigo o que NAO precisa do modelo. O prompt pede; aqui o codigo garante.
// Ordem importa: seguranca e regras de negocio vem antes de qualquer resposta de FAQ.
const FAQ = /*FAQ_JSON*/[];
const msg = $input.first().json;

const SUGESTOES = ['Como faço um pedido?', 'Quero ajuda para escolher um perfume', 'Como sei se é original?', 'Falar com a vendedora'];
const resp = (o) => [{ json: { route: 'direta', handoff: false, suggestions: [], products: [], source: 'regra', ...o } }];

const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const t = norm(msg.text);

if (msg.invalid) {
  return resp({ intent: 'invalida', reply: 'Não consegui ler a sua mensagem. Escreva em até 500 caracteres.' });
}

// Tentativa de mexer nas instrucoes: nunca chega ao modelo.
if (/\b(ignore|esqueca|desconsidere|burle)\b.*\b(instruc\w*|regras|prompt)\b|\b(seu|o|qual) (system )?prompt\b|\brevele\b.*\binstruc/.test(t)) {
  return resp({ intent: 'fora_de_escopo', reply: 'Só posso ajudar com assuntos da GDS Boutique: pedidos, escolha de perfumes e autenticidade.' });
}

// Saude nao e assunto de loja.
if (/\b(alergi\w*|dermatit\w*|irritac\w*|reacao|gravida|gestante|asma|eczema)\b/.test(t)) {
  return resp({ intent: 'saude', reply: 'Não oriento sobre saúde ou alergias. Para isso, consulte um profissional de saúde antes de usar o produto.' });
}

// Pediu uma pessoa.
if (/\b(atendente|humano|vendedora|pessoa de verdade)\b|falar com (alguem|uma pessoa|a loja|a vendedora)|\bquero falar\b|\bwhatsapp\b/.test(t)) {
  return resp({ intent: 'atendente', handoff: true, reply: 'Claro. O atendimento com a vendedora é pelo WhatsApp. Toque no botão abaixo.' });
}

// Preco final, prazo, pagamento, troca, estoque: so a vendedora sabe. Nunca inventar.
if (/\b(desconto|cupom|promocao)\b/.test(t)) {
  return resp({ intent: 'negocio', handoff: true, reply: 'Não tenho confirmação de desconto. O preço vigente está na página de cada produto, e a vendedora confirma condições especiais pelo WhatsApp.' });
}
if (/\b(frete|prazo|entrega|entregam|pagamento|pagar|pix|cartao|parcel\w*|troc\w*|devol\w*|garantia|estoque|reposicao|disponibilidade)\b/.test(t)) {
  return resp({ intent: 'negocio', handoff: true, reply: 'Isso é combinado direto com a vendedora pelo WhatsApp, porque depende do seu endereço e do produto. Eu não tenho esses valores.' });
}

if (/^(oi|ola|opa|e ai|hey|hello|bom dia|boa tarde|boa noite)\b/.test(t) && t.split(' ').length <= 4) {
  return resp({ intent: 'saudacao', reply: 'Olá! Sou o assistente virtual da GDS Boutique. Posso ajudar com pedidos, escolha de perfume e autenticidade.', suggestions: SUGESTOES });
}
if (/^(obrigad[oa]|valeu|muito obrigad[oa])\b/.test(t)) {
  return resp({ intent: 'agradecimento', reply: 'Por nada! Se precisar de mais alguma coisa, é só chamar.' });
}

// ---- FAQ por similaridade (ponderada pela raridade da palavra), sem modelo ----
const STOP = new Set('uma uns umas dos das nos nas por pra para com sem que como qual quais eu voce meu minha seu sua ao aos tem ter foi sao esta esse essa isso sobre mais muito sei funciona funcionam quero posso pode'.split(' '));
const SIN = { comprar: 'pedido', compra: 'pedido', pedir: 'pedido', pedidos: 'pedido', original: 'autentico', falsificado: 'autentico', falso: 'autentico', autenticidade: 'autentico', verificar: 'autentico', certificado: 'autentico', certificados: 'autentico', certificar: 'autentico', fixa: 'durar', fixacao: 'durar', duracao: 'durar', dura: 'durar', permanece: 'durar' };
const stem = (w) => SIN[w] || (w.length > 4 ? w.replace(/(es|s)$/, '') : w);
const toks = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)).map(stem));

const itens = FAQ.map((f) => ({ f, q: toks(f.q) }));
const df = new Map();
for (const { q } of itens) for (const w of q) df.set(w, (df.get(w) || 0) + 1);
const idf = (w) => Math.log(1 + (itens.length || 1) / (df.get(w) || 0.5));

const u = toks(msg.text);
let melhor = null;
let melhorScore = 0;
for (const it of itens) {
  let comum = 0, somaQ = 0, somaU = 0;
  for (const w of it.q) somaQ += idf(w);
  for (const w of u) { somaU += idf(w); if (it.q.has(w)) comum += idf(w); }
  const score = somaQ + somaU ? (2 * comum) / (somaQ + somaU) : 0;
  if (score > melhorScore) { melhorScore = score; melhor = it.f; }
}

// Com modelo disponivel, so responde direto quando tem certeza. Sem modelo, aceita menos certeza.
const CORTE = msg.cfg.hasKey ? 0.6 : 0.35;
if (melhor && melhorScore >= CORTE) {
  return resp({ intent: 'faq', source: 'faq', reply: melhor.a, handoff: /whatsapp/i.test(melhor.a), faq: melhor.q, score: Number(melhorScore.toFixed(2)) });
}

if (!msg.cfg.hasKey) {
  return resp({ intent: 'sem_resposta', source: 'fallback', handoff: true, suggestions: SUGESTOES, reply: 'Não tenho essa informação. Quer falar com a vendedora pelo WhatsApp?' });
}

return [{ json: { route: 'llm' } }];
