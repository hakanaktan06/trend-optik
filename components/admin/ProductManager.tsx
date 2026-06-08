"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, ListFilter, Star, Trash2, Pencil, QrCode, Link2, Loader2, Sparkles, Glasses } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  desc: string;
  img: string;
  isFeatured: boolean;
  brand?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("gunes");
  const [pPrice, setPPrice] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pLongDesc, setPLongDesc] = useState("");
  const [pImgUrl, setPImgUrl] = useState("");
  const [pBrand, setPBrand] = useState("");
  const [pSeoTitle, setPSeoTitle] = useState("");
  const [pSeoDesc, setPSeoDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // VIP & QR State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [qrProduct, setQrProduct] = useState<any>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setPName("");
    setPCategory("gunes");
    setPPrice("");
    setPDesc("");
    setPLongDesc("");
    setPImgUrl("");
    setPBrand("");
    setPSeoTitle("");
    setPSeoDesc("");
  };

  const handleSave = async () => {
    if (!pName || !pPrice || !pImgUrl) return alert("Ad, Fiyat ve Resim URL zorunludur.");
    setIsSaving(true);
    try {
      const payload = {
        name: pName, 
        category: pCategory, 
        price: pPrice, 
        desc: pDesc, 
        description: pLongDesc, // Detailed description for product page
        img: pImgUrl,
        brand: pBrand,
        seoTitle: pSeoTitle,
        seoDescription: pSeoDesc
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          isFeatured: false, 
          clicks: 0, 
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      loadProducts();
      alert(editId ? "Ürün güncellendi." : "Yeni ürün eklendi.");
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Kalıcı olarak silinecek, onaylıyor musunuz?")) {
      await deleteDoc(doc(db, "products", id));
      loadProducts();
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "products", id), { isFeatured: !current });
    loadProducts();
  };

  const handleEdit = (p: any) => {
    setEditId(p.id);
    setPName(p.name);
    setPCategory(p.category);
    setPPrice(p.price.toString().replace(/[^0-9]/g, ''));
    setPDesc(p.desc || "");
    setPLongDesc(p.description || "");
    setPImgUrl(p.img);
    setPBrand(p.brand || "");
    setPSeoTitle(p.seoTitle || "");
    setPSeoDesc(p.seoDescription || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVIPOffer = () => {
    if (selectedIds.length === 0) return alert("VIP teklif için önce ürün seçin.");
    const selectedProds = products.filter(p => selectedIds.includes(p.id));
    let total = 0;
    let msg = "Sizin için VIP Modeller:\\n";
    selectedProds.forEach((p, i) => {
      const priceVal = parseInt(p.price.toString().replace(/[^0-9]/g, '')) || 0;
      total += priceVal;
      msg += `${i + 1}) ${p.name} - ${p.price} ₺\\n`;
    });
    
    const discount = prompt(`Toplam: ${total} ₺. Sen kaça bırakacaksın?`);
    if (discount) {
      msg += `\\n🎁 ÖZEL FİYAT: ${discount} ₺ 🎁`;
      navigator.clipboard.writeText(msg);
      alert("WhatsApp VIP Mesajı Panoya Kopyalandı!");
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const filteredProducts = filter === "all" ? products : products.filter(p => p.category === filter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Glasses className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-3xl font-bold">Ürün Vitrini</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl sticky top-6">
            <h3 className="text-xl font-bold text-[var(--accent-gold)] mb-6 flex items-center gap-2">
              {editId ? <Pencil className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
              {editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Ürün Adı</label>
                <input type="text" value={pName} onChange={e => setPName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Ray-Ban Aviator" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Kategori</label>
                <select value={pCategory} onChange={e => setPCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                  <option value="gunes">Güneş Gözlüğü</option>
                  <option value="klasik">Klasik Çerçeve</option>
                  <option value="kadin">Kadın Modeller</option>
                  <option value="cocuk">Çocuk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Fiyat (₺)</label>
                <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="2500" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Kısa Açıklama</label>
                <input type="text" value={pDesc} onChange={e => setPDesc(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Polarize cam, hafif çerçeve" />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Detaylı Ürün Özeti (Sayfada Görünür)</label>
                <textarea 
                  value={pLongDesc} 
                  onChange={e => setPLongDesc(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors h-24 resize-none" 
                  placeholder="Ürün hikayesi, teknik özellikler..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs text-white/50 uppercase tracking-widest">Resim URL (ImgBB)</label>
                  <a href="https://imgbb.com/" target="_blank" rel="noreferrer" className="text-[10px] text-[var(--accent-gold)] hover:underline flex items-center gap-1"><Link2 className="w-3 h-3"/> Yükle</a>
                </div>
                <input type="text" value={pImgUrl} onChange={e => setPImgUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors mb-2" placeholder="https://i.ibb.co/..." />
                
                {/* Preview */}
                <div className="w-full aspect-square bg-black/30 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                  {pImgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pImgUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/20 text-xs">Görsel Önizleme</span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-[var(--accent-gold)]">SEO & Marka (İsteğe Bağlı)</h4>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Marka</label>
                  <input type="text" value={pBrand} onChange={e => setPBrand(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Örn: Ray-Ban" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">SEO Title (Başlık)</label>
                  <input type="text" value={pSeoTitle} onChange={e => setPSeoTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Özel başlık boşsa otomatik oluşur" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">SEO Description (Açıklama)</label>
                  <input type="text" value={pSeoDesc} onChange={e => setPSeoDesc(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Özel meta açıklama" />
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving} className="w-full py-3 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
                </button>
                {editId && (
                  <button onClick={resetForm} className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm">
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-[var(--accent-gold)]"/> Mevcut Vitrin
              </h3>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--accent-gold)]/50 w-full sm:w-auto">
                  <option value="all">Tüm Kategoriler</option>
                  <option value="gunes">Güneş Gözlükleri</option>
                  <option value="klasik">Klasik Modeller</option>
                  <option value="kadin">Kadın Özel</option>
                  <option value="cocuk">Çocuk Modelleri</option>
                </select>
                <button onClick={handleVIPOffer} className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
                  <Sparkles className="w-4 h-4"/> VIP Teklif
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-20 text-[var(--accent-gold)]"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                      <th className="p-3">Seç</th>
                      <th className="p-3">Görsel</th>
                      <th className="p-3">Ürün Adı</th>
                      <th className="p-3 text-center">Yıldız</th>
                      <th className="p-3">Fiyat</th>
                      <th className="p-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={6} className="text-center p-8 text-white/30">Bu kategoride ürün bulunamadı.</td></tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="w-4 h-4 accent-[var(--accent-gold)] rounded bg-black/50 border-white/20" />
                          </td>
                          <td className="p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                          </td>
                          <td className="p-3 font-medium">{p.name}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => toggleFeatured(p.id, p.isFeatured)} className={`p-2 rounded-lg transition-colors ${p.isFeatured ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-white/30 hover:text-white"}`}>
                              <Star className="w-4 h-4" fill={p.isFeatured ? "currentColor" : "none"} />
                            </button>
                          </td>
                          <td className="p-3 text-[var(--accent-gold)] font-medium">
                            {p.price.toString().includes("₺") ? p.price : `${p.price} ₺`}
                          </td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => setQrProduct(p)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 transition-colors" title="QR Etiket">
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-400 transition-colors" title="Düzenle">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors" title="Sil">
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

      {/* QR Code Modal (Simple absolute div) */}
      {qrProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative text-black">
            <h4 className="font-bold text-xl mb-1">{qrProduct.name}</h4>
            <p className="text-black/50 font-medium mb-6">
              {qrProduct.price.toString().includes("₺") ? qrProduct.price : `${qrProduct.price} ₺`}
            </p>
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://trendoptikmersin.com/product/${qrProduct.id}`} alt="QR Code" className="w-48 h-48 rounded-xl border p-2 bg-white" />
            </div>
            <p className="text-xs text-black/40 mb-6">Okutunca ürün detay sayfasına gider.</p>
            <div className="flex gap-2">
              <button onClick={() => setQrProduct(null)} className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors">Kapat</button>
              <button onClick={() => window.print()} className="w-full py-3 bg-black text-white hover:bg-gray-900 rounded-xl font-medium transition-colors">Yazdır</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
