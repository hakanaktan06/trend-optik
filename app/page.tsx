import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import VIPConcierge from "@/components/home/VIPConcierge";
import LensTech from "@/components/home/LensTech";
import CTASection from "@/components/home/CTASection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";
import ParallaxBanner from "@/components/home/ParallaxBanner";
import FAQSection from "@/components/home/FAQSection";
import { faqs } from "@/lib/constants";
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
  const allProducts = await getAllProductsServer();
  return allProducts.filter((p) => p.isFeatured === true && p.status === 'published').slice(0, 16);
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const brands = await getAllBrandsServer();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* 1. Hero — Apple Style Canvas Scroll Animasyon */}
      <HeroSection />

      {/* 2. Vitrin Ürünleri — Products Foregrounded */}
      <ProductsShowcase initialProducts={featuredProducts} brands={brands} />

      {/* 3. Zanaatkarlık ve Materyaller — Apple Bento Grid */}
      <BentoGrid />

      {/* 5. Lens Teknolojisi — Before/After Slider */}
      <LensTech />

      {/* 6. Lifestyle Parallax Banner */}
      <ParallaxBanner />

      {/* 7. VIP Özel Sunum Concierge — Glassmorphism Anket */}
      <VIPConcierge />

      {/* 8. Sipariş Sorgulama — Müşteri Takip Sistemi */}
      <OrderLookup />

      {/* 9. FAQ — Sıkça Sorulan Sorular */}
      <FAQSection />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* 10. CTA — WhatsApp İletişim */}
      <CTASection />
    </>
  );
}
