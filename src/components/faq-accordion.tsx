"use client";

import { useState } from "react";
import type { Faq } from "@/lib/types";

export function slugifyCategory(c: string) {
  return c
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const visible = query.trim()
    ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(query.toLowerCase()))
    : faqs;

  return (
    <div>
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dúvida (ex.: prazo, moagem, pausar assinatura)"
          aria-label="Buscar nas dúvidas frequentes"
          className="field"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${slugifyCategory(c)}`}
              className="rounded-full border border-areia-300 bg-white px-3.5 py-2 text-xs font-medium text-forest-700 transition hover:border-forest-600"
            >
              {c}
            </a>
          ))}
        </div>
      </div>

      {categories.map((category) => {
        const items = visible.filter((f) => f.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} id={slugifyCategory(category)} className="mb-12 scroll-mt-28">
            <h2 className="mb-4 font-display text-2xl text-forest-900">{category}</h2>
            <ul className="space-y-2.5">
              {items.map((f) => {
                const open = openId === f.id;
                return (
                  <li key={f.id} className="overflow-hidden rounded-2xl border border-areia-200 bg-white">
                    <button
                      onClick={() => setOpenId(open ? null : f.id)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[0.95rem] font-medium text-forest-900">{f.question}</span>
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full border border-areia-300 text-forest-700 transition-transform duration-300 ${
                          open ? "rotate-45 border-terracota-500 text-terracota-600" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-forest-600">{f.answer}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {visible.length === 0 && (
        <p className="rounded-3xl border border-dashed border-areia-300 p-10 text-center text-sm text-forest-600">
          Não encontramos essa dúvida. Fale com a gente pelo WhatsApp ou em contato@auraterra.com.br.
        </p>
      )}
    </div>
  );
}
