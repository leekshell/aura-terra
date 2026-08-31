"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatBRL, METHODS } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD, itemKey, useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQuantity, subtotalCents, shippingCents, totalCents } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const missing = FREE_SHIPPING_THRESHOLD - subtotalCents;

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-50 bg-forest-950/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Sacola de compras"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-areia-50 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-areia-200 px-5 py-4">
          <div>
            <p className="eyebrow text-terracota-500">Sua sacola</p>
            <h2 className="text-xl">{items.length === 0 ? "Vazia por enquanto" : `${items.length} item(ns)`}</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar sacola"
            className="grid size-10 place-items-center rounded-full border border-areia-300 text-forest-800 transition hover:bg-areia-200"
          >
            ✕
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-areia-200 bg-forest-800 px-5 py-2.5 text-center text-xs text-areia-100">
            {missing > 0 ? (
              <>
                Faltam <strong>{formatBRL(missing)}</strong> para o frete grátis
              </>
            ) : (
              <>🎉 Frete grátis desbloqueado para todo o Brasil</>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="text-5xl">☕</span>
              <p className="max-w-[24ch] text-sm text-forest-600">
                Que tal começar por um microlote fresco, torrado esta semana?
              </p>
              <Link href="/loja" onClick={() => setOpen(false)} className="btn btn-primary">
                Ver a loja
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const key = itemKey(item);
                return (
                  <li key={key} className="flex gap-3 rounded-2xl border border-areia-200 bg-white p-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-areia-200">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-forest-900">{item.name}</p>
                        <button
                          onClick={() => remove(key)}
                          aria-label={`Remover ${item.name}`}
                          className="text-xs text-forest-500 underline-offset-2 hover:text-terracota-600 hover:underline"
                        >
                          remover
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-forest-500">
                        {item.weight} · {METHODS.find((m) => m.value === item.grind)?.short}
                        {item.kind === "assinatura" ? ` · assinatura ${item.frequency}` : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-areia-300">
                          <button
                            onClick={() => setQuantity(key, item.quantity - 1)}
                            aria-label="Diminuir quantidade"
                            className="size-7 rounded-full text-forest-700 transition hover:bg-areia-200"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(key, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                            className="size-7 rounded-full text-forest-700 transition hover:bg-areia-200"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-forest-900">
                          {formatBRL(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-areia-200 bg-white px-5 py-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span>{formatBRL(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Frete</span>
                <span>{shippingCents === 0 ? "Grátis" : formatBRL(shippingCents)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-forest-900">
                <span>Total</span>
                <span>{formatBRL(totalCents)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Finalizar compra
            </Link>
            <button onClick={() => setOpen(false)} className="w-full text-center text-xs text-forest-500 underline">
              continuar comprando
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
