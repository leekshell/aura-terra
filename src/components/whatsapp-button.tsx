"use client";

import { useEffect, useState } from "react";

const NUMBER = "5531990001234";
const MESSAGE = encodeURIComponent("Olá, Aura Terra! Tenho uma dúvida sobre os cafés 🌱");

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Falar com a Aura Terra no WhatsApp"
      className={`fixed bottom-5 right-4 z-40 flex items-center gap-2.5 rounded-full bg-[#1FA855] py-3 pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(31,168,85,.9)] transition-all duration-500 md:bottom-7 md:right-7 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.53 3.75 1.44 5.3L2 22l5-1.6a9.8 9.8 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm0 17.9c-1.63 0-3.14-.48-4.4-1.3l-.32-.2-2.96.95.96-2.88-.2-.33a7.98 7.98 0 0 1-1.25-4.3c0-4.44 3.62-8.05 8.06-8.05 4.45 0 8.06 3.61 8.06 8.05 0 4.45-3.61 8.06-8.05 8.06Zm4.42-6.04c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.5.58.19 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          expanded ? "max-w-[16rem] opacity-100" : "max-w-0 opacity-0 md:max-w-0"
        }`}
      >
        Fale com um barista
      </span>
    </a>
  );
}
