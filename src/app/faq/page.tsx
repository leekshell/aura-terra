import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq-accordion";
import { listFaqs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Dúvidas Frequentes · Entregas, assinatura, moagem e trocas",
  description:
    "Tire suas dúvidas sobre prazos de entrega, funcionamento do Clube Aura, tipos de moagem e política de trocas e devoluções da Aura Terra.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqs = listFaqs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <section className="border-b border-areia-200 bg-areia-50">
        <div className="container-aura py-12 md:py-16">
          <span className="eyebrow text-terracota-600">Central de ajuda</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-forest-900 md:text-5xl">
            Dúvidas frequentes
          </h1>
          <p className="mt-4 max-w-xl text-forest-600">
            Respostas rápidas sobre entregas, assinatura, moagem e devoluções. Não achou? Fale com um barista de
            verdade pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="container-aura py-12 md:py-16">
        <FaqAccordion faqs={faqs} />

        <div className="mt-6 rounded-4xl border border-areia-200 bg-white p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-forest-900">Ainda com dúvida?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-forest-600">
            Nosso time responde em até 1 dia útil por e-mail — e na hora pelo WhatsApp, de segunda a sexta das 9h
            às 18h.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contato" className="btn btn-primary">
              Falar com a gente
            </Link>
            <a href="mailto:contato@auraterra.com.br" className="btn btn-ghost">
              contato@auraterra.com.br
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
