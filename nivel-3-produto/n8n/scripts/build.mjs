// Uso: node scripts/build.mjs
// Junta o template, os arquivos .js dos nos e o chatbot/faq.md (fonte unica da base de conhecimento)
// em workflows/chat-loja.json, pronto para o n8n importar.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FAQ_MD = resolve(ROOT, '../chatbot/faq.md');

// Cada "### Pergunta" vira uma entrada; o corpo ate o proximo titulo e a resposta (sem markdown).
export function parseFaq(md) {
  const itens = [];
  let atual = null;
  for (const linha of md.replace(/\r\n/g, '\n').split('\n')) {
    if (/^###\s+/.test(linha)) {
      atual = { q: linha.replace(/^###\s+/, '').trim(), a: [] };
      itens.push(atual);
    } else if (/^#{1,2}\s/.test(linha)) {
      atual = null;
    } else if (atual) {
      atual.a.push(linha);
    }
  }
  return itens
    .map((i) => ({ q: i.q, a: i.a.join('\n').replace(/[*`]/g, '').replace(/\n{3,}/g, '\n\n').trim() }))
    .filter((i) => i.a);
}

export function build() {
  const faq = parseFaq(readFileSync(FAQ_MD, 'utf8'));
  const wf = JSON.parse(readFileSync(resolve(ROOT, 'workflows/chat-loja.template.json'), 'utf8'));
  for (const n of wf.nodes) {
    const js = n.parameters.jsCode;
    if (typeof js !== 'string' || !js.startsWith('@file:')) continue;
    n.parameters.jsCode = readFileSync(resolve(ROOT, js.slice('@file:'.length)), 'utf8').replace('/*FAQ_JSON*/[]', JSON.stringify(faq));
  }
  return { wf, faq };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { wf, faq } = build();
  writeFileSync(resolve(ROOT, 'workflows/chat-loja.json'), `${JSON.stringify(wf, null, 2)}\n`);
  console.log(`workflows/chat-loja.json (${wf.nodes.length} nos, ${faq.length} perguntas no FAQ)`);
}
