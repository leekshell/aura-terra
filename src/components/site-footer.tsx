import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Loja",
    links: [
      { href: "/loja", label: "Todos os cafés" },
      { href: "/loja?torra=clara", label: "Torra clara" },
      { href: "/loja?torra=media", label: "Torra média" },
      { href: "/loja?torra=escura", label: "Torra escura" },
      { href: "/assinatura", label: "Clube de assinatura" },
    ],
  },
  {
    title: "Aura Terra",
    links: [
      { href: "/sobre", label: "Nossa Terra" },
      { href: "/sobre#jornada", label: "Jornada do grão" },
      { href: "/blog", label: "Diário do Café" },
      { href: "/contato", label: "Laboratório de torra" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/faq", label: "Dúvidas frequentes" },
      { href: "/faq#entregas-prazos", label: "Entregas e prazos" },
      { href: "/faq#trocasdevolucoes", label: "Trocas e devoluções" },
      { href: "/conta", label: "Minha conta" },
      { href: "/contato", label: "Fale com a gente" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest-800 text-areia-100">
      <div className="container-aura grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-16">
        <div className="max-w-sm">
          <p className="font-display text-2xl">Aura Terra</p>
          <p className="mt-3 text-sm leading-relaxed text-areia-100/70">
            Cafés especiais 100% orgânicos, comprados diretamente de pequenos produtores agroecológicos e torrados
            sob demanda no nosso laboratório em Belo Horizonte.
          </p>
          <NewsletterForm />
          <div className="mt-6 flex gap-3">
            {["Instagram", "YouTube", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border border-areia-100/25 px-3 py-1.5 text-xs transition hover:border-terracota-300 hover:text-terracota-300"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-terracota-300">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-areia-100/75 transition hover:text-areia-100 hover:underline underline-offset-4"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-areia-100/12">
        <div className="container-aura flex flex-col gap-3 py-6 text-xs text-areia-100/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Aura Terra Cafés Especiais LTDA · CNPJ 48.221.109/0001-64</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="mailto:contato@auraterra.com.br" className="hover:text-areia-100">
              contato@auraterra.com.br
            </a>
            <span>Av. do Contorno, 4.220 · Funcionários · Belo Horizonte/MG</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
