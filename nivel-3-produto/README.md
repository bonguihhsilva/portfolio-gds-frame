# Nível 3: GDS Boutique, produto integrado

Vitrine de perfumaria e cosméticos que reúne todas as tecnologias do curso em um único sistema que sobe com um comando.

| Requisito | Entrega | Onde |
|---|---|---|
| Frontend e backend em containers | 4 serviços no Docker Compose | [docker-compose.yml](docker-compose.yml) |
| Sistema de recomendação no frontend | "Quem gosta deste também gosta" na página do produto e "Combina com o seu carrinho" no carrinho | [recommender.py](backend/app/recommender.py) |
| Blockchain | Smart contract de certificado de autenticidade por lote, com página pública de verificação | [ProductCertificate.sol](contracts/contracts/ProductCertificate.sol) |
| Chatbot de suporte | Base de conhecimento, fluxo e webchat do Botpress | [chatbot/](chatbot/README.md) |
| Blog otimizado para SEO | 3 artigos, dados estruturados, sitemap e robots | [frontend/content/blog](frontend/content/blog/) |
| Campanha e estratégia de SEO | Plano de campanha de 4 semanas e plano de SEO | [marketing/](marketing/) |

## Arquitetura

```
 navegador ──► frontend (Next.js :3000) ──/api/*──► backend (Flask :5000) ──web3──► chain (Hardhat :8545)
                                                         │                              ▲
                                                  catalog.json                          │ publica o contrato
                                               (25 produtos, TF-IDF)              deployer (roda e sai)
```

- **frontend:** Next.js 16 (App Router), React 19, Tailwind 4. Busca produtos e recomendações no backend. As chamadas do navegador a `/api/*` passam por um *rewrite* do Next, então não há CORS.
- **backend:** Flask. Serve catálogo, recomendações e a ponte com a blockchain.
- **chain:** nó local do Hardhat. Não usa dinheiro nem rede pública.
- **deployer:** publica o contrato e grava endereço e ABI em um volume compartilhado, de onde o backend lê. Roda uma vez e termina.

A loja original usa Supabase. Nesta versão o catálogo vem de um arquivo JSON para que qualquer pessoa rode o sistema sem contas nem chaves.

## Como rodar

Requisitos: Docker com Compose.

```bash
cd nivel-3-produto
ADMIN_TOKEN=escolha-um-valor docker compose up --build
```

No PowerShell: `$env:ADMIN_TOKEN="escolha-um-valor"; docker compose up --build`.

- Loja: http://localhost:3000
- API: http://localhost:5050/api/health

### Variáveis (todas opcionais, exceto `ADMIN_TOKEN` para emitir certificados)

Podem ir em um arquivo `.env` ao lado do `docker-compose.yml` (que o git ignora) ou no ambiente.

| Variável | Para que serve | Padrão |
|---|---|---|
| `ADMIN_TOKEN` | Autoriza a emissão de certificados. Vazio desabilita a emissão | vazio |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número da loja nos links do WhatsApp, só dígitos | `5511999999999` |
| `SITE_URL` | URL pública, usada no sitemap e no Open Graph | `http://localhost:3000` |
| `BOTPRESS_INJECT_URL`, `BOTPRESS_CONFIG_URL` | Webchat do Botpress. Veja [chatbot/](chatbot/README.md) | vazio (sem chat) |

Para recomeçar do zero (o nó blockchain guarda tudo em memória): `docker compose down -v`.

## Testando a blockchain

Emitir um certificado para o lote `DEMO-001` do Asad (precisa do `ADMIN_TOKEN`):

```bash
curl -X POST http://localhost:5050/api/certificates \
  -H "Content-Type: application/json" -H "X-Admin-Token: escolha-um-valor" \
  -d '{"slug":"asad-100ml","lot":"DEMO-001"}'
```

Depois, em http://localhost:3000/autenticidade, escolha **Asad** e o lote `DEMO-001`. A página responde "Lote autêntico". Com outro produto ou outro lote, responde que não há certificado.

### Como o certificado funciona

1. O backend monta um JSON canônico com slug, nome, marca, volume e lote e calcula o hash (keccak-256).
2. O contrato guarda `id = keccak(slug|lote)`, esse hash e a data. Só o dono do contrato emite ou revoga.
3. A verificação recalcula o hash **com os dados atuais do cadastro** e compara com o registro. Se alguém alterar o volume do produto depois de emitido, a verificação deixa de conferir.

O endereço do contrato muda a cada subida porque a rede é local e descartável.

## Testes

```bash
# Contrato (8 testes)
cd contracts && npm ci && npx hardhat test

# Backend: recomendação, API e verificação de certificados (10 testes)
cd backend && pip install -r requirements.txt pytest && pytest

# Frontend
cd frontend && npm ci && npm run lint && npx tsc --noEmit && BACKEND_URL=http://localhost:5000 npm run build
```

## Recomendação

Recomendação baseada em conteúdo. Cada produto vira um texto com categoria, marca, linha, notas olfativas (peso maior) e descrição. O TF-IDF transforma os textos em vetores e a similaridade de cosseno ordena os mais parecidos. No carrinho, usa-se o vetor médio dos itens. Produtos esgotados e itens já escolhidos ficam de fora.

```
GET /api/recommendations?slugs=khamrah-100ml&limit=3
```

## API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Status e total de produtos |
| GET | `/api/products?category=` | Lista, com filtro opcional por categoria |
| GET | `/api/products/<slug>` | Produto |
| GET | `/api/recommendations?slugs=a,b&limit=4` | Produtos parecidos com os informados |
| POST | `/api/certificates` | Emite certificado de lote. Exige `X-Admin-Token` |
| GET | `/api/certificates/<slug>/<lote>` | Verifica um lote |

## Limitações

- As fotos são de banco de imagens (Unsplash), como no produto original.
- O chatbot depende de um bot criado no Botpress Cloud: o repositório traz o conteúdo e o fluxo, mas o bot publicado e a conferência do webchat no site não foram feitos.
- A rede blockchain é local. Não há deploy em testnet pública.
- O painel administrativo, o checkout com pedidos e a autenticação do produto original não fazem parte desta versão.
