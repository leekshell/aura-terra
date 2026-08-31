"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Visão geral", icon: "◎" },
  { href: "/admin/produtos", label: "Produtos e estoque", icon: "☕" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "📦" },
  { href: "/admin/assinantes", label: "Assinantes", icon: "🔁" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/mensagens", label: "Mensagens", icon: "✉" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu administrativo">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-6 lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((i) => {
          const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <li key={i.href} className="shrink-0">
              <Link
                href={i.href}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  active ? "bg-forest-800 text-areia-100" : "text-forest-700 hover:bg-white"
                }`}
              >
                <span aria-hidden>{i.icon}</span>
                <span className="whitespace-nowrap">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
