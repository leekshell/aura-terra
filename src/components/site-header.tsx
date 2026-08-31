"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  { href: "/loja", label: "Loja" },
  { href: "/assinatura", label: "Clube Aura" },
  { href: "/sobre", label: "Nossa Terra" },
  { href: "/blog", label: "Diário do Café" },
  { href: "/faq", label: "Dúvidas" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ userName, isAdmin }: { userName?: string | null; isAdmin?: boolean }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count, setOpen } = useCart();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="bg-forest-800 px-4 py-2 text-center text-[11px] tracking-wide text-areia-100 sm:text-xs">
        Torra sob demanda · Frete grátis acima de R$ 149 · 100% orgânico e rastreável
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-areia-50/90 shadow-[0_1px_0_rgba(26,54,38,.08)] backdrop-blur-md" : "bg-areia-100"
        }`}
      >
        <div className="container-aura flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Aura Terra — página inicial">
            <Logo />
            <span className="font-display text-lg leading-none tracking-tight text-forest-800 md:text-xl">
              Aura<span className="text-terracota-500">&nbsp;Terra</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? "text-terracota-600" : "text-forest-700 hover:text-forest-900"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-terracota-500 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden rounded-full border border-forest-800/20 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:bg-forest-800 hover:text-areia-100 md:inline-flex"
              >
                Painel admin
              </Link>
            )}
            <Link
              href={userName ? "/conta" : "/entrar"}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-forest-700 transition hover:bg-areia-200 md:inline-flex"
            >
              <UserIcon />
              <span className="max-w-[12ch] truncate">{userName ? userName.split(" ")[0] : "Entrar"}</span>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="relative grid size-11 place-items-center rounded-full text-forest-800 transition hover:bg-areia-200"
              aria-label={`Abrir sacola com ${count} item(ns)`}
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-terracota-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenu((v) => !v)}
              className="grid size-11 place-items-center rounded-full text-forest-800 transition hover:bg-areia-200 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menu}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-300 ${
                    menu ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[6px] h-0.5 rounded bg-current transition-opacity ${
                    menu ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[13px] h-0.5 rounded bg-current transition-transform duration-300 ${
                    menu ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`overflow-hidden border-t border-areia-200 bg-areia-50 transition-[max-height] duration-400 ease-in-out lg:hidden ${
            menu ? "max-h-[80vh]" : "max-h-0"
          }`}
        >
          <nav className="container-aura flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-forest-800 transition hover:bg-areia-200"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href={userName ? "/conta" : "/entrar"} className="btn btn-ghost">
                {userName ? "Minha conta" : "Entrar"}
              </Link>
              <Link href="/assinatura" className="btn btn-primary">
                Assinar
              </Link>
            </div>
            {isAdmin && (
              <Link href="/admin" className="btn btn-secondary mt-2">
                Painel administrativo
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

function Logo() {
  return (
    <span className="grid size-9 place-items-center rounded-full bg-forest-800 md:size-10">
      <svg viewBox="0 0 24 24" className="size-5 text-areia-100" fill="none" aria-hidden>
        <path
          d="M12 21c4.5-2.2 7-5.7 7-9.9V5.6L12 3 5 5.6v5.5C5 15.3 7.5 18.8 12 21Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M12 7.5v9M12 16.5c0-3 1.6-4.6 4-5.2M12 12.4c0-2.4-1.4-3.7-3.4-4.2" stroke="#C86047" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.5 10V7a2.5 2.5 0 0 1 5 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 19.5c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
