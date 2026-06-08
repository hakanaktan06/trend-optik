import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import VIPConcierge from "@/components/home/VIPConcierge";
import LensTech from "@/components/home/LensTech";
import BrandShowcase from "@/components/home/BrandShowcase";
import CTASection from "@/components/home/CTASection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";
import ParallaxBanner from "@/components/home/ParallaxBanner";
import FAQSection from "@/components/home/FAQSection";
import { faqs } from "@/lib/constants";
import { getAllProductsServer } from "@/lib/firestore-server";

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
  return allProducts.filter((p) => p.isFeatured === true).slice(0, 8);
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

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

      {/* 2. Zanaatkarlık ve Materyaller — Apple Bento Grid */}
      <BentoGrid />

      {/* 3. Lens Teknolojisi — Before/After Slider */}
      <LensTech />

      {/* 4. Lifestyle Parallax Banner */}
      <ParallaxBanner />

      {/* 5. Vitrin Ürünleri — Panelden Yıldızlananlar */}
      <ProductsShowcase initialProducts={featuredProducts} />

      {/* 6. VIP Özel Sunum Concierge — Glassmorphism Anket */}
      <VIPConcierge />

      {/* Marka Vitrini — Infinite Carousel */}
      <BrandShowcase />

      {/* 6. Sipariş Sorgulama — Müşteri Takip Sistemi */}
      <OrderLookup />

      {/* 7. FAQ — Sıkça Sorulan Sorular */}
      <FAQSection />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* 8. CTA — WhatsApp İletişim */}
      <CTASection />
      
      {/* Build Marker - Can be removed later */}
      <div className="hidden">v1.2.0-sync-stable</div>
    </>
  );
}
