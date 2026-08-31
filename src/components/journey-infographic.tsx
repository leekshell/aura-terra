"use client";

import { useState } from "react";

const STEPS = [
  {
    id: "solo",
    icon: "🌱",
    title: "1. Solo vivo",
    subtitle: "Fazenda agroecológica",
    detail:
      "Nada de herbicida. O mato é roçado, vira cobertura e devolve matéria orgânica. Adubação com composto de palha de café e esterco curtido, e análise de solo duas vezes por ano.",
    stat: ["0", "agrotóxicos aplicados"],
  },
  {
    id: "colheita",
    icon: "🍒",
    title: "2. Colheita seletiva",
    subtitle: "Só cereja madura",
    detail:
      "A colheita é feita a dedo, em duas a três passadas por lavoura, garantindo que só o fruto no ponto ideal de maturação entre no lote. É mais caro — e é o que separa um café 82 de um café 88.",
    stat: ["3", "passadas por lavoura"],
  },
  {
    id: "processo",
    icon: "💧",
    title: "3. Processamento",
    subtitle: "Lavado, natural ou fermentado",
    detail:
      "Cada lote segue o processo que melhor revela seu terroir. Água de reúso em circuito fechado, secagem em terreiro suspenso e monitoramento de umidade até os 11%.",
    stat: ["11%", "umidade final"],
  },
  {
    id: "curadoria",
    icon: "🥄",
    title: "4. Cupping e curadoria",
    subtitle: "Mesa de prova às cegas",
    detail:
      "Todo lote passa por três Q-Graders em prova às cegas. Só entra no catálogo se pontuar 84 ou mais na escala SCA — e se pagarmos acima da cotação ao produtor.",
    stat: ["84+", "pontos SCA mínimos"],
  },
  {
    id: "torra",
    icon: "🔥",
    title: "5. Torra sob demanda",
    subtitle: "Laboratório em BH",
    detail:
      "Torramos duas vezes por semana em torrador de tambor com perfil desenvolvido lote a lote. Cada pacote traz a data exata da torra — nunca só a validade.",
    stat: ["48h", "da torra ao envio"],
  },
  {
    id: "xicara",
    icon: "☕",
    title: "6. Sua xícara",
    subtitle: "Moagem no ponto",
    detail:
      "Moemos na granulometria do seu método no dia do envio, embalamos com válvula desgaseificadora e compensamos o carbono do frete via reflorestamento nativo.",
    stat: ["100%", "carbono compensado"],
  },
];

export function JourneyInfographic() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
      {/* trilha */}
      <ol className="relative flex gap-3 overflow-x-auto pb-2 lg:block lg:overflow-visible lg:pb-0 no-scrollbar">
        <span className="absolute left-[19px] top-4 hidden h-[calc(100%-2rem)] w-px bg-areia-300 lg:block" />
        {STEPS.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.id} className="relative shrink-0 lg:mb-1.5">
              <button
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`flex w-[13.5rem] items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 lg:w-full ${
                  isActive
                    ? "border-forest-800 bg-forest-800 text-areia-100 shadow-[0_18px_40px_-28px_rgba(26,54,38,.9)]"
                    : "border-transparent bg-white/70 text-forest-800 hover:border-areia-300"
                }`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-lg transition-colors ${
                    isActive ? "bg-terracota-500" : "bg-areia-100"
                  }`}
                >
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{s.title}</span>
                  <span className={`block truncate text-xs ${isActive ? "text-areia-100/70" : "text-forest-500"}`}>
                    {s.subtitle}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* detalhe */}
      <div key={step.id} className="animate-fade-up rounded-4xl border border-areia-200 bg-white p-7 md:p-10">
        <span className="text-5xl">{step.icon}</span>
        <h3 className="mt-5 font-display text-2xl text-forest-900 md:text-3xl">{step.title}</h3>
        <p className="mt-1 text-sm font-medium text-terracota-600">{step.subtitle}</p>
        <p className="mt-5 leading-relaxed text-forest-700">{step.detail}</p>

        <div className="mt-7 flex items-end gap-4 border-t border-areia-200 pt-5">
          <span className="font-display text-4xl text-forest-800">{step.stat[0]}</span>
          <span className="pb-1.5 text-sm text-forest-600">{step.stat[1]}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            className="btn btn-ghost px-4 py-2.5 text-xs disabled:opacity-30"
          >
            ← Etapa anterior
          </button>
          <span className="text-xs text-forest-500">
            {active + 1} de {STEPS.length}
          </span>
          <button
            onClick={() => setActive((a) => Math.min(STEPS.length - 1, a + 1))}
            disabled={active === STEPS.length - 1}
            className="btn btn-secondary px-4 py-2.5 text-xs disabled:opacity-30"
          >
            Próxima etapa →
          </button>
        </div>
      </div>
    </div>
  );
}
