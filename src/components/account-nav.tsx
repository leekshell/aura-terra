"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/conta", label: "Visão geral" },
  { href: "/conta/pedidos", label: "Meus pedidos" },
  { href: "/conta/assinatura", label: "Minha assinatura" },
  { href: "/conta/dados", label: "Meus dados" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu da conta">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <li key={i.href} className="shrink-0">
              <Link
                href={i.href}
                className={`block rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  active ? "bg-forest-800 text-areia-100" : "text-forest-700 hover:bg-areia-200"
                }`}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
