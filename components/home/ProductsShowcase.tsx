"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  isFeatured?: boolean;
}

export default function ProductsShowcase({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [rotation, setRotation] = useState(0);

  const angle = initialProducts.length > 0 ? 360 / initialProducts.length : 0;
  const radius = initialProducts.length > 5 ? 320 : 280;

  const handleDragEnd = (e: any, info: any) => {
    const swipeThreshold = 20;
    if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
      setRotation(r => r + angle);
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
      setRotation(r => r - angle);
    }
  };

  return (
    <section id="koleksiyon" className="py-16 md:py-32 bg-[#050505] relative overflow-hidden">
      {/* Ambient Liquid Glow Background (Highly Optimized GPU Rendering) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow Blob 1: Premium Gold (Theme Aura) */}
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[5%] left-[5%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] rounded-full blur-3xl will-change-[opacity]"
          style={{ background: "radial-gradient(circle, var(--aura-color) 0%, rgba(201, 169, 110, 0.03) 50%, transparent 100%)" }}
        />
        
        {/* Glow Blob 2: Warm Amber / Bronze */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[25%] right-[5%] w-[300px] md:w-[550px] h-[300px] md:h-[550px] rounded-full blur-3xl will-change-[opacity]"
          style={{ background: "radial-gradient(circle, rgba(184, 148, 31, 0.08) 0%, rgba(184, 148, 31, 0.01) 50%, transparent 100%)" }}
        />
        
        {/* Glow Blob 3: Center Highlight (Intense Aura) */}
        <motion.div
          animate={{
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[400px] md:w-[750px] h-[300px] md:h-[450px] rounded-full blur-3xl will-change-[opacity]"
          style={{ background: "radial-gradient(circle, var(--aura-intense) 0%, rgba(201, 169, 110, 0.04) 50%, transparent 100%)" }}
        />
      </div>

      <div className="container-premium relative z-10 px-6 md:px-0">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[var(--accent-color)] text-[10px] tracking-[0.4em] uppercase mb-4 block font-bold"
            >
              Elite Selection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tighter"
            >
              Sezonun <span className="text-white/30 font-light italic">Yıldızları</span>
            </motion.h2>
          </div>
          <Link href="/katalog" className="group flex items-center gap-2 text-white/30 hover:text-[var(--accent-color)] transition-colors text-[10px] tracking-widest uppercase font-bold">
            Tüm Modeller <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {initialProducts.length > 0 ? (
          
          /* 3D Cylindrical Carousel Wrapper */
          <div className="relative h-[450px] md:h-[500px] flex items-center justify-center perspective-[1000px] w-full max-w-full overflow-hidden group/carousel">
            
            {/* Masaüstü Hayalet Sol Buton */}
            <button 
              onClick={() => setRotation(prev => prev + angle)}
              className="hidden md:flex absolute left-8 lg:left-24 z-50 w-12 h-12 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 items-center justify-center hover:bg-white/10 hover:scale-110"
              aria-label="Önceki Ürün"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={{ rotateY: rotation }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-[220px] h-[320px] cursor-grab active:cursor-grabbing"
            >
              {initialProducts.map((product, idx) => {
                const itemAngle = idx * angle;
                return (
                  <div
                    key={product.id}
                    className="absolute inset-0 w-full h-full rounded-[1.5rem] bg-white/[0.03] backdrop-blur-md border border-white/[0.05] flex flex-col overflow-hidden group select-none"
                    style={{ transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)` }}
                  >
                    <Link href={`/product/${product.id}`} className="flex flex-col h-full pointer-events-none md:pointer-events-auto">
                      {/* Ürün Görseli: Kartın %60'ı */}
                      <div className="h-[60%] w-full overflow-hidden relative bg-black/20 flex-shrink-0">
                        <Image 
                          src={product.img} 
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-[13px] font-medium text-white tracking-tight group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[9px] text-[var(--accent-color)]/70 uppercase tracking-[0.2em] font-medium">
                              {product.category}
                            </span>
                            <p className="text-[11px] text-white/50 font-light whitespace-nowrap tracking-wide">
                              {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                            </p>
                          </div>
                        </div>
                        
                        {/* Minimalist WhatsApp Link */}
                        <div className="flex justify-end pt-2 border-t border-white/5 mt-auto">
                          <a 
                            href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba, ${product.name} modelini incelemek istiyorum.`)}`}
                            onClick={(e) => { e.stopPropagation(); }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold hover:text-[var(--accent-color)] transition-all group/wa pointer-events-auto"
                          >
                            <MessageCircle size={12} className="text-[var(--accent-color)] opacity-40 group-hover/wa:opacity-100" />
                            Bilgi Al
                          </a>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </motion.div>

            {/* Masaüstü Hayalet Sağ Buton */}
            <button 
              onClick={() => setRotation(prev => prev - angle)}
              className="hidden md:flex absolute right-8 lg:right-24 z-50 w-12 h-12 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 items-center justify-center hover:bg-white/10 hover:scale-110"
              aria-label="Sonraki Ürün"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Navigasyon İpuçları */}
            <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-4 pointer-events-none opacity-40">
              <span className="text-[10px] text-[var(--accent-color)] uppercase tracking-[0.3em] font-bold">&larr; Sürükle &rarr;</span>
            </div>

          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-[2.5rem] mx-6">
            <p className="text-white/20 italic font-light tracking-widest text-xs uppercase">
              Şu an vitrinde ürün bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
