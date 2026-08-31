"use client";

import Link from "next/link";
import { useActionState } from "react";
import { googleLoginAction, loginAction, registerAction, type AuthState } from "@/app/actions/auth";

export function LoginForm({ next = "/conta" }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <div>
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-forest-700">
            E-mail
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-forest-700">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
          />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-2xl bg-terracota-100 px-4 py-3 text-sm text-terracota-700">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <GoogleButton />

      <p className="mt-6 text-center text-sm text-forest-600">
        Ainda não tem conta?{" "}
        <Link href="/criar-conta" className="font-medium text-terracota-600 underline underline-offset-4">
          Criar conta
        </Link>
      </p>

      <div className="mt-6 rounded-2xl bg-areia-100 p-4 text-xs text-forest-600">
        <p className="font-semibold text-forest-800">Contas de demonstração</p>
        <p className="mt-1">Cliente: cliente@auraterra.com.br · senha cafe1234</p>
        <p>Admin: admin@auraterra.com.br · senha aura2026</p>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, undefined);

  return (
    <div>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-forest-700">
            Nome completo
          </label>
          <input id="name" name="name" required autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-forest-700">
            E-mail
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-forest-700">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="field"
          />
          <p className="mt-1 text-xs text-forest-500">Mínimo de 6 caracteres.</p>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-2xl bg-terracota-100 px-4 py-3 text-sm text-terracota-700">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
          {pending ? "Criando…" : "Criar minha conta"}
        </button>
      </form>

      <GoogleButton />

      <p className="mt-6 text-center text-sm text-forest-600">
        Já é cliente?{" "}
        <Link href="/entrar" className="font-medium text-terracota-600 underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}

function GoogleButton() {
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-forest-400">
        <span className="h-px flex-1 bg-areia-300" />
        ou
        <span className="h-px flex-1 bg-areia-300" />
      </div>
      <form action={googleLoginAction}>
        <button
          type="submit"
          className="btn w-full border border-areia-300 bg-white text-forest-800 hover:border-forest-600"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.68-.06-1.34-.18-1.98H12v3.75h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.74 2.98-4.3 2.98-7.29Z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H3.06v2.58A10 10 0 0 0 12 22Z"
            />
            <path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82V7.51H3.06a10 10 0 0 0 0 8.98l3.35-2.58Z" />
            <path
              fill="#EA4335"
              d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.94 5.51l3.35 2.58C7.2 7.73 9.4 5.98 12 5.98Z"
            />
          </svg>
          Entrar com Google
        </button>
      </form>
      <p className="mt-2 text-center text-[11px] text-forest-400">
        Fluxo social simulado neste ambiente de demonstração.
      </p>
    </>
  );
}
