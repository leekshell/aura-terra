"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { placeOrder } from "@/app/actions/checkout";
import { useCart } from "./cart-provider";
import { formatBRL, METHODS } from "@/lib/types";

export function CheckoutFlow({ user }: { user: { name: string; email: string } | null }) {
  const { items, subtotalCents, shippingCents, totalCents, clear, ready } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [createAccount, setCreateAccount] = useState(!user);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    phone: "",
    zip: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    payment: "pix",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await placeOrder({
      customer: { name: form.name, email: form.email, password: form.password, phone: form.phone },
      address: {
        street: form.street,
        number: form.number,
        complement: form.complement,
        district: form.district,
        city: form.city,
        state: form.state,
        zip: form.zip,
      },
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        weight: i.weight,
        grind: i.grind,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
        kind: i.kind,
        frequency: i.frequency,
      })),
      shippingCents,
      createAccount: createAccount && !user,
    });
    setLoading(false);
    if ("error" in res && res.error) {
      setError(res.error);
      return;
    }
    if ("code" in res) {
      clear();
      setDone(res.code ?? "");
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-4xl border border-areia-200 bg-white p-8 text-center md:p-12">
        <span className="text-5xl">🎉</span>
        <h1 className="mt-5 font-display text-3xl text-forest-900">Pedido confirmado!</h1>
        <p className="mt-3 text-forest-600">
          Seu número de pedido é <strong className="text-forest-900">{done}</strong>. Enviamos a confirmação por
          e-mail — seu café entra na próxima torra e você recebe o rastreio em até 48h.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/conta/pedidos" className="btn btn-primary">
            Acompanhar meu pedido
          </Link>
          <Link href="/loja" className="btn btn-ghost">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-4xl border border-dashed border-areia-300 bg-white/70 p-12 text-center">
        <span className="text-4xl">🛒</span>
        <h1 className="mt-4 font-display text-2xl text-forest-900">Sua sacola está vazia</h1>
        <p className="mt-2 text-sm text-forest-600">Escolha um microlote fresco para começar.</p>
        <Link href="/loja" className="btn btn-primary mt-6">
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <form onSubmit={submit} className="space-y-6">
        {/* Etapas */}
        <ol className="flex items-center gap-3 text-xs">
          {["Identificação e entrega", "Pagamento"].map((label, i) => {
            const n = (i + 1) as 1 | 2;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold ${
                    step >= n ? "bg-forest-800 text-areia-100" : "bg-areia-200 text-forest-500"
                  }`}
                >
                  {n}
                </span>
                <span className={step >= n ? "font-medium text-forest-900" : "text-forest-500"}>{label}</span>
                {i === 0 && <span className="mx-1 h-px w-6 bg-areia-300" />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="animate-fade-up space-y-5 rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-forest-900">Seus dados</h2>
            {!user && (
              <p className="rounded-2xl bg-areia-100 px-4 py-3 text-xs text-forest-600">
                Já tem conta?{" "}
                <Link href="/entrar?next=/checkout" className="font-medium text-terracota-600 underline">
                  Entre aqui
                </Link>{" "}
                para preencher tudo automaticamente.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" value={form.name} onChange={(v) => set("name", v)} required />
              <Field label="E-mail" type="email" value={form.email} onChange={(v) => set("email", v)} required />
              <Field label="Celular / WhatsApp" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(31) 90000-0000" />
              <Field label="CEP" value={form.zip} onChange={(v) => set("zip", v)} required placeholder="30110-090" />
            </div>

            {!user && (
              <label className="flex items-start gap-2.5 text-sm text-forest-700">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Quero criar uma conta para acompanhar pedidos e gerenciar assinatura
                  {createAccount && (
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Crie uma senha (mín. 6 caracteres)"
                      className="field mt-2"
                    />
                  )}
                </span>
              </label>
            )}

            <h2 className="pt-2 font-display text-xl text-forest-900">Endereço de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Field label="Rua / Avenida" value={form.street} onChange={(v) => set("street", v)} required />
              </div>
              <div className="sm:col-span-2">
                <Field label="Número" value={form.number} onChange={(v) => set("number", v)} required />
              </div>
              <div className="sm:col-span-3">
                <Field label="Complemento" value={form.complement} onChange={(v) => set("complement", v)} />
              </div>
              <div className="sm:col-span-3">
                <Field label="Bairro" value={form.district} onChange={(v) => set("district", v)} required />
              </div>
              <div className="sm:col-span-4">
                <Field label="Cidade" value={form.city} onChange={(v) => set("city", v)} required />
              </div>
              <div className="sm:col-span-2">
                <Field label="UF" value={form.state} onChange={(v) => set("state", v)} required maxLength={2} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const required = [form.name, form.email, form.zip, form.street, form.number, form.district, form.city, form.state];
                if (required.some((v) => !v.trim())) {
                  setError("Preencha todos os campos obrigatórios para continuar.");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="btn btn-primary w-full"
            >
              Ir para o pagamento
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up space-y-5 rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-forest-900">Pagamento</h2>
            <div className="space-y-2.5">
              {[
                ["pix", "Pix", "5% de desconto · aprovação imediata"],
                ["cartao", "Cartão de crédito", "Em até 3x sem juros"],
                ["boleto", "Boleto bancário", "Compensação em até 2 dias úteis"],
              ].map(([value, label, hint]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    form.payment === value ? "border-forest-800 bg-areia-50" : "border-areia-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={form.payment === value}
                    onChange={(e) => set("payment", e.target.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-forest-900">{label}</span>
                    <span className="block text-xs text-forest-600">{hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <p className="rounded-2xl bg-areia-100 px-4 py-3 text-xs text-forest-600">
              Ambiente de demonstração: nenhuma cobrança real é processada. A integração com gateway (Pagar.me,
              Stripe ou Mercado Pago) pode ser plugada nesta etapa.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="btn btn-ghost sm:w-auto">
                ← Voltar
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary flex-1 disabled:opacity-60">
                {loading ? "Processando…" : `Finalizar pedido · ${formatBRL(totalCents)}`}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-2xl bg-terracota-100 px-4 py-3 text-sm text-terracota-700">
            {error}
          </p>
        )}
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-4xl border border-areia-200 bg-white p-6">
          <h2 className="font-display text-xl text-forest-900">Resumo do pedido</h2>
          <ul className="mt-5 space-y-3">
            {items.map((i, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-areia-200">
                  <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-medium text-forest-900">{i.name}</p>
                  <p className="text-xs text-forest-500">
                    {i.quantity}× {i.weight} · {METHODS.find((m) => m.value === i.grind)?.short}
                    {i.kind === "assinatura" ? ` · ${i.frequency}` : ""}
                  </p>
                </div>
                <span className="text-sm font-medium text-forest-900">
                  {formatBRL(i.unitPriceCents * i.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-areia-200 pt-4 text-sm">
            <div className="flex justify-between text-forest-600">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-forest-600">
              <dt>Frete</dt>
              <dd>{shippingCents === 0 ? "Grátis" : formatBRL(shippingCents)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold text-forest-900">
              <dt>Total</dt>
              <dd>{formatBRL(totalCents)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-forest-700">
        {label}
        {required && <span className="text-terracota-500"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}
