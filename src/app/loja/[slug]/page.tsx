import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlavorProfileChart } from "@/components/flavor-chart";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getProductBySlug, listProducts } from "@/lib/queries";
import { formatBRL, PROFILES, ROASTS } from "@/lib/types";

export function generateStaticParams() {
  return listProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Café não encontrado" };
  return {
    title: `${product.name} · ${product.subtitle}`,
    description: product.description.slice(0, 165),
    alternates: { canonical: `/loja/${product.slug}` },
    openGraph: {
      title: `${product.name} · Aura Terra`,
      description: product.description.slice(0, 165),
      images: [{ url: product.image }],
      type: "website",
    },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const related = listProducts()
    .filter((p) => p.id !== product.id && (p.roast === product.roast || p.profiles.some((x) => product.profiles.includes(x))))
    .slice(0, 3);

  const roast = ROASTS.find((r) => r.value === product.roast);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description,
            brand: { "@type": "Brand", name: "Aura Terra" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewsCount,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: (product.priceCents / 100).toFixed(2),
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      <div className="container-aura py-6">
        <nav aria-label="Você está aqui" className="text-xs text-forest-500">
          <Link href="/" className="hover:text-forest-800">
            Início
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/loja" className="hover:text-forest-800">
            Loja
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-forest-800">{product.name}</span>
        </nav>
      </div>

      <section className="container-aura grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-4xl bg-areia-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 560px"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-forest-800/95 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-areia-100">
                {product.badge}
              </span>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              ["Altitude", product.altitude],
              ["Processo", product.process],
              ["Variedade", product.variety],
              ["Pontuação", `${product.score} SCA`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-areia-200 bg-white px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-wider text-forest-500">{k}</dt>
                <dd className="mt-0.5 text-xs font-medium text-forest-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-forest-100 px-3 py-1 font-medium text-forest-800">{roast?.label}</span>
            {product.profiles.map((p) => (
              <span key={p} className="rounded-full bg-terracota-100 px-3 py-1 font-medium text-terracota-700">
                {PROFILES.find((x) => x.value === p)?.label}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-900 md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-forest-600">{product.subtitle}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-terracota-500">{"★".repeat(Math.round(product.rating))}</span>
            <span className="text-forest-600">
              {product.rating.toFixed(1)} · {product.reviewsCount} avaliações
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-forest-700">{product.description}</p>

          <div className="mt-6 rounded-3xl bg-areia-50 p-5">
            <p className="eyebrow text-terracota-600">Notas de degustação</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.notes.map((n) => (
                <span key={n} className="rounded-full border border-areia-300 bg-white px-3.5 py-1.5 text-sm text-forest-800">
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <p className="eyebrow mb-3 text-terracota-600">Gráfico de perfil de sabor</p>
              <FlavorProfileChart flavor={product.flavor} accent={product.accent} />
            </div>
          </div>

          <div className="mt-8">
            <ProductBuyBox product={product} />
          </div>

          <div className="mt-8 rounded-3xl border border-areia-200 bg-white p-6">
            <p className="eyebrow text-terracota-600">Origem e produtor</p>
            <h2 className="mt-2 text-xl text-forest-900">{product.farm}</h2>
            <p className="mt-1 text-sm text-forest-600">
              {product.producer} · {product.origin}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-forest-700">{product.story}</p>
            <Link href="/sobre#jornada" className="mt-4 inline-block text-sm font-medium text-terracota-600 underline underline-offset-4">
              Ver a jornada completa do grão →
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-areia-50 py-16">
          <div className="container-aura">
            <Reveal className="mb-7">
              <span className="eyebrow text-terracota-600">Combina com o seu paladar</span>
              <h2 className="mt-2 text-2xl text-forest-900 md:text-3xl">Quem levou este, também gostou</h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-aura py-14">
        <div className="rounded-4xl bg-forest-800 p-8 text-areia-100 md:p-12">
          <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl">
                Prefira receber {product.name} todo mês, sempre fresco
              </h2>
              <p className="mt-3 text-sm text-areia-100/75">
                Assinantes economizam 10% em todos os lotes, têm frete grátis e podem trocar o café a qualquer
                momento. A partir de {formatBRL(Math.round((product.priceCents * 0.9) / 100) * 100)} por entrega.
              </p>
            </div>
            <Link href="/assinatura" className="btn btn-primary md:justify-self-end">
              Conhecer o Clube Aura
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
