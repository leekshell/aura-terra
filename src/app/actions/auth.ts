"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession, findOrCreateOAuthUser, registerUser } from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/conta");

  const userId = checkCredentials(email, password);
  if (!userId) return { error: "E-mail ou senha incorretos. Tente novamente." };

  await createSession(userId);
  redirect(next);
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "E-mail inválido." };
  if (password.length < 6) return { error: "A senha precisa ter ao menos 6 caracteres." };

  const result = registerUser({ name, email, password });
  if ("error" in result) return { error: result.error };

  await createSession(result.id);
  redirect("/conta");
}

/** Demonstração do fluxo "Entrar com Google" sem depender de credenciais externas. */
export async function googleLoginAction() {
  const id = findOrCreateOAuthUser("Convidado Google", "convidado.google@auraterra.com.br");
  await createSession(id);
  redirect("/conta");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
