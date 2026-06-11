"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--accent-gold)]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="container-premium relative z-10 px-6 md:px-0">
        
        {/* Header & Filter Chips */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block font-bold">
              Elite Selection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              Sezonun <span className="text-white/30 font-light italic">Yıldızları</span>
            </h2>
          </div>
        </div>

        {/* Brand Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button 
            onClick={() => setActiveBrand("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${
              activeBrand === "all" 
                ? "bg-[var(--accent-gold)] text-black" 
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            Tümü
          </button>
          {brands.map(brand => (
            <button 
              key={brand.id}
              onClick={() => setActiveBrand(brand.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${
                activeBrand === brand.id 
                  ? "bg-[var(--accent-gold)] text-black" 
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <PremiumProductCard 
                key={product.id} 
                product={product} 
                brandName={getBrandName(product.brandId)} 
              />
            ))}
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
