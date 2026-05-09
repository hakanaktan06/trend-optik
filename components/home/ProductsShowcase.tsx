"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
}

export default function ProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("isFeatured", "==", true),
          limit(8)
        );
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
      } catch (e) {
        console.error("Featured products fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return null; // Or a skeleton

  return (
    <section id="koleksiyon" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--accent-gold)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container-premium relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-3 block font-bold"
            >
              Özel Seçki
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Vitrindeki <span className="text-white/40">Yıldızlar</span>
            </motion.h2>
          </div>
          <Link href="/katalog" className="group flex items-center gap-2 text-white/50 hover:text-[var(--accent-gold)] transition-colors text-sm tracking-widest uppercase font-medium">
            Tüm Koleksiyonu Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-[var(--accent-gold)]/30 transition-all duration-500">
                {/* Product Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 shadow-2xl">
                    <ShoppingBag className="w-4 h-4" /> İncele
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                  <span className="text-[10px] text-white uppercase tracking-widest font-bold">Trend Seçimi</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold mb-1 block">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--accent-gold)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-white/40 font-medium tracking-wider">
                  {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-white/20 italic">Vitrinde henüz ürün bulunmuyor. Panelden yıldızlayarak ekleyebilirsiniz.</p>
          </div>
        )}
      </div>
    </section>
  );
}
