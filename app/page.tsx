import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import VIPConcierge from "@/components/home/VIPConcierge";
import LensTech from "@/components/home/LensTech";
import BrandShowcase from "@/components/home/BrandShowcase";
import CTASection from "@/components/home/CTASection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import OrderLookup from "@/components/home/OrderLookup";
import ParallaxBanner from "@/components/home/ParallaxBanner";

async function getFeaturedProducts() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`;

  try {
    const res = await fetch(firebaseUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    
    // Transform Firebase REST format to our Product interface
    const products = (data.documents || []).map((doc: any) => {
      const fields = doc.fields;
      return {
        id: doc.name.split("/").pop(),
        name: fields.name?.stringValue || "",
        price: fields.price?.stringValue || fields.price?.integerValue || fields.price?.doubleValue || 0,
        img: fields.img?.stringValue || "",
        category: fields.category?.stringValue || "",
        isFeatured: fields.isFeatured?.booleanValue || false,
      };
    });

    return products.filter((p: any) => p.isFeatured === true);
  } catch (error) {
    console.error("Server-side fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

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
      <ProductsShowcase initialProducts={featuredProducts} />

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
