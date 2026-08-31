import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-aura flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">☕</span>
      <h1 className="mt-6 font-display text-4xl text-forest-900">Essa xícara está vazia</h1>
      <p className="mt-3 max-w-md text-forest-600">
        A página que você procurou não existe ou saiu de safra. Que tal conhecer os microlotes disponíveis agora?
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/loja" className="btn btn-primary">
          Ver a loja
        </Link>
        <Link href="/" className="btn btn-ghost">
          Voltar para a home
        </Link>
      </div>
    </section>
  );
}
