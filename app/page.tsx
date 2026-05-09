import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandShowcase from "@/components/home/BrandShowcase";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      {/* Hero — GSAP Scroll-Driven Animasyon */}
      <HeroSection />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* Hizmetler / Öne Çıkan Ürünler */}
      <FeaturedProducts />

      {/* Marka Vitrini — Infinite Carousel */}
      <BrandShowcase />

      {/* Altın Çizgi Ayırıcı */}
      <div className="divider-gold" />

      {/* CTA — WhatsApp & Randevu */}
      <CTASection />
    </>
  );
}
