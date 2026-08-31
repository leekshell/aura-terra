"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatBRL, METHODS, PLANS, type BrewMethod } from "@/lib/types";

const FREQUENCIES = [
  { value: "quinzenal", label: "A cada 15 dias" },
  { value: "mensal", label: "Mensal" },
  { value: "bimestral", label: "A cada 2 meses" },
] as const;

export function SubscriptionBuilder({ initialPlan }: { initialPlan?: string }) {
  const { add } = useCart();
  const [planId, setPlanId] = useState(
    PLANS.some((p) => p.id === initialPlan) ? (initialPlan as string) : "explorador",
  );
  const [grind, setGrind] = useState<BrewMethod>("graos");
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]["value"]>("mensal");
  const [added, setAdded] = useState(false);

  const plan = PLANS.find((p) => p.id === planId)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <div className="space-y-7">
        <div>
          <p className="eyebrow mb-3 text-forest-500">1. Escolha seu plano</p>
          <div className="grid gap-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                aria-pressed={planId === p.id}
                className={`flex items-start justify-between gap-4 rounded-3xl border p-5 text-left transition-all duration-300 ${
                  planId === p.id
                    ? "border-forest-800 bg-forest-800 text-areia-100"
                    : "border-areia-300 bg-white hover:border-forest-600"
                }`}
              >
                <span>
                  <span className="block font-display text-xl">{p.name}</span>
                  <span className={`mt-1 block text-xs ${planId === p.id ? "text-areia-100/70" : "text-forest-500"}`}>
                    {p.bags}
                  </span>
                  <span className={`mt-2 block text-sm ${planId === p.id ? "text-areia-100/85" : "text-forest-600"}`}>
                    {p.description}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-2xl">{formatBRL(p.priceCents)}</span>
                  <span className={`text-[11px] ${planId === p.id ? "text-areia-100/60" : "text-forest-500"}`}>
                    por entrega
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3 text-forest-500">2. Como prefere a moagem?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setGrind(m.value)}
                aria-pressed={grind === m.value}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  grind === m.value
                    ? "border-terracota-500 bg-terracota-100/60 text-forest-900"
                    : "border-areia-300 bg-white text-forest-700 hover:border-forest-600"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3 text-forest-500">3. Com que frequência?</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                onClick={() => setFrequency(f.value)}
                aria-pressed={frequency === f.value}
                className={`rounded-full border px-4 py-2.5 text-sm transition ${
                  frequency === f.value
                    ? "border-forest-800 bg-forest-800 text-areia-100"
                    : "border-areia-300 bg-white text-forest-700 hover:border-forest-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-4xl border border-areia-200 bg-white p-7">
          <p className="eyebrow text-terracota-600">Resumo da assinatura</p>
          <h3 className="mt-2 font-display text-2xl text-forest-900">Clube Aura · {plan.name}</h3>

          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ["Conteúdo", plan.bags],
              ["Moagem", METHODS.find((m) => m.value === grind)?.label ?? ""],
              ["Frequência", FREQUENCIES.find((f) => f.value === frequency)?.label ?? ""],
              ["Frete", "Grátis para todo o Brasil"],
              ["Fidelidade", "Nenhuma — cancele quando quiser"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-areia-100 pb-2">
                <dt className="text-forest-500">{k}</dt>
                <dd className="text-right font-medium text-forest-900">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 font-display text-4xl text-forest-900">
            {formatBRL(plan.priceCents)}
            <span className="font-sans text-sm text-forest-500"> /entrega</span>
          </p>

          <button
            onClick={() => {
              add({
                productId: `plan_${plan.id}`,
                slug: "assinatura",
                name: `Clube Aura · ${plan.name}`,
                image: "/images/produtos/serra-mantiqueira.jpg",
                weight: "250g",
                grind,
                quantity: 1,
                unitPriceCents: plan.priceCents,
                kind: "assinatura",
                frequency,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className={`btn mt-6 w-full ${added ? "btn-secondary" : "btn-primary"}`}
          >
            {added ? "Adicionado ✓" : "Começar minha assinatura"}
          </button>

          <p className="mt-3 text-center text-xs text-forest-500">
            Primeira entrega em até 5 dias úteis · pagamento recorrente no cartão ou pix
          </p>
        </div>
      </aside>
    </div>
  );
}
