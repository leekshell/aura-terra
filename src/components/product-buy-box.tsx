"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatBRL, METHODS, priceForWeight, WEIGHTS, type BrewMethod, type Product, type Weight } from "@/lib/types";

const FREQUENCIES = [
  { value: "quinzenal", label: "A cada 15 dias" },
  { value: "mensal", label: "Mensal" },
  { value: "bimestral", label: "A cada 2 meses" },
] as const;

const SUBSCRIPTION_DISCOUNT = 0.1;

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [weight, setWeight] = useState<Weight>("250g");
  const [grind, setGrind] = useState<BrewMethod>(product.methods[0] ?? "graos");
  const [quantity, setQuantity] = useState(1);
  const [kind, setKind] = useState<"avulsa" | "assinatura">("avulsa");
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]["value"]>("mensal");
  const [added, setAdded] = useState(false);

  const base = priceForWeight(product.priceCents, weight);
  const unit = kind === "assinatura" ? Math.round((base * (1 - SUBSCRIPTION_DISCOUNT)) / 100) * 100 : base;

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      weight,
      grind,
      quantity,
      unitPriceCents: unit,
      kind,
      frequency: kind === "assinatura" ? frequency : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Avulsa x assinatura */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-areia-100 p-1.5">
        {(["avulsa", "assinatura"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
              kind === k ? "bg-white text-forest-900 shadow-sm" : "text-forest-600 hover:text-forest-900"
            }`}
          >
            {k === "avulsa" ? "Compra avulsa" : "Assinar e economizar 10%"}
          </button>
        ))}
      </div>

      {kind === "assinatura" && (
        <div className="animate-fade-up rounded-2xl border border-forest-100 bg-forest-100/40 p-4">
          <p className="eyebrow mb-2.5 text-forest-600">Frequência de entrega</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                onClick={() => setFrequency(f.value)}
                aria-pressed={frequency === f.value}
                className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                  frequency === f.value
                    ? "border-forest-800 bg-forest-800 text-areia-100"
                    : "border-forest-800/20 bg-white text-forest-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-forest-600">
            Frete grátis sempre · pause, adie ou cancele quando quiser no seu painel.
          </p>
        </div>
      )}

      {/* Peso */}
      <div>
        <p className="eyebrow mb-2.5 text-forest-500">Peso do pacote</p>
        <div className="grid grid-cols-3 gap-2">
          {WEIGHTS.map((w) => {
            const price = priceForWeight(product.priceCents, w.value);
            const perKg = Math.round(price / (w.value === "250g" ? 0.25 : w.value === "500g" ? 0.5 : 1));
            return (
              <button
                key={w.value}
                onClick={() => setWeight(w.value)}
                aria-pressed={weight === w.value}
                className={`rounded-2xl border px-3 py-3 text-center transition-all duration-200 ${
                  weight === w.value
                    ? "border-forest-800 bg-forest-800 text-areia-100"
                    : "border-areia-300 bg-white text-forest-800 hover:border-forest-600"
                }`}
              >
                <span className="block text-sm font-semibold">{w.label}</span>
                <span className={`mt-0.5 block text-[10px] ${weight === w.value ? "text-areia-100/70" : "text-forest-500"}`}>
                  {formatBRL(perKg)}/kg
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Moagem */}
      <div>
        <p className="eyebrow mb-2.5 text-forest-500">Moagem</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {METHODS.filter((m) => product.methods.includes(m.value)).map((m) => (
            <button
              key={m.value}
              onClick={() => setGrind(m.value)}
              aria-pressed={grind === m.value}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                grind === m.value
                  ? "border-terracota-500 bg-terracota-100/60 text-forest-900"
                  : "border-areia-300 bg-white text-forest-700 hover:border-forest-600"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-forest-500">
          Não sabe qual escolher?{" "}
          <Link href="/blog/moagem-certa-para-cada-metodo" className="underline underline-offset-2">
            Veja nosso guia de moagem
          </Link>
          .
        </p>
      </div>

      {/* Preço + CTA */}
      <div className="rounded-3xl border border-areia-200 bg-white p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            {kind === "assinatura" && (
              <span className="mr-2 text-sm text-forest-400 line-through">{formatBRL(base)}</span>
            )}
            <span className="font-display text-3xl text-forest-900">{formatBRL(unit)}</span>
            <p className="mt-1 text-xs text-forest-500">
              {kind === "assinatura" ? `por entrega · ${frequency}` : "à vista no pix ou em até 3x sem juros"}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-areia-300 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="size-8 rounded-full text-forest-700 transition hover:bg-areia-200"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="size-8 rounded-full text-forest-700 transition hover:bg-areia-200"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`btn mt-4 w-full ${added ? "btn-secondary" : "btn-primary"} disabled:opacity-50`}
        >
          {product.stock === 0
            ? "Esgotado nesta safra"
            : added
              ? "Adicionado à sacola ✓"
              : kind === "assinatura"
                ? "Assinar este café"
                : "Adicionar à sacola"}
        </button>

        <ul className="mt-4 space-y-1.5 text-xs text-forest-600">
          <li>🚚 Frete grátis acima de R$ 149 — chega em 1 a 5 dias úteis</li>
          <li>🔥 Torra sob demanda: segundas e quintas</li>
          <li>💚 Garantia xícara cheia: não gostou, devolvemos o valor</li>
          <li>📦 {product.stock} pacotes disponíveis neste lote</li>
        </ul>
      </div>
    </div>
  );
}
