import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { ProductCarousel } from "@/components/product-carousel";
import { Reveal } from "@/components/reveal";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { listFeaturedProducts, listPosts, listTestimonials } from "@/lib/queries";
import { formatBRL, IMPACT_METRICS, METHODS, PLANS } from "@/lib/types";

export default function HomePage() {
  const featured = listFeaturedProducts();
  const testimonials = listTestimonials();
  const posts = listPosts().slice(0, 3);

  return (
    <>
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative overflow-hidden bg-forest-800">
        <Image
          src="/images/marca/hero.jpg"
          alt="Lavoura agroecológica de café ao amanhecer"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-900/55 to-forest-800/90" />

        <div className="container-aura relative flex min-h-[86svh] flex-col justify-center py-20 md:min-h-[88vh] md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-areia-100/25 px-3.5 py-1.5 text-areia-100">
              <span className="size-1.5 rounded-full bg-terracota-500" />
              Safra 2026 · torra sob demanda
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] text-areia-100 sm:text-6xl lg:text-7xl">
              O café que <em className="not-italic text-terracota-300">devolve</em> mais do que tira da terra.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-areia-100/85 md:text-lg">
              Microlotes 100% orgânicos, comprados direto de 74 famílias agroecológicas e torrados na semana em
              que chegam à sua casa. Rastreabilidade do pé à xícara — e carbono neutralizado no caminho.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/loja" className="btn btn-primary">
                Conheça nossos Cafés
              </Link>
              <Link
                href="/assinatura"
                className="btn border border-areia-100/35 text-areia-100 hover:bg-areia-100 hover:text-forest-800"
              >
                Clube de Assinatura
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-areia-100/20 pt-6">
              {[
                { k: "74", v: "produtores parceiros" },
                { k: "48h", v: "da torra ao envio" },
                { k: "4,9", v: "média de avaliação" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl text-areia-100 md:text-3xl">{s.k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-wider text-areia-100/60">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* --------------------------- SELOS / TRUST --------------------------- */}
      <section aria-label="Selos e garantias" className="border-b border-areia-200 bg-areia-50">
        <div className="container-aura grid grid-cols-2 gap-y-5 py-6 text-center text-[11px] font-medium uppercase tracking-wider text-forest-600 md:grid-cols-4 md:text-xs">
          <span>🌱 Certificado orgânico IBD</span>
          <span>🤝 Comércio direto e justo</span>
          <span>♻️ Carbono neutralizado</span>
          <span>☕ Garantia xícara cheia</span>
        </div>
      </section>

      {/* ----------------------------- MANIFESTO ----------------------------- */}
      <section className="container-aura py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="eyebrow text-terracota-600">Manifesto da marca</span>
            <h2 className="mt-4 text-3xl leading-tight text-forest-900 md:text-[2.75rem]">
              Não existe café bom em terra doente.
            </h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-forest-700">
              <p>
                A Aura Terra nasceu de uma inconformidade: o Brasil é o maior exportador de café do mundo e, ainda
                assim, quem planta costuma receber menos do que gasta. Decidimos comprar direto, pagar acima do
                mercado e só trabalhar com lavouras <strong>100% orgânicas e agroecológicas</strong>.
              </p>
              <p>
                Isso significa nenhum agrotóxico, sombreamento com espécies nativas, nascentes protegidas e solo
                vivo. Significa também café mais complexo na xícara — porque planta bem alimentada produz grão com
                mais açúcar e mais aroma.
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Compra direta", "Contrato antes da colheita, preço acima da saca."],
                ["Torra sob demanda", "Duas torras por semana, nunca estoque velho."],
                ["Rastreabilidade total", "Produtor, altitude e processo em cada pacote."],
                ["Embalagem compostável", "Kraft com barreira vegetal e válvula reciclável."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-2xl border border-areia-200 bg-white p-4">
                  <p className="text-sm font-semibold text-forest-900">{t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-forest-600">{d}</p>
                </li>
              ))}
            </ul>

            <Link href="/sobre" className="btn btn-ghost mt-8">
              Conheça a nossa terra →
            </Link>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-4xl">
              <Image
                src="/images/blog/produtores.jpg"
                alt="Produtores parceiros segurando cerejas de café colhidas"
                fill
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-2 max-w-[15rem] rounded-3xl bg-forest-800 p-5 text-areia-100 shadow-xl md:left-auto md:-right-6">
              <p className="font-display text-3xl">38%</p>
              <p className="mt-1 text-xs leading-relaxed text-areia-100/75">
                é quanto pagamos, em média, acima da cotação da saca aos nossos produtores.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- DESTAQUES LOJA -------------------------- */}
      <section className="bg-areia-50 py-20 md:py-24">
        <div className="container-aura">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-terracota-600">Destaques da loja</span>
              <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">Os mais amados desta safra</h2>
              <p className="mt-2 max-w-md text-sm text-forest-600">
                Escolha o peso e a moagem ideal — moemos no dia do envio, com a granulometria do seu método.
              </p>
            </div>
            <Link href="/loja" className="btn btn-ghost">
              Ver catálogo completo
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <ProductCarousel products={featured} />
          </Reveal>

          <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-forest-600">Moagens disponíveis:</span>
            {METHODS.map((m) => (
              <Link
                key={m.value}
                href={`/loja?metodo=${m.value}`}
                className="rounded-full border border-areia-300 bg-white px-3.5 py-1.5 text-xs text-forest-700 transition hover:border-terracota-500 hover:text-terracota-600"
              >
                {m.label}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* --------------------------- CLUBE ASSINATURA ------------------------ */}
      <section className="container-aura py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-terracota-600">Clube de Assinatura Aura</span>
          <h2 className="mt-3 text-3xl text-forest-900 md:text-[2.6rem]">Café fresco chegando todo mês</h2>
          <p className="mt-4 text-forest-600">
            Você escolhe o plano, a moagem e a frequência. Nós selecionamos os microlotes da safra, torramos na
            semana do envio e entregamos com ficha de degustação. Pause, adie ou cancele quando quiser.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 90}>
              <div
                className={`flex h-full flex-col rounded-4xl border p-7 transition-all duration-500 hover:-translate-y-1.5 ${
                  plan.highlight
                    ? "border-forest-800 bg-forest-800 text-areia-100 shadow-[0_30px_70px_-40px_rgba(26,54,38,.9)]"
                    : "border-areia-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 w-fit rounded-full bg-terracota-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Mais escolhido
                  </span>
                )}
                <h3 className={`text-2xl ${plan.highlight ? "text-areia-100" : "text-forest-900"}`}>{plan.name}</h3>
                <p className={`mt-1 text-xs ${plan.highlight ? "text-areia-100/70" : "text-forest-500"}`}>
                  {plan.bags}
                </p>
                <p className="mt-5 font-display text-4xl">
                  {formatBRL(plan.priceCents)}
                  <span className={`text-sm font-sans ${plan.highlight ? "text-areia-100/60" : "text-forest-500"}`}>
                    /mês
                  </span>
                </p>
                <p className={`mt-3 text-sm leading-relaxed ${plan.highlight ? "text-areia-100/80" : "text-forest-600"}`}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex gap-2.5">
                      <span className={plan.highlight ? "text-terracota-300" : "text-terracota-500"}>✓</span>
                      <span className={plan.highlight ? "text-areia-100/85" : "text-forest-700"}>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/assinatura?plano=${plan.id}`}
                  className={`btn mt-8 w-full ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  Assinar {plan.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10 grid gap-4 rounded-4xl bg-areia-50 p-7 sm:grid-cols-4 md:p-9">
          {[
            ["1", "Escolha o plano", "Descobridor, Explorador ou Colecionador."],
            ["2", "Defina a moagem", "Grãos, prensa, espresso ou filtro."],
            ["3", "Receba fresquinho", "Torrado há no máximo 5 dias."],
            ["4", "Ajuste quando quiser", "Pause, adie ou troque no painel."],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-800 text-sm font-semibold text-areia-100">
                {n}
              </span>
              <div>
                <p className="text-sm font-semibold text-forest-900">{t}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-forest-600">{d}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ------------------------ MÉTRICAS DE IMPACTO ------------------------ */}
      <section className="bg-forest-800 py-20 text-areia-100 md:py-24">
        <div className="container-aura">
          <Reveal className="max-w-2xl">
            <span className="eyebrow text-terracota-300">Métricas de impacto</span>
            <h2 className="mt-3 text-3xl text-areia-100 md:text-4xl">
              Números auditados da safra 2025/2026
            </h2>
            <p className="mt-3 text-sm text-areia-100/70">
              Publicamos nosso relatório de impacto todo mês de março, com verificação independente do Instituto
              Terra Viva.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 90}>
                <div className="border-t border-areia-100/20 pt-5">
                  <p className="font-display text-4xl text-terracota-300 md:text-5xl">
                    <CountUp value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-3 text-sm font-semibold text-areia-100">{m.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-areia-100/60">{m.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- DEPOIMENTOS ---------------------------- */}
      <section className="container-aura py-20 md:py-28">
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <span className="eyebrow text-terracota-600">Depoimentos &amp; avaliações</span>
          <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">Quem já mudou o café da manhã</h2>
          <p className="mt-3 text-sm text-forest-600">
            4,9 de 5 em 1.284 avaliações verificadas de clientes, baristas e Q-Graders.
          </p>
        </Reveal>
        <Reveal delay={80} className="mx-auto max-w-3xl">
          <TestimonialsCarousel items={testimonials} />
        </Reveal>
      </section>

      {/* ------------------------------ BLOG ------------------------------- */}
      <section className="bg-areia-50 py-20 md:py-24">
        <div className="container-aura">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-terracota-600">Diário do Café</span>
              <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">Aprenda a extrair o melhor</h2>
            </div>
            <Link href="/blog" className="btn btn-ghost">
              Todos os artigos
            </Link>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 90} as="article">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-areia-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-40px_rgba(26,54,38,.5)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-areia-200">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="eyebrow text-terracota-600">{post.category}</span>
                    <h3 className="mt-2 text-lg leading-snug text-forest-900 group-hover:text-terracota-600">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-600">{post.excerpt}</p>
                    <p className="mt-auto pt-4 text-xs text-forest-500">{post.readMinutes} min de leitura</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- CTA -------------------------------- */}
      <section className="container-aura py-20 md:py-24">
        <Reveal className="relative overflow-hidden rounded-4xl bg-terracota-500 px-7 py-14 text-center text-white md:px-16 md:py-20">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-forest-800/15" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight md:text-5xl">
              Comece pelo kit degustação: três microlotes, três perfis
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              A forma mais honesta de descobrir seu paladar. Se não gostar, devolvemos 100% do valor.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/loja" className="btn bg-white text-terracota-600 hover:bg-areia-100">
                Montar meu kit
              </Link>
              <Link href="/faq" className="btn border border-white/50 text-white hover:bg-white/10">
                Tirar dúvidas
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
