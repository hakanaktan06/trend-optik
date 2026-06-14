"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Package, Truck, Target, Award, Eye, Settings2, ImageIcon, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

interface Stats {
  products: number;
  orders: number;
  certs: number;
  lenses: number;
  radar: number;
}

export default function DashboardHome({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [theme, setTheme] = useState("standard");
  const [greeting, setGreeting] = useState("Hoş Geldiniz");
  const [isUpdating, setIsUpdating] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Günaydın");
    else if (hour >= 12 && hour < 18) setGreeting("İyi Günler");
    else if (hour >= 18 && hour < 22) setGreeting("İyi Akşamlar");
    else setGreeting("İyi Geceler");

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return; // auth henüz çözülmedi, bekle
      loadStats();
      loadTheme();
      loadLogo();
      unsub();
    });
    return () => unsub();
  }, []);

  const loadStats = async () => {
    try {
      const pSnap = await getDocs(collection(db, "products"));
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

      const cSnap = await getDocs(collection(db, "certificates"));
      const lSnap = await getDocs(collection(db, "lenses"));

      setStats({
        products: pSnap.size,
        orders: activeOrders,
        certs: cSnap.size,
        lenses: lSnap.size,
        radar: radarCount
      });
    } catch (e: any) {
      console.error("Stats load error", e);
      toast.error(`İstatistik yüklenemedi: ${e?.message || JSON.stringify(e)}`, { id: "stats-err" });
    }
  };

  const loadTheme = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists()) setTheme(snap.data().activeTheme);
    } catch(e: any) {
      console.error("Theme load error", e);
    }
  };

  const loadLogo = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists() && snap.data().logoUrl) setLogoUrl(snap.data().logoUrl);
    } catch(e) {}
  };

  const handleUpdateTheme = async () => {
    setIsUpdating(true);
    try {
      await setDoc(doc(db, "settings", "theme"), { activeTheme: theme }, { merge: true });
      toast.success("Site teması başarıyla güncellendi.");
    } catch(e: any) {
      toast.error(`Tema hatası: ${e?.message || JSON.stringify(e)}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const signRes = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "trendoptik/site" }),
      });
      const { cloudName, apiKey, timestamp, signature, folder } = await signRes.json();
      if (!cloudName) throw new Error("Cloudinary yapılandırması eksik — Vercel'de env var kontrol edin");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error(uploadData.error?.message || "Cloudinary yanıt vermedi");

      await setDoc(doc(db, "settings", "theme"), { logoUrl: uploadData.secure_url }, { merge: true });
      setLogoUrl(uploadData.secure_url);
      toast.success("Logo başarıyla güncellendi. Sitenin tamamında yayınlandı.");
    } catch (e: any) {
      toast.error(`Logo yüklenemedi: ${e?.message}`);
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await setDoc(doc(db, "settings", "theme"), { logoUrl: "" }, { merge: true });
      setLogoUrl("");
      toast.success("Logo kaldırıldı, yazılı logo geri geldi.");
    } catch (e: any) {
      toast.error(`Kaldırma hatası: ${e?.message}`);
    }
  };

  const statCards = [
    { title: "Ürün", count: stats?.products, icon: Package, color: "text-[var(--accent-gold)]", border: "border-b-[var(--accent-gold)]", bg: "bg-[var(--accent-gold)]/10" },
    { title: "Sipariş", count: stats?.orders, icon: Truck, color: "text-amber-500", border: "border-b-amber-500", bg: "bg-amber-500/10" },
    { title: "Radar", count: stats?.radar, icon: Target, color: "text-red-500", border: "border-b-red-500", bg: "bg-red-500/10", action: () => setActiveTab("radar") },
    { title: "VIP", count: stats?.certs, icon: Award, color: "text-purple-500", border: "border-b-purple-500", bg: "bg-purple-500/10" },
    { title: "Lens", count: stats?.lenses, icon: Eye, color: "text-cyan-500", border: "border-b-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <h2 className="text-xl md:text-3xl font-bold">
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
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {stats === null ? (
                <span className="inline-block w-8 h-7 rounded bg-white/10 animate-pulse" />
              ) : card.count}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden border-white/5">
          {/* Subtle Atmosphere Icon in background */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Settings2 className="w-64 h-64 text-[var(--accent-color)]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--aura-color)] flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">Global Atmosphere Controller</h3>
            </div>
            
            <p className="text-white/40 text-sm mb-10 max-w-lg font-light leading-relaxed">
              Tüm sitenin aurasını tek tıkla profesyonelce yönetin. Vurgu renkleri, parlama efektleri ve tipografi anında tüm kullanıcılarda güncellenir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: "standard", label: "Trend Optik (Marka Turu)", desc: "Markanın imza koyu turuncusu. Cesur, modern ve özgün." },
                { id: "classic", label: "Classic Gold (Orijinal)", desc: "Eski premium altın palet — kuruluş döneminden kalma şık tasarım." },
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
                        <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
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

        {/* Site Logosu */}
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden border-white/5">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ImageIcon className="w-64 h-64 text-[var(--accent-color)]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--aura-color)] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">Site Logosu</h3>
            </div>

            <p className="text-white/40 text-sm mb-8 max-w-lg font-light leading-relaxed">
              Logo yüklendiğinde navbar ve footer'daki yazılı logo yerine geçer. Siyah arka planlı logolar sitemizin koyu zemininde otomatik olarak şeffaf görünür.
            </p>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
              {logoUrl ? (
                <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center justify-center min-w-[200px] min-h-[80px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Site Logosu"
                    className="max-h-16 max-w-[180px] object-contain"
                    style={{ mixBlendMode: "screen" }}
                  />
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[200px] min-h-[80px] text-white/20 text-sm">
                  <ImageIcon className="w-6 h-6 mb-2 opacity-40" />
                  Henüz logo yüklenmedi
                </div>
              )}

              <div className="flex flex-col gap-3">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingLogo ? "Yükleniyor..." : logoUrl ? "Logoyu Değiştir" : "Logo Yükle"}
                </button>
                {logoUrl && (
                  <button
                    onClick={handleRemoveLogo}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold text-sm transition-all border border-red-500/20"
                  >
                    Yazılı Logoya Dön
                  </button>
                )}
                <p className="text-white/25 text-xs">PNG, JPG veya WebP · Siyah arka planlı logolar idealdir</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

