import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { listProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Loja · Cafés especiais orgânicos por torra, perfil e moagem",
  description:
    "Catálogo completo de microlotes Aura Terra. Filtre por tipo de torra, perfil sensorial e método de preparo. Torra sob demanda e entrega em todo o Brasil.",
  alternates: { canonical: "/loja" },
};

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ torra?: string; perfil?: string; metodo?: string }>;
}) {
  const products = listProducts();
  const initial = await searchParams;

  return (
    <>
      <section className="border-b border-areia-200 bg-areia-50">
        <div className="container-aura py-12 md:py-16">
          <span className="eyebrow text-terracota-600">Loja Aura Terra</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-forest-900 md:text-5xl">
            Microlotes torrados na semana do seu pedido
          </h1>
          <p className="mt-4 max-w-xl text-forest-600">
            Todos os cafés são orgânicos certificados, rastreáveis até o produtor e moídos no ponto do seu método
            no dia do envio.
          </p>
        </div>
      </section>

      <section className="container-aura py-10 md:py-14">
        <ShopCatalog products={products} initial={initial} />
      </section>
    </>
  );
}
