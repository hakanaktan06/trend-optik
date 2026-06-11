"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import OrderLookup from "@/components/home/OrderLookup";
import { Product, Brand } from "@/lib/firestore-server";
import PremiumProductCard from "@/components/product/PremiumProductCard";

export default function CatalogClient({ initialProducts, brands }: { initialProducts: Product[], brands: Brand[] }) {
  const [filtered, setFiltered] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let result = initialProducts;
    if (filter !== "all") {
      result = result.filter(p => p.brandId === filter);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.model?.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [filter, search, initialProducts]);

  const getBrandName = (brandId: string) => {
    const b = brands.find(br => br.id === brandId || br.slug === brandId || br.name === brandId);
    return b ? b.name : brandId;
  };

  return (
    <>
      <div className="container-premium">
        
        {/* Header */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Koleksiyon <span className="text-white/20 italic">Arşivi</span>
          </motion.h1>
          <p className="text-white/40 max-w-xl font-light text-lg">
            Trend Optik'in tüm seçkin modellerini keşfedin. Lüks ve zarafetin buluştuğu en geniş ürün yelpazesi.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === "all" 
                ? "bg-[var(--accent-gold)] text-black shadow-[0_0_15px_rgba(201,169,110,0.4)]" 
                : "text-white/40 hover:text-white"
              }`}
            >
              Tümü
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setFilter(brand.id)}
                className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === brand.id 
                  ? "bg-[var(--accent-gold)] text-black shadow-[0_0_15px_rgba(201,169,110,0.4)]" 
                  : "text-white/40 hover:text-white"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--accent-gold)] transition-colors" />
            <input 
              type="text" 
              placeholder="Model ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-all font-light"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
          {filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            >
              <PremiumProductCard 
                product={product} 
                brandName={getBrandName(product.brandId)} 
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-40">
            <p className="text-white/20 italic text-xl">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>

      <OrderLookup />
    </>
  );
}
