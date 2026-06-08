"use client";

import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle, ChevronLeft, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/firestore-server";

interface ProductClientUIProps {
  product: Product;
  related: Product[];
}

export default function ProductClientUI({ product, related }: ProductClientUIProps) {
  const whatsappLink = `https://wa.me/905312075818?text=Merhaba, ${encodeURIComponent(product.name)} modeli hakkında bilgi alabilir miyim?`;

  return (
    <div className="container-premium relative">
      {/* Back Button */}
      <Link 
        href="/katalog" 
        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-all">
          <ChevronLeft size={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Koleksiyona Dön</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-24">
        {/* Left: Product Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 relative"
        >
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/5 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.img} 
              alt={`${product.name} - Trend Optik Mersin`}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/60 backdrop-blur-xl px-4 md:px-6 py-2 rounded-full border border-[var(--accent-gold)]/30 flex items-center gap-2 shadow-2xl">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                <span className="text-[8px] md:text-[10px] text-white uppercase tracking-[0.2em] font-bold">Trend Seçkisi</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="mb-8 md:mb-10">
            <span className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-3 md:mb-4 block font-bold">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tighter">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl md:text-4xl font-light text-white/90 tracking-tighter">
                {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
              </span>
              <span className="px-3 py-1 bg-white/5 rounded-md text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest font-medium border border-white/5">
                Stokta Mevcut
              </span>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
            <p className="text-white/40 font-light leading-relaxed text-base md:text-lg italic">
              {product.description || product.desc || "Zarafetin ve kalitenin buluştuğu bu özel tasarım, göz sağlığınızı korurken stilinize eşsiz bir dokunuş katıyor. En yüksek kalite materyallerle üretilmiştir."}
            </p>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0" />
                <span className="text-xs md:text-sm text-white/60 font-medium">%100 UV Korumalı Orijinal Camlar</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Truck className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0" />
                <span className="text-xs md:text-sm text-white/60 font-medium">Aynı Gün Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <RotateCcw className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0" />
                <span className="text-xs md:text-sm text-white/60 font-medium">14 Gün Değişim Garantisi</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                import("@/lib/analytics").then((m) => m.trackWhatsAppLead(product.name));
              }}
              className="flex-1 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black py-4 md:py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[var(--accent-gold)]/20"
            >
              <MessageCircle size={18} />
              WhatsApp ile Sorgula
            </a>
            <button className="flex-1 glass hover:bg-white/10 text-white py-4 md:py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
              <ShoppingBag size={18} className="text-[var(--accent-gold)]" />
              Satın Al
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-40">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-white">Bunlar da <span className="text-white/20 italic">İlginizi Çekebilir</span></h3>
            <Link href="/katalog" className="text-sm text-[var(--accent-gold)] font-bold uppercase tracking-widest hover:underline">Tümünü Gör</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((item) => (
              <Link 
                key={item.id} 
                href={`/product/${item.id}`}
                className="group"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-[var(--accent-gold)]/30 transition-all mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={`${item.name} - Trend Optik Mersin`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[var(--accent-gold)] uppercase font-bold tracking-widest mb-1">{item.category}</p>
                  <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-sm text-white/30">{item.price.toString().includes("₺") ? item.price : `${item.price} ₺`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
