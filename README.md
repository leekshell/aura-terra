# Aura Terra · E-commerce + Institucional + Blog

Plataforma híbrida de cafés especiais orgânicos: loja completa, conteúdo institucional, blog "Diário do Café",
área do cliente com gestão de assinatura e um painel administrativo no-code para a equipe.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 com design tokens do manual de marca |
| Banco de dados | SQLite (better-sqlite3) com migração + seed automáticos |
| Autenticação | Sessão em cookie httpOnly + hash scrypt (login e-mail/senha e fluxo Google simulado) |
| Fontes | Fraunces (display) e Inter (texto), self-hosted via Fontsource |

## Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

O banco é criado automaticamente em `data/aura-terra.db` na primeira execução, já populado com 7 cafés,
5 artigos, 16 perguntas de FAQ, depoimentos, pedidos e uma assinatura de exemplo. Para recomeçar do zero,
apague a pasta `data/`.

### Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador (CMS) | `admin@auraterra.com.br` | `aura2026` |
| Cliente | `cliente@auraterra.com.br` | `cafe1234` |

## Mapa de páginas

**Site público**

- `/` — hero, manifesto da marca, carrossel de destaques, Clube Aura, métricas de impacto (contadores animados),
  depoimentos e chamadas do blog.
- `/loja` — catálogo com filtros por torra, perfil sensorial e método/moagem, busca e ordenação (estado refletido na URL).
- `/loja/[slug]` — página de produto com notas de degustação, gráfico de perfil de sabor, seleção de peso
  (250 g / 500 g / 1 kg), moagem e escolha entre compra avulsa ou assinatura (‑10%).
- `/assinatura` — planos Descobridor, Explorador e Colecionador + montagem da assinatura em 3 passos.
- `/sobre` — história da marca e **infográfico interativo da jornada do grão** (6 etapas).
- `/blog` e `/blog/[slug]` — Diário do Café, com filtro por categoria e conteúdo em Markdown.
- `/faq` — dúvidas categorizadas (Entregas & Prazos, Assinatura, Tipos de Moagem, Trocas/Devoluções) com busca
  e schema `FAQPage`.
- `/contato` — formulário (persistido no banco), WhatsApp flutuante, e-mail oficial e mapa do laboratório de torra.
- `/checkout` — fluxo em duas etapas com criação opcional de conta e geração do pedido.

**Área do cliente** (`/conta`)

- Visão geral, histórico de pedidos com linha do tempo de rastreamento, gestão da assinatura
  (pausar, retomar, adiar 7 dias, trocar frequência/moagem/peso, alterar endereço, cancelar) e dados pessoais.

**Painel administrativo** (`/admin`, restrito a `role = admin`)

- Dashboard com receita, MRR, clientes, estoque crítico e gráfico de vendas dos últimos 6 meses.
- Produtos: CRUD completo, edição rápida de estoque, publicar/despublicar.
- Pedidos: atualização de status, código de rastreio e transportadora + exportação CSV.
- Assinantes: visão de todos os planos e exportação CSV.
- Blog: editor Markdown com rascunho/publicação.
- Mensagens: caixa de entrada do formulário de contato.

Exportações: `/api/admin/export?tipo=pedidos|assinantes|clientes` (CSV com BOM, pronto para Excel).

## Design system

Tokens definidos em `src/app/globals.css`:

- Verde Floresta `#1A3626` (escala `forest-*`)
- Terracota `#C86047` (escala `terracota-*`)
- Areia `#F4F1EA` (escala `areia-*`)

Componentes utilitários: `.btn`, `.btn-primary/secondary/ghost`, `.card`, `.field`, `.eyebrow`, `.container-aura`,
`.prose-aura`. Microinterações via `<Reveal>` (IntersectionObserver), `<CountUp>` e transições suaves —
todas desativadas automaticamente em `prefers-reduced-motion`.

Layout **mobile-first**: menu e filtros em drawer, carrosséis com scroll-snap, sacola lateral, alvos de toque ≥ 44 px.

## SEO e performance

- Metadata por rota, Open Graph, canonical, `sitemap.xml` e `robots.txt` dinâmicos.
- JSON-LD de `Organization`, `Product` (com `AggregateRating`/`Offer`), `BlogPosting` e `FAQPage`.
- Imagens otimizadas via `next/image` (AVIF/WebP), fontes self-hosted (sem requisição a terceiros),
  Server Components por padrão e JavaScript de cliente restrito às ilhas interativas.

## Estrutura

```
src/
├─ app/
│  ├─ actions/       # Server Actions (auth, checkout, conta, admin, site)
│  ├─ admin/         # painel administrativo
│  ├─ conta/         # área do cliente
│  ├─ api/admin/     # exportações CSV
│  └─ (páginas públicas)
├─ components/       # UI e ilhas interativas
└─ lib/              # db, seed, queries, auth, tipos e regras de negócio
```

## Próximos passos sugeridos

- Plugar gateway de pagamento real (Pagar.me / Mercado Pago / Stripe) na etapa de pagamento do checkout.
- Substituir o botão "Entrar com Google" simulado por OAuth real.
- Migrar o SQLite para Postgres gerenciado ao escalar (o acesso a dados está isolado em `src/lib/queries.ts`).
- Integrar cálculo de frete por CEP (Correios/Melhor Envio) e e-mails transacionais.
