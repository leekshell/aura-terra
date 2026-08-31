import "server-only";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { hashPassword, newId, verifyPassword } from "./password";
import type { User } from "./types";

const COOKIE = "aura_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function createSession(userId: string) {
  const db = getDb();
  const id = newId("ses");
  const expires = new Date(Date.now() + MAX_AGE * 1000);
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(
    id,
    userId,
    expires.toISOString(),
  );
  const store = await cookies();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (id) getDb().prepare("DELETE FROM sessions WHERE id = ?").run(id);
  store.delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (!id) return null;
  const row = getDb()
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now')`,
    )
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as User["role"],
    provider: row.provider as string,
    phone: (row.phone as string) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

export function findUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim()) as
    | (Record<string, unknown> & { password_hash: string })
    | undefined;
}

export function registerUser(input: { name: string; email: string; password: string; provider?: string }) {
  const db = getDb();
  const email = input.email.toLowerCase().trim();
  const existing = findUserByEmail(email);
  if (existing) return { error: "Já existe uma conta com este e-mail." as const };
  const id = newId("usr");
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, provider) VALUES (?, ?, ?, ?, 'cliente', ?)",
  ).run(id, input.name.trim(), email, hashPassword(input.password), input.provider ?? "email");
  return { id };
}

export function checkCredentials(email: string, password: string) {
  const row = findUserByEmail(email);
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash)) return null;
  return row.id as string;
}

/** Simulação de login social (Google) para o ambiente de demonstração. */
export function findOrCreateOAuthUser(name: string, email: string) {
  const existing = findUserByEmail(email);
  if (existing) return existing.id as string;
  const id = newId("usr");
  getDb()
    .prepare("INSERT INTO users (id, name, email, password_hash, role, provider) VALUES (?, ?, ?, ?, 'cliente', 'google')")
    .run(id, name, email.toLowerCase().trim(), hashPassword(newId("rnd")));
  return id;
}
