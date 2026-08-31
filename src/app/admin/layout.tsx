import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin-nav";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Painel administrativo", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/admin");
  if (user.role !== "admin") {
    return (
      <section className="container-aura py-20 text-center">
        <h1 className="font-display text-3xl text-forest-900">Acesso restrito</h1>
        <p className="mt-3 text-forest-600">Esta área é exclusiva da equipe Aura Terra.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Voltar para o site
        </Link>
      </section>
    );
  }

  return (
    <div className="min-h-dvh bg-areia-100">
      <div className="container-aura py-8 md:py-10">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow text-terracota-600">Painel administrativo</span>
            <h1 className="mt-1.5 font-display text-2xl text-forest-900 md:text-3xl">Aura Terra CMS</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn btn-ghost px-4 py-2.5 text-xs">
              Ver site
            </Link>
            <form action={logoutAction}>
              <button className="btn btn-ghost px-4 py-2.5 text-xs">Sair ({user.name.split(" ")[0]})</button>
            </form>
          </div>
        </header>

        <div className="grid gap-7 lg:grid-cols-[210px_1fr] lg:gap-10">
          <AdminNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
