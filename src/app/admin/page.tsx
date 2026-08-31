import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminMetrics, listAllOrders, listAllSubscriptions, listProducts } from "@/lib/queries";
import { formatBRL } from "@/lib/types";

export default async function AdminHome() {
  await requireAdmin();
  const m = adminMetrics();
  const orders = listAllOrders();
  const subs = listAllSubscriptions();
  const products = listProducts({ includeInactive: true });

  // vendas dos últimos 6 meses (para o mini gráfico)
  const months: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const total = orders
      .filter((o) => o.createdAt.startsWith(key) && o.status !== "cancelado")
      .reduce((s, o) => s + o.totalCents, 0);
    months.push({ label: d.toLocaleDateString("pt-BR", { month: "short" }), total });
  }
  const max = Math.max(1, ...months.map((x) => x.total));

  const cards = [
    { label: "Receita acumulada", value: formatBRL(m.revenueCents), hint: `${m.orders} pedidos` },
    { label: "MRR das assinaturas", value: formatBRL(m.mrrCents), hint: `${m.activeSubscriptions} assinantes ativos` },
    { label: "Clientes cadastrados", value: String(m.customers), hint: "contas na área do cliente" },
    { label: "Produtos com estoque baixo", value: String(m.lowStock), hint: "menos de 80 pacotes" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-areia-200 bg-white p-5">
            <p className="text-xs text-forest-500">{c.label}</p>
            <p className="mt-1.5 font-display text-2xl text-forest-900">{c.value}</p>
            <p className="mt-1 text-[11px] text-forest-500">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-4xl border border-areia-200 bg-white p-6">
          <h2 className="font-display text-lg text-forest-900">Vendas nos últimos 6 meses</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {months.map((mo) => (
              <div key={mo.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-forest-500">{mo.total > 0 ? formatBRL(mo.total) : ""}</span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-forest-800 to-forest-600 transition-all"
                  style={{ height: `${Math.max(4, (mo.total / max) * 100)}%` }}
                />
                <span className="text-[11px] capitalize text-forest-600">{mo.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-areia-200 bg-white p-6">
          <h2 className="font-display text-lg text-forest-900">Atalhos rápidos</h2>
          <div className="mt-4 grid gap-2.5">
            <Link href="/admin/produtos/novo" className="btn btn-primary justify-start px-5 py-3 text-sm">
              + Cadastrar novo café
            </Link>
            <Link href="/admin/blog/novo" className="btn btn-secondary justify-start px-5 py-3 text-sm">
              + Publicar artigo no blog
            </Link>
            <a href="/api/admin/export?tipo=pedidos" className="btn btn-ghost justify-start px-5 py-3 text-sm">
              ↓ Exportar pedidos (CSV)
            </a>
            <a href="/api/admin/export?tipo=assinantes" className="btn btn-ghost justify-start px-5 py-3 text-sm">
              ↓ Exportar assinantes (CSV)
            </a>
          </div>
          {m.unreadMessages > 0 && (
            <Link
              href="/admin/mensagens"
              className="mt-4 block rounded-2xl bg-terracota-100 px-4 py-3 text-sm text-terracota-700"
            >
              Você tem {m.unreadMessages} mensagem(ns) sem resposta →
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-4xl border border-areia-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-forest-900">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-terracota-600 underline">
              ver todos
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-areia-100 text-sm">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-forest-900">{o.code}</p>
                  <p className="truncate text-xs text-forest-500">{o.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-forest-900">{formatBRL(o.totalCents)}</p>
                  <p className="text-xs text-forest-500">{o.status}</p>
                </div>
              </li>
            ))}
            {orders.length === 0 && <li className="py-3 text-forest-500">Nenhum pedido ainda.</li>}
          </ul>
        </div>

        <div className="rounded-4xl border border-areia-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-forest-900">Estoque crítico</h2>
            <Link href="/admin/produtos" className="text-xs text-terracota-600 underline">
              gerenciar
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-areia-100 text-sm">
            {products
              .slice()
              .sort((a, b) => a.stock - b.stock)
              .slice(0, 5)
              .map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="truncate text-forest-900">{p.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.stock < 40 ? "bg-terracota-100 text-terracota-700" : "bg-areia-100 text-forest-700"
                    }`}
                  >
                    {p.stock} un.
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-4 text-xs text-forest-500">
            {subs.filter((s) => s.status === "ativa").length} assinaturas ativas gerando reposição automática.
          </p>
        </div>
      </div>
    </div>
  );
}
