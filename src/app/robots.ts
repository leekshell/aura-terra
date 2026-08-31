import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/conta", "/checkout", "/entrar", "/criar-conta", "/api/"],
      },
    ],
    sitemap: "https://www.auraterra.com.br/sitemap.xml",
  };
}
