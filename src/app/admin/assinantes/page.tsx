import { requireAdmin } from "@/lib/auth";
import { listAllSubscriptions, listUsers } from "@/lib/queries";
import { formatBRL } from "@/lib/types";

export default async function AdminAssinantes() {
  await requireAdmin();
  const subs = listAllSubscriptions();
  const users = new Map(listUsers().map((u) => [u.id, u]));
  const mrr = subs.filter((s) => s.status === "ativa").reduce((s, x) => s + x.priceCents, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest-900">Assinantes</h2>
          <p className="text-sm text-forest-600">
            {subs.filter((s) => s.status === "ativa").length} ativos · MRR de {formatBRL(mrr)}
          </p>
        </div>
        <a href="/api/admin/export?tipo=assinantes" className="btn btn-ghost px-5 py-2.5 text-sm">
          ↓ Exportar CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-4xl border border-areia-200 bg-white p-5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-areia-200 text-[11px] uppercase tracking-wider text-forest-500">
              <th className="pb-3 pr-3 font-semibold">Cliente</th>
              <th className="pb-3 pr-3 font-semibold">Plano</th>
              <th className="pb-3 pr-3 font-semibold">Frequência</th>
              <th className="pb-3 pr-3 font-semibold">Moagem</th>
              <th className="pb-3 pr-3 font-semibold">Próxima entrega</th>
              <th className="pb-3 pr-3 font-semibold">Valor</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => {
              const u = users.get(s.userId);
              return (
                <tr key={s.id} className="border-b border-areia-100 last:border-0">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-forest-900">{u?.name ?? "—"}</p>
                    <p className="text-xs text-forest-500">{u?.email}</p>
                  </td>
                  <td className="py-3 pr-3 capitalize text-forest-700">{s.plan}</td>
                  <td className="py-3 pr-3 text-forest-700">{s.frequency}</td>
                  <td className="py-3 pr-3 text-forest-700">
                    {s.grind} · {s.weight}
                  </td>
                  <td className="py-3 pr-3 text-forest-700">
                    {new Date(s.nextDelivery).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 pr-3 font-medium text-forest-900">{formatBRL(s.priceCents)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        s.status === "ativa"
                          ? "bg-forest-100 text-forest-800"
                          : s.status === "pausada"
                            ? "bg-terracota-100 text-terracota-700"
                            : "bg-areia-200 text-forest-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {subs.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-forest-500">
                  Nenhuma assinatura ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
