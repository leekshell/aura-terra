import Link from "next/link";
import { AdminProductRow } from "@/components/admin-product-row";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/queries";

export default async function AdminProdutos({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const products = listProducts({ includeInactive: true });
  const { ok } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest-900">Produtos e estoque</h2>
          <p className="text-sm text-forest-600">Edite preços, estoque e publicação sem tocar em código.</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary px-5 py-2.5 text-sm">
          + Novo café
        </Link>
      </div>

      {ok && (
        <p className="rounded-2xl bg-forest-100 px-4 py-3 text-sm text-forest-800">Produto salvo com sucesso.</p>
      )}

      <div className="overflow-x-auto rounded-4xl border border-areia-200 bg-white p-5">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-areia-200 text-[11px] uppercase tracking-wider text-forest-500">
              <th className="pb-3 pr-3 font-semibold">Produto</th>
              <th className="pb-3 pr-3 font-semibold">Preço 250g</th>
              <th className="pb-3 pr-3 font-semibold">Estoque</th>
              <th className="pb-3 pr-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <AdminProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
