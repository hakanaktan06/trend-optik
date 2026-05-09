"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Award, Plus, Trash2, Link2, Loader2, PatchCheck } from "lucide-react";

interface Certificate {
  id: string;
  customerName: string;
  product: string;
  discountRate: string;
  duration: string;
  certNo: string;
}

export default function VIPCerts() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [cName, setCName] = useState("");
  const [cProduct, setCProduct] = useState("");
  const [cDiscount, setCDiscount] = useState("15");
  const [cDuration, setCDuration] = useState("24");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCerts();
  }, []);

  const loadCerts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: Certificate[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() } as Certificate));
      setCerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!cName || !cProduct) return alert("Müşteri Adı ve Ürün zorunludur.");
    setIsSaving(true);
    try {
      const genNo = `TRND-${new Date().getFullYear()}-${Math.random().toString(16).substring(2,6).toUpperCase()}`;
      await addDoc(collection(db, "certificates"), {
        customerName: cName,
        product: cProduct,
        discountRate: cDiscount,
        duration: cDuration,
        certNo: genNo,
        createdAt: serverTimestamp()
      });
      setCName(""); setCProduct(""); setCDiscount("15"); setCDuration("24");
      loadCerts();
      alert(`Sertifika başarıyla oluşturuldu. No: ${genNo}`);
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu sertifikayı silmek istediğinize emin misiniz?")) {
      await deleteDoc(doc(db, "certificates", id));
      loadCerts();
    }
  };

  const copyLink = (id: string) => {
    const link = `https://trendoptikmersin.com/sertifika?id=${id}`;
    navigator.clipboard.writeText(link);
    alert("Sertifika Linki Kopyalandı!");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-purple-500" />
        <h2 className="text-3xl font-bold text-white">VIP Dijital Garanti Sistemi</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD CERT FORM */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl sticky top-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
              <PatchCheck className="w-5 h-5"/> Sertifika Oluştur
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Müşteri Ad Soyad</label>
                <input type="text" value={cName} onChange={e => setCName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" placeholder="Ahmet Yılmaz" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Gözlük / Lens Modeli</label>
                <input type="text" value={cProduct} onChange={e => setCProduct(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" placeholder="Cartier Premiere" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">İndirim (%)</label>
                  <input type="number" value={cDiscount} onChange={e => setCDiscount(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Süre (Ay)</label>
                  <input type="number" value={cDuration} onChange={e => setCDuration(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving} className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  DİJİTAL SERTİFİKA OLUŞTUR
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CERT LIST */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 min-h-[500px]">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              Kayıtlı VIP Sertifikalar
            </h3>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-20 text-purple-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                      <th className="p-3">Garanti No</th>
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Ürün</th>
                      <th className="p-3">İndirim</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.length === 0 ? (
                      <tr><td colSpan={5} className="text-center p-8 text-white/30">Kayıtlı sertifika bulunmuyor.</td></tr>
                    ) : (
                      certs.map((c) => (
                        <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono text-purple-400 font-bold text-sm">{c.certNo}</td>
                          <td className="p-3 font-bold">{c.customerName}</td>
                          <td className="p-3 text-white/70">{c.product}</td>
                          <td className="p-3">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold">
                              %{c.discountRate}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => copyLink(c.id)} className="p-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg text-purple-400 transition-colors" title="Linki Kopyala">
                              <Link2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors" title="Sil">
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
