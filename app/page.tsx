import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import VIPConcierge from "@/components/home/VIPConcierge";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";
import BrandShowcase from "@/components/home/BrandShowcase";
import { getAllProductsServer, getAllBrandsServer } from "@/lib/firestore-server";

export const metadata: Metadata = {
  title: {
    absolute: "Trend Optik Mersin | Premium Gözlük & Güneş Gözlüğü Mağazası",
  },
  description:
    "Mersin Yenişehir Trend Optik: güneş gözlüğü, numaralı gözlük, lens ve göz muayenesi. Ray-Ban, Prada, Gucci, Oakley orijinal ürünler. Hemen WhatsApp'tan bilgi alın.",
  alternates: { canonical: "https://trendoptikmersin.com" },
};

async function getFeaturedProducts() {
  const products = await getAllProductsServer();
  return products
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
}

export default async function Home() {
  const showcaseProducts = await getFeaturedProducts();
  const brands = await getAllBrandsServer();

  return (
    <>
      {/* 1. Hero — untouched */}
      <HeroSection />

      {/* 2. Vitrin Ürünleri — products right below hero */}
      <ProductsShowcase initialProducts={showcaseProducts} brands={brands} />

      {/* 3. Markalar — horizontal swipeable logo strip */}
      <BrandShowcase brands={brands} />

      {/* 4. VIP Özel Sunum Concierge */}
      <VIPConcierge />

      {/* 5. Sipariş Sorgulama */}
      <OrderLookup />
    </>
  );
}
