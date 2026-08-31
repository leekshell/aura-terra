"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatBRL, METHODS, priceForWeight, ROASTS, type Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const roast = ROASTS.find((r) => r.value === product.roast)?.label ?? "";

  function quickAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      weight: "250g",
      grind: product.methods[0] ?? "graos",
      quantity: 1,
      unitPriceCents: product.priceCents,
      kind: "avulsa",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-areia-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-38px_rgba(26,54,38,.55)] ${
        compact ? "" : ""
      }`}
    >
      <Link href={`/loja/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-areia-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 300px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-forest-800/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-areia-100">
            {product.badge}
          </span>
        )}
        {product.stock <= 30 && (
          <span className="absolute right-3 top-3 rounded-full bg-terracota-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Últimos {product.stock}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] text-forest-500">
          <span className="truncate">{product.origin}</span>
          <span className="flex items-center gap-1 text-terracota-600">
            ★ {product.rating.toFixed(1)}
            <span className="text-forest-400">({product.reviewsCount})</span>
          </span>
        </div>

        <h3 className="mt-1.5 text-lg leading-snug text-forest-900">
          <Link href={`/loja/${product.slug}`} className="hover:text-terracota-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-forest-600">{roast} · SCA {product.score}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.notes.slice(0, 3).map((n) => (
            <span key={n} className="rounded-full bg-areia-100 px-2.5 py-1 text-[11px] text-forest-700">
              {n}
            </span>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-forest-500">
          Moagens: {product.methods.map((m) => METHODS.find((x) => x.value === m)?.short).join(" · ")}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {product.compareAtCents && (
              <span className="mr-1.5 text-xs text-forest-400 line-through">
                {formatBRL(product.compareAtCents)}
              </span>
            )}
            <span className="text-lg font-semibold text-forest-900">
              {formatBRL(priceForWeight(product.priceCents, "250g"))}
            </span>
            <span className="text-xs text-forest-500"> /250g</span>
          </div>
          <button
            onClick={quickAdd}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
              added ? "bg-forest-600 text-white" : "bg-forest-800 text-areia-100 hover:bg-terracota-500"
            }`}
          >
            {added ? "Adicionado ✓" : "Comprar"}
          </button>
        </div>
      </div>
    </article>
  );
}
