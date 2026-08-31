export type Roast = "clara" | "media" | "escura";
export type SensoryProfile = "frutado" | "achocolatado" | "citrico" | "floral" | "caramelo" | "nozes";
export type BrewMethod = "graos" | "prensa" | "espresso" | "filtro";
export type Weight = "250g" | "500g" | "1kg";

export type FlavorChart = {
  acidez: number;
  corpo: number;
  doçura: number;
  aroma: number;
  intensidade: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  origin: string;
  producer: string;
  farm: string;
  altitude: string;
  process: string;
  variety: string;
  score: number;
  roast: Roast;
  profiles: SensoryProfile[];
  methods: BrewMethod[];
  notes: string[];
  flavor: FlavorChart;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  image: string;
  accent: string;
  badge: string | null;
  featured: boolean;
  subscriptionOnly: boolean;
  rating: number;
  reviewsCount: number;
  active: boolean;
  createdAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover: string;
  author: string;
  readMinutes: number;
  published: boolean;
  publishedAt: string;
};

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  position: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  weight: Weight;
  grind: BrewMethod;
  quantity: number;
  unitPriceCents: number;
};

export type Address = {
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type Order = {
  id: string;
  code: string;
  userId: string | null;
  customerName: string;
  email: string;
  kind: "avulsa" | "assinatura";
  status: "processando" | "torrando" | "enviado" | "entregue" | "cancelado";
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  address: Address;
  trackingCode: string | null;
  carrier: string | null;
  createdAt: string;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: "descobridor" | "explorador" | "colecionador";
  productId: string | null;
  grind: BrewMethod;
  weight: Weight;
  frequency: "quinzenal" | "mensal" | "bimestral";
  status: "ativa" | "pausada" | "cancelada";
  priceCents: number;
  nextDelivery: string;
  address: Address;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "cliente" | "admin";
  provider: string;
  phone: string | null;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  position: number;
};

export const ROASTS: { value: Roast; label: string; hint: string }[] = [
  { value: "clara", label: "Torra Clara", hint: "Acidez viva e notas florais" },
  { value: "media", label: "Torra Média", hint: "Equilíbrio entre doçura e corpo" },
  { value: "escura", label: "Torra Escura", hint: "Corpo intenso e final achocolatado" },
];

export const PROFILES: { value: SensoryProfile; label: string }[] = [
  { value: "frutado", label: "Frutado" },
  { value: "achocolatado", label: "Achocolatado" },
  { value: "citrico", label: "Cítrico" },
  { value: "floral", label: "Floral" },
  { value: "caramelo", label: "Caramelo" },
  { value: "nozes", label: "Nozes" },
];

export const METHODS: { value: BrewMethod; label: string; short: string }[] = [
  { value: "graos", label: "Grãos inteiros", short: "Grãos" },
  { value: "prensa", label: "Moído para Prensa Francesa", short: "Prensa" },
  { value: "espresso", label: "Moído para Espresso", short: "Espresso" },
  { value: "filtro", label: "Moído para Filtro / V60", short: "Filtro" },
];

export const WEIGHTS: { value: Weight; label: string; multiplier: number }[] = [
  { value: "250g", label: "250 g", multiplier: 1 },
  { value: "500g", label: "500 g", multiplier: 1.85 },
  { value: "1kg", label: "1 kg", multiplier: 3.4 },
];

export const PLANS = [
  {
    id: "descobridor" as const,
    name: "Descobridor",
    priceCents: 6900,
    bags: "1 pacote de 250 g",
    description: "Um microlote diferente por mês, escolhido pelo nosso mestre de torra.",
    perks: ["1 café surpresa por ciclo", "Ficha de degustação impressa", "Frete grátis acima de R$ 99"],
  },
  {
    id: "explorador" as const,
    name: "Explorador",
    priceCents: 11900,
    bags: "2 pacotes de 250 g",
    description: "Dois perfis contrastantes para comparar métodos e extrações.",
    perks: [
      "2 microlotes por ciclo",
      "Frete grátis sempre",
      "10% off em toda a loja",
      "Acesso ao clube de cupping online",
    ],
    highlight: true,
  },
  {
    id: "colecionador" as const,
    name: "Colecionador",
    priceCents: 21900,
    bags: "3 pacotes de 250 g + edição limitada",
    description: "Para quem quer os lotes raros, fermentações especiais e primeiro acesso às safras.",
    perks: [
      "3 microlotes + 1 edição limitada por trimestre",
      "Frete grátis expresso",
      "15% off em toda a loja",
      "Visita virtual às fazendas parceiras",
    ],
  },
];

export const IMPACT_METRICS = [
  { value: 1280, suffix: " ha", label: "Hectares de mata preservados", detail: "Áreas de reserva legal e nascentes monitoradas com nossos parceiros." },
  { value: 74, suffix: "", label: "Pequenos produtores apoiados", detail: "Famílias agroecológicas em MG, ES e BA com compra direta." },
  { value: 100, suffix: "%", label: "Emissão de carbono neutralizada", detail: "Da lavoura à entrega, compensada via reflorestamento nativo." },
  { value: 38, suffix: "%", label: "Acima do preço justo", detail: "Média paga aos produtores em relação à cotação da saca." },
];

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function priceForWeight(baseCents: number, weight: Weight) {
  const w = WEIGHTS.find((x) => x.value === weight) ?? WEIGHTS[0];
  return Math.round((baseCents * w.multiplier) / 100) * 100;
}
