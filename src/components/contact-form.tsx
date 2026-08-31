"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/actions/site";

const SUBJECTS = ["Dúvida sobre pedido", "Assinatura", "Atacado e cafeterias", "Parceria com produtor", "Imprensa", "Outro"];

const initialState = { status: "idle" as "idle" | "success" | "error", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-forest-700">
            Nome completo
          </label>
          <input id="name" name="name" required className="field" placeholder="Como podemos te chamar?" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-forest-700">
            E-mail
          </label>
          <input id="email" name="email" type="email" required className="field" placeholder="seu@email.com" />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-forest-700">
          Assunto
        </label>
        <select id="subject" name="subject" className="field">
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-forest-700">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="field resize-y"
          placeholder="Conte pra gente como podemos ajudar…"
        />
      </div>

      {state.status !== "idle" && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-forest-100 text-forest-800"
              : "bg-terracota-100 text-terracota-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
        {pending ? "Enviando…" : "Enviar mensagem"}
      </button>

      <p className="text-xs text-forest-500">
        Ao enviar, você concorda com o uso dos seus dados apenas para responder este contato (LGPD).
      </p>
    </form>
  );
}
