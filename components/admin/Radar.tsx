"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Target, AlertTriangle, Loader2 } from "lucide-react";

interface RadarItem {
  id: string;
  customerName: string;
  phone: string;
  date: Date;
  diffDays: number;
}

export default function Radar() {
  const [items, setItems] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRadar();
  }, []);

  const loadRadar = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: RadarItem[] = [];
      const today = new Date();

      snap.forEach((doc) => {
        const order = doc.data();
        if (order.createdAt) {
          const date = order.createdAt.toDate();
          const diffTime = Math.abs(today.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Show if exam was >= 360 days ago
          if (diffDays >= 360) {
            data.push({
              id: doc.id,
              customerName: order.customerName,
              phone: order.phone,
              date,
              diffDays
            });
          }
        }
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (name: string, phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Merhaba ${name}, Trend Optik'ten yazıyoruz. Göz muayenenizin üzerinden 1 yıl geçmiş. Göz sağlığınız için kontrol vaktiniz gelmiş olabilir, sizi dükkanımıza bekleriz.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-8 h-8 text-red-500" />
        <h2 className="text-xl md:text-3xl font-bold text-white">Akıllı Müşteri Radarı</h2>
      </div>
      <p className="text-white/50 mb-10 max-w-2xl">
        Sistem son 1 yılı analiz eder ve göz muayenesi zamanı gelenleri sana listeler. Müşterilerine WhatsApp üzerinden profesyonelce hatırlatma yap.
      </p>

      <div className="glass rounded-3xl p-6 md:p-10 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5"/> Muayene Zamanı Gelenler (1 Yıl+)
        </h3>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20 text-red-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                  <th className="p-4">Müşteri</th>
                  <th className="p-4">Son İşlem</th>
                  <th className="p-4">Geçen Süre</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={4} className="text-center p-8 text-white/30">Günü geçen muayene yok, herkes güvende! 🎉</td></tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors border-l-4 border-l-red-500">
                      <td className="p-4 font-bold">{item.customerName}</td>
                      <td className="p-4 text-white/70">{item.date.toLocaleDateString("tr-TR")}</td>
                      <td className="p-4 text-red-400 font-bold">{item.diffDays} Gün Önce</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => openWhatsApp(item.customerName, item.phone)}
                          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Çağır
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
