# Nível 1: práticas individuais do curso

Cada prática do curso, com o código que a demonstra e o conceito que ela cobre. As seis primeiras são exercícios curtos de fundamentos. As demais, que fecham o curso (chatbot, recomendação, blockchain, Docker, SEO e marketing), estão implementadas de forma integrada no [Nível 3](../nivel-3-produto/README.md).

## Fundamentos

| # | Prática | Tecnologia | O que o código demonstra | Arquivos |
|---|---|---|---|---|
| 1 | Formulários e estilo | HTML5 + CSS3 | Campos de texto, e-mail, senha e `select`; validação nativa com `required`; `fieldset`/`legend`; estilização com flexbox, `border-radius` e `box-shadow`; estado `:hover` no botão | [formulario.html](01-html-css/formulario.html), [atividade-frontend.html](01-html-css/atividade-frontend.html) |
| 2 | Layout responsivo | Bootstrap 5 | Grid fluido com `container-fluid` e classes utilitárias (`text-center`, `rounded-pill`, `shadow-sm`) carregadas por CDN | [index.html](02-bootstrap/index.html) |
| 3 | Variáveis e condicionais | JavaScript | Declaração com `let`, template strings e `if/else` | [variaveis-e-condicionais.js](03-javascript/variaveis-e-condicionais.js) |
| 4 | Funções | JavaScript | Função sem parâmetro, com parâmetro e com retorno (`soma`), chamadas com valores diferentes | [funcoes.js](03-javascript/funcoes.js) |
| 5 | Orientação a objetos | JavaScript | `class`, `constructor`, método de instância e método estático usado como *factory* (`Car.factoryCar`) | [classes.js](03-javascript/classes.js) |
| 6 | Assíncrono | JavaScript | `Promise` com `resolve`/`reject` e encadeamento `.then().catch().finally()` | [promises.js](03-javascript/promises.js) |
| 7 | JSON | JavaScript | Objeto literal serializado com `JSON.stringify(obj, null, 2)` e exibido no HTML | [exercicio.html](04-json/exercicio.html) |
| 8 | Funções em Java | Java | Método `void` com parâmetro e método com retorno tipado (`calcularQuadrado`), chamados a partir do `main` | [AtividadeFuncoes.java](05-java/AtividadeFuncoes.java) |
| 9 | Dados para BI | Python / CSV | Três bases simuladas de 150 registros (logística, saúde e terceiro setor) preparadas para análise | [06-python-bi](06-python-bi/) |

As bases da prática 9 são só os conjuntos de dados. A análise delas não está neste repositório.

## Práticas de fechamento do curso

| Prática | Onde está |
|---|---|
| Chatbot com Botpress | [nivel-3-produto/chatbot](../nivel-3-produto/chatbot/README.md) |
| Sistema de recomendação (machine learning) | [backend/app/recommender.py](../nivel-3-produto/backend/app/recommender.py) |
| Blockchain e smart contract | [contracts/](../nivel-3-produto/contracts/contracts/ProductCertificate.sol) |
| Docker (frontend e backend conteinerizados) | [docker-compose.yml](../nivel-3-produto/docker-compose.yml) |
| Blog otimizado para SEO | [frontend/content/blog](../nivel-3-produto/frontend/content/blog/) |
| Campanha de marketing e SEO | [marketing/](../nivel-3-produto/marketing/) |

## Como rodar os exercícios

Os arquivos `.html` abrem direto no navegador. Os `.js` rodam com `node arquivo.js`. O Java roda com `javac AtividadeFuncoes.java && java AtividadeFuncoes`.
