# Nível 2: as tecnologias aplicadas à minha área

**Área de atuação:** desenvolvimento web e marketing digital para pequenos negócios locais (agência GDS Frame).

O cliente típico é um comércio local, como clínica, petshop, salão ou loja, que vende pelo WhatsApp, tem pouca equipe e pouco tempo. O problema recorrente é o mesmo: o cliente do cliente tem dúvidas simples, a resposta depende de uma pessoa, e o negócio não tem como provar que é confiável nem recomendar algo a mais.

Cada prática do curso foi ajustada a esse cenário.

## Chatbot: atendimento que não depende da dona do negócio

| | |
|---|---|
| Problema | A mesma dúvida chega dezenas de vezes por dia no WhatsApp (horário, como pedir, o que fazer) e interrompe o trabalho |
| Aplicação | Chatbot que responde às dúvidas frequentes a partir de uma base de conhecimento do negócio e encaminha para uma pessoa quando precisa |
| Ajuste da prática | O foco não é conversar bem sobre qualquer assunto, e sim **não inventar**: preço, prazo e disponibilidade sempre vão para o humano. O fluxo define quando passar a conversa |
| Aplicado em | [chatbot/](../nivel-3-produto/chatbot/README.md) para a loja de perfumes. A mesma estrutura serve a clínica, petshop ou restaurante trocando a base de conhecimento |

## Sistema de recomendação: vender mais para quem já está olhando

| | |
|---|---|
| Problema | Pequeno comércio não tem equipe para sugerir produtos. O cliente compra um item e vai embora |
| Aplicação | Recomendação por conteúdo: sugere itens parecidos com o que o cliente está vendo ou já pôs no carrinho |
| Ajuste da prática | Comércio pequeno não tem histórico de compras, então não dá para usar filtragem colaborativa. A recomendação por **conteúdo** (atributos do produto) funciona desde o primeiro dia, com 25 produtos |
| Aplicado em | [recommender.py](../nivel-3-produto/backend/app/recommender.py). Mostra também as "notas em comum", para o cliente entender por que aquilo foi sugerido |

## Blockchain: confiança verificável sem infraestrutura cara

| | |
|---|---|
| Problema | Em mercados com produto falsificado ou de origem duvidosa (perfumes importados, por exemplo), a palavra do vendedor não basta |
| Aplicação | Registrar em um contrato o hash dos dados de cada lote. O cliente confere sozinho se o lote existe e se os dados batem |
| Ajuste da prática | Não se guarda o dado na blockchain, só o hash. Isso evita custo e exposição de dados. A leitura é gratuita e o cliente verifica numa página comum, sem carteira nem conhecimento técnico |
| Outros usos na área | Registro de aceite de proposta ou contrato de serviço com data confiável; comprovação de entrega de um relatório mensal |
| Aplicado em | [ProductCertificate.sol](../nivel-3-produto/contracts/contracts/ProductCertificate.sol) e a página de verificação do site |

## Docker: entregar o mesmo sistema para cada cliente

| | |
|---|---|
| Problema | Quem entrega sistemas parecidos para vários clientes perde horas com o "funciona na minha máquina" |
| Aplicação | Frontend, backend e blockchain local sobem com um comando. O ambiente é idêntico em qualquer máquina e no servidor |
| Ajuste da prática | Imagens pequenas (build em duas etapas, usuário sem privilégios), `healthcheck` e ordem de subida declarada. A ordem importa: o contrato precisa ser publicado antes da API iniciar |
| Aplicado em | [docker-compose.yml](../nivel-3-produto/docker-compose.yml) |

## SEO e marketing digital: ser encontrado

| | |
|---|---|
| Problema | O negócio local depende de ser achado no Google e no Instagram, mas não tem conteúdo nem rastreamento |
| Aplicação | Blog com artigos que respondem dúvidas reais, dados estruturados, sitemap e uma campanha com UTM preservada até o WhatsApp |
| Ajuste da prática | A conversão do comércio local acontece no WhatsApp, fora do site. Por isso a campanha mede **conversa iniciada**, não "compra no site" |
| Aplicado em | [marketing/](../nivel-3-produto/marketing/) e [frontend/content/blog](../nivel-3-produto/frontend/content/blog/) |

## Resumo

| Tecnologia | Dor do pequeno negócio | Ajuste principal |
|---|---|---|
| Chatbot | Atendimento repetitivo | Responder só com base verificável e saber passar para uma pessoa |
| Recomendação | Falta de equipe para sugerir | Por conteúdo, sem precisar de histórico |
| Blockchain | Desconfiança do cliente | Guardar só o hash e verificar em página comum |
| Docker | Entrega e suporte repetidos | Ambiente único, subida em ordem, um comando |
| SEO e campanha | Ninguém acha o negócio | Medir conversa no WhatsApp, não venda no site |
