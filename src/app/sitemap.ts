import type { MetadataRoute } from "next";
import { listPosts, listProducts } from "@/lib/queries";

const base = "https://www.auraterra.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/loja", "/assinatura", "/sobre", "/blog", "/faq", "/contato"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const products = listProducts().map((p) => ({
    url: `${base}/loja/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const posts = listPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt.replace(" ", "T")),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...products, ...posts];
}
