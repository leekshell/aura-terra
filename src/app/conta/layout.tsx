import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { AccountNav } from "@/components/account-nav";

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/conta");

  return (
    <section className="container-aura py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-terracota-600">Área do cliente</span>
          <h1 className="mt-2 font-display text-3xl text-forest-900 md:text-4xl">Olá, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-forest-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && (
            <Link href="/admin" className="btn btn-ghost px-4 py-2.5 text-xs">
              Painel admin
            </Link>
          )}
          <form action={logoutAction}>
            <button className="btn btn-ghost px-4 py-2.5 text-xs">Sair</button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <AccountNav />
        <div>{children}</div>
      </div>
    </section>
  );
}
