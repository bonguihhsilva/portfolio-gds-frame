# Campanha de lançamento: GDS Boutique

Plano de campanha documentado para divulgar a vitrine. É um plano de execução: ainda não foi veiculado, então este documento não traz resultados. Os números de meta são hipóteses para calibrar depois das primeiras semanas.

## 1. Objetivo

Gerar conversas qualificadas no WhatsApp da loja a partir do site. A conversão principal é o clique em "Enviar pedido pelo WhatsApp" ou "Perguntar no WhatsApp", porque a venda é fechada fora do site.

Meta de partida: medir por 4 semanas o custo por conversa iniciada e a taxa de pedido fechado por conversa. Só depois fixar metas numéricas.

## 2. Público

| Segmento | Motivação | Produtos de entrada |
|---|---|---|
| Quem já usa perfume importado e quer pagar menos por fixação melhor | Custo-benefício | Linha árabe (Khamrah, Asad, Hawas) |
| Quem busca assinatura olfativa diferente | Exclusividade | Linha de nicho (Santal 33, Layton, Replica Jazz Club) |
| Quem vai presentear | Segurança na escolha | Importados conhecidos (Black Opium, Bleu, Libre) |
| Quem monta rotina de skin care | Recorrência | Sérum, protetor solar, creme noturno |

Praça inicial: a região da própria loja, com expansão para o resto do Brasil pelo Instagram.

## 3. Proposta e mensagem

- **Ideia central:** "Perfume é memória. Escolha a sua com calma." (a mesma da home)
- **Ângulos de anúncio**, um por criativo, para testar qual funciona:
  1. Fixação: "Perfume que dura o dia inteiro" (linha árabe)
  2. Descoberta: "Não sabe qual escolher? Diga o que você gosta" (leva ao chatbot e às recomendações)
  3. Confiança: "Confira o lote na blockchain" (diferencial de autenticidade)
  4. Presente: "O presente que não erra" (importados conhecidos)
- **Regra de marca:** nenhum preço em post de Instagram. O preço aparece apenas no site e na conversa.
- **Promessa:** método e transparência, nunca resultado garantido.

## 4. Canais

| Canal | Papel | Formato |
|---|---|---|
| Instagram orgânico | Construir presença e prova | Reels de 15 a 30 s (aplicação, notas olfativas), carrossel educativo a partir dos artigos do blog |
| Meta Ads (Instagram e Facebook) | Gerar tráfego qualificado | Anúncio com destino WhatsApp ou a página do produto |
| Google (busca orgânica) | Captar quem já procura | Artigos do blog e páginas de produto (ver [seo.md](seo.md)) |
| Chatbot no site | Reduzir atrito e qualificar | Responde dúvidas e encaminha ao WhatsApp |

## 5. Calendário de 4 semanas

| Semana | Foco | Entregas |
|---|---|---|
| 1 | Base | Rastreamento conferido, perfil do Instagram ajustado, 3 artigos publicados, chatbot no ar |
| 2 | Orgânico | 3 reels (um por ângulo), 1 carrossel por artigo, stories com enquete de família olfativa |
| 3 | Pago, teste | Campanha criada **pausada** e ativada após revisão: 4 anúncios (um por ângulo) com verba pequena e igual entre eles |
| 4 | Pago, decisão | Pausar os dois piores ângulos, concentrar verba nos dois melhores, revisar o relatório |

## 6. Rastreamento

Sem rastreamento conferido a campanha não sobe.

- Todo anúncio com UTM: `utm_source=facebook-ads&utm_medium=cpc&utm_campaign=lancamento&utm_content=<angulo>`
- O link do WhatsApp preserva a origem: o clique é registrado no site antes de abrir o `wa.me`
- Pixel da Meta nos eventos `ViewContent` (página de produto), `AddToCart` e `Lead` (clique em enviar pelo WhatsApp)
- Planilha simples de conversas: data, origem (UTM), produto, fechou ou não

## 7. Métricas

| Métrica | Como medir | Para que serve |
|---|---|---|
| Custo por conversa iniciada | Verba / cliques em "Enviar pelo WhatsApp" | Eficiência do anúncio |
| Taxa de fechamento | Pedidos fechados / conversas | Qualidade do tráfego |
| Sessões orgânicas e posição das páginas-alvo | Google Search Console | Resultado do SEO |
| Uso do chatbot e taxa de encaminhamento | Analytics do Botpress | Se o bot resolve ou só empurra |
| Verificações de autenticidade | Acessos a /autenticidade | Interesse no diferencial |

## 8. Regras de operação

1. Campanha nasce pausada e só é ativada depois de revisada.
2. A verba de mídia é paga direto na plataforma, no nome do dono da loja.
3. Parar e revisar se o pixel ficar 24 horas sem eventos com campanha ativa.
4. Decisão de escalar ou cortar só com dado de pelo menos 7 dias.
5. Credenciais de anúncio nunca vão para o repositório.

## 9. Riscos

| Risco | Mitigação |
|---|---|
| Fotos de produto são imagens de banco, não do estoque real | Trocar pelas fotos reais antes de anunciar |
| Estoque muda e o anúncio promete produto esgotado | Anunciar só itens com `available` verdadeiro, conferir semanalmente |
| Conversão acontece fora do site e é difícil de medir | UTM preservada e planilha de conversas |
| Claims sobre o produto sem comprovação | Usar apenas as descrições do catálogo e o certificado do lote |
