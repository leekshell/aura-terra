"use client";

import { useEffect, useRef, useState } from "react";
import type { FlavorChart } from "@/lib/types";

const LABELS: { key: keyof FlavorChart; label: string }[] = [
  { key: "acidez", label: "Acidez" },
  { key: "corpo", label: "Corpo" },
  { key: "doçura", label: "Doçura" },
  { key: "aroma", label: "Aroma" },
  { key: "intensidade", label: "Intensidade" },
];

export function FlavorProfileChart({ flavor, accent = "#C86047" }: { flavor: FlavorChart; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3.5">
      {LABELS.map(({ key, label }, i) => {
        const value = Number(flavor[key] ?? 0);
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-baseline justify-between text-xs">
              <span className="font-medium text-forest-700">{label}</span>
              <span className="tabular-nums text-forest-500">{value.toFixed(1)}/10</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-areia-200">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-out"
                style={{
                  width: on ? `${value * 10}%` : "0%",
                  transitionDelay: `${i * 90}ms`,
                  background: `linear-gradient(90deg, ${accent}, #1A3626)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
