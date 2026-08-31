"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, registerUser, createSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import type { Address, OrderItem } from "@/lib/types";

export type CheckoutPayload = {
  customer: { name: string; email: string; password?: string; phone?: string };
  address: Address;
  items: (OrderItem & { kind: "avulsa" | "assinatura"; frequency?: string })[];
  shippingCents: number;
  createAccount?: boolean;
};

export async function placeOrder(payload: CheckoutPayload) {
  const db = getDb();
  let user = await getCurrentUser();

  if (!user && payload.createAccount && payload.customer.password) {
    const created = registerUser({
      name: payload.customer.name,
      email: payload.customer.email,
      password: payload.customer.password,
    });
    if (!("error" in created)) {
      await createSession(created.id);
      user = await getCurrentUser();
    }
  }

  const items = payload.items;
  if (items.length === 0) return { error: "Sua sacola está vazia." };

  const subtotal = items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
  const shipping = payload.shippingCents;
  const total = subtotal + shipping;

  const seq = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c + 1001;
  const code = `AT-${new Date().getFullYear()}-${seq}`;
  const orderId = newId("ord");
  const hasSubscription = items.some((i) => i.kind === "assinatura");

  db.prepare(
    `INSERT INTO orders (id, code, user_id, customer_name, email, kind, status, items, subtotal_cents,
      shipping_cents, total_cents, address, tracking_code, carrier)
     VALUES (?, ?, ?, ?, ?, ?, 'processando', ?, ?, ?, ?, ?, NULL, NULL)`,
  ).run(
    orderId,
    code,
    user?.id ?? null,
    payload.customer.name,
    payload.customer.email.toLowerCase(),
    hasSubscription ? "assinatura" : "avulsa",
    JSON.stringify(
      items.map((i) => ({
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        weight: i.weight,
        grind: i.grind,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
    ),
    subtotal,
    shipping,
    total,
    JSON.stringify(payload.address),
  );

  // baixa de estoque
  const dec = db.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?");
  for (const i of items) if (!i.productId.startsWith("plan_")) dec.run(i.quantity, i.productId);

  // cria assinaturas para itens recorrentes (quando há conta)
  if (user) {
    const next = new Date();
    next.setDate(next.getDate() + 30);
    for (const i of items.filter((x) => x.kind === "assinatura")) {
      const plan = i.productId.startsWith("plan_") ? i.productId.replace("plan_", "") : "descobridor";
      db.prepare(
        `INSERT INTO subscriptions (id, user_id, plan, product_id, grind, weight, frequency, status, price_cents,
          next_delivery, address) VALUES (?, ?, ?, ?, ?, ?, ?, 'ativa', ?, ?, ?)`,
      ).run(
        newId("sub"),
        user.id,
        plan,
        i.productId.startsWith("plan_") ? null : i.productId,
        i.grind,
        i.weight,
        i.frequency ?? "mensal",
        i.unitPriceCents,
        next.toISOString().slice(0, 10),
        JSON.stringify(payload.address),
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/conta");
  return { code, orderId, loggedIn: !!user };
}
