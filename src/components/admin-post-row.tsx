"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost, togglePostPublished } from "@/app/actions/admin";
import type { Post } from "@/lib/types";

export function AdminPostRow({ post }: { post: Post }) {
  const [pending, start] = useTransition();

  return (
    <tr className="border-b border-areia-100 last:border-0">
      <td className="py-3 pr-3">
        <Link href={`/admin/blog/${post.id}`} className="font-medium text-forest-900 hover:text-terracota-600">
          {post.title}
        </Link>
        <p className="text-xs text-forest-500">
          {post.category} · {post.author}
        </p>
      </td>
      <td className="py-3 pr-3 text-sm text-forest-700">
        {new Date(post.publishedAt.replace(" ", "T")).toLocaleDateString("pt-BR")}
      </td>
      <td className="py-3 pr-3">
        <button
          disabled={pending}
          onClick={() => start(() => togglePostPublished(post.id, !post.published).then(() => undefined))}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            post.published ? "bg-forest-100 text-forest-800" : "bg-areia-200 text-forest-500"
          }`}
        >
          {post.published ? "Publicado" : "Rascunho"}
        </button>
      </td>
      <td className="py-3 text-right text-xs">
        <Link href={`/blog/${post.slug}`} className="text-forest-500 underline">
          ver
        </Link>
        <Link href={`/admin/blog/${post.id}`} className="ml-3 text-terracota-600 underline">
          editar
        </Link>
        <button
          onClick={() => {
            if (confirm(`Excluir o artigo "${post.title}"?`)) {
              start(() => deletePost(post.id).then(() => undefined));
            }
          }}
          className="ml-3 text-forest-500 underline hover:text-terracota-600"
        >
          excluir
        </button>
      </td>
    </tr>
  );
}
