// Roda o corpo de um Code node do n8n fora do n8n, com $input, $(), $env e $now simulados.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const acesso = (rows) => ({
  first: () => ({ json: rows[0] }),
  all: () => rows.map((json) => ({ json })),
});

// `faq` substitui o placeholder que o build preenche a partir de chatbot/faq.md.
export async function runNode(rel, { input = [], nodes = {}, env = {}, faq = [] } = {}) {
  const code = readFileSync(resolve(ROOT, rel), 'utf8').replace('/*FAQ_JSON*/[]', JSON.stringify(faq));
  const $ = (nome) => {
    if (!(nome in nodes)) throw new Error(`no simulado ausente: ${nome}`);
    return acesso(nodes[nome]);
  };
  const out = await new AsyncFunction('$input', '$', '$env', code)(acesso(input), $, env);
  return (out ?? []).map((i) => i.json);
}
