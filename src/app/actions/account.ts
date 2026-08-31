"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getSubscription } from "@/lib/queries";

async function ownedSubscription(id: string) {
  const user = await requireUser();
  const sub = getSubscription(id);
  if (!sub || sub.userId !== user.id) throw new Error("NOT_FOUND");
  return sub;
}

export async function setSubscriptionStatus(id: string, status: "ativa" | "pausada" | "cancelada") {
  await ownedSubscription(id);
  getDb().prepare("UPDATE subscriptions SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/conta/assinatura");
  revalidatePath("/admin/assinantes");
}

export async function updateSubscriptionPreferences(
  id: string,
  data: { frequency?: string; grind?: string; weight?: string; nextDelivery?: string },
) {
  const sub = await ownedSubscription(id);
  getDb()
    .prepare("UPDATE subscriptions SET frequency = ?, grind = ?, weight = ?, next_delivery = ? WHERE id = ?")
    .run(
      data.frequency ?? sub.frequency,
      data.grind ?? sub.grind,
      data.weight ?? sub.weight,
      data.nextDelivery ?? sub.nextDelivery,
      id,
    );
  revalidatePath("/conta/assinatura");
  revalidatePath("/admin/assinantes");
}

export async function updateSubscriptionAddress(id: string, formData: FormData) {
  await ownedSubscription(id);
  const address = {
    street: String(formData.get("street") ?? ""),
    number: String(formData.get("number") ?? ""),
    complement: String(formData.get("complement") ?? ""),
    district: String(formData.get("district") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    zip: String(formData.get("zip") ?? ""),
  };
  getDb().prepare("UPDATE subscriptions SET address = ? WHERE id = ?").run(JSON.stringify(address), id);
  revalidatePath("/conta/assinatura");
  return { ok: true };
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (name.length < 2) return { error: "Informe seu nome." };
  getDb().prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?").run(name, phone, user.id);
  revalidatePath("/conta");
  revalidatePath("/conta/dados");
  return { ok: true };
}
