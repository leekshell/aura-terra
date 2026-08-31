import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getCurrentUser } from "@/lib/auth";


const siteUrl = "https://www.auraterra.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aura Terra · Cafés especiais orgânicos e torrados sob demanda",
    template: "%s · Aura Terra",
  },
  description:
    "Microlotes de café 100% orgânico comprados diretamente de pequenos produtores agroecológicos. Torra sob demanda, moagem à sua escolha e clube de assinatura mensal.",
  keywords: [
    "café especial",
    "café orgânico",
    "microlote",
    "clube de assinatura de café",
    "café torrado na hora",
    "café agroecológico",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Aura Terra",
    title: "Aura Terra · Cafés especiais orgânicos",
    description:
      "Do produtor agroecológico à sua xícara: microlotes rastreáveis, torrados sob demanda e entregues frescos em todo o Brasil.",
    images: [{ url: "/images/marca/hero.jpg", width: 1200, height: 630, alt: "Lavoura de café da Aura Terra" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Terra · Cafés especiais orgânicos",
    description: "Microlotes rastreáveis, torra sob demanda e clube de assinatura.",
    images: ["/images/marca/hero.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#1A3626",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR">
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Aura Terra",
              url: siteUrl,
              email: "contato@auraterra.com.br",
              logo: `${siteUrl}/images/marca/hero.jpg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. do Contorno, 4.220",
                addressLocality: "Belo Horizonte",
                addressRegion: "MG",
                postalCode: "30110-090",
                addressCountry: "BR",
              },
              sameAs: ["https://instagram.com/auraterra", "https://youtube.com/@auraterra"],
            }),
          }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest-800 focus:px-4 focus:py-2 focus:text-areia-100"
        >
          Pular para o conteúdo
        </a>
        <CartProvider>
          <SiteHeader userName={user?.name} isAdmin={user?.role === "admin"} />
          <main id="conteudo">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
