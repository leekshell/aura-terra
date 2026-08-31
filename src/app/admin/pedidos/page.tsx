import { updateOrder } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { listAllOrders } from "@/lib/queries";
import { formatBRL } from "@/lib/types";

const STATUSES = ["processando", "torrando", "enviado", "entregue", "cancelado"];

export default async function AdminPedidos() {
  await requireAdmin();
  const orders = listAllOrders();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest-900">Pedidos</h2>
          <p className="text-sm text-forest-600">
            {orders.length} pedidos · atualize status e rastreio — o cliente vê na hora.
          </p>
        </div>
        <a href="/api/admin/export?tipo=pedidos" className="btn btn-ghost px-5 py-2.5 text-sm">
          ↓ Exportar CSV
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-4xl border border-areia-200 bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg text-forest-900">{o.code}</p>
                <p className="text-xs text-forest-500">
                  {new Date(o.createdAt.replace(" ", "T")).toLocaleString("pt-BR")} · {o.customerName} ·{" "}
                  {o.email}
                </p>
                <p className="mt-1 text-xs text-forest-500">
                  {o.address.city}/{o.address.state} · CEP {o.address.zip}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-forest-900">{formatBRL(o.totalCents)}</p>
                <span className="text-xs text-forest-500">
                  {o.kind === "assinatura" ? "Assinatura" : "Compra avulsa"}
                </span>
              </div>
            </div>

            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-forest-600">
              {o.items.map((i, idx) => (
                <li key={idx} className="rounded-full bg-areia-100 px-3 py-1">
                  {i.quantity}× {i.name} · {i.weight} · {i.grind}
                </li>
              ))}
            </ul>

            <form action={updateOrder} className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr_auto]">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="field w-auto text-sm">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                name="tracking"
                defaultValue={o.trackingCode ?? ""}
                placeholder="Código de rastreio"
                className="field text-sm"
              />
              <input
                name="carrier"
                defaultValue={o.carrier ?? ""}
                placeholder="Transportadora"
                className="field text-sm"
              />
              <button type="submit" className="btn btn-secondary px-5 py-2.5 text-xs">
                Atualizar
              </button>
            </form>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="rounded-4xl border border-dashed border-areia-300 p-10 text-center text-sm text-forest-600">
            Nenhum pedido registrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
