"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import PremiumProductCard from "@/components/product/PremiumProductCard";
import { Product, Brand } from "@/lib/firestore-server";

export default function ProductsShowcase({ initialProducts = [], brands = [] }: { initialProducts?: Product[], brands?: Brand[] }) {
  const [activeBrand, setActiveBrand] = useState<string>("all");

  const filteredProducts = activeBrand === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.brandId === activeBrand);

  const getBrandName = (brandId: string) => {
    const b = brands.find(br => br.id === brandId || br.slug === brandId || br.name === brandId);
    return b ? b.name : brandId;
  };

  return (
    <section id="koleksiyon" className="py-16 md:py-24 bg-[#050505] relative overflow-hidden">
      {/* Background glow effects omitted for brevity, keeping simple dark theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--accent-gold)]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="container-premium relative z-10 px-4 md:px-6">
        
        {/* Header & Filter Chips */}
        <div className="flex flex-col items-center text-center mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[var(--accent-gold)] text-[11px] tracking-[0.5em] uppercase mb-6 block font-bold">
              Trend Optik Exclusive
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white">
              Vitrin <span className="font-playfair italic text-white/50">Koleksiyonu</span>
            </h2>
            <p className="text-white/40 mt-6 max-w-2xl mx-auto font-light leading-relaxed">
              En seçkin markaların özenle seçilmiş ikonik modellerini keşfedin. Trend Optik Mersin güvencesiyle stilinizi yeniden tanımlayın.
            </p>
          </motion.div>
        </div>

        {/* Brand Filter Chips */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-3 overflow-x-auto pb-6 mb-12 scrollbar-hide justify-center max-w-4xl mx-auto"
        >
          <button 
            onClick={() => setActiveBrand("all")}
            className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all ${
              activeBrand === "all" 
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            Tüm Modeller
          </button>
          {brands.map(brand => (
            <button 
              key={brand.id}
              onClick={() => setActiveBrand(brand.id)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all ${
                activeBrand === brand.id 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </motion.div>

        {filteredProducts.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
            >
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="focus-reveal"
                >
                  <PremiumProductCard 
                    product={product} 
                    brandName={getBrandName(product.brandId)} 
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 text-center"
            >
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all hover:-translate-y-1"
              >
                Tüm Ürünler <ArrowRight size={18} />
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20 px-6 border border-dashed border-white/10 rounded-3xl mx-auto max-w-2xl glass">
            <p className="text-white/40 font-light mb-6">
              Vitrin yakında yeni modellerle dolacak — WhatsApp'tan sorabilirsiniz.
            </p>
            <a
              href="https://wa.me/905312075818?text=Merhaba,%20yeni%20modeller%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] text-black font-bold rounded-full transition-transform hover:scale-105"
            >
              WhatsApp'tan Sorun
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
