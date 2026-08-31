import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta Aura Terra e acompanhe pedidos, entregas e assinaturas.",
  robots: { index: false, follow: false },
};

export default async function CriarContaPage() {
  const user = await getCurrentUser();
  if (user) redirect("/conta");

  return (
    <section className="container-aura flex justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-4xl border border-areia-200 bg-white p-7 md:p-9">
        <span className="eyebrow text-terracota-600">Área do cliente</span>
        <h1 className="mt-2 font-display text-3xl text-forest-900">Criar conta</h1>
        <p className="mt-2 text-sm text-forest-600">
          Leva 30 segundos — e você ganha 10% off na primeira compra.
        </p>
        <div className="mt-7">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
