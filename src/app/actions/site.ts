"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";

export async function subscribeNewsletter(email: string) {
  const clean = email.toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { error: "E-mail inválido" };
  getDb().prepare("INSERT OR IGNORE INTO newsletter (email) VALUES (?)").run(clean);
  return { ok: true };
}

export async function sendContactMessage(_prev: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "Contato").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) return { status: "error" as const, message: "Informe seu nome completo." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { status: "error" as const, message: "Informe um e-mail válido." };
  if (message.length < 10)
    return { status: "error" as const, message: "Conte um pouco mais na mensagem (mín. 10 caracteres)." };

  getDb()
    .prepare("INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)")
    .run(newId("msg"), name, email, subject, message);

  revalidatePath("/admin/mensagens");
  return { status: "success" as const, message: "Mensagem enviada! Respondemos em até 1 dia útil." };
}
