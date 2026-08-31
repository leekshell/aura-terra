"use client";

import { useState, useTransition } from "react";
import {
  setSubscriptionStatus,
  updateSubscriptionAddress,
  updateSubscriptionPreferences,
} from "@/app/actions/account";
import { formatBRL, METHODS, WEIGHTS, type Subscription } from "@/lib/types";

const FREQUENCIES = [
  { value: "quinzenal", label: "A cada 15 dias" },
  { value: "mensal", label: "Mensal" },
  { value: "bimestral", label: "A cada 2 meses" },
];

export function SubscriptionManager({ subscription }: { subscription: Subscription }) {
  const s = subscription;
  const [pending, start] = useTransition();
  const [frequency, setFrequency] = useState(s.frequency);
  const [grind, setGrind] = useState(s.grind);
  const [weight, setWeight] = useState(s.weight);
  const [nextDelivery, setNextDelivery] = useState(s.nextDelivery);
  const [toast, setToast] = useState("");

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const paused = s.status === "pausada";
  const canceled = s.status === "cancelada";

  return (
    <div className="space-y-5">
      <div className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow text-terracota-600">Clube Aura · {s.plan}</span>
            <h2 className="mt-2 font-display text-2xl text-forest-900">
              {formatBRL(s.priceCents)} <span className="font-sans text-sm text-forest-500">por entrega</span>
            </h2>
            <p className="mt-1 text-sm text-forest-600">
              Assinante desde {new Date(s.createdAt.replace(" ", "T")).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              canceled
                ? "bg-areia-200 text-forest-600"
                : paused
                  ? "bg-terracota-100 text-terracota-700"
                  : "bg-forest-100 text-forest-800"
            }`}
          >
            {canceled ? "Cancelada" : paused ? "Pausada" : "Ativa"}
          </span>
        </div>

        {!canceled && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await setSubscriptionStatus(s.id, paused ? "ativa" : "pausada");
                  notify(paused ? "Assinatura retomada!" : "Assinatura pausada — retome quando quiser.");
                })
              }
              className={`btn px-5 py-2.5 text-xs ${paused ? "btn-primary" : "btn-ghost"}`}
            >
              {paused ? "Retomar assinatura" : "Pausar assinatura"}
            </button>
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const d = new Date(nextDelivery);
                  d.setDate(d.getDate() + 7);
                  const iso = d.toISOString().slice(0, 10);
                  setNextDelivery(iso);
                  await updateSubscriptionPreferences(s.id, { nextDelivery: iso });
                  notify("Próxima entrega adiada em 7 dias.");
                })
              }
              className="btn btn-ghost px-5 py-2.5 text-xs"
            >
              Adiar 7 dias
            </button>
            <button
              disabled={pending}
              onClick={() => {
                if (!confirm("Tem certeza que deseja cancelar? Você pode apenas pausar, se preferir.")) return;
                start(async () => {
                  await setSubscriptionStatus(s.id, "cancelada");
                  notify("Assinatura cancelada. Sentiremos sua falta ☕");
                });
              }}
              className="btn px-5 py-2.5 text-xs text-terracota-600 underline"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
        <h3 className="font-display text-xl text-forest-900">Preferências do café</h3>

        <div className="mt-5 space-y-5">
          <div>
            <p className="eyebrow mb-2.5 text-forest-500">Frequência</p>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value as Subscription["frequency"])}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    frequency === f.value
                      ? "border-forest-800 bg-forest-800 text-areia-100"
                      : "border-areia-300 text-forest-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2.5 text-forest-500">Moagem</p>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setGrind(m.value)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    grind === m.value
                      ? "border-terracota-500 bg-terracota-100 text-terracota-700"
                      : "border-areia-300 text-forest-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2.5 text-forest-500">Peso por pacote</p>
              <div className="flex gap-2">
                {WEIGHTS.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setWeight(w.value)}
                    className={`flex-1 rounded-2xl border px-3 py-2.5 text-xs transition ${
                      weight === w.value
                        ? "border-forest-800 bg-forest-800 text-areia-100"
                        : "border-areia-300 text-forest-700"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="eyebrow mb-2.5 block text-forest-500">Próxima entrega</span>
              <input
                type="date"
                value={nextDelivery}
                onChange={(e) => setNextDelivery(e.target.value)}
                className="field"
              />
            </label>
          </div>
        </div>

        <button
          disabled={pending}
          onClick={() =>
            start(async () => {
              await updateSubscriptionPreferences(s.id, { frequency, grind, weight, nextDelivery });
              notify("Preferências salvas!");
            })
          }
          className="btn btn-primary mt-6 disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Salvar preferências"}
        </button>
      </div>

      <form
        action={async (fd) => {
          await updateSubscriptionAddress(s.id, fd);
          notify("Endereço atualizado — vale a partir do próximo ciclo.");
        }}
        className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8"
      >
        <h3 className="font-display text-xl text-forest-900">Endereço de entrega</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-6">
          <Input name="street" label="Rua / Avenida" defaultValue={s.address.street} className="sm:col-span-4" />
          <Input name="number" label="Número" defaultValue={s.address.number} className="sm:col-span-2" />
          <Input name="complement" label="Complemento" defaultValue={s.address.complement} className="sm:col-span-3" />
          <Input name="district" label="Bairro" defaultValue={s.address.district} className="sm:col-span-3" />
          <Input name="city" label="Cidade" defaultValue={s.address.city} className="sm:col-span-3" />
          <Input name="state" label="UF" defaultValue={s.address.state} className="sm:col-span-1" />
          <Input name="zip" label="CEP" defaultValue={s.address.zip} className="sm:col-span-2" />
        </div>
        <button type="submit" className="btn btn-secondary mt-6">
          Atualizar endereço
        </button>
      </form>

      {toast && (
        <p role="status" className="sticky bottom-5 rounded-2xl bg-forest-800 px-5 py-3 text-sm text-areia-100 shadow-lg">
          {toast}
        </p>
      )}
    </div>
  );
}

function Input({
  name,
  label,
  defaultValue,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-forest-700">{label}</span>
      <input name={name} defaultValue={defaultValue ?? ""} className="field" />
    </label>
  );
}
