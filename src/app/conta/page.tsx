import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listOrdersByUser, listSubscriptionsByUser } from "@/lib/queries";
import { formatBRL } from "@/lib/types";

export const metadata: Metadata = { title: "Minha conta", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<string, string> = {
  processando: "Processando",
  torrando: "Em torra",
  enviado: "A caminho",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function ContaPage() {
  const user = await requireUser();
  const orders = listOrdersByUser(user.id);
  const subs = listSubscriptionsByUser(user.id);
  const active = subs.find((s) => s.status === "ativa");
  const spent = orders.filter((o) => o.status !== "cancelado").reduce((s, o) => s + o.totalCents, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Pedidos realizados", String(orders.length)],
          ["Total investido em café", formatBRL(spent)],
          ["Assinatura", active ? `Clube ${active.plan}` : "Nenhuma ativa"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-3xl border border-areia-200 bg-white p-5">
            <p className="text-xs text-forest-500">{k}</p>
            <p className="mt-1.5 font-display text-2xl text-forest-900">{v}</p>
          </div>
        ))}
      </div>

      {active ? (
        <div className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="eyebrow text-terracota-600">Próxima entrega</span>
              <h2 className="mt-2 font-display text-2xl text-forest-900">
                {new Date(active.nextDelivery).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <p className="mt-1 text-sm text-forest-600">
                Clube {active.plan} · {active.frequency} · moagem {active.grind} · {active.weight}
              </p>
            </div>
            <Link href="/conta/assinatura" className="btn btn-ghost px-4 py-2.5 text-xs">
              Gerenciar assinatura
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-4xl bg-forest-800 p-7 text-areia-100 md:p-9">
          <h2 className="font-display text-2xl">Você ainda não faz parte do Clube Aura</h2>
          <p className="mt-2 max-w-lg text-sm text-areia-100/75">
            Receba microlotes frescos todo mês com 10% de desconto e frete grátis. Pause quando quiser.
          </p>
          <Link href="/assinatura" className="btn btn-primary mt-5">
            Conhecer os planos
          </Link>
        </div>
      )}

      <div className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-forest-900">Pedidos recentes</h2>
          <Link href="/conta/pedidos" className="text-xs font-medium text-terracota-600 underline underline-offset-4">
            ver todos
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-forest-600">Você ainda não fez pedidos.</p>
        ) : (
          <ul className="mt-4 divide-y divide-areia-200">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div>
                  <p className="text-sm font-medium text-forest-900">{o.code}</p>
                  <p className="text-xs text-forest-500">
                    {new Date(o.createdAt.replace(" ", "T")).toLocaleDateString("pt-BR")} · {o.items.length} item(ns)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-areia-100 px-3 py-1 text-xs text-forest-700">
                    {STATUS_LABEL[o.status]}
                  </span>
                  <span className="text-sm font-semibold text-forest-900">{formatBRL(o.totalCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
