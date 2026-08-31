import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contato · Fale com o laboratório de torra",
  description:
    "Fale com a Aura Terra por formulário, WhatsApp ou e-mail contato@auraterra.com.br. Visite nosso laboratório de torra em Belo Horizonte.",
  alternates: { canonical: "/contato" },
};

const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=-43.9420%2C-19.9420%2C-43.9200%2C-19.9270&layer=mapnik&marker=-19.9345%2C-43.9310";

export default function ContatoPage() {
  return (
    <>
      <section className="border-b border-areia-200 bg-areia-50">
        <div className="container-aura py-12 md:py-16">
          <span className="eyebrow text-terracota-600">Contato</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-forest-900 md:text-5xl">
            A gente adora conversar sobre café
          </h1>
          <p className="mt-4 max-w-xl text-forest-600">
            Dúvida sobre um pedido, interesse em atacado ou vontade de conhecer o laboratório de torra? Escolha o
            canal mais confortável.
          </p>
        </div>
      </section>

      <section className="container-aura grid gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <div className="rounded-4xl border border-areia-200 bg-white p-7 md:p-9">
            <h2 className="font-display text-2xl text-forest-900">Formulário de contato</h2>
            <p className="mt-1 text-sm text-forest-600">Respondemos em até 1 dia útil.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>

        <Reveal delay={90} className="space-y-5">
          <div className="rounded-4xl bg-forest-800 p-7 text-areia-100">
            <h2 className="font-display text-2xl">Canais diretos</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <p className="eyebrow text-terracota-300">WhatsApp</p>
                <a
                  href="https://wa.me/5531990001234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-base underline underline-offset-4 hover:text-terracota-300"
                >
                  +55 (31) 99000-1234
                </a>
                <p className="mt-0.5 text-xs text-areia-100/60">Seg a sex, 9h às 18h — resposta na hora</p>
              </li>
              <li>
                <p className="eyebrow text-terracota-300">E-mail oficial</p>
                <a
                  href="mailto:contato@auraterra.com.br"
                  className="mt-1 inline-block text-base underline underline-offset-4 hover:text-terracota-300"
                >
                  contato@auraterra.com.br
                </a>
              </li>
              <li>
                <p className="eyebrow text-terracota-300">Atacado e cafeterias</p>
                <a
                  href="mailto:b2b@auraterra.com.br"
                  className="mt-1 inline-block text-base underline underline-offset-4 hover:text-terracota-300"
                >
                  b2b@auraterra.com.br
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-4xl border border-areia-200 bg-white p-7">
            <p className="eyebrow text-terracota-600">Laboratório de torra</p>
            <h3 className="mt-2 text-xl text-forest-900">Av. do Contorno, 4.220 · Funcionários</h3>
            <p className="mt-1 text-sm text-forest-600">Belo Horizonte / MG · CEP 30110-090</p>
            <p className="mt-3 text-sm text-forest-600">
              Visitas guiadas com cupping às quintas, 16h, mediante agendamento. Loja física aberta de terça a
              sábado, das 9h às 19h.
            </p>
            <div className="mt-5 overflow-hidden rounded-3xl border border-areia-200">
              <iframe
                title="Mapa do laboratório de torra da Aura Terra"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 md:h-72"
              />
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=-19.9345&mlon=-43.9310#map=17/-19.9345/-43.9310"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-terracota-600 underline underline-offset-4"
            >
              Abrir rota no mapa →
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
