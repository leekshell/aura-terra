"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { METHODS, PROFILES, ROASTS, type BrewMethod, type Product, type Roast, type SensoryProfile } from "@/lib/types";

type Sort = "relevancia" | "menor-preco" | "maior-preco" | "nota";

const SORTS: { value: Sort; label: string }[] = [
  { value: "relevancia", label: "Mais relevantes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "nota", label: "Maior pontuação SCA" },
];

export function ShopCatalog({
  products,
  initial,
}: {
  products: Product[];
  initial: { torra?: string; perfil?: string; metodo?: string };
}) {
  const [roasts, setRoasts] = useState<Roast[]>(initial.torra ? [initial.torra as Roast] : []);
  const [profiles, setProfiles] = useState<SensoryProfile[]>(
    initial.perfil ? [initial.perfil as SensoryProfile] : [],
  );
  const [methods, setMethods] = useState<BrewMethod[]>(initial.metodo ? [initial.metodo as BrewMethod] : []);
  const [sort, setSort] = useState<Sort>("relevancia");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (roasts.length) params.set("torra", roasts.join(","));
    if (profiles.length) params.set("perfil", profiles.join(","));
    if (methods.length) params.set("metodo", methods.join(","));
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/loja?${qs}` : "/loja");
  }, [roasts, profiles, methods]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (roasts.length && !roasts.includes(p.roast)) return false;
      if (profiles.length && !profiles.some((x) => p.profiles.includes(x))) return false;
      if (methods.length && !methods.some((x) => p.methods.includes(x))) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.origin} ${p.notes.join(" ")} ${p.producer}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list];
    if (sort === "menor-preco") list.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "maior-preco") list.sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "nota") list.sort((a, b) => b.score - a.score);
    return list;
  }, [products, roasts, profiles, methods, query, sort]);

  const activeCount = roasts.length + profiles.length + methods.length;

  function toggle<T>(list: T[], setList: (v: T[]) => void, value: T) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const filtersUI = (
    <div className="space-y-7">
      <FilterGroup title="Tipo de torra">
        {ROASTS.map((r) => (
          <Chip key={r.value} active={roasts.includes(r.value)} onClick={() => toggle(roasts, setRoasts, r.value)}>
            {r.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Perfil sensorial">
        {PROFILES.map((p) => (
          <Chip
            key={p.value}
            active={profiles.includes(p.value)}
            onClick={() => toggle(profiles, setProfiles, p.value)}
          >
            {p.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Método / moagem">
        {METHODS.map((m) => (
          <Chip key={m.value} active={methods.includes(m.value)} onClick={() => toggle(methods, setMethods, m.value)}>
            {m.label}
          </Chip>
        ))}
      </FilterGroup>

      {activeCount > 0 && (
        <button
          onClick={() => {
            setRoasts([]);
            setProfiles([]);
            setMethods([]);
          }}
          className="text-xs font-medium text-terracota-600 underline underline-offset-4"
        >
          Limpar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filtersUI}</div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, origem ou nota sensorial…"
              aria-label="Buscar cafés"
              className="field pl-10"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500">⌕</span>
          </div>

          <button onClick={() => setDrawer(true)} className="btn btn-ghost lg:hidden">
            Filtros {activeCount > 0 && `(${activeCount})`}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Ordenar por"
            className="field w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-5 text-sm text-forest-600">
          {filtered.length} {filtered.length === 1 ? "café encontrado" : "cafés encontrados"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-areia-300 bg-white/60 p-12 text-center">
            <p className="font-display text-xl text-forest-900">Nenhum café com essa combinação</p>
            <p className="mt-2 text-sm text-forest-600">
              Tente remover um filtro — ou fale com um barista pelo WhatsApp que a gente indica.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${drawer ? "" : "pointer-events-none"}`}
        aria-hidden={!drawer}
      >
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-forest-950/40 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-4xl bg-areia-50 p-6 transition-transform duration-300 ${
            drawer ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl">Filtrar cafés</h2>
            <button onClick={() => setDrawer(false)} aria-label="Fechar filtros" className="text-2xl leading-none">
              ✕
            </button>
          </div>
          {filtersUI}
          <button onClick={() => setDrawer(false)} className="btn btn-primary mt-7 w-full">
            Ver {filtered.length} cafés
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-forest-500">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
        active
          ? "border-forest-800 bg-forest-800 text-areia-100"
          : "border-areia-300 bg-white text-forest-700 hover:border-forest-600"
      }`}
    >
      {children}
    </button>
  );
}
