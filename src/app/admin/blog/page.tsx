import Link from "next/link";
import { AdminPostRow } from "@/components/admin-post-row";
import { requireAdmin } from "@/lib/auth";
import { listPosts } from "@/lib/queries";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const posts = listPosts({ includeDrafts: true });
  const { ok } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest-900">Diário do Café</h2>
          <p className="text-sm text-forest-600">{posts.length} artigos · escreva em Markdown simples.</p>
        </div>
        <Link href="/admin/blog/novo" className="btn btn-primary px-5 py-2.5 text-sm">
          + Novo artigo
        </Link>
      </div>

      {ok && <p className="rounded-2xl bg-forest-100 px-4 py-3 text-sm text-forest-800">Artigo salvo com sucesso.</p>}

      <div className="overflow-x-auto rounded-4xl border border-areia-200 bg-white p-5">
        <table className="w-full min-w-[620px] text-left">
          <thead>
            <tr className="border-b border-areia-200 text-[11px] uppercase tracking-wider text-forest-500">
              <th className="pb-3 pr-3 font-semibold">Artigo</th>
              <th className="pb-3 pr-3 font-semibold">Publicação</th>
              <th className="pb-3 pr-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <AdminPostRow key={p.id} post={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
