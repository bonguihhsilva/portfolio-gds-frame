# Chatbot de suporte (Botpress)

Assistente de atendimento da GDS Boutique. Responde dúvidas frequentes (como pedir, escolher perfume, autenticidade, cuidados) e encaminha para o WhatsApp da loja quando a conversa precisa de uma pessoa.

## O que este repositório contém

| Arquivo | Para que serve |
|---|---|
| [faq.md](faq.md) | Base de conhecimento. É o conteúdo que o bot usa para responder |
| [fluxo.md](fluxo.md) | Desenho do fluxo de conversa, instruções do agente e casos de teste |
| `frontend/src/components/chat/BotpressWebchat.tsx` | Carrega o webchat no site |

O bot em si vive na conta do Botpress de quem o criou, então não há exportação dele aqui. O site funciona sem o chat e o webchat só aparece depois que as duas variáveis de ambiente abaixo forem preenchidas.

## Criar o bot e ligar ao site

1. No [Botpress Cloud](https://botpress.com), crie um bot novo.
2. Em **Knowledge Base**, envie o [faq.md](faq.md) como documento.
3. Monte o fluxo conforme [fluxo.md](fluxo.md): um nó de agente com a base de conhecimento, o menu de intenções e o encaminhamento para o WhatsApp.
4. Teste no emulador com os casos da seção "Casos de teste" do `fluxo.md`.
5. Publique o bot e abra **Webchat > Embed**. Copie os dois endereços de script do snippet:
   - o primeiro (`inject.js`) vai em `BOTPRESS_INJECT_URL`
   - o segundo (arquivo de configuração do bot) vai em `BOTPRESS_CONFIG_URL`
6. Crie um arquivo `.env` ao lado do `docker-compose.yml` com essas duas variáveis e suba de novo:

```bash
docker compose up -d --build frontend
```

O webchat aparece no canto inferior direito de todas as páginas da loja.

## Estado

O conteúdo e o fluxo estão prontos para importar. A publicação do bot e a conferência do webchat no site dependem da conta do autor no Botpress e ainda não foram feitas.
