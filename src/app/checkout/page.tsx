import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout-flow";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize seu pedido Aura Terra.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <section className="container-aura py-10 md:py-16">
      <h1 className="mb-8 font-display text-3xl text-forest-900 md:text-4xl">Finalizar compra</h1>
      <CheckoutFlow user={user ? { name: user.name, email: user.email } : null} />
    </section>
  );
}
