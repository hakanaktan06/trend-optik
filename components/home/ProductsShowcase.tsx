"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  isFeatured: boolean;
}

export default function ProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarred = async () => {
      setLoading(true);
      try {
        /* 
           DİKKAT: Admin panelinde yıldızladığın ürünlerin Firestore'daki alan adı 
           aşağıdaki 'where' sorgusunda 'isFeatured' olarak tanımlıdır. 
           Eğer panelinde bu alanın adı 'vitrin' veya 'yildizli' ise, 
           aşağıdaki 'isFeatured' yazısını o alan adıyla değiştirmen yeterlidir.
        */
        const q = query(
          collection(db, "products"),
          where("isFeatured", "==", true), // <-- BURAYI GEREKİRSE 'vitrin' YAPIN
          limit(6)
        );
        
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
      } catch (e) {
        console.error("Vitrin fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStarred();
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
              Exclusive Selection
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
            Kataloğu Keşfet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          /* Loading Skeleton */
          <div className="flex gap-6 overflow-hidden md:grid md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[80vw] md:min-w-0 aspect-[4/5] bg-white/[0.02] rounded-[2.5rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : products.length > 0 ? (
          /* Ürün Listesi - Mobil Yatay Kaydırma / Masaüstü Grid */
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative min-w-[85vw] flex-shrink-0 snap-center md:min-w-0 md:w-auto overflow-hidden rounded-[2rem] bg-white/[0.02] backdrop-blur-md border border-white/[0.05] group"
              >
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden p-8 md:p-12">
                    {/* Ürün Fotoğrafı: product.img */}
                    <Image 
                      src={product.img} 
                      alt={product.name}
                      fill
                      className="object-contain p-8 md:p-12 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-8 pt-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-[var(--accent-gold)] uppercase tracking-[0.2em] font-bold mb-1 block">
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
                    
                    {/* WhatsApp Link */}
                    <div className="pt-2">
                      <a 
                        href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba, ${product.name} modelini incelemek istiyorum.`)}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold hover:text-[var(--accent-gold)] transition-all"
                      >
                        <MessageCircle size={14} className="text-[var(--accent-gold)]" />
                        Bilgi Al
                      </a>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Boş State */
          <div className="text-center py-24 border border-dashed border-white/10 rounded-[2.5rem] mx-6">
            <p className="text-white/20 italic font-light tracking-widest text-xs uppercase">
              Vitrinde henüz ürün bulunmuyor. <br/> Panelden ürünleri yıldızlayarak ekleyebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
