"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 280) + 20;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  return (
    <div className="relative">
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Anterior"
          className="grid size-11 place-items-center rounded-full border border-forest-800/20 text-forest-800 transition hover:bg-forest-800 hover:text-areia-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest-800"
        >
          ←
        </button>
        <button
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Próximo"
          className="grid size-11 place-items-center rounded-full border border-forest-800/20 text-forest-800 transition hover:bg-forest-800 hover:text-areia-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest-800"
        >
          →
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
      >
        {products.map((p) => (
          <div
            key={p.id}
            data-card
            className="w-[76vw] shrink-0 snap-start sm:w-[46vw] md:w-[300px] lg:w-[302px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
