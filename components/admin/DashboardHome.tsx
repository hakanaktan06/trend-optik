"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, Truck, Target, Award, Eye, Settings2 } from "lucide-react";
import { toast } from "react-hot-toast";
// Actually, to be safe, I'll use simple inline states or native alerts if Sonner is not installed. 
// Let's use simple window.alert for now to mimic trendAlert, or build a quick toast.
// For the sake of premium look, I'll build a quick custom Toast function or use standard browser features. Let's just use simple state for now.

interface Stats {
  products: number;
  orders: number;
  certs: number;
  lenses: number;
  radar: number;
}

export default function DashboardHome({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, certs: 0, lenses: 0, radar: 0 });
  const [theme, setTheme] = useState("standart");
  const [greeting, setGreeting] = useState("Hoş Geldiniz");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Günaydın");
    else if (hour >= 12 && hour < 18) setGreeting("İyi Günler");
    else if (hour >= 18 && hour < 22) setGreeting("İyi Akşamlar");
    else setGreeting("İyi Geceler");

    loadStats();
    loadTheme();
  }, []);

  const loadStats = async () => {
    try {
      // Products
      const pSnap = await getDocs(collection(db, "products"));
      // Orders
      const oSnap = await getDocs(collection(db, "orders"));
      let activeOrders = 0;
      let radarCount = 0;
      const today = new Date();

      oSnap.forEach((doc) => {
        const order = doc.data();
        if (order.status !== "Teslim Edildi") activeOrders++;
        
        if (order.createdAt) {
          const date = order.createdAt.toDate();
          const diffDays = Math.ceil(Math.abs(today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 360) radarCount++;
        }
      });

      // Certs
      const cSnap = await getDocs(collection(db, "certificates"));
      // Lenses
      const lSnap = await getDocs(collection(db, "lenses"));

      setStats({
        products: pSnap.size,
        orders: activeOrders,
        certs: cSnap.size,
        lenses: lSnap.size,
        radar: radarCount
      });
    } catch (e) {
      console.error("Stats load error", e);
    }
  };

  const loadTheme = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists()) {
        setTheme(snap.data().activeTheme);
      }
    } catch(e) {}
  };

  const handleUpdateTheme = async () => {
    setIsUpdating(true);
    try {
      await setDoc(doc(db, "settings", "theme"), { activeTheme: theme });
      toast.success("Site teması başarıyla güncellendi.");
    } catch(e) {
      toast.error("Tema güncellenirken hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const statCards = [
    { title: "Ürün", count: stats.products, icon: Package, color: "text-[var(--accent-gold)]", border: "border-b-[var(--accent-gold)]", bg: "bg-[var(--accent-gold)]/10" },
    { title: "Sipariş", count: stats.orders, icon: Truck, color: "text-amber-500", border: "border-b-amber-500", bg: "bg-amber-500/10" },
    { title: "Radar", count: stats.radar, icon: Target, color: "text-red-500", border: "border-b-red-500", bg: "bg-red-500/10", action: () => setActiveTab("radar") },
    { title: "VIP", count: stats.certs, icon: Award, color: "text-purple-500", border: "border-b-purple-500", bg: "bg-purple-500/10" },
    { title: "Lens", count: stats.lenses, icon: Eye, color: "text-cyan-500", border: "border-b-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">
          {greeting}, <span className="text-[var(--accent-gold)]">Patron</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            onClick={card.action}
            className={`glass p-6 text-center rounded-2xl border-b-4 ${card.border} ${card.action ? "cursor-pointer hover:-translate-y-1 transition-transform" : ""}`}
          >
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-white/50 text-sm mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold text-white">{card.count}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden border-white/5">
          {/* Subtle Atmosphere Icon in background */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Settings2 className="w-64 h-64 text-[var(--accent-color)]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--aura-color)] flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Global Atmosphere Controller</h3>
            </div>
            
            <p className="text-white/40 text-sm mb-10 max-w-lg font-light leading-relaxed">
              Tüm sitenin aurasını tek tıkla profesyonelce yönetin. Vurgu renkleri, parlama efektleri ve tipografi anında tüm kullanıcılarda güncellenir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: "standard", label: "Standard (Pure Gold)", desc: "Zifiri siyah ve premium altın parlamalar." },
                { id: "amber", label: "Amber Gold (Sunset)", desc: "Sıcak amber tonları ve yüksek kontrastlı lüks." },
                { id: "winter", label: "Winter Ice (Diamond)", desc: "Gümüş ışıltılar ve soğuk kristalize cam efekti." },
                { id: "executive", label: "Executive Matrix (CEO)", desc: "Neon yeşili detaylar ve monospaced fontlar." },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-6 rounded-3xl border text-left transition-all duration-500 group ${
                    theme === t.id 
                    ? "bg-[var(--aura-color)] border-[var(--accent-color)]/30 shadow-[0_0_30px_var(--aura-color)]" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${theme === t.id ? "text-white" : "text-white/60"}`}>
                        {t.label}
                      </span>
                      {t.id === "standard" && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Önerilen
                        </span>
                      )}
                    </div>
                    {theme === t.id && (
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse shadow-[0_0_10px_var(--accent-color)]" />
                    )}
                  </div>
                  <p className="text-xs text-white/30 font-light leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={handleUpdateTheme}
              disabled={isUpdating}
              className="w-full py-5 bg-white text-black hover:bg-[var(--accent-color)] hover:text-white transition-all duration-500 font-bold rounded-2xl tracking-[0.2em] uppercase text-xs disabled:opacity-50 active:scale-[0.98]"
            >
              {isUpdating ? "ATMOSFER SENKRONİZE EDİLİYOR..." : "YENİ ATMOSFERİ YAYINLA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
