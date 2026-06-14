import { MetadataRoute } from "next";
import { getAllProductsServer, getAllBrandsServer } from "@/lib/firestore-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([
    getAllProductsServer(),
    getAllBrandsServer(),
  ]);

  const productUrls = products
    .filter(p => p.status === "published")
    .map((p) => ({
      url: `https://trendoptikmersin.com/product/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt * 1000) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const brandUrls = brands
    .filter(b => b.slug)
    .map(b => ({
      url: `https://trendoptikmersin.com/marka/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  return [
    { url: "https://trendoptikmersin.com", changeFrequency: "daily" as const, priority: 1 },
    { url: "https://trendoptikmersin.com/katalog", changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://trendoptikmersin.com/lens", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "https://trendoptikmersin.com/hakkimizda", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "https://trendoptikmersin.com/sertifika", changeFrequency: "monthly" as const, priority: 0.5 },
    ...brandUrls,
    ...productUrls,
  ];
}
