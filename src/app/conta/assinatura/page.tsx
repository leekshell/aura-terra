import type { Metadata } from "next";
import Link from "next/link";
import { SubscriptionManager } from "@/components/subscription-manager";
import { requireUser } from "@/lib/auth";
import { listSubscriptionsByUser } from "@/lib/queries";

export const metadata: Metadata = { title: "Minha assinatura", robots: { index: false, follow: false } };

export default async function AssinaturaContaPage() {
  const user = await requireUser();
  const subs = listSubscriptionsByUser(user.id);

  if (subs.length === 0) {
    return (
      <div className="rounded-4xl bg-forest-800 p-8 text-areia-100 md:p-12">
        <h2 className="font-display text-2xl">Nenhuma assinatura ativa</h2>
        <p className="mt-2 max-w-lg text-sm text-areia-100/75">
          No Clube Aura você recebe microlotes frescos com 10% de desconto, frete grátis e liberdade total para
          pausar ou cancelar.
        </p>
        <Link href="/assinatura" className="btn btn-primary mt-6">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {subs.map((s) => (
        <SubscriptionManager key={s.id} subscription={s} />
      ))}
    </div>
  );
}
