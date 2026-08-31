"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteProduct, toggleProductActive, updateStock } from "@/app/actions/admin";
import { formatBRL, type Product } from "@/lib/types";

export function AdminProductRow({ product }: { product: Product }) {
  const [stock, setStock] = useState(product.stock);
  const [active, setActive] = useState(product.active);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <tr className="border-b border-areia-100 last:border-0">
      <td className="py-3 pr-3">
        <Link href={`/admin/produtos/${product.id}`} className="font-medium text-forest-900 hover:text-terracota-600">
          {product.name}
        </Link>
        <p className="text-xs text-forest-500">
          {product.roast} · {product.origin}
        </p>
      </td>
      <td className="py-3 pr-3 text-sm text-forest-700">{formatBRL(product.priceCents)}</td>
      <td className="py-3 pr-3">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-20 rounded-lg border border-areia-300 px-2 py-1.5 text-sm"
            aria-label={`Estoque de ${product.name}`}
          />
          <button
            disabled={pending || stock === product.stock}
            onClick={() =>
              start(async () => {
                await updateStock(product.id, stock);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              })
            }
            className="rounded-lg bg-forest-800 px-2.5 py-1.5 text-xs text-areia-100 disabled:opacity-30"
          >
            {saved ? "✓" : "salvar"}
          </button>
        </div>
      </td>
      <td className="py-3 pr-3">
        <button
          onClick={() =>
            start(async () => {
              await toggleProductActive(product.id, !active);
              setActive(!active);
            })
          }
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            active ? "bg-forest-100 text-forest-800" : "bg-areia-200 text-forest-500"
          }`}
        >
          {active ? "Publicado" : "Rascunho"}
        </button>
      </td>
      <td className="py-3 text-right">
        <Link href={`/admin/produtos/${product.id}`} className="text-xs text-terracota-600 underline">
          editar
        </Link>
        <button
          onClick={() => {
            if (confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) {
              start(() => deleteProduct(product.id).then(() => undefined));
            }
          }}
          className="ml-3 text-xs text-forest-500 underline hover:text-terracota-600"
        >
          excluir
        </button>
      </td>
    </tr>
  );
}
