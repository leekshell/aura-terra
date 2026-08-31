import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { JourneyInfographic } from "@/components/journey-infographic";
import { Reveal } from "@/components/reveal";
import { IMPACT_METRICS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Nossa Terra · A história por trás de cada grão",
  description:
    "Conheça a Aura Terra: comércio direto com 74 famílias agroecológicas, lavouras 100% orgânicas e a jornada completa do grão, da fazenda até a sua xícara.",
  alternates: { canonical: "/sobre" },
};

const TIMELINE = [
  ["2018", "Uma van e 12 sacas", "Helena e Tomás percorrem a Mantiqueira comprando lotes de famílias que não tinham acesso ao mercado de especiais."],
  ["2020", "Primeiro laboratório", "Alugamos um galpão em BH e instalamos o primeiro torrador de tambor de 5 kg."],
  ["2022", "Selo orgânico IBD", "Todas as lavouras parceiras concluem a certificação orgânica participativa."],
  ["2024", "Clube Aura", "Nasce a assinatura mensal; em seis meses, 3.400 assinantes."],
  ["2026", "Carbono neutro", "Fechamos o ciclo: 100% das emissões da lavoura à entrega compensadas."],
];

export default function SobrePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest-800 text-areia-100">
        <Image
          src="/images/marca/hero.jpg"
          alt="Serra com lavoura de café agroecológica"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="container-aura relative py-20 md:py-28">
          <span className="eyebrow text-terracota-300">Nossa Terra</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] md:text-6xl">
            Somos uma torrefação que começa muito antes do torrador.
          </h1>
          <p className="mt-6 max-w-xl text-areia-100/80">
            A Aura Terra existe para provar que café excepcional e agricultura regenerativa não são caminhos
            opostos — são o mesmo caminho.
          </p>
        </div>
      </section>

      <section className="container-aura py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow text-terracota-600">Como começou</span>
            <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">Da estrada de terra para a sua xícara</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-4 text-[1.0625rem] leading-relaxed text-forest-700">
            <p>
              Em 2018, Helena Braga trabalhava com análise sensorial em uma grande exportadora quando percebeu
              algo desconfortável: os melhores lotes que ela provava vinham de propriedades minúsculas que
              recebiam, pela saca, quase o mesmo que o café commodity.
            </p>
            <p>
              Ela e Tomás Vieira, agrônomo, compraram uma van velha e passaram seis meses percorrendo a
              Mantiqueira. Voltaram com 12 sacas, uma lista de 40 famílias e uma decisão: comprar direto,
              pagar acima da cotação e trabalhar só com lavouras em transição orgânica.
            </p>
            <p>
              Oito anos depois somos <strong>74 famílias parceiras</strong> em quatro estados, um laboratório de
              torra em Belo Horizonte e mais de 20 mil pessoas tomando café rastreável todas as manhãs.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="jornada" className="scroll-mt-24 bg-areia-50 py-20 md:py-28">
        <div className="container-aura">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow text-terracota-600">Infográfico interativo</span>
            <h2 className="mt-3 text-3xl text-forest-900 md:text-[2.6rem]">A jornada do grão</h2>
            <p className="mt-3 text-forest-600">
              Toque em cada etapa para ver o que acontece entre a fazenda agroecológica e a sua xícara.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <JourneyInfographic />
          </Reveal>
        </div>
      </section>

      <section className="container-aura py-20 md:py-28">
        <Reveal className="mb-10 max-w-xl">
          <span className="eyebrow text-terracota-600">Impacto verificado</span>
          <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">O que o nosso café movimenta</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="h-full rounded-3xl border border-areia-200 bg-white p-6">
                <p className="font-display text-4xl text-terracota-500">
                  <CountUp value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-3 text-sm font-semibold text-forest-900">{m.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-forest-600">{m.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest-800 py-20 text-areia-100 md:py-24">
        <div className="container-aura">
          <Reveal className="mb-12 max-w-xl">
            <span className="eyebrow text-terracota-300">Linha do tempo</span>
            <h2 className="mt-3 text-3xl md:text-4xl">Oito anos de estrada de terra</h2>
          </Reveal>
          <ol className="grid gap-8 md:grid-cols-5">
            {TIMELINE.map(([year, title, text], i) => (
              <Reveal key={year} delay={i * 80} as="li">
                <div className="border-t border-areia-100/25 pt-5">
                  <p className="font-display text-2xl text-terracota-300">{year}</p>
                  <p className="mt-2 text-sm font-semibold">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-areia-100/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-aura py-20 md:py-24">
        <div className="grid items-center gap-10 rounded-4xl border border-areia-200 bg-white p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="eyebrow text-terracota-600">Compromissos públicos</span>
            <h2 className="mt-3 text-2xl text-forest-900 md:text-3xl">O que assumimos com quem planta</h2>
            <ul className="mt-6 space-y-4">
              {[
                ["Preço mínimo garantido", "Contrato assinado antes da colheita, com piso 25% acima da cotação da saca."],
                ["Pagamento em 7 dias", "Sem esperar a revenda: o produtor recebe uma semana após a entrega do lote."],
                ["Assistência agronômica", "Visitas técnicas trimestrais gratuitas para manejo agroecológico."],
                ["Transparência total", "Publicamos quanto pagamos por saca no relatório anual de impacto."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-terracota-100 text-xs text-terracota-600">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{t}</p>
                    <p className="mt-0.5 text-sm text-forest-600">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-square">
            <Image
              src="/images/blog/produtores.jpg"
              alt="Produtores parceiros na lavoura"
              fill
              sizes="(max-width: 768px) 90vw, 460px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/loja" className="btn btn-primary">
            Provar nossos cafés
          </Link>
          <Link href="/contato" className="btn btn-ghost">
            Visitar o laboratório de torra
          </Link>
        </div>
      </section>
    </>
  );
}
