# Workflow n8n do chatbot

Código-fonte do workflow **Loja: chat de atendimento**. Explicação da arquitetura e das camadas em [chatbot/README.md](../chatbot/README.md).

## Estrutura

```
n8n/
  nodes/                       um arquivo .js por nó de código (a lógica de verdade)
  workflows/
    chat-loja.template.json    esqueleto do workflow, com @file:nodes/x.js no lugar do código
    chat-loja.json             gerado: é o que o n8n importa
  scripts/build.mjs            junta template + nodes + chatbot/faq.md em chat-loja.json
  lib/harness.mjs              roda um nó de código fora do n8n ($input, $(), $env simulados)
  tests/chat.test.mjs          25 testes
```

O código dos nós fica em arquivos `.js` comuns, e não escondido dentro do JSON do workflow, para poder ser lido, revisado e testado. O build cola tudo no `chat-loja.json`.

## Comandos

```bash
npm run build   # regenera workflows/chat-loja.json (rode depois de mudar um nó ou o chatbot/faq.md)
npm test        # roda os testes dos nós e confere que o chat-loja.json está atualizado
```

Não precisa de `npm install`: usa só o Node.

## Como o workflow entra no n8n

O serviço `n8n` do `docker-compose.yml` monta `workflows/` e, ao subir, executa `n8n import:workflow` e `n8n publish:workflow`. Para importar em outro n8n, use **Import from File** com o `chat-loja.json` e defina as variáveis de ambiente do [chatbot/README.md](../chatbot/README.md). O n8n precisa de `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, porque a chave do Gemini é lida de `$env` e não de um arquivo.

## Decisões

- **Sem credencial no JSON.** A chave do Gemini vem de `$env.GEMINI_API_KEY`. O workflow exportado não carrega segredo, e um teste confere isso.
- **O n8n não guarda estado.** O histórico vem do navegador a cada mensagem (até 6 turnos), e o workflow não grava execuções bem-sucedidas (`saveDataSuccessExecution: none`). Nenhuma conversa fica salva no n8n.
- **O prompt nunca vê preço.** O catálogo vai ao modelo sem o campo de preço, e o guardrail barra qualquer resposta com dinheiro. Preço é da página do produto e da vendedora.
- **Falhas sempre terminam em uma saída para o WhatsApp.** Cota do Gemini, API fora, resposta cortada e JSON inválido viram encaminhamento, com o motivo específico no log.
