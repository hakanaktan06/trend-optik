import HeroSection from "@/components/home/HeroSection";
import Craftsmanship from "@/components/home/Craftsmanship";
import VIPConcierge from "@/components/home/VIPConcierge";
import TheVault from "@/components/home/TheVault";
import LensTech from "@/components/home/LensTech";
import BrandShowcase from "@/components/home/BrandShowcase";
import CTASection from "@/components/home/CTASection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";

export default function Home() {
  return (
    <>
      {/* 1. Hero — Apple Style Canvas Scroll Animasyon */}
      <HeroSection />

      {/* 2. Zanaatkarlık ve Materyaller — Parallax & Hover Glow */}
      <Craftsmanship />

      {/* 3. Lens Teknolojisi — Before/After Slider */}
      <LensTech />

      {/* 4. Vitrin Ürünleri — Panelden Yıldızlananlar */}
      <ProductsShowcase />

      {/* 5. VIP Özel Sunum Concierge — Glassmorphism Anket */}
      <VIPConcierge />

      {/* Marka Vitrini — Infinite Carousel */}
      <BrandShowcase />

      {/* 6. Sipariş Sorgulama — Müşteri Takip Sistemi */}
      <OrderLookup />

      {/* 7. The Vault — Basılı Tutarak Kasa Açma Efekti (Gizli Koleksiyon) */}
      <TheVault />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* 8. CTA — WhatsApp İletişim */}
      <CTASection />
      
      {/* Build Marker - Can be removed later */}
      <div className="hidden">v1.2.0-sync-stable</div>
    </>
  );
}
