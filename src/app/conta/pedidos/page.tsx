import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listOrdersByUser } from "@/lib/queries";
import { formatBRL, METHODS } from "@/lib/types";

export const metadata: Metadata = { title: "Meus pedidos", robots: { index: false, follow: false } };

const STEPS = ["processando", "torrando", "enviado", "entregue"] as const;
const STEP_LABEL: Record<string, string> = {
  processando: "Pedido confirmado",
  torrando: "Em torra",
  enviado: "A caminho",
  entregue: "Entregue",
};

export default async function PedidosPage() {
  const user = await requireUser();
  const orders = listOrdersByUser(user.id);

  if (orders.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-areia-300 bg-white/70 p-12 text-center">
        <p className="font-display text-xl text-forest-900">Nenhum pedido por aqui ainda</p>
        <Link href="/loja" className="btn btn-primary mt-5">
          Escolher meu café
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const stepIndex = STEPS.indexOf(order.status as (typeof STEPS)[number]);
        return (
          <article key={order.id} className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-terracota-600">
                  {order.kind === "assinatura" ? "Entrega da assinatura" : "Pedido"}
                </p>
                <h2 className="mt-1.5 font-display text-xl text-forest-900">{order.code}</h2>
                <p className="mt-1 text-xs text-forest-500">
                  Realizado em {new Date(order.createdAt.replace(" ", "T")).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <p className="text-lg font-semibold text-forest-900">{formatBRL(order.totalCents)}</p>
            </header>

            {order.status !== "cancelado" && (
              <div className="mt-6">
                <div className="flex items-center">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`grid size-7 place-items-center rounded-full text-[11px] font-bold transition ${
                            i <= stepIndex ? "bg-forest-800 text-areia-100" : "bg-areia-200 text-forest-400"
                          }`}
                        >
                          {i <= stepIndex ? "✓" : i + 1}
                        </span>
                        <span
                          className={`hidden text-[10px] sm:block ${
                            i <= stepIndex ? "text-forest-800" : "text-forest-400"
                          }`}
                        >
                          {STEP_LABEL[s]}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`mx-1 h-0.5 flex-1 rounded ${i < stepIndex ? "bg-forest-800" : "bg-areia-200"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ul className="mt-6 divide-y divide-areia-100 border-t border-areia-100">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-forest-900">{i.name}</p>
                    <p className="text-xs text-forest-500">
                      {i.quantity}× {i.weight} · {METHODS.find((m) => m.value === i.grind)?.label ?? i.grind}
                    </p>
                  </div>
                  <span className="text-forest-700">{formatBRL(i.unitPriceCents * i.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-4 rounded-3xl bg-areia-50 p-5 text-sm sm:grid-cols-2">
              <div>
                <p className="eyebrow text-forest-500">Entrega</p>
                <p className="mt-1.5 text-forest-700">
                  {order.address.street}, {order.address.number}
                  {order.address.complement ? ` · ${order.address.complement}` : ""}
                  <br />
                  {order.address.district} · {order.address.city}/{order.address.state}
                  <br />
                  CEP {order.address.zip}
                </p>
              </div>
              <div>
                <p className="eyebrow text-forest-500">Rastreamento</p>
                {order.trackingCode ? (
                  <>
                    <p className="mt-1.5 font-mono text-forest-900">{order.trackingCode}</p>
                    <p className="text-xs text-forest-500">{order.carrier}</p>
                    <a
                      href={`https://www.linkcorreios.com.br/?id=${order.trackingCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-terracota-600 underline underline-offset-4"
                    >
                      Rastrear entrega →
                    </a>
                  </>
                ) : (
                  <p className="mt-1.5 text-forest-600">
                    O código de rastreio é liberado em até 48h após a torra.
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
