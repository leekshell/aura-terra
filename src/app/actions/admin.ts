"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function num(fd: FormData, key: string, fallback = 0) {
  const v = Number(String(fd.get(key) ?? "").replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

function list(fd: FormData, key: string): string[] {
  return fd
    .getAll(key)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

/* -------------------------------- produtos -------------------------------- */

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);

  const data = {
    slug,
    name,
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    story: String(formData.get("story") ?? ""),
    origin: String(formData.get("origin") ?? ""),
    producer: String(formData.get("producer") ?? ""),
    farm: String(formData.get("farm") ?? ""),
    altitude: String(formData.get("altitude") ?? ""),
    process: String(formData.get("process") ?? ""),
    variety: String(formData.get("variety") ?? ""),
    score: num(formData, "score", 84),
    roast: String(formData.get("roast") ?? "media"),
    profiles: JSON.stringify(list(formData, "profiles")),
    methods: JSON.stringify(list(formData, "methods")),
    notes: JSON.stringify(
      String(formData.get("notes") ?? "")
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
    ),
    flavor: JSON.stringify({
      acidez: num(formData, "acidez", 5),
      corpo: num(formData, "corpo", 5),
      "doçura": num(formData, "docura", 5),
      aroma: num(formData, "aroma", 5),
      intensidade: num(formData, "intensidade", 5),
    }),
    price_cents: Math.round(num(formData, "price", 49) * 100),
    compare_at_cents: formData.get("compareAt") ? Math.round(num(formData, "compareAt") * 100) : null,
    stock: Math.round(num(formData, "stock", 0)),
    image: String(formData.get("image") ?? "/images/produtos/serra-mantiqueira.jpg"),
    accent: String(formData.get("accent") ?? "#1A3626"),
    badge: String(formData.get("badge") ?? "") || null,
    featured: formData.get("featured") ? 1 : 0,
    active: formData.get("active") ? 1 : 0,
  };

  if (id) {
    db.prepare(
      `UPDATE products SET slug=@slug, name=@name, subtitle=@subtitle, description=@description, story=@story,
        origin=@origin, producer=@producer, farm=@farm, altitude=@altitude, process=@process, variety=@variety,
        score=@score, roast=@roast, profiles=@profiles, methods=@methods, notes=@notes, flavor=@flavor,
        price_cents=@price_cents, compare_at_cents=@compare_at_cents, stock=@stock, image=@image, accent=@accent,
        badge=@badge, featured=@featured, active=@active WHERE id=@id`,
    ).run({ ...data, id });
  } else {
    db.prepare(
      `INSERT INTO products (id, slug, name, subtitle, description, story, origin, producer, farm, altitude,
        process, variety, score, roast, profiles, methods, notes, flavor, price_cents, compare_at_cents, stock,
        image, accent, badge, featured, active)
       VALUES (@id, @slug, @name, @subtitle, @description, @story, @origin, @producer, @farm, @altitude, @process,
        @variety, @score, @roast, @profiles, @methods, @notes, @flavor, @price_cents, @compare_at_cents, @stock,
        @image, @accent, @badge, @featured, @active)`,
    ).run({ ...data, id: newId("prd") });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  revalidatePath(`/loja/${slug}`);
  redirect("/admin/produtos?ok=1");
}

export async function updateStock(id: string, stock: number) {
  await requireAdmin();
  getDb().prepare("UPDATE products SET stock = ? WHERE id = ?").run(Math.max(0, stock), id);
  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  getDb().prepare("UPDATE products SET active = ? WHERE id = ?").run(active ? 1 : 0, id);
  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
}

/* --------------------------------- pedidos -------------------------------- */

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  getDb()
    .prepare("UPDATE orders SET status = ?, tracking_code = ?, carrier = ? WHERE id = ?")
    .run(
      String(formData.get("status") ?? "processando"),
      String(formData.get("tracking") ?? "") || null,
      String(formData.get("carrier") ?? "") || null,
      id,
    );
  revalidatePath("/admin/pedidos");
  revalidatePath("/conta/pedidos");
}

/* ------------------------------ assinaturas ------------------------------- */

export async function adminSetSubscriptionStatus(id: string, status: string) {
  await requireAdmin();
  getDb().prepare("UPDATE subscriptions SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin/assinantes");
}

/* ----------------------------------- blog --------------------------------- */

export async function savePost(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);

  const data = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "Guias"),
    cover: String(formData.get("cover") ?? "/images/blog/metodos-extracao.jpg"),
    author: String(formData.get("author") ?? "Equipe Aura Terra"),
    read_minutes: Math.max(1, Math.round(num(formData, "readMinutes", 5))),
    published: formData.get("published") ? 1 : 0,
    published_at: String(formData.get("publishedAt") ?? new Date().toISOString().slice(0, 10)) + " 09:00:00",
  };

  if (id) {
    db.prepare(
      `UPDATE posts SET slug=@slug, title=@title, excerpt=@excerpt, content=@content, category=@category,
        cover=@cover, author=@author, read_minutes=@read_minutes, published=@published, published_at=@published_at
       WHERE id=@id`,
    ).run({ ...data, id });
  } else {
    db.prepare(
      `INSERT INTO posts (id, slug, title, excerpt, content, category, cover, author, read_minutes, published, published_at)
       VALUES (@id, @slug, @title, @excerpt, @content, @category, @cover, @author, @read_minutes, @published, @published_at)`,
    ).run({ ...data, id: newId("pst") });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog?ok=1");
}

export async function deletePost(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostPublished(id: string, published: boolean) {
  await requireAdmin();
  getDb().prepare("UPDATE posts SET published = ? WHERE id = ?").run(published ? 1 : 0, id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

/* -------------------------------- mensagens ------------------------------- */

export async function toggleMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  getDb().prepare("UPDATE messages SET handled = ? WHERE id = ?").run(handled ? 1 : 0, id);
  revalidatePath("/admin/mensagens");
}
