import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { listPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Diário do Café · Guias de extração, produtores e sustentabilidade",
  description:
    "Receitas de preparo, histórias dos produtores parceiros e dicas de sustentabilidade no blog da Aura Terra.",
  alternates: { canonical: "/blog" },
};

function formatDate(value: string) {
  return new Date(value.replace(" ", "T")).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const all = listPosts();
  const categories = Array.from(new Set(all.map((p) => p.category)));
  const posts = cat ? all.filter((p) => p.category === cat) : all;
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="border-b border-areia-200 bg-areia-50">
        <div className="container-aura py-12 md:py-16">
          <span className="eyebrow text-terracota-600">Diário do Café</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-forest-900 md:text-5xl">
            Conteúdo para extrair o melhor de cada grão
          </h1>
          <p className="mt-4 max-w-xl text-forest-600">
            Guias de preparo testados no nosso laboratório, histórias de quem planta e ideias práticas de
            sustentabilidade.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                !cat ? "border-forest-800 bg-forest-800 text-areia-100" : "border-areia-300 bg-white text-forest-700"
              }`}
            >
              Todos
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog?cat=${encodeURIComponent(c)}`}
                className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                  cat === c
                    ? "border-forest-800 bg-forest-800 text-areia-100"
                    : "border-areia-300 bg-white text-forest-700 hover:border-forest-600"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-aura py-12 md:py-16">
        {featured && (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-6 overflow-hidden rounded-4xl border border-areia-200 bg-white md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-areia-200 md:aspect-auto md:h-full">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <span className="eyebrow text-terracota-600">{featured.category}</span>
                <h2 className="mt-3 font-display text-2xl leading-snug text-forest-900 group-hover:text-terracota-600 md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 leading-relaxed text-forest-600">{featured.excerpt}</p>
                <p className="mt-5 text-xs text-forest-500">
                  {featured.author} · {formatDate(featured.publishedAt)} · {featured.readMinutes} min
                </p>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={i * 70} as="article">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-areia-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-40px_rgba(26,54,38,.5)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-areia-200">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 92vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="eyebrow text-terracota-600">{post.category}</span>
                  <h3 className="mt-2 text-lg leading-snug text-forest-900 group-hover:text-terracota-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-600">{post.excerpt}</p>
                  <p className="mt-auto pt-4 text-xs text-forest-500">
                    {formatDate(post.publishedAt)} · {post.readMinutes} min
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
