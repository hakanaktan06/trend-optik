"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, Truck, Target, Award, Eye, Settings2 } from "lucide-react";
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
      alert("Site teması başarıyla güncellendi.");
    } catch(e) {
      alert("Tema güncellenirken hata oluştu.");
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl relative overflow-hidden border border-rose-500/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Settings2 className="w-48 h-48 text-rose-500" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-rose-500 mb-2">Global Tema Şovu</h3>
            <p className="text-white/50 text-sm mb-8 max-w-sm">
              Tüm siteyi tek tıkla günün anlam ve önemine göre profesyonelce süsle. Müşterilerine özel günlerde sürpriz yap.
            </p>

            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white font-medium mb-4 focus:outline-none focus:border-rose-500/50"
            >
              <option value="standart">Standart (Sade ve Minimal)</option>
              <option value="yilbasi">Kış Koleksiyonu (Buzul Işıltısı)</option>
              <option value="sevgililer">Sevgililer Günü (Yakut Ambiyans)</option>
              <option value="kadinlar">Kadınlar Günü (Zarif Lila)</option>
              <option value="bayram">Özel Seri (Altın Yansıma)</option>
            </select>

            <button 
              onClick={handleUpdateTheme}
              disabled={isUpdating}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
            >
              {isUpdating ? "Güncelleniyor..." : "SİTE TEMASINI GÜNCELLE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
