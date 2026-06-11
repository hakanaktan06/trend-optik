"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, ShieldCheck, Truck, RotateCcw, Star, PackageX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/firestore-server";
import PremiumProductCard from "./PremiumProductCard";

interface ProductClientUIProps {
  product: Product;
  related: Product[];
  brandName: string;
}

export default function ProductClientUI({ product, related, brandName }: ProductClientUIProps) {
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];
  
  const isOutOfStock = product.stock <= 0;
  const whatsappLink = `https://wa.me/905312075818?text=Merhaba, ${encodeURIComponent(`"${brandName} ${product.model} - ${product.name}"`)} modeli hakkında bilgi almak istiyorum. (https://trendoptikmersin.com/product/${product.id})`;

  return (
    <div className="container-premium relative">
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()} 
        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-all bg-white/5">
          <ChevronLeft size={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Geri Dön</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">
        {/* Left: Product Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 relative flex flex-col gap-4"
        >
          {/* Main Image */}
          <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative"
              >
                <Image 
                  src={images[activeImage]} 
                  alt={`${brandName} ${product.name}`}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {product.isFeatured && (
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-[var(--accent-gold)]/30 flex items-center gap-2 shadow-2xl">
                <Star className="w-4 h-4 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">Trend Seçkisi</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-300 ${activeImage === idx ? 'border-[var(--accent-gold)] opacity-100 scale-105' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 flex flex-col"
        >
          <div className="mb-8">
            <span className="text-[var(--accent-gold)] text-xs tracking-[0.4em] uppercase mb-4 block font-bold">
              {brandName}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="text-lg text-white/50 font-sans tracking-wider mb-6">
              Model: <span className="text-white font-medium">{product.model}</span>
            </div>
            
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <PackageX className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Stokta Yok / Yakında</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Stokta Mevcut</span>
              </div>
            )}
          </div>

          <div className="space-y-6 md:space-y-8 mb-10">
            <p className="text-white/60 font-light leading-relaxed text-base md:text-lg">
              {product.description || "Zarafetin ve kalitenin buluştuğu bu özel tasarım, göz sağlığınızı korurken stilinize eşsiz bir dokunuş katıyor. En yüksek kalite materyallerle üretilmiştir."}
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-white/[0.02] transition-colors border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[var(--accent-gold)]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold tracking-wide">%100 UV Korumalı Orijinal Camlar</h4>
                  <p className="text-white/40 text-xs mt-1">Tüm ürünlerimiz distribütör garantilidir.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-white/[0.02] transition-colors border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-[var(--accent-gold)]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold tracking-wide">Ücretsiz ve Güvenli Kargo</h4>
                  <p className="text-white/40 text-xs mt-1">Özenle paketlenip kapınıza teslim edilir.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-white/[0.02] transition-colors border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-6 h-6 text-[var(--accent-gold)]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold tracking-wide">Müşteri Memnuniyeti</h4>
                  <p className="text-white/40 text-xs mt-1">14 gün içerisinde kolay iade ve değişim.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {isOutOfStock && (
              <p className="text-[10px] text-white/40 tracking-widest uppercase mb-3 px-1 text-center sm:text-left">
                Bu ürün geçici olarak temin edilemiyor, ancak ön sipariş için bilgi alabilirsiniz.
              </p>
            )}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                import("@/lib/analytics").then((m) => m.trackWhatsAppLead(product.name));
              }}
              className="w-full bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black py-5 md:py-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[var(--accent-gold)]/20 text-lg uppercase tracking-wider"
            >
              <MessageCircle size={24} />
              WhatsApp İle Bilgi Al
            </a>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-32 border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Benzer <span className="text-white/20 italic font-playfair">Modeller</span></h3>
            <Link href={`/marka/${product.brandId}`} className="text-xs text-[var(--accent-gold)] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
              Tüm {brandName} Modelleri <span>&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <PremiumProductCard 
                key={item.id} 
                product={item} 
                brandName={brandName} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
