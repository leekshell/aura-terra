import Link from "next/link";
import { notFound } from "next/navigation";
import { savePost } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { listPosts } from "@/lib/queries";

const COVERS = [
  "/images/blog/metodos-extracao.jpg",
  "/images/blog/produtores.jpg",
  "/images/marca/hero.jpg",
];

const CATEGORIES = ["Métodos de Extração", "Produtores", "Sustentabilidade", "Guias", "Receitas"];

export default async function PostEditor({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "novo";
  const post = isNew ? null : listPosts({ includeDrafts: true }).find((p) => p.id === id) ?? null;
  if (!isNew && !post) notFound();

  return (
    <form action={savePost} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-forest-900">{isNew ? "Novo artigo" : "Editar artigo"}</h2>
        <div className="flex gap-2">
          <Link href="/admin/blog" className="btn btn-ghost px-4 py-2.5 text-xs">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary px-5 py-2.5 text-sm">
            Salvar artigo
          </button>
        </div>
      </div>

      <section className="grid gap-4 rounded-4xl border border-areia-200 bg-white p-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Título</span>
          <input name="title" defaultValue={post?.title} required className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Slug (URL)</span>
          <input name="slug" defaultValue={post?.slug} placeholder="gerado automaticamente" className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Categoria</span>
          <select name="category" defaultValue={post?.category ?? CATEGORIES[0]} className="field">
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Resumo (aparece na listagem e no Google)</span>
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className="field resize-y" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Autor</span>
          <input name="author" defaultValue={post?.author ?? "Equipe Aura Terra"} className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Tempo de leitura (min)</span>
          <input name="readMinutes" type="number" min={1} defaultValue={post?.readMinutes ?? 5} className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Imagem de capa</span>
          <select name="cover" defaultValue={post?.cover ?? COVERS[0]} className="field">
            {COVERS.map((c) => (
              <option key={c} value={c}>
                {c.split("/").pop()}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">Data de publicação</span>
          <input
            name="publishedAt"
            type="date"
            defaultValue={(post?.publishedAt ?? new Date().toISOString()).slice(0, 10)}
            className="field"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-forest-700 sm:col-span-2">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} />
          Publicar imediatamente
        </label>
      </section>

      <section className="rounded-4xl border border-areia-200 bg-white p-6">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-forest-700">
            Conteúdo (Markdown: ## título, - lista, &gt; citação, **negrito**)
          </span>
          <textarea
            name="content"
            rows={20}
            defaultValue={post?.content}
            className="field resize-y font-mono text-sm leading-relaxed"
            placeholder={"## Subtítulo\n\nTexto do artigo...\n\n- item\n- item"}
          />
        </label>
      </section>

      <div className="flex justify-end gap-2">
        <Link href="/admin/blog" className="btn btn-ghost px-5 py-2.5 text-sm">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary px-6 py-2.5 text-sm">
          Salvar artigo
        </button>
      </div>
    </form>
  );
}
