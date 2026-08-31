import type { Metadata } from "next";
import { updateProfile } from "@/app/actions/account";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Meus dados", robots: { index: false, follow: false } };

export default async function DadosPage() {
  const user = await requireUser();

  return (
    <div className="space-y-5">
      <form
        action={async (fd: FormData) => {
          "use server";
          await updateProfile(fd);
        }}
        className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-xl text-forest-900">Dados pessoais</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-forest-700">Nome completo</span>
            <input name="name" defaultValue={user.name} className="field" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-forest-700">Celular / WhatsApp</span>
            <input name="phone" defaultValue={user.phone ?? ""} className="field" placeholder="(31) 90000-0000" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-forest-700">E-mail</span>
            <input defaultValue={user.email} disabled className="field opacity-60" />
            <span className="mt-1 block text-xs text-forest-500">
              Para trocar o e-mail de acesso, fale com a gente pelo WhatsApp.
            </span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary mt-6">
          Salvar alterações
        </button>
      </form>

      <div className="rounded-4xl border border-areia-200 bg-white p-6 md:p-8">
        <h2 className="font-display text-xl text-forest-900">Privacidade e LGPD</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-600">
          Guardamos apenas os dados necessários para processar pedidos e entregas. Você pode solicitar a exportação
          ou exclusão completa dos seus dados a qualquer momento pelo e-mail{" "}
          <a href="mailto:privacidade@auraterra.com.br" className="underline underline-offset-4">
            privacidade@auraterra.com.br
          </a>
          .
        </p>
        <p className="mt-4 text-xs text-forest-500">
          Conta criada em {new Date(user.createdAt.replace(" ", "T")).toLocaleDateString("pt-BR")} · acesso via{" "}
          {user.provider === "google" ? "Google" : "e-mail e senha"}.
        </p>
      </div>
    </div>
  );
}
