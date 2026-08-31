import { getDb } from "./db";
import type {
  Faq,
  Order,
  Post,
  Product,
  Subscription,
  Testimonial,
  Testimonial as TestimonialType,
  User,
} from "./types";

/* ---------------------------------- map ---------------------------------- */

type Row = Record<string, unknown>;

export function mapProduct(r: Row): Product {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    subtitle: r.subtitle as string,
    description: r.description as string,
    story: r.story as string,
    origin: r.origin as string,
    producer: r.producer as string,
    farm: r.farm as string,
    altitude: r.altitude as string,
    process: r.process as string,
    variety: r.variety as string,
    score: r.score as number,
    roast: r.roast as Product["roast"],
    profiles: JSON.parse((r.profiles as string) || "[]"),
    methods: JSON.parse((r.methods as string) || "[]"),
    notes: JSON.parse((r.notes as string) || "[]"),
    flavor: JSON.parse((r.flavor as string) || "{}"),
    priceCents: r.price_cents as number,
    compareAtCents: (r.compare_at_cents as number) ?? null,
    stock: r.stock as number,
    image: r.image as string,
    accent: r.accent as string,
    badge: (r.badge as string) ?? null,
    featured: !!r.featured,
    subscriptionOnly: !!r.subscription_only,
    rating: r.rating as number,
    reviewsCount: r.reviews_count as number,
    active: !!r.active,
    createdAt: r.created_at as string,
  };
}

function mapPost(r: Row): Post {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    excerpt: r.excerpt as string,
    content: r.content as string,
    category: r.category as string,
    cover: r.cover as string,
    author: r.author as string,
    readMinutes: r.read_minutes as number,
    published: !!r.published,
    publishedAt: r.published_at as string,
  };
}

function mapOrder(r: Row): Order {
  return {
    id: r.id as string,
    code: r.code as string,
    userId: (r.user_id as string) ?? null,
    customerName: r.customer_name as string,
    email: r.email as string,
    kind: r.kind as Order["kind"],
    status: r.status as Order["status"],
    items: JSON.parse((r.items as string) || "[]"),
    subtotalCents: r.subtotal_cents as number,
    shippingCents: r.shipping_cents as number,
    totalCents: r.total_cents as number,
    address: JSON.parse((r.address as string) || "{}"),
    trackingCode: (r.tracking_code as string) ?? null,
    carrier: (r.carrier as string) ?? null,
    createdAt: r.created_at as string,
  };
}

function mapSubscription(r: Row): Subscription {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    plan: r.plan as Subscription["plan"],
    productId: (r.product_id as string) ?? null,
    grind: r.grind as Subscription["grind"],
    weight: r.weight as Subscription["weight"],
    frequency: r.frequency as Subscription["frequency"],
    status: r.status as Subscription["status"],
    priceCents: r.price_cents as number,
    nextDelivery: r.next_delivery as string,
    address: JSON.parse((r.address as string) || "{}"),
    createdAt: r.created_at as string,
  };
}

function mapUser(r: Row): User {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    role: r.role as User["role"],
    provider: r.provider as string,
    phone: (r.phone as string) ?? null,
    createdAt: r.created_at as string,
  };
}

/* -------------------------------- products -------------------------------- */

export function listProducts(opts: { includeInactive?: boolean } = {}): Product[] {
  const db = getDb();
  const sql = opts.includeInactive
    ? "SELECT * FROM products ORDER BY featured DESC, created_at DESC"
    : "SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, created_at DESC";
  return (db.prepare(sql).all() as Row[]).map(mapProduct);
}

export function listFeaturedProducts(): Product[] {
  return listProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | null {
  const row = getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as Row | undefined;
  return row ? mapProduct(row) : null;
}

export function getProductById(id: string): Product | null {
  const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as Row | undefined;
  return row ? mapProduct(row) : null;
}

/* ---------------------------------- posts --------------------------------- */

export function listPosts(opts: { includeDrafts?: boolean } = {}): Post[] {
  const sql = opts.includeDrafts
    ? "SELECT * FROM posts ORDER BY published_at DESC"
    : "SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC";
  return (getDb().prepare(sql).all() as Row[]).map(mapPost);
}

export function getPostBySlug(slug: string): Post | null {
  const row = getDb().prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as Row | undefined;
  return row ? mapPost(row) : null;
}

/* ----------------------------------- faq ---------------------------------- */

export function listFaqs(): Faq[] {
  return (getDb().prepare("SELECT * FROM faqs ORDER BY position ASC").all() as Row[]).map((r) => ({
    id: r.id as string,
    category: r.category as string,
    question: r.question as string,
    answer: r.answer as string,
    position: r.position as number,
  }));
}

/* ------------------------------ testimonials ------------------------------ */

export function listTestimonials(): TestimonialType[] {
  return (getDb().prepare("SELECT * FROM testimonials ORDER BY position ASC").all() as Row[]).map(
    (r): Testimonial => ({
      id: r.id as string,
      name: r.name as string,
      role: r.role as string,
      quote: r.quote as string,
      rating: r.rating as number,
      position: r.position as number,
    }),
  );
}

/* --------------------------------- orders --------------------------------- */

export function listOrdersByUser(userId: string): Order[] {
  return (
    getDb().prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(userId) as Row[]
  ).map(mapOrder);
}

export function listAllOrders(): Order[] {
  return (getDb().prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as Row[]).map(mapOrder);
}

export function getOrderByCode(code: string): Order | null {
  const row = getDb().prepare("SELECT * FROM orders WHERE code = ?").get(code) as Row | undefined;
  return row ? mapOrder(row) : null;
}

/* ------------------------------ subscriptions ----------------------------- */

export function listSubscriptionsByUser(userId: string): Subscription[] {
  return (
    getDb().prepare("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC").all(userId) as Row[]
  ).map(mapSubscription);
}

export function listAllSubscriptions(): Subscription[] {
  return (getDb().prepare("SELECT * FROM subscriptions ORDER BY created_at DESC").all() as Row[]).map(
    mapSubscription,
  );
}

export function getSubscription(id: string): Subscription | null {
  const row = getDb().prepare("SELECT * FROM subscriptions WHERE id = ?").get(id) as Row | undefined;
  return row ? mapSubscription(row) : null;
}

/* ---------------------------------- users --------------------------------- */

export function listUsers(): User[] {
  return (getDb().prepare("SELECT * FROM users ORDER BY created_at DESC").all() as Row[]).map(mapUser);
}

/* -------------------------------- dashboard ------------------------------- */

export function adminMetrics() {
  const db = getDb();
  const revenue = db
    .prepare("SELECT COALESCE(SUM(total_cents),0) as t FROM orders WHERE status != 'cancelado'")
    .get() as { t: number };
  const orders = db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number };
  const subs = db.prepare("SELECT COUNT(*) as c FROM subscriptions WHERE status = 'ativa'").get() as { c: number };
  const customers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'cliente'").get() as { c: number };
  const lowStock = db.prepare("SELECT COUNT(*) as c FROM products WHERE stock < 80 AND active = 1").get() as {
    c: number;
  };
  const messages = db.prepare("SELECT COUNT(*) as c FROM messages WHERE handled = 0").get() as { c: number };
  const posts = db.prepare("SELECT COUNT(*) as c FROM posts WHERE published = 1").get() as { c: number };
  const mrr = db
    .prepare("SELECT COALESCE(SUM(price_cents),0) as t FROM subscriptions WHERE status = 'ativa'")
    .get() as { t: number };

  return {
    revenueCents: revenue.t,
    orders: orders.c,
    activeSubscriptions: subs.c,
    customers: customers.c,
    lowStock: lowStock.c,
    unreadMessages: messages.c,
    publishedPosts: posts.c,
    mrrCents: mrr.t,
  };
}

export function listMessages() {
  return getDb().prepare("SELECT * FROM messages ORDER BY created_at DESC").all() as {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    handled: number;
    created_at: string;
  }[];
}
