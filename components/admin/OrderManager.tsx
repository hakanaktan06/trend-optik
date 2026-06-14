"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Box, Plus, Trash2, Loader2, Truck } from "lucide-react";
import { toast } from "react-hot-toast";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  product: string;
  status: string;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [oName, setOName] = useState("");
  const [oPhone, setOPhone] = useState("");
  const [oProduct, setOProduct] = useState("");
  const [oStatus, setOStatus] = useState("Sipariş Alındı");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: Order[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() } as Order));
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!oName || !oPhone || !oProduct) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(db, "orders"), {
        customerName: oName,
        phone: oPhone,
        product: oProduct,
        status: oStatus,
        createdAt: serverTimestamp()
      });
      setOName(""); setOPhone(""); setOProduct(""); setOStatus("Sipariş Alındı");
      loadOrders();
      toast.success("Sipariş başarıyla eklendi.");
    } catch (e: any) {
      toast.error(`Sipariş hatası: ${e?.message || JSON.stringify(e)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-bold text-sm">Bu siparişi silmek istediğinize emin misiniz?</span>
        <div className="flex gap-2">
          <button onClick={async () => { 
            toast.dismiss(t.id); 
            await deleteDoc(doc(db, "orders", id));
            loadOrders(); 
            toast.success("Sipariş silindi.");
          }} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">Evet, Sil</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-white/10 text-white rounded">İptal</button>
        </div>
      </div>
    ), { duration: Infinity, id: 'delete-confirm' });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!newStatus) return;
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success("Sipariş durumu güncellendi.");
    } catch (e: any) {
      toast.error(`Güncelleme hatası: ${e?.message || "Bilinmeyen hata"}`);
      loadOrders();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Teslimata Hazır": return "bg-amber-500/20 text-amber-500 border border-amber-500/50";
      case "Teslim Edildi": return "bg-green-500/20 text-green-500 border border-green-500/50";
      case "İşlem Yapılıyor": return "bg-blue-500/20 text-blue-500 border border-blue-500/50";
      default: return "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/50";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Box className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-xl md:text-3xl font-bold text-white">Sipariş & Teslimat</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD ORDER FORM */}
        <div className="lg:col-span-1">
          <div className="glass p-5 md:p-6 rounded-3xl lg:sticky lg:top-6">
            <h3 className="text-xl font-bold text-[var(--accent-gold)] mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5"/> Yeni Sipariş Gir
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Müşteri Ad Soyad</label>
                <input type="text" value={oName} onChange={e => setOName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Ahmet Yılmaz" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Telefon (Sorgu İçin)</label>
                <input type="text" value={oPhone} onChange={e => setOPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="0531 207 58 18" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Hangi Ürün / Cam?</label>
                <input type="text" value={oProduct} onChange={e => setOProduct(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Ray-Ban Çerçeve + Zeiss Cam" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Başlangıç Durumu</label>
                <select value={oStatus} onChange={e => setOStatus(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                  <option value="Sipariş Alındı">Sipariş Alındı</option>
                  <option value="İşlem Yapılıyor">İşlem Yapılıyor (Hazırlanıyor)</option>
                  <option value="Teslimata Hazır">Teslimata Hazır</option>
                  <option value="Teslim Edildi">Teslim Edildi</option>
                </select>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving} className="w-full py-3 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Siparişi Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 min-h-[500px]">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-[var(--accent-gold)]"/> Aktif Siparişler
            </h3>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-20 text-[var(--accent-gold)]"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Telefon</th>
                      <th className="p-3">Ürün</th>
                      <th className="p-3 text-center">Durum</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="text-center p-8 text-white/30">Aktif sipariş bulunmuyor.</td></tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold">{o.customerName}</td>
                          <td className="p-3 text-white/70">{o.phone}</td>
                          <td className="p-3">{o.product}</td>
                          <td className="p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(o.status)}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap flex items-center justify-end">
                            <select 
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[var(--accent-gold)]/50"
                              value=""
                            >
                              <option value="" disabled>Durum Değiştir</option>
                              <option value="Sipariş Alındı">Sipariş Alındı</option>
                              <option value="İşlem Yapılıyor">İşlem Yapılıyor</option>
                              <option value="Teslimata Hazır">Teslimata Hazır</option>
                              <option value="Teslim Edildi">Teslim Edildi</option>
                            </select>
                            
                            <button onClick={() => handleDelete(o.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors" title="Sil">
                              <Trash2 className="w-4 h-4" />
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

      </div>
    </div>
  );
}
