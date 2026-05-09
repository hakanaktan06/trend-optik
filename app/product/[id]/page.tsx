"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MessageCircle, ChevronLeft, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  description?: string;
  features?: string[];
  isFeatured?: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Product;
          setProduct(data);
          
          // Fetch related
          const q = query(
            collection(db, "products"),
            where("category", "==", data.category),
            limit(4)
          );
          const rSnap = await getDocs(q);
          const items: Product[] = [];
          rSnap.forEach(d => {
            if (d.id !== id) items.push({ id: d.id, ...d.data() } as Product);
          });
          setRelated(items);
        }
      } catch (e) {
        console.error("Product fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ürün Bulunamadı</h2>
        <Link href="/katalog" className="text-[var(--accent-gold)] flex items-center gap-2">
          <ChevronLeft size={20} /> Koleksiyona Dön
        </Link>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/905551234567?text=Merhaba%2C%20${encodeURIComponent(product.name)}%20modeli%20hakkında%20bilgi%20almak%20istiyorum.`;

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Left: Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 group">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-[var(--accent-gold)]/30 flex items-center gap-2 shadow-2xl">
                  <Star className="w-4 h-4 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                  <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">Trend Seçkisi</span>
                </div>
              )}
            </div>
            
            {/* Decorative background glow */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-[var(--accent-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Right: Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="mb-10">
              <span className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block font-bold">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-light text-white/90 tracking-tighter">
                  {product.price.toString().includes("₺") ? product.price : `${product.price} ₺`}
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-md text-[10px] text-white/40 uppercase tracking-widest font-medium border border-white/5">
                  Stokta Mevcut
                </span>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <p className="text-white/40 font-light leading-relaxed text-lg italic">
                {product.description || "Zarafetin ve kalitenin buluştuğu bu özel tasarım, göz sağlığınızı korurken stilinize eşsiz bir dokunuş katıyor. En yüksek kalite materyallerle üretilmiştir."}
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span className="text-sm text-white/60 font-medium">%100 UV Korumalı Orijinal Camlar</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Truck className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span className="text-sm text-white/60 font-medium">Aynı Gün Ücretsiz Kargo</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <RotateCcw className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span className="text-sm text-white/60 font-medium">14 Gün Değişim Garantisi</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[var(--accent-gold)]/20"
              >
                <MessageCircle size={20} />
                WhatsApp ile Sorgula
              </a>
              <button className="flex-1 glass hover:bg-white/10 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all">
                <ShoppingBag size={20} className="text-[var(--accent-gold)]" />
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
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-[var(--accent-gold)] uppercase font-bold tracking-widest mb-1">{item.category}</p>
                    <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                    <p className="text-sm text-white/30">{item.price} ₺</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
