import Link from "next/link";
import { notFound } from "next/navigation";
import { saveProduct } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/queries";
import { METHODS, PROFILES, ROASTS, type Product } from "@/lib/types";

const IMAGES = [
  "/images/produtos/aurora-cerrado.jpg",
  "/images/produtos/serra-mantiqueira.jpg",
  "/images/produtos/mata-atlantica.jpg",
  "/images/produtos/chapada-diamantina.jpg",
  "/images/produtos/espresso-vale.jpg",
  "/images/produtos/lua-nova.jpg",
  "/images/produtos/raizes-descafeinado.jpg",
];

export default async function ProdutoEditor({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "novo";
  const p: Product | null = isNew ? null : getProductById(id);
  if (!isNew && !p) notFound();

  const flavor = p?.flavor ?? { acidez: 5, corpo: 5, "doçura": 5, aroma: 5, intensidade: 5 };

  return (
    <form action={saveProduct} className="space-y-5">
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest-900">{isNew ? "Novo café" : `Editar ${p!.name}`}</h2>
          <p className="text-sm text-forest-600">Os campos abaixo alimentam a loja e a página do produto.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/produtos" className="btn btn-ghost px-4 py-2.5 text-xs">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary px-5 py-2.5 text-sm">
            Salvar produto
          </button>
        </div>
      </div>

      <section className="rounded-4xl border border-areia-200 bg-white p-6">
        <h3 className="mb-4 font-display text-lg text-forest-900">Informações básicas</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Nome do café" defaultValue={p?.name} required />
          <Field name="slug" label="Slug (URL)" defaultValue={p?.slug} placeholder="gerado automaticamente" />
          <Field name="subtitle" label="Subtítulo" defaultValue={p?.subtitle} className="sm:col-span-2" />
          <Area name="description" label="Descrição curta (vitrine e SEO)" defaultValue={p?.description} className="sm:col-span-2" />
          <Area name="story" label="História do lote" defaultValue={p?.story} className="sm:col-span-2" />
        </div>
      </section>

      <section className="rounded-4xl border border-areia-200 bg-white p-6">
        <h3 className="mb-4 font-display text-lg text-forest-900">Origem</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="origin" label="Região / origem" defaultValue={p?.origin} />
          <Field name="producer" label="Produtor" defaultValue={p?.producer} />
          <Field name="farm" label="Fazenda / sítio" defaultValue={p?.farm} />
          <Field name="altitude" label="Altitude" defaultValue={p?.altitude} />
          <Field name="process" label="Processo" defaultValue={p?.process} />
          <Field name="variety" label="Variedade" defaultValue={p?.variety} />
        </div>
      </section>

      <section className="rounded-4xl border border-areia-200 bg-white p-6">
        <h3 className="mb-4 font-display text-lg text-forest-900">Classificação sensorial</h3>
        <div className="grid gap-5">
          <div>
            <p className="mb-2 text-xs font-medium text-forest-700">Tipo de torra</p>
            <div className="flex flex-wrap gap-4">
              {ROASTS.map((r) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-forest-700">
                  <input type="radio" name="roast" value={r.value} defaultChecked={(p?.roast ?? "media") === r.value} />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-forest-700">Perfil sensorial</p>
            <div className="flex flex-wrap gap-4">
              {PROFILES.map((x) => (
                <label key={x.value} className="flex items-center gap-2 text-sm text-forest-700">
                  <input type="checkbox" name="profiles" value={x.value} defaultChecked={p?.profiles.includes(x.value)} />
                  {x.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-forest-700">Moagens disponíveis</p>
            <div className="flex flex-wrap gap-4">
              {METHODS.map((m) => (
                <label key={m.value} className="flex items-center gap-2 text-sm text-forest-700">
                  <input type="checkbox" name="methods" value={m.value} defaultChecked={p?.methods.includes(m.value)} />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          <Field
            name="notes"
            label="Notas de degustação (separadas por vírgula)"
            defaultValue={p?.notes.join(", ")}
            placeholder="Caramelo, Chocolate ao leite, Castanha"
          />

          <div className="grid gap-4 sm:grid-cols-5">
            {[
              ["acidez", "Acidez", flavor.acidez],
              ["corpo", "Corpo", flavor.corpo],
              ["docura", "Doçura", flavor["doçura"]],
              ["aroma", "Aroma", flavor.aroma],
              ["intensidade", "Intensidade", flavor.intensidade],
            ].map(([name, label, value]) => (
              <Field key={name as string} name={name as string} label={`${label} (0-10)`} type="number" step="0.5" defaultValue={String(value)} />
            ))}
          </div>

          <Field name="score" label="Pontuação SCA" type="number" step="0.5" defaultValue={String(p?.score ?? 84)} />
        </div>
      </section>

      <section className="rounded-4xl border border-areia-200 bg-white p-6">
        <h3 className="mb-4 font-display text-lg text-forest-900">Comercial</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            name="price"
            label="Preço base 250g (R$)"
            type="number"
            step="0.01"
            defaultValue={p ? (p.priceCents / 100).toFixed(2) : "49.00"}
            required
          />
          <Field
            name="compareAt"
            label="Preço 'de' (opcional)"
            type="number"
            step="0.01"
            defaultValue={p?.compareAtCents ? (p.compareAtCents / 100).toFixed(2) : ""}
          />
          <Field name="stock" label="Estoque (pacotes)" type="number" defaultValue={String(p?.stock ?? 0)} />
          <Field name="badge" label="Selo (ex.: Mais vendido)" defaultValue={p?.badge ?? ""} />
          <Field name="accent" label="Cor de destaque" type="color" defaultValue={p?.accent ?? "#1A3626"} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-forest-700">Imagem</span>
            <select name="image" defaultValue={p?.image ?? IMAGES[0]} className="field">
              {IMAGES.map((img) => (
                <option key={img} value={img}>
                  {img.split("/").pop()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-forest-700">
            <input type="checkbox" name="featured" defaultChecked={p?.featured ?? true} />
            Destacar na home
          </label>
          <label className="flex items-center gap-2 text-sm text-forest-700">
            <input type="checkbox" name="active" defaultChecked={p?.active ?? true} />
            Publicado na loja
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link href="/admin/produtos" className="btn btn-ghost px-5 py-2.5 text-sm">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary px-6 py-2.5 text-sm">
          Salvar produto
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  step,
  required,
  placeholder,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-forest-700">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="field"
      />
    </label>
  );
}

function Area({
  name,
  label,
  defaultValue,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-forest-700">{label}</span>
      <textarea name={name} rows={3} defaultValue={defaultValue ?? ""} className="field resize-y" />
    </label>
  );
}
