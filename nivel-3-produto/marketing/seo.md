# Estratégia de SEO

## O que já está implementado no código

| Item | Onde |
|---|---|
| `title` e `description` únicos por página (produto, artigo, blog, autenticidade) | `generateMetadata` em cada rota |
| URL canônica nos artigos e no blog | `alternates.canonical` |
| Open Graph (site e artigos) | `src/app/layout.tsx`, `blog/[slug]/page.tsx` |
| Dados estruturados `Product` (nome, marca, preço em BRL, disponibilidade) | página do produto, JSON-LD |
| Dados estruturados `Article` | página do artigo, JSON-LD |
| `sitemap.xml` dinâmico com produtos e artigos | `src/app/sitemap.ts` |
| `robots.txt` liberando o site e bloqueando `/api/` | `src/app/robots.ts` |
| `lang="pt-BR"` e HTML semântico (`nav`, `article`, `time`, `dl`) | layouts e páginas |
| Links internos entre artigos, categorias e produtos | conteúdo em `frontend/content/blog` |
| Imagens com `alt` descritivo e otimizadas pelo `next/image` | componentes de produto |

## Palavras-chave e conteúdo

Estratégia de cauda longa: o site é pequeno, então compete em dúvidas específicas e não em termos genéricos.

| Intenção | Palavra-chave alvo | Página |
|---|---|---|
| Informacional | como escolher perfume, famílias olfativas | [Guia das famílias olfativas](../frontend/content/blog/como-escolher-perfume-familias-olfativas.md) |
| Informacional | o que é oud, perfume árabe fixa mais | [Perfume árabe e oud](../frontend/content/blog/perfume-arabe-oud-fixacao.md) |
| Informacional | como fazer o perfume durar mais | [Hábitos de fixação](../frontend/content/blog/como-fazer-perfume-durar-mais.md) |
| Comercial | perfume árabe, perfume de nicho, comprar perfume importado | páginas de categoria no catálogo |
| Transacional | nome do produto + volume (ex.: "Khamrah 100ml") | página de cada produto |

Cada artigo leva a categorias e a produtos, e cada produto leva a recomendações semelhantes. Isso distribui a autoridade entre as páginas.

## Próximos passos (não feitos)

1. Publicar em domínio próprio com HTTPS e configurar `SITE_URL`.
2. Cadastrar o site no Google Search Console e enviar o sitemap.
3. Cadastrar o perfil da loja no Google Meu Negócio, já que há endereço e atendimento local.
4. Trocar as imagens de banco pelas fotos reais, com nome de arquivo e `alt` descritivos.
5. Publicar um artigo novo por mês, sempre ligado a uma categoria do catálogo.
6. Medir no Search Console: impressões, cliques e posição média por página, e ajustar títulos de quem tem impressão e pouco clique.
