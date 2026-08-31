import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SubscriptionBuilder } from "@/components/subscription-builder";

export const metadata: Metadata = {
  title: "Clube de Assinatura Aura · Café fresco todo mês",
  description:
    "Assine o Clube Aura e receba microlotes orgânicos torrados na semana do envio. Escolha moagem e frequência, pause ou cancele quando quiser.",
  alternates: { canonical: "/assinatura" },
};

const FAQ = [
  ["Posso escolher o café?", "Nos planos Descobridor e Explorador a curadoria é nossa, mas você pode fixar favoritos ou bloquear perfis. No Colecionador, você escolhe todos os lotes."],
  ["E se eu viajar?", "Pause quantas vezes quiser pelo painel, sem custo, ou adie a próxima entrega em uma data específica."],
  ["Como é a cobrança?", "Recorrente no cartão ou pix automático, sempre 3 dias antes da data de envio. Você recebe aviso por e-mail antes."],
];

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;

  return (
    <>
      <section className="bg-forest-800 py-16 text-areia-100 md:py-24">
        <div className="container-aura grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow text-terracota-300">Clube de Assinatura Aura</span>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] md:text-5xl">
              Café fresco chegando na porta, sem você pensar nisso.
            </h1>
            <p className="mt-5 max-w-lg text-areia-100/80">
              Todo ciclo, nosso mestre de torra escolhe os microlotes no auge da safra, torra na semana do envio e
              manda para você com ficha de degustação e receita sugerida.
            </p>
            <ul className="mt-7 grid gap-2.5 text-sm sm:grid-cols-2">
              {[
                "Torrado há no máximo 5 dias",
                "Frete grátis para todo o Brasil",
                "Pause, adie ou cancele em 1 clique",
                "Até 15% de desconto na loja",
              ].map((i) => (
                <li key={i} className="flex gap-2 text-areia-100/85">
                  <span className="text-terracota-300">✓</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-4xl border border-areia-100/20 bg-areia-100/5 p-7 backdrop-blur">
            <p className="font-display text-5xl text-terracota-300">3.400+</p>
            <p className="mt-2 text-sm text-areia-100/80">assinantes ativos em todo o Brasil</p>
            <div className="mt-6 space-y-3 border-t border-areia-100/20 pt-6 text-sm text-areia-100/75">
              <p>“Virou meu ritual de domingo à noite: abrir o pacote e ler a ficha do produtor.”</p>
              <p className="text-xs text-areia-100/50">— Beatriz M., assinante Explorador</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-aura py-16 md:py-24">
        <Reveal className="mb-10 max-w-xl">
          <span className="eyebrow text-terracota-600">Monte sua assinatura</span>
          <h2 className="mt-3 text-3xl text-forest-900 md:text-4xl">Três passos e pronto</h2>
        </Reveal>
        <Reveal delay={80}>
          <SubscriptionBuilder initialPlan={plano} />
        </Reveal>
      </section>

      <section className="bg-areia-50 py-16 md:py-20">
        <div className="container-aura grid gap-8 md:grid-cols-3">
          {FAQ.map(([q, a], i) => (
            <Reveal key={q} delay={i * 80}>
              <div className="h-full rounded-3xl border border-areia-200 bg-white p-6">
                <h3 className="text-lg text-forest-900">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-600">{a}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="container-aura mt-10 text-center">
          <Link href="/faq#como-funciona-a-assinatura" className="btn btn-ghost">
            Ver todas as dúvidas sobre a assinatura
          </Link>
        </div>
      </section>
    </>
  );
}
