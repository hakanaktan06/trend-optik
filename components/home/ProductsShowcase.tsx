"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  isFeatured?: boolean;
}

export default function ProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        // BYPASS: Tüm koleksiyonu çekiyoruz
        const snap = await getDocs(collection(db, "products"));
        
        const allItems: Product[] = [];
        snap.forEach((doc) => {
          allItems.push({ id: doc.id, ...doc.data() } as Product);
        });

        // JAVASCRIPT FILTRELEME: Sadece isFeatured olanları ayıkla
        const vitrinler = allItems.filter(p => p.isFeatured === true);
        setProducts(vitrinler);
      } catch (e) {
        console.error("Vitrin fetch bypass error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilter();
  }, []);

  return (
    <section id="koleksiyon" className="py-16 md:py-32 bg-[#050505] relative overflow-hidden">
      <div className="container-premium relative z-10 px-6 md:px-0">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block font-bold"
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
          <Link href="/katalog" className="group flex items-center gap-2 text-white/30 hover:text-[var(--accent-gold)] transition-colors text-[10px] tracking-widest uppercase font-bold">
            Tüm Modeller <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-[var(--accent-gold)] animate-spin" />
          </div>
        ) : products.length > 0 ? (
          /* Ürün Listesi - Zarif Yatay Kaydırma (Fixed Size Elegant Carousel) */
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-10 md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative w-[220px] h-[320px] md:w-auto md:h-auto md:aspect-[4/5] flex-none snap-center overflow-hidden rounded-[1.5rem] bg-white/[0.03] backdrop-blur-md border border-white/[0.05] group flex flex-col transition-all duration-500"
              >
                <Link href={`/product/${product.id}`} className="flex flex-col h-full">
                  {/* Ürün Görseli: Kartın %65'ini kaplar */}
                  <div className="h-[65%] w-full overflow-hidden relative bg-black/20">
                    <img 
                      src={product.img} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* İçerik: Alt %35 */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-light text-white tracking-tight group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[var(--accent-gold)]/70 uppercase tracking-[0.2em] font-medium">
                          {product.category}
                        </span>
                        <p className="text-xs text-white/50 font-light whitespace-nowrap tracking-wide">
                          {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Minimalist WhatsApp Link */}
                    <div className="flex justify-end pt-2 border-t border-white/5">
                      <a 
                        href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba, ${product.name} modelini incelemek istiyorum.`)}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold hover:text-[var(--accent-gold)] transition-all group/wa"
                      >
                        <MessageCircle size={12} className="text-[var(--accent-gold)] opacity-40 group-hover/wa:opacity-100" />
                        Bilgi Al
                      </a>
                    </div>
                  </div>
                </Link>
              </motion.div>
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
