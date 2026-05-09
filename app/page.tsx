import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import VIPConcierge from "@/components/home/VIPConcierge";
import LensTech from "@/components/home/LensTech";
import BrandShowcase from "@/components/home/BrandShowcase";
import CTASection from "@/components/home/CTASection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";
import ParallaxBanner from "@/components/home/ParallaxBanner";

export default function Home() {
  return (
    <>
      {/* 1. Hero — Apple Style Canvas Scroll Animasyon */}
      <HeroSection />

      {/* 2. Zanaatkarlık ve Materyaller — Apple Bento Grid */}
      <BentoGrid />

      {/* 3. Lens Teknolojisi — Before/After Slider */}
      <LensTech />

      {/* 4. Lifestyle Parallax Banner */}
      <ParallaxBanner />

      {/* 5. Vitrin Ürünleri — Panelden Yıldızlananlar */}
      <ProductsShowcase />

      {/* 6. VIP Özel Sunum Concierge — Glassmorphism Anket */}
      <VIPConcierge />

      {/* Marka Vitrini — Infinite Carousel */}
      <BrandShowcase />

      {/* 6. Sipariş Sorgulama — Müşteri Takip Sistemi */}
      <OrderLookup />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* 8. CTA — WhatsApp İletişim */}
      <CTASection />
      
      {/* Build Marker - Can be removed later */}
      <div className="hidden">v1.2.0-sync-stable</div>
    </>
  );
}
