import { Metadata } from "next";
import Link from "next/link";
import { getAllProductsServer } from "@/lib/firestore-server";
import { ChevronLeft, ShoppingBag } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Güneş Gözlüğü Modelleri | Trend Optik Mersin",
  description: "Mersin güneş gözlüğü modelleri. Ray-Ban, Prada, Gucci ve daha fazlası. %100 orijinal, UV korumalı ve garantili ürünler.",
  alternates: { canonical: "https://trendoptikmersin.com/gunes-gozlugu" }
};

export default async function GunesGozluguPage() {
  const allProducts = await getAllProductsServer();
  // Fetch both 'gunes' and fallback general categories if needed
  const products = allProducts.filter(p => p.category === "gunes" || p.category === "kadin" || p.category === "cocuk");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://trendoptikmersin.com/product/${p.id}`
    }))
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="container-premium">
        <Link href="/katalog" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12">
          <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Kataloğa Dön</span>
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Güneş <span className="text-white/20 italic">Gözlüğü</span></h1>
          <p className="text-white/40 max-w-2xl font-light text-lg">
            Mersin'de en seçkin güneş gözlüğü markalarını bir araya getirdik. Tarzınıza uygun, %100 UV korumalı ve garantili modelleri inceleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-[var(--accent-gold)]/30 transition-all duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> İncele
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-white/40 font-medium tracking-wider">{product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="text-white/40 col-span-full">Bu kategoride henüz ürün bulunmuyor.</p>
          )}
        </div>
      </div>
    </main>
  );
}
