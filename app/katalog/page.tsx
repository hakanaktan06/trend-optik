import { Metadata } from "next";
import { getAllProductsServer } from "@/lib/firestore-server";
import CatalogClient from "@/components/product/CatalogClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tüm Koleksiyonlar | Trend Optik Mersin",
  description: "Mersin'in en seçkin gözlük koleksiyonunu keşfedin. Güneş gözlüğü, numaralı gözlük ve kontakt lenslerde dünya markaları avantajlı fiyatlarla.",
  alternates: {
    canonical: "https://trendoptikmersin.com/katalog",
  },
};

export default async function CatalogPage() {
  const products = await getAllProductsServer();

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <CatalogClient initialProducts={products} />
    </main>
  );
}
