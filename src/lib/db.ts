import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "./seed";

declare global {
  var __auraDb: Database.Database | undefined;
}

function createConnection() {
  const dir = process.env.AURA_DATA_DIR ?? path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "aura-terra.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seedDatabase(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'cliente',
      provider TEXT NOT NULL DEFAULT 'email',
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      story TEXT NOT NULL DEFAULT '',
      origin TEXT NOT NULL DEFAULT '',
      producer TEXT NOT NULL DEFAULT '',
      farm TEXT NOT NULL DEFAULT '',
      altitude TEXT NOT NULL DEFAULT '',
      process TEXT NOT NULL DEFAULT '',
      variety TEXT NOT NULL DEFAULT '',
      score REAL NOT NULL DEFAULT 84,
      roast TEXT NOT NULL DEFAULT 'media',
      profiles TEXT NOT NULL DEFAULT '[]',
      methods TEXT NOT NULL DEFAULT '[]',
      notes TEXT NOT NULL DEFAULT '[]',
      flavor TEXT NOT NULL DEFAULT '{}',
      price_cents INTEGER NOT NULL DEFAULT 4900,
      compare_at_cents INTEGER,
      stock INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL DEFAULT '',
      accent TEXT NOT NULL DEFAULT '#1A3626',
      badge TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      subscription_only INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 4.8,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'avulsa',
      status TEXT NOT NULL DEFAULT 'processando',
      items TEXT NOT NULL DEFAULT '[]',
      subtotal_cents INTEGER NOT NULL DEFAULT 0,
      shipping_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL DEFAULT 0,
      address TEXT NOT NULL DEFAULT '{}',
      tracking_code TEXT,
      carrier TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL DEFAULT 'descobridor',
      product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
      grind TEXT NOT NULL DEFAULT 'graos',
      weight TEXT NOT NULL DEFAULT '500g',
      frequency TEXT NOT NULL DEFAULT 'mensal',
      status TEXT NOT NULL DEFAULT 'ativa',
      price_cents INTEGER NOT NULL DEFAULT 8900,
      next_delivery TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Extração',
      cover TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'Equipe Aura Terra',
      read_minutes INTEGER NOT NULL DEFAULT 5,
      published INTEGER NOT NULL DEFAULT 1,
      published_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'Contato',
      message TEXT NOT NULL,
      handled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      quote TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      email TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_sub_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_pub ON posts(published, published_at);
  `);
}

export function getDb(): Database.Database {
  if (!global.__auraDb) {
    global.__auraDb = createConnection();
  }
  return global.__auraDb;
}
