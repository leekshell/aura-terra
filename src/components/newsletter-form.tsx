"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions/site";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <form
      className="mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setState("loading");
        await subscribeNewsletter(String(form.get("email") ?? ""));
        setState("done");
      }}
    >
      <label htmlFor="nl-email" className="text-xs text-areia-100/70">
        Receba receitas e lotes novos antes de todo mundo
      </label>
      {state === "done" ? (
        <p className="mt-2 rounded-xl bg-areia-100/10 px-4 py-3 text-sm text-areia-100">
          Pronto! Confira sua caixa de entrada ☕
        </p>
      ) : (
        <div className="mt-2 flex gap-2">
          <input
            id="nl-email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="min-w-0 flex-1 rounded-full border border-areia-100/25 bg-transparent px-4 py-2.5 text-sm text-areia-100 placeholder:text-areia-100/40 focus:border-terracota-300 focus:outline-none"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="rounded-full bg-terracota-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracota-600 disabled:opacity-60"
          >
            {state === "loading" ? "..." : "Quero"}
          </button>
        </div>
      )}
    </form>
  );
}
