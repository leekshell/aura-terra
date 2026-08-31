"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-4xl border border-forest-100/40 bg-white/70 p-7 backdrop-blur md:p-12">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t) => (
            <figure key={t.id} className="w-full shrink-0 px-1">
              <div className="text-terracota-500" aria-label={`${t.rating} de 5 estrelas`}>
                {"★".repeat(t.rating)}
                <span className="text-areia-300">{"★".repeat(5 - t.rating)}</span>
              </div>
              <blockquote className="mt-4 font-display text-xl leading-snug text-forest-900 md:text-2xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-forest-800">{t.name}</span>
                <span className="text-forest-500"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {items.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setIndex(i)}
            aria-label={`Ver depoimento ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-terracota-500" : "w-2.5 bg-forest-800/20 hover:bg-forest-800/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
