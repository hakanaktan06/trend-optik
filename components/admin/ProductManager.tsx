"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, ListFilter, Star, Trash2, Pencil, Loader2, Sparkles, Glasses, Minus, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brandId: string;
  model: string;
  images: string[];
  description: string;
  stock: number;
  isFeatured: boolean;
  status: 'published' | 'draft';
  source: 'manual';
  // legacy
  price?: any;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [pName, setPName] = useState("");
  const [pBrandId, setPBrandId] = useState("");
  const [pModel, setPModel] = useState("");
  const [pImages, setPImages] = useState<string[]>([]);
  const [pDesc, setPDesc] = useState("");
  const [pStock, setPStock] = useState<number>(0);
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pStatus, setPStatus] = useState<'published'|'draft'>('published');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadBrands();
    loadProducts();
  }, []);

  const loadBrands = async () => {
    try {
      const q = query(collection(db, "brands"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data: Brand[] = [];
      snap.forEach((d) => data.push({ id: d.id, name: d.data().name }));
      setBrands(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: any[] = [];
      snap.forEach((d) => {
        const p = d.data();
        let images = p.images || [];
        if (images.length === 0 && p.img) images = [p.img];
        
        data.push({ 
          id: d.id, 
          ...p,
          images,
          stock: p.stock || 0,
          status: p.status || 'published',
          brandId: p.brandId || p.brand || ""
        });
      });
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Get Cloudinary cloud name from env/config if possible, but we can't reliably read process.env on client unless NEXT_PUBLIC.
      // So we fetch sign config from our route which can also return cloud name.
      const signRes = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "trendoptik/products" })
      });
      const signData = await signRes.json();
      if (signData.error) throw new Error(signData.error);

      // Note: In a real app we'd fetch CLOUD_NAME from a NEXT_PUBLIC var, but let's assume unsigned upload is easier 
      // or we just need the cloud name. Wait, let's just use the signData to upload.
      // Cloudinary API requires the cloud name. I will assume NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is available.
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dsxjq1kxx"; // fallback to a default if not set, or prompt to set it.
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");
        formData.append("timestamp", signData.timestamp);
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          uploadedUrls.push(uploadData.secure_url);
        } else {
          // If signed fails (maybe API key not public), fallback to unsigned if an upload preset exists. 
          // For now, if we can't upload via signed without public key, let's rely on standard unsigned if user set it up, or show an error.
          throw new Error(uploadData.error?.message || "Upload failed");
        }
      }

      setPImages([...pImages, ...uploadedUrls]);
      toast.success("Görseller yüklendi.");
    } catch (error: any) {
      console.error(error);
      toast.error(`Görsel yüklenirken hata oluştu: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...pImages];
    newImages.splice(index, 1);
    setPImages(newImages);
  };

  const resetForm = () => {
    setEditId(null);
    setPName("");
    setPBrandId("");
    setPModel("");
    setPImages([]);
    setPDesc("");
    setPStock(0);
    setPIsFeatured(false);
    setPStatus("published");
  };

  const handleSave = async () => {
    if (!pName || !pBrandId || pImages.length === 0) {
      toast.error("Ürün Adı, Marka ve en az 1 görsel zorunludur.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: pName, 
        brandId: pBrandId, 
        model: pModel, 
        images: pImages,
        description: pDesc, 
        stock: pStock,
        isFeatured: pIsFeatured,
        status: pStatus,
        source: 'manual',
        updatedAt: serverTimestamp()
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      loadProducts();
      toast.success(editId ? "Ürün güncellendi." : "Yeni ürün eklendi.");
    } catch (e) {
      toast.error("Hata oluştu.");
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

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setPName(p.name);
    setPBrandId(p.brandId);
    setPModel(p.model || "");
    setPImages(p.images || []);
    setPDesc(p.description || "");
    setPStock(p.stock || 0);
    setPIsFeatured(p.isFeatured || false);
    setPStatus(p.status || 'published');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSell = async (p: Product) => {
    if (p.stock <= 0) {
      toast.error("Stok zaten 0.");
      return;
    }

    const newStock = p.stock - 1;
    
    // Optimistic update
    setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: newStock } : prod));
    
    try {
      await updateDoc(doc(db, "products", p.id), { stock: newStock });
      
      // Log to sales
      await addDoc(collection(db, "sales"), {
        productId: p.id,
        productName: p.name,
        qty: 1,
        soldAt: serverTimestamp()
      });

      toast((t) => (
        <div className="flex items-center gap-4">
          <span>Stok -1 düşüldü.</span>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              // Undo
              await updateDoc(doc(db, "products", p.id), { stock: p.stock });
              setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: p.stock } : prod));
              toast.success("İşlem geri alındı.");
            }}
            className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
          >
            Geri Al
          </button>
        </div>
      ), { duration: 5000 });
      
    } catch (e) {
      toast.error("Hata oluştu.");
      loadProducts(); // revert
    }
  };

  const handleAddStock = async (p: Product) => {
    const qtyStr = prompt("Kaç adet eklenecek?");
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) return;

    const newStock = p.stock + qty;
    try {
      await updateDoc(doc(db, "products", p.id), { stock: newStock });
      setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: newStock } : prod));
      toast.success("Stok eklendi.");
    } catch (e) {
      toast.error("Hata oluştu.");
    }
  };

  const filteredProducts = filter === "all" ? products : products.filter(p => p.brandId === filter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Glasses className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-3xl font-bold">Ürün Vitrini</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* FORM */}
        <div className="xl:col-span-1">
          <div className="glass p-6 rounded-3xl sticky top-6">
            <h3 className="text-xl font-bold text-[var(--accent-gold)] mb-6 flex items-center gap-2">
              {editId ? <Pencil className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
              {editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Ürün Adı</label>
                <input type="text" value={pName} onChange={e => setPName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Aviator Classic" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Marka</label>
                  <select value={pBrandId} onChange={e => setPBrandId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                    <option value="" disabled>Seçiniz</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Model Kodu</label>
                  <input type="text" value={pModel} onChange={e => setPModel(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="RB3025" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Stok Adedi</label>
                  <input type="number" value={pStock} onChange={e => setPStock(parseInt(e.target.value)||0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Durum</label>
                  <select value={pStatus} onChange={e => setPStatus(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Görseller (Cloudinary)</span>
                  <label className="text-[10px] text-[var(--accent-gold)] cursor-pointer hover:underline">
                    {isUploading ? "Yükleniyor..." : "Dosya Seç"}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {pImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl border border-white/10 overflow-hidden bg-black/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 text-[10px]">
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {pImages.length === 0 && (
                    <div className="w-full h-16 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 text-xs">
                      Galeriden çoklu görsel seçebilirsiniz. İlk görsel vitrin görseli olur.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Detaylı Açıklama</label>
                <textarea 
                  value={pDesc} 
                  onChange={e => setPDesc(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors h-24 resize-none" 
                  placeholder="Ürün özellikleri..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 cursor-pointer select-none">
                  <input type="checkbox" checked={pIsFeatured} onChange={e => setPIsFeatured(e.target.checked)} className="w-5 h-5 accent-[var(--accent-gold)] rounded bg-black/50 border-white/20" />
                  <div>
                    <div className="text-sm font-bold text-white">Öne Çıkar</div>
                    <div className="text-xs text-white/40">Ana sayfada vitrinde gösterilsin mi?</div>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving || isUploading} className="w-full py-3 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
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
        <div className="xl:col-span-2">
          <div className="glass rounded-3xl p-6 min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-[var(--accent-gold)]"/> Mevcut Ürünler
              </h3>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--accent-gold)]/50 w-full sm:w-auto">
                  <option value="all">Tüm Markalar</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-20 text-[var(--accent-gold)]"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                      <th className="p-3">Görsel</th>
                      <th className="p-3">Marka / Ürün</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3">Stok</th>
                      <th className="p-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={5} className="text-center p-8 text-white/30">Ürün bulunamadı.</td></tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const bName = brands.find(b => b.id === p.brandId)?.name || p.brandId;
                        return (
                          <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${p.stock <= 2 ? 'bg-red-500/5' : ''}`}>
                            <td className="p-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.images[0] || "/placeholder.png"} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                            </td>
                            <td className="p-3">
                              <div className="text-[10px] text-white/50 uppercase tracking-widest">{bName}</div>
                              <div className="font-medium flex items-center gap-2">
                                {p.name}
                                {p.isFeatured && <Star className="w-3 h-3 text-amber-500" fill="currentColor" />}
                              </div>
                              <div className="text-xs text-white/30">{p.model}</div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                                {p.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-lg ${p.stock <= 0 ? 'text-red-500' : p.stock <= 2 ? 'text-amber-500' : 'text-green-500'}`}>
                                  {p.stock}
                                </span>
                                <div className="flex flex-col gap-1">
                                  <button onClick={() => handleAddStock(p)} className="p-1 bg-white/5 hover:bg-white/10 rounded text-white/50 hover:text-white" title="Stok Ekle">
                                    <PlusCircle className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => handleSell(p)} className="p-1 bg-white/5 hover:bg-amber-500/20 rounded text-white/50 hover:text-amber-500" title="Satıldı (-1)">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-right space-x-2 whitespace-nowrap">
                              <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-400 transition-colors" title="Düzenle">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors" title="Sil">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
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

function XIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
