"use client";

import { useTransition } from "react";
import { toggleMessageHandled } from "@/app/actions/admin";

export function MessageToggle({ id, handled }: { id: string; handled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(() => toggleMessageHandled(id, !handled).then(() => undefined))}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        handled ? "bg-forest-100 text-forest-800" : "bg-terracota-500 text-white"
      }`}
    >
      {handled ? "Respondida ✓" : "Marcar como respondida"}
    </button>
  );
}
