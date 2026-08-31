import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Entrar na sua conta",
  description: "Acesse sua conta Aura Terra para acompanhar pedidos e gerenciar sua assinatura.",
  robots: { index: false, follow: false },
};

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/conta");
  const { next } = await searchParams;

  return (
    <section className="container-aura flex justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-4xl border border-areia-200 bg-white p-7 md:p-9">
        <span className="eyebrow text-terracota-600">Área do cliente</span>
        <h1 className="mt-2 font-display text-3xl text-forest-900">Bom te ver de novo</h1>
        <p className="mt-2 text-sm text-forest-600">
          Acompanhe pedidos, rastreie entregas e gerencie sua assinatura mensal.
        </p>
        <div className="mt-7">
          <LoginForm next={next ?? "/conta"} />
        </div>
      </div>
    </section>
  );
}
