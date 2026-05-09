"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Filter, Search } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  isFeatured: boolean;
}

import OrderLookup from "@/components/home/OrderLookup";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
        setFiltered(items);
      } catch (e) {
        console.error("Catalog fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    let result = products;
    if (filter !== "all") {
      result = result.filter(p => p.category === filter);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [filter, search, products]);

  const categories = ["all", "gunes", "klasik", "kadin", "cocuk"];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
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
          <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/5 overflow-x-auto max-w-full scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === cat 
                  ? "bg-[var(--accent-gold)] text-black shadow-[0_0_15px_rgba(201,169,110,0.4)]" 
                  : "text-white/40 hover:text-white"
                }`}
              >
                {cat === "all" ? "Tümü" : cat}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/5 rounded-2xl mb-4" />
                <div className="h-4 bg-white/5 rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/3 mx-auto" />
              </div>
            ))
          ) : (
            filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-[var(--accent-gold)]/30 transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {product.isFeatured && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                      <span className="text-[10px] text-white uppercase tracking-widest font-bold">Trend</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Satın Al
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold mb-1 block">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-white/40 font-medium tracking-wider">
                    {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-40">
            <p className="text-white/20 italic text-xl">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>

      <OrderLookup />
    </main>
  );
}

