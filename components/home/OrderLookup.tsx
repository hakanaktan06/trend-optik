"use client";

import { useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  product: string;
  status: string;
}

export default function OrderLookup() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setSearched(true);
    try {
      const q = query(
        collection(db, "orders"),
        where("phone", "==", phone),
        limit(5)
      );
      const snap = await getDocs(q);
      const items: Order[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Order);
      });
      setResults(items);
    } catch (e) {
      console.error("Order lookup error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Teslimata Hazır": return <Truck className="w-6 h-6 text-amber-500" />;
      case "Teslim Edildi": return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      default: return <Package className="w-6 h-6 text-[var(--accent-gold)]" />;
    }
  };

  return (
    <section id="takip" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container-premium relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[var(--accent-gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block font-bold"
            >
              Müşteri Deneyimi
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Siparişinizin <span className="text-white/30 italic">Yolculuğu</span>
            </motion.h2>
            <p className="text-white/40 max-w-xl mx-auto font-light">
              Gözlüğünüzün durumunu anlık olarak takip edin. Telefon numaranızı girerek hazırlık ve teslimat sürecini görebilirsiniz.
            </p>
          </div>

          {/* Search Bar */}
          <div className="glass p-1.5 md:p-2 rounded-2xl md:rounded-full border border-white/5 max-w-xl mx-auto mb-16 flex flex-col md:flex-row items-center gap-2 pr-1.5 md:pr-2">
            <form onSubmit={handleSearch} className="flex-1 flex items-center px-4 md:px-6 w-full py-3 md:py-0">
              <Search className="w-5 h-5 text-white/20 mr-4" />
              <input 
                type="tel" 
                placeholder="Telefon numaranızı girin (05...)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none focus:ring-0 w-full placeholder:text-white/20 font-light text-sm md:text-base"
              />
            </form>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full md:w-auto bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black px-8 py-3.5 md:py-3 rounded-xl md:rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,169,110,0.3)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sorgula"}
            </button>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {searched && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {results && results.length > 0 ? (
                  results.map((order) => (
                    <div key={order.id} className="glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[var(--accent-gold)]/20 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="text-[10px] text-[var(--accent-gold)] font-bold tracking-widest uppercase mb-1">{order.status}</p>
                          <h4 className="text-xl font-bold text-white mb-1">{order.product}</h4>
                          <p className="text-sm text-white/30">Sayın {order.customerName}</p>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex-1">
                          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Durum Güncellemesi</p>
                          <p className="text-sm text-white/60 font-light italic">Siparişiniz titizlikle işleniyor.</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[var(--accent-gold)]/50" />
                      </div>
                    </div>
                  ))
                ) : (
                  !loading && (
                    <div className="text-center py-20 glass rounded-3xl border border-white/5 border-dashed">
                      <p className="text-white/40 italic">Kayıt bulunamadı. Lütfen telefon numaranızı kontrol edin.</p>
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
