import { MetadataRoute } from "next";
import { getAllProductsServer } from "@/lib/firestore-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductsServer();
  
  const productUrls = products.map((p) => ({
    url: `https://trendoptikmersin.com/product/${p.id}`,
    lastModified: new Date(), // İdealde Firestore'dan updatedAt çekilebilir
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = [
    { url: "https://trendoptikmersin.com/gunes-gozlugu", changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://trendoptikmersin.com/numarali-gozluk", changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://trendoptikmersin.com/lens", changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  return [
    { url: "https://trendoptikmersin.com", changeFrequency: "daily" as const, priority: 1 },
    { url: "https://trendoptikmersin.com/katalog", changeFrequency: "daily" as const, priority: 0.9 },
    ...categoryUrls,
    ...productUrls,
  ];
}
