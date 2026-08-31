"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BrewMethod, Weight } from "@/lib/types";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  weight: Weight;
  grind: BrewMethod;
  quantity: number;
  unitPriceCents: number;
  kind: "avulsa" | "assinatura";
  frequency?: "quinzenal" | "mensal" | "bimestral";
};

type CartContext = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  ready: boolean;
};

const Ctx = createContext<CartContext | null>(null);
const STORAGE_KEY = "aura-terra-cart-v1";
export const FREE_SHIPPING_THRESHOLD = 14900;
export const FLAT_SHIPPING = 1990;

export function itemKey(i: Pick<CartItem, "productId" | "weight" | "grind" | "kind">) {
  return `${i.productId}|${i.weight}|${i.grind}|${i.kind}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        /* carrinho inválido no storage — ignora */
      }
      setReady(true);
    };
    const id = window.setTimeout(hydrate, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = itemKey(item);
      const found = prev.find((p) => itemKey(p) === key);
      if (found) {
        return prev.map((p) => (itemKey(p) === key ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      return [...prev, item];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => itemKey(p) !== key));
  }, []);

  const setQuantity = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (itemKey(p) === key ? { ...p, quantity: Math.max(0, qty) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContext>(() => {
    const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
    const hasSubscription = items.some((i) => i.kind === "assinatura");
    const shippingCents =
      items.length === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD || hasSubscription ? 0 : FLAT_SHIPPING;
    return {
      items,
      add,
      remove,
      setQuantity,
      clear,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      open,
      setOpen,
      ready,
    };
  }, [items, add, remove, setQuantity, clear, open, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
