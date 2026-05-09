"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
          orderBy("createdAt", "desc"),
          limit(6)
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

  if (loading) return null;

  return (
    <section id="koleksiyon" className="py-16 md:py-32 bg-[#050505] relative overflow-hidden">
      <div className="container-premium relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 px-6 md:px-0">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-3 block font-bold"
            >
              Exclusive Selection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tighter"
            >
              Sezonun <span className="text-white/40 font-light italic">Öne Çıkanları</span>
            </motion.h2>
          </div>
          <Link href="/katalog" className="group flex items-center gap-2 text-white/30 hover:text-[var(--accent-gold)] transition-colors text-xs tracking-widest uppercase font-medium">
            Tümünü Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Carousel / Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative min-w-[80vw] md:min-w-0 md:w-auto flex-shrink-0 snap-center group"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/[0.05] transition-all duration-700 group-hover:border-[var(--accent-gold)]/20">
                  {/* Product Image */}
                  <div className="relative w-full h-full p-4">
                    <Image 
                      src={product.img} 
                      alt={product.name}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-[9px] text-white/60 uppercase tracking-[0.2em] font-bold">Yeni Sezon</span>
                  </div>
                </div>

                <div className="mt-8 px-2 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-light text-white tracking-tight group-hover:text-[var(--accent-gold)] transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-white/40 font-light tracking-wider text-sm md:text-base">
                      {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                    </p>
                  </div>
                  
                  {/* WhatsApp Link - Bilgi Al */}
                  <a 
                    href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba Trend Optik, vitrindeki ${product.name} modeli hakkında bilgi almak istiyorum.`)}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 pt-2 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold hover:text-[var(--accent-gold)] transition-colors group/link"
                  >
                    <MessageCircle size={14} className="group-hover/link:animate-pulse" />
                    Bilgi Al <span className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0">→</span>
                  </a>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl mx-6">
            <p className="text-white/20 italic font-light">Vitrinde henüz yıldızlı ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
}
