import type Database from "better-sqlite3";
import { hashPassword } from "./password";

type Seeder = (db: Database.Database) => void;

const products = [
  {
    id: "prd_aurora",
    slug: "aurora-do-cerrado",
    name: "Aurora do Cerrado",
    subtitle: "Microlote lavado · Torra clara",
    description:
      "Um café solar, de acidez cítrica brilhante e final limpo. Colhido a dedo no Cerrado Mineiro por uma cooperativa de 12 famílias que converteu 100% da lavoura para manejo orgânico em 2019.",
    story:
      "A Aurora nasce das primeiras horas do dia na Fazenda Boa Esperança, onde a colheita começa às 5h para aproveitar o frescor. O lote é lavado em água de reúso e seco em terreiro suspenso por 14 dias.",
    origin: "Cerrado Mineiro, MG",
    producer: "Cooperativa Aurora (12 famílias)",
    farm: "Sítio Boa Esperança",
    altitude: "1.180 m",
    process: "Lavado, secagem em terreiro suspenso",
    variety: "Catuaí Amarelo",
    score: 86.5,
    roast: "clara",
    profiles: ["citrico", "frutado", "floral"],
    methods: ["graos", "filtro", "prensa"],
    notes: ["Tangerina", "Mel de flores", "Chá branco"],
    flavor: { acidez: 8.5, corpo: 5, doçura: 7.5, aroma: 8, intensidade: 5 },
    price_cents: 5490,
    compare_at_cents: 6290,
    stock: 148,
    image: "/images/produtos/aurora-cerrado.jpg",
    accent: "#C86047",
    badge: "Mais vendido",
    featured: 1,
    rating: 4.9,
    reviews_count: 212,
  },
  {
    id: "prd_mantiqueira",
    slug: "serra-da-mantiqueira",
    name: "Serra da Mantiqueira",
    subtitle: "Cereja descascado · Torra média",
    description:
      "Nosso café mais equilibrado: doçura de caramelo, corpo sedoso e final achocolatado. É o coringa da casa — vai bem no coado da manhã e no espresso da tarde.",
    story:
      "Cultivado a 1.350 m em uma propriedade familiar que preserva 62 hectares de mata nativa. O sombreamento por ingás desacelera a maturação e concentra açúcares no grão.",
    origin: "Serra da Mantiqueira, MG",
    producer: "Família Rodrigues",
    farm: "Fazenda Águas Claras",
    altitude: "1.350 m",
    process: "Cereja descascado",
    variety: "Mundo Novo & Yellow Bourbon",
    score: 85,
    roast: "media",
    profiles: ["achocolatado", "caramelo", "nozes"],
    methods: ["graos", "filtro", "espresso", "prensa"],
    notes: ["Caramelo salgado", "Chocolate ao leite", "Castanha-do-pará"],
    flavor: { acidez: 5.5, corpo: 7.5, doçura: 8.5, aroma: 7, intensidade: 6.5 },
    price_cents: 4890,
    compare_at_cents: null,
    stock: 320,
    image: "/images/produtos/serra-mantiqueira.jpg",
    accent: "#1A3626",
    badge: "Favorito da casa",
    featured: 1,
    rating: 4.8,
    reviews_count: 341,
  },
  {
    id: "prd_mata",
    slug: "mata-atlantica-reserva",
    name: "Mata Atlântica Reserva",
    subtitle: "Natural · Torra escura",
    description:
      "Intenso, encorpado e doce. Uma torra escura sem amargor queimado, pensada para quem toma café com leite ou ama um espresso denso de crema persistente.",
    story:
      "Produzido em sistema agroflorestal no Caparaó Capixaba, onde o café divide espaço com bananeiras e árvores nativas — um sistema que devolve sombra, água e biodiversidade ao solo.",
    origin: "Caparaó, ES",
    producer: "Sr. Belmiro e Dona Ivete",
    farm: "Sítio Recanto Verde",
    altitude: "980 m",
    process: "Natural, 21 dias de secagem",
    variety: "Catucaí Vermelho",
    score: 84,
    roast: "escura",
    profiles: ["achocolatado", "nozes", "caramelo"],
    methods: ["graos", "espresso", "prensa"],
    notes: ["Cacau 70%", "Rapadura", "Amêndoa tostada"],
    flavor: { acidez: 3, corpo: 9, doçura: 7, aroma: 6.5, intensidade: 9 },
    price_cents: 4590,
    compare_at_cents: null,
    stock: 205,
    image: "/images/produtos/mata-atlantica.jpg",
    accent: "#9C4432",
    badge: null,
    featured: 1,
    rating: 4.7,
    reviews_count: 168,
  },
  {
    id: "prd_chapada",
    slug: "chapada-diamantina-natural",
    name: "Chapada Diamantina",
    subtitle: "Natural de altitude · Torra clara",
    description:
      "Explosivo em frutas vermelhas, com perfume floral e doçura de compota. Um lote pequeno, de safra limitada, para quem quer entender o que é café de terroir.",
    story:
      "A 1.420 m, na Bahia, as noites frias da Chapada criam uma maturação lenta. O lote seca em estufa por 26 dias, virado à mão a cada duas horas.",
    origin: "Piatã, Chapada Diamantina, BA",
    producer: "Coletivo Piatã Agroecológico",
    farm: "Fazenda Serra do Bode",
    altitude: "1.420 m",
    process: "Natural em estufa",
    variety: "Bourbon Amarelo",
    score: 88,
    roast: "clara",
    profiles: ["frutado", "floral", "citrico"],
    methods: ["graos", "filtro"],
    notes: ["Morango", "Jasmim", "Compota de damasco"],
    flavor: { acidez: 8, corpo: 6.5, doçura: 9, aroma: 9.5, intensidade: 6 },
    price_cents: 6890,
    compare_at_cents: null,
    stock: 62,
    image: "/images/produtos/chapada-diamantina.jpg",
    accent: "#47795C",
    badge: "Safra limitada",
    featured: 1,
    rating: 4.9,
    reviews_count: 97,
  },
  {
    id: "prd_espresso",
    slug: "vale-do-cafe-espresso",
    name: "Vale do Café Espresso",
    subtitle: "Blend de espresso · Torra média-escura",
    description:
      "Blend desenvolvido no nosso laboratório para render um espresso doce, com crema aveludada e retrogosto de chocolate meio amargo. Estável também na moka italiana.",
    story:
      "70% Mantiqueira e 30% Caparaó: a acidez de um equilibra a densidade do outro. Testado em mais de 40 extrações antes de virar receita fixa.",
    origin: "Blend MG + ES",
    producer: "Parceiros Aura Terra",
    farm: "Blend de 4 sítios",
    altitude: "980 – 1.350 m",
    process: "Misto",
    variety: "Catuaí, Mundo Novo, Catucaí",
    score: 84.5,
    roast: "media",
    profiles: ["achocolatado", "caramelo"],
    methods: ["graos", "espresso"],
    notes: ["Chocolate meio amargo", "Melado", "Avelã"],
    flavor: { acidez: 4.5, corpo: 8.5, doçura: 8, aroma: 7.5, intensidade: 8 },
    price_cents: 4390,
    compare_at_cents: 4990,
    stock: 410,
    image: "/images/produtos/espresso-vale.jpg",
    accent: "#12281B",
    badge: "Melhor custo",
    featured: 1,
    rating: 4.8,
    reviews_count: 289,
  },
  {
    id: "prd_luanova",
    slug: "lua-nova-fermentado",
    name: "Lua Nova Fermentado",
    subtitle: "Fermentação anaeróbica · Torra clara",
    description:
      "Nossa edição experimental: 96 horas de fermentação anaeróbica controlada. Aromático, complexo, quase vinho. Produzido em 180 kg por safra.",
    story:
      "O lote fermenta em tanques inox lacrados, monitorado por pH e temperatura a cada 6 horas, durante as noites frias de lua nova — daí o nome.",
    origin: "Alta Mogiana, SP",
    producer: "Juliana Prado",
    farm: "Sítio Lua Nova",
    altitude: "1.240 m",
    process: "Fermentação anaeróbica 96h",
    variety: "Geisha & Bourbon",
    score: 90,
    roast: "clara",
    profiles: ["frutado", "floral"],
    methods: ["graos", "filtro"],
    notes: ["Maracujá", "Rosas", "Vinho do Porto"],
    flavor: { acidez: 9, corpo: 6, doçura: 9.5, aroma: 10, intensidade: 7 },
    price_cents: 9890,
    compare_at_cents: null,
    stock: 24,
    image: "/images/produtos/lua-nova.jpg",
    accent: "#7A3A55",
    badge: "Edição limitada",
    featured: 0,
    rating: 5,
    reviews_count: 43,
  },
  {
    id: "prd_raizes",
    slug: "raizes-descafeinado",
    name: "Raízes Descafeinado",
    subtitle: "Processo água suíça · Torra média",
    description:
      "Descafeinado sem solventes químicos, mantendo doçura e corpo. Para a xícara da noite que não tira o sono de ninguém.",
    story:
      "Usamos o método Swiss Water, que remove 99,9% da cafeína apenas com água, temperatura e filtros de carvão.",
    origin: "Sul de Minas, MG",
    producer: "Associação Raízes",
    farm: "Múltiplos sítios familiares",
    altitude: "1.050 m",
    process: "Swiss Water Decaf",
    variety: "Acaiá",
    score: 83,
    roast: "media",
    profiles: ["caramelo", "nozes", "achocolatado"],
    methods: ["graos", "filtro", "prensa", "espresso"],
    notes: ["Baunilha", "Nozes", "Doce de leite"],
    flavor: { acidez: 4.5, corpo: 7, doçura: 8, aroma: 6.5, intensidade: 5.5 },
    price_cents: 5290,
    compare_at_cents: null,
    stock: 96,
    image: "/images/produtos/raizes-descafeinado.jpg",
    accent: "#A8794F",
    badge: null,
    featured: 0,
    rating: 4.6,
    reviews_count: 74,
  },
];

const posts = [
  {
    id: "pst_v60",
    slug: "guia-completo-v60-em-casa",
    title: "Guia completo: como fazer um V60 impecável em casa",
    excerpt:
      "Proporção, moagem, temperatura e o famoso bloom. O passo a passo que usamos no laboratório para extrair doçura sem amargor.",
    category: "Métodos de Extração",
    cover: "/images/blog/metodos-extracao.jpg",
    author: "Marina Alencar, Q-Grader",
    read_minutes: 7,
    published_at: "2026-08-12 09:00:00",
    content: `O V60 é o método que mais revela o caráter de um café de origem — e também o que mais perdoa pouco. A boa notícia: com quatro variáveis controladas, você chega a uma xícara consistente todos os dias.

## A receita base da Aura Terra

Usamos a proporção **1:16** — 15 g de café para 240 ml de água. Se você quer uma xícara maior, mantenha a razão: 22 g para 350 ml.

- **Moagem:** média-fina, textura de açúcar cristal.
- **Água:** 92 °C a 94 °C para torras claras; 88 °C a 90 °C para torras médias.
- **Tempo total:** entre 2min30 e 3min00.

## Passo a passo

1. Escalde o filtro de papel com água quente e descarte a água. Isso elimina o gosto de papel e pré-aquece o conjunto.
2. Adicione o café moído e nivele a cama com um toque leve.
3. **Bloom:** despeje o dobro do peso do café em água (30 ml para 15 g) e espere 35 segundos. Você verá o café "respirar" liberando CO₂.
4. Despeje em espirais lentas, do centro para fora, em três etapas até completar 240 ml.
5. Deixe drenar. A cama deve ficar plana — se ficar com paredes altas, sua moagem está grossa demais.

## Diagnóstico rápido

| Sintoma | Causa provável | Correção |
| --- | --- | --- |
| Amargo e seco | Sobre-extração | Moagem mais grossa ou água mais fria |
| Azedo e aguado | Sub-extração | Moagem mais fina ou despejo mais lento |

> Café não é receita fixa, é conversa. Anote cada mudança e prove — em duas semanas você terá seu próprio protocolo.

## O café certo para o método

Torras claras e naturais, como a **Chapada Diamantina**, brilham no V60. Se você prefere algo mais doce e redondo, tente a **Serra da Mantiqueira** moída para filtro.`,
  },
  {
    id: "pst_prensa",
    slug: "prensa-francesa-corpo-e-doçura",
    title: "Prensa francesa: o método mais subestimado do Brasil",
    excerpt:
      "Sem filtro de papel, os óleos ficam na xícara. Entenda por que a prensa entrega corpo e como evitar o pó no fundo.",
    category: "Métodos de Extração",
    cover: "/images/blog/metodos-extracao.jpg",
    author: "Rafael Bittencourt",
    read_minutes: 5,
    published_at: "2026-07-28 09:00:00",
    content: `A prensa francesa é imersão pura: o café fica em contato total com a água por 4 minutos. O resultado é uma bebida densa, oleosa e aromática.

## Receita

- 30 g de café moído grosso (textura de sal grosso)
- 500 ml de água a 93 °C
- 4 minutos de infusão

## O truque da quebra de crosta

Aos 4 minutos, uma crosta de borra se forma na superfície. Quebre com uma colher, retire a espuma e os grãos flutuantes, e **espere mais 5 minutos antes de pressionar**. A borra decanta sozinha e sua xícara sai limpa.

## Qual café usar

Torras médias e escuras com corpo, como a **Mata Atlântica Reserva**. Peça a moagem "Prensa Francesa" na loja e nós moemos no ponto certo na hora do envio.`,
  },
  {
    id: "pst_produtores",
    slug: "historias-de-quem-planta-familia-rodrigues",
    title: "Histórias de quem planta: a Família Rodrigues na Mantiqueira",
    excerpt:
      "Três gerações, 62 hectares de mata preservada e uma decisão radical em 2015: abandonar o agrotóxico.",
    category: "Produtores",
    cover: "/images/blog/produtores.jpg",
    author: "Equipe Aura Terra",
    read_minutes: 6,
    published_at: "2026-07-10 09:00:00",
    content: `Quando conhecemos Seu Antônio Rodrigues, ele tinha acabado de perder um contrato com um grande comprador. O motivo: se recusou a voltar a usar herbicida na lavoura.

## A conversão

Em 2015, a família iniciou a transição agroecológica. Os três primeiros anos foram duros — a produtividade caiu 30%. Hoje, com solo vivo e sombreamento por ingás, a produção voltou e a qualidade subiu: o lote de 2026 pontuou **85 na escala SCA**.

## O que a compra direta muda

Pagamos, em média, **38% acima da cotação da saca** e fechamos contrato antes da colheita. Isso significa que a família sabe quanto vai receber enquanto o café ainda está no pé.

> "Antes eu plantava para o mercado. Hoje eu planto para quem bebe." — Antônio Rodrigues

## Preservação

Os 62 hectares de reserva da Fazenda Águas Claras abrigam três nascentes que abastecem o córrego que corta a comunidade. Nada disso aparece na xícara — e ao mesmo tempo, é tudo o que aparece.`,
  },
  {
    id: "pst_borra",
    slug: "borra-de-cafe-cinco-usos-sustentaveis",
    title: "Borra de café: 5 destinos melhores que a lixeira",
    excerpt:
      "Composto, repelente natural, esfoliante e até tinta. Feche o ciclo do seu café com ideias simples.",
    category: "Sustentabilidade",
    cover: "/images/blog/produtores.jpg",
    author: "Camila Duarte",
    read_minutes: 4,
    published_at: "2026-06-22 09:00:00",
    content: `Cada quilo de café gera cerca de 2 kg de borra úmida. No aterro, ela vira metano. No seu quintal, vira nutriente.

## 1. Composteira

A borra é rica em nitrogênio. Misture com material seco (folhas, papelão picado) na proporção de 1:3.

## 2. Adubo direto

Seque a borra e espalhe fina em volta de plantas acidófilas: azaleias, hortênsias, samambaias.

## 3. Repelente de formigas

Uma linha de borra seca no batente funciona como barreira olfativa.

## 4. Esfoliante corporal

Borra + óleo de coco em partes iguais. Use uma vez por semana.

## 5. Tingimento natural

Deixe a borra de molho por 24h e use a água para envelhecer tecidos de algodão e papel.

## Nosso ciclo

No laboratório de torra, 100% da nossa palha e borra vão para compostagem, e o composto volta para as fazendas parceiras. Em 2025 foram **7,4 toneladas** desviadas do aterro.`,
  },
  {
    id: "pst_moagem",
    slug: "moagem-certa-para-cada-metodo",
    title: "A moagem certa para cada método (com referências visuais)",
    excerpt:
      "Grossa, média, fina: um guia prático para acertar a granulometria sem moedor caro.",
    category: "Guias",
    cover: "/images/blog/metodos-extracao.jpg",
    author: "Marina Alencar, Q-Grader",
    read_minutes: 5,
    published_at: "2026-06-02 09:00:00",
    content: `A moagem determina a velocidade da extração. Quanto mais fina, maior a superfície de contato e mais rápido o café cede seus compostos.

## Referências rápidas

- **Grossa** (sal grosso): prensa francesa, cold brew.
- **Média** (areia de praia): coador de pano, Chemex, cafeteira elétrica.
- **Média-fina** (açúcar cristal): V60, Kalita, Melitta.
- **Fina** (açúcar refinado): espresso, moka.

## Moa na hora — mas se não der...

O ideal é moer na hora: café moído perde 60% dos aromas voláteis nas primeiras 15 minutos. Se você não tem moedor, escolha a moagem na página do produto e nós moemos no dia da torra, embalando com válvula desgaseificadora.

## Frescor

Consuma em até **30 dias** após a torra. A data está impressa no verso de cada pacote — nunca a data de validade genérica.`,
  },
];

const faqs = [
  ["Entregas & Prazos", "Qual o prazo de entrega?", "Torramos sob demanda às segundas e quintas. Pedidos aprovados até 12h entram na torra seguinte e são despachados em até 48h. Depois disso: Sudeste 1 a 3 dias úteis, Sul e Centro-Oeste 2 a 5, Nordeste e Norte 4 a 9 dias úteis."],
  ["Entregas & Prazos", "Qual o valor do frete?", "Frete grátis para todo o Brasil em compras acima de R$ 149 e para todos os assinantes dos planos Explorador e Colecionador. Abaixo disso, o valor é calculado no checkout pelo CEP."],
  ["Entregas & Prazos", "Como acompanho meu pedido?", "Assim que o pacote é postado, você recebe o código de rastreio por e-mail e WhatsApp. Também é possível acompanhar tudo em tempo real na Área do Cliente, em Meus Pedidos."],
  ["Entregas & Prazos", "Vocês entregam no mesmo dia em São Paulo?", "Sim. Para a capital paulista oferecemos entrega expressa em até 4 horas para pedidos feitos de segunda a sexta até as 14h, com taxa adicional exibida no checkout."],
  ["Como Funciona a Assinatura", "Como funciona o Clube Aura?", "Você escolhe o plano, a moagem e a frequência. A cada ciclo, nosso mestre de torra seleciona microlotes frescos, torra na semana do envio e despacha direto para você, com ficha de degustação e sugestão de receita."],
  ["Como Funciona a Assinatura", "Posso pausar ou cancelar quando quiser?", "Sim, sem multa e sem ligação. No painel da Área do Cliente você pausa, adia, troca a frequência ou cancela com um clique. Alterações feitas até 3 dias antes da data de renovação valem para o ciclo seguinte."],
  ["Como Funciona a Assinatura", "Posso escolher qual café vem?", "Nos planos Descobridor e Explorador a curadoria é nossa (é a graça do clube), mas você pode fixar um café favorito ou bloquear perfis que não gosta. No plano Colecionador você escolhe livremente todos os lotes."],
  ["Como Funciona a Assinatura", "Como altero o endereço de entrega?", "Em Área do Cliente › Minha Assinatura › Endereço. A mudança passa a valer no próximo ciclo, desde que feita antes da data de renovação."],
  ["Tipos de Moagem", "Qual moagem devo escolher?", "Grãos inteiros se você tem moedor (recomendamos!). Moído para Prensa é uma moagem grossa; Filtro/V60 é média-fina; Espresso é fina. Na dúvida, escolha Filtro — é a mais versátil."],
  ["Tipos de Moagem", "O café moído dura menos?", "Sim. Grãos inteiros mantêm o auge por até 30 dias após a torra; moído, o ideal é consumir em 10 a 15 dias. Todos os pacotes têm válvula desgaseificadora e fecho hermético."],
  ["Tipos de Moagem", "Posso pedir moagens diferentes no mesmo pedido?", "Pode. A moagem é definida item a item no carrinho, então dá para pedir 250 g em grãos e 500 g moído para espresso no mesmo envio."],
  ["Tipos de Moagem", "A moagem para moka italiana existe?", "Use a opção Espresso: a granulometria fina funciona muito bem na moka. Se preferir algo um pouco mais grosso, escreva nas observações do pedido e ajustamos."],
  ["Trocas/Devoluções", "E se eu não gostar do café?", "Temos a Garantia Xícara Cheia: se o café não te agradar, avise em até 15 dias e enviamos outro perfil sem custo ou devolvemos 100% do valor — sem precisar devolver o pacote."],
  ["Trocas/Devoluções", "Como faço uma troca?", "Escreva para contato@auraterra.com.br ou use o WhatsApp com o número do pedido. Respondemos em até 1 dia útil e a logística reversa é por nossa conta."],
  ["Trocas/Devoluções", "Qual o prazo de arrependimento?", "Conforme o Código de Defesa do Consumidor, você tem 7 dias corridos após o recebimento para desistir da compra, com reembolso integral incluindo frete."],
  ["Trocas/Devoluções", "Meu pacote chegou danificado. E agora?", "Envie uma foto do pacote pelo WhatsApp em até 48h do recebimento. Reenviamos imediatamente, sem burocracia."],
];

const testimonials = [
  ["Beatriz Moraes", "Assinante Explorador há 2 anos", "Eu era do tipo que comprava café no mercado sem olhar. Hoje meu ritual de manhã mudou completamente. A ficha de degustação que vem junto ensina de verdade.", 5],
  ["Rodrigo Sampaio", "Barista, Café Corvo (SP)", "Uso o blend Vale do Café na casa há oito meses. Espresso estável, crema bonita e um pós-gosto de chocolate que agrada do cliente iniciante ao exigente.", 5],
  ["Luana Ferrari", "Q-Grader e consultora", "A rastreabilidade da Aura Terra é exemplar: eu sei o nome do produtor, a altitude e o processo. Isso ainda é raro no mercado brasileiro.", 5],
  ["Marcos Tavares", "Cliente desde 2023", "Pedi na quarta, chegou na sexta em Recife, torrado havia três dias. O Chapada Diamantina é o café mais floral que já tomei.", 5],
  ["Ana Clara Nunes", "Assinante Descobridor", "Pausei minha assinatura por dois meses durante uma viagem e voltei sem nenhum atrito. O painel é simples de usar de verdade.", 4],
];

export const seedDatabase: Seeder = (db) => {
  const count = db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
  if (count.c > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products (id, slug, name, subtitle, description, story, origin, producer, farm, altitude, process,
      variety, score, roast, profiles, methods, notes, flavor, price_cents, compare_at_cents, stock, image, accent,
      badge, featured, rating, reviews_count)
    VALUES (@id, @slug, @name, @subtitle, @description, @story, @origin, @producer, @farm, @altitude, @process,
      @variety, @score, @roast, @profiles, @methods, @notes, @flavor, @price_cents, @compare_at_cents, @stock, @image,
      @accent, @badge, @featured, @rating, @reviews_count)
  `);

  const insertPost = db.prepare(`
    INSERT INTO posts (id, slug, title, excerpt, content, category, cover, author, read_minutes, published, published_at)
    VALUES (@id, @slug, @title, @excerpt, @content, @category, @cover, @author, @read_minutes, 1, @published_at)
  `);

  const insertFaq = db.prepare(
    "INSERT INTO faqs (id, category, question, answer, position) VALUES (?, ?, ?, ?, ?)",
  );
  const insertTestimonial = db.prepare(
    "INSERT INTO testimonials (id, name, role, quote, rating, position) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const p of products) {
      insertProduct.run({
        ...p,
        profiles: JSON.stringify(p.profiles),
        methods: JSON.stringify(p.methods),
        notes: JSON.stringify(p.notes),
        flavor: JSON.stringify(p.flavor),
      });
    }
    for (const p of posts) insertPost.run(p);
    faqs.forEach((f, i) => insertFaq.run(`faq_${i}`, f[0], f[1], f[2], i));
    testimonials.forEach((t, i) =>
      insertTestimonial.run(`tst_${i}`, t[0] as string, t[1] as string, t[2] as string, t[3] as number, i),
    );

    insertUser.run("usr_admin", "Helena Braga", "admin@auraterra.com.br", hashPassword("aura2026"), "admin", "+55 31 99999-0001");
    insertUser.run("usr_ana", "Ana Clara Nunes", "cliente@auraterra.com.br", hashPassword("cafe1234"), "cliente", "+55 11 98888-2233");

    const address = JSON.stringify({
      street: "Rua das Acácias",
      number: "184",
      complement: "Apto 72",
      district: "Vila Madalena",
      city: "São Paulo",
      state: "SP",
      zip: "05435-020",
    });

    db.prepare(`
      INSERT INTO orders (id, code, user_id, customer_name, email, kind, status, items, subtotal_cents,
        shipping_cents, total_cents, address, tracking_code, carrier, created_at)
      VALUES (@id, @code, @user_id, @customer_name, @email, @kind, @status, @items, @subtotal, @shipping, @total,
        @address, @tracking, @carrier, @created_at)
    `).run(
      {
        id: "ord_1001",
        code: "AT-2026-1001",
        user_id: "usr_ana",
        customer_name: "Ana Clara Nunes",
        email: "cliente@auraterra.com.br",
        kind: "avulsa",
        status: "entregue",
        items: JSON.stringify([
          { productId: "prd_aurora", name: "Aurora do Cerrado", slug: "aurora-do-cerrado", weight: "500g", grind: "filtro", quantity: 1, unitPriceCents: 10200 },
          { productId: "prd_mantiqueira", name: "Serra da Mantiqueira", slug: "serra-da-mantiqueira", weight: "250g", grind: "graos", quantity: 2, unitPriceCents: 4900 },
        ]),
        subtotal: 20000,
        shipping: 0,
        total: 20000,
        address,
        tracking: "AT884512203BR",
        carrier: "Correios SEDEX",
        created_at: "2026-07-18 10:24:00",
      },
    );

    db.prepare(`
      INSERT INTO orders (id, code, user_id, customer_name, email, kind, status, items, subtotal_cents,
        shipping_cents, total_cents, address, tracking_code, carrier, created_at)
      VALUES (@id, @code, @user_id, @customer_name, @email, @kind, @status, @items, @subtotal, @shipping, @total,
        @address, @tracking, @carrier, @created_at)
    `).run({
      id: "ord_1002",
      code: "AT-2026-1042",
      user_id: "usr_ana",
      customer_name: "Ana Clara Nunes",
      email: "cliente@auraterra.com.br",
      kind: "assinatura",
      status: "enviado",
      items: JSON.stringify([
        { productId: "prd_chapada", name: "Chapada Diamantina", slug: "chapada-diamantina-natural", weight: "250g", grind: "filtro", quantity: 1, unitPriceCents: 6900 },
      ]),
      subtotal: 6900,
      shipping: 0,
      total: 6900,
      address,
      tracking: "AT991230877BR",
      carrier: "Loggi",
      created_at: "2026-08-20 08:10:00",
    });

    db.prepare(`
      INSERT INTO subscriptions (id, user_id, plan, product_id, grind, weight, frequency, status, price_cents,
        next_delivery, address, created_at)
      VALUES (@id, @user_id, @plan, @product_id, @grind, @weight, @frequency, @status, @price, @next, @address, @created_at)
    `).run({
      id: "sub_2001",
      user_id: "usr_ana",
      plan: "descobridor",
      product_id: null,
      grind: "filtro",
      weight: "250g",
      frequency: "mensal",
      status: "ativa",
      price: 6900,
      next: "2026-09-20",
      address,
      created_at: "2025-11-20 08:00:00",
    });
  });

  tx();
};
