import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getPostBySlug, listPosts } from "@/lib/queries";

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover }],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = listPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const date = new Date(post.publishedAt.replace(" ", "T")).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover,
            datePublished: post.publishedAt,
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: "Aura Terra" },
          }),
        }}
      />

      <article className="container-aura py-10 md:py-14">
        <nav className="mb-6 text-xs text-forest-500">
          <Link href="/blog" className="hover:text-forest-800">
            ← Diário do Café
          </Link>
        </nav>

        <header className="mx-auto max-w-3xl">
          <span className="eyebrow text-terracota-600">{post.category}</span>
          <h1 className="mt-3 font-display text-3xl leading-tight text-forest-900 md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-forest-600">{post.excerpt}</p>
          <p className="mt-5 text-xs text-forest-500">
            Por {post.author} · {date} · {post.readMinutes} min de leitura
          </p>
        </header>

        <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-4xl bg-areia-200">
          <Image src={post.cover} alt={post.title} fill priority sizes="(max-width: 1024px) 95vw, 900px" className="object-cover" />
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Markdown content={post.content} />

          <div className="mt-12 rounded-4xl bg-forest-800 p-7 text-areia-100 md:p-9">
            <p className="eyebrow text-terracota-300">Coloque em prática</p>
            <h2 className="mt-2 font-display text-2xl">Escolha um microlote fresco para testar hoje</h2>
            <p className="mt-2 text-sm text-areia-100/75">
              Torramos duas vezes por semana e moemos na granulometria do seu método no dia do envio.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/loja" className="btn btn-primary">
                Ver os cafés
              </Link>
              <Link href="/assinatura" className="btn border border-areia-100/35 text-areia-100 hover:bg-areia-100/10">
                Assinar o clube
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-areia-50 py-14">
        <div className="container-aura">
          <h2 className="mb-6 text-2xl text-forest-900">Continue lendo</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group rounded-3xl border border-areia-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="eyebrow text-terracota-600">{p.category}</span>
                <h3 className="mt-2 text-base leading-snug text-forest-900 group-hover:text-terracota-600">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-forest-600">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
