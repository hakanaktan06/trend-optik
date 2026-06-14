"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, ListFilter, Star, Trash2, Pencil, Loader2, Glasses, Minus, PlusCircle, Copy, GripVertical, Image as ImageIcon, X, ZoomIn } from "lucide-react";
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
  type?: 'kadin' | 'erkek' | 'cocuk' | 'gunes' | 'optik' | 'unisex' | null;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [pName, setPName] = useState("");
  const [pBrandName, setPBrandName] = useState(""); // Typed brand name
  const [pModel, setPModel] = useState("");
  const [pImages, setPImages] = useState<string[]>([]);
  const [pDesc, setPDesc] = useState("");
  const [pStock, setPStock] = useState<number>(0);
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pStatus, setPStatus] = useState<'published'|'draft'>('published');
  const [pType, setPType] = useState<Product['type']>('' as any);
  const [pSeoTitle, setPSeoTitle] = useState("");
  const [pSeoDesc, setPSeoDesc] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  // Rate-limiting for toasts
  const lastActionTime = useRef<number>(0);

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  /* Canvas sıkıştırma — telefon fotoğraflarını ~200KB'a indirir, yükleme 5-10x hızlanır */
  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error("Sıkıştırma başarısız")), "image/jpeg", 0.82);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Görsel okunamadı")); };
      img.src = url;
    });

  const setCoverImage = (idx: number) => {
    if (idx === 0) return;
    const next = [...pImages];
    const [cover] = next.splice(idx, 1);
    setPImages([cover, ...next]);
    toast.success("Kapak görseli güncellendi.", { id: "cover-set" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - pImages.length;
    if (remaining <= 0) {
      toast.error("En fazla 5 görsel ekleyebilirsiniz.", { id: "img-limit" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const toUpload = files.slice(0, remaining);
    if (files.length > remaining)
      toast(`${files.length - remaining} görsel 5 sınırı nedeniyle atlandı.`, { id: "img-skip" });

    setIsUploading(true);
    const loadingToastId = toast.loading(`Sıkıştırılıp yükleniyor (${toUpload.length} görsel)...`);

    try {
      const signRes = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "trendoptik/products" }),
      });
      const signData = await signRes.json();
      if (signData.error) throw new Error(signData.error);

      /* Sıkıştır + paralel yükle */
      const uploadedUrls = await Promise.all(
        toUpload.map(async (file) => {
          const compressed = await compressImage(file);
          const fd = new FormData();
          fd.append("file", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
          fd.append("api_key", signData.apiKey);
          fd.append("timestamp", signData.timestamp);
          fd.append("signature", signData.signature);
          fd.append("folder", signData.folder);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
            method: "POST",
            body: fd,
          });
          const data = await res.json();
          if (!data.secure_url) throw new Error(data.error?.message || "Yükleme başarısız");
          return data.secure_url as string;
        })
      );

      setPImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} görsel yüklendi.`, { id: loadingToastId });
    } catch (error: any) {
      console.error(error);
      toast.error(`Hata: ${error.message}`, { id: loadingToastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setPImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag to reorder images
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newImages = [...pImages];
    const item = newImages.splice(draggedIdx, 1)[0];
    newImages.splice(targetIdx, 0, item);
    setPImages(newImages);
    setDraggedIdx(null);
  };

  const resetForm = () => {
    setEditId(null);
    setPName("");
    setPBrandName("");
    setPModel("");
    setPImages([]);
    setPDesc("");
    setPStock(0);
    setPIsFeatured(false);
    setPStatus("published");
    setPType('' as any);
    setPSeoTitle("");
    setPSeoDesc("");
    setSeoOpen(false);
  };

  const handleSave = async () => {
    if (!pName || !pBrandName || pImages.length === 0) {
      toast.error("Ürün Adı, Marka ve en az 1 görsel zorunludur.", { id: 'validation-err' });
      return;
    }
    setIsSaving(true);
    const saveToastId = toast.loading("Kaydediliyor...");
    try {
      // Auto-create brand if it doesn't exist
      let finalBrandId = pBrandName;
      const existingBrand = brands.find(b => b.name.toLowerCase() === pBrandName.trim().toLowerCase());
      if (existingBrand) {
        finalBrandId = existingBrand.id;
      } else {
        // Create brand
        const newBrandDoc = await addDoc(collection(db, "brands"), {
          name: pBrandName.trim(),
          slug: generateSlug(pBrandName.trim()),
          order: 999,
          logoUrl: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        finalBrandId = newBrandDoc.id;
        loadBrands(); // refresh brands
      }

      const payload: any = {
        name: pName, 
        brandId: finalBrandId, 
        model: pModel, 
        images: pImages,
        description: pDesc, 
        stock: pStock,
        isFeatured: pIsFeatured,
        status: pStatus,
        source: 'manual',
        updatedAt: serverTimestamp()
      };
      
      if (pType && pType !== ('' as any)) {
        payload.type = pType;
      } else {
        payload.type = null;
      }

      payload.seoTitle = pSeoTitle.trim();
      payload.seoDesc = pSeoDesc.trim();

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
      toast.success(editId ? "Ürün güncellendi." : "Yeni ürün eklendi.", { id: saveToastId });
    } catch (e: any) {
      toast.error(`Kayıt hatası: ${e?.message || JSON.stringify(e)}`, { id: saveToastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-bold text-sm">Ürün kalıcı olarak silinecek, onaylıyor musunuz?</span>
        <div className="flex gap-2">
          <button onClick={async () => { 
            toast.dismiss(t.id); 
            await deleteDoc(doc(db, "products", id));
            toast.success("Ürün silindi.");
            loadProducts();
          }} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">Evet, Sil</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-white/10 text-white rounded">İptal</button>
        </div>
      </div>
    ), { duration: Infinity, id: 'delete-confirm' });
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setPName(p.name);
    const bName = brands.find(b => b.id === p.brandId)?.name || p.brandId;
    setPBrandName(bName);
    setPModel(p.model || "");
    setPImages(p.images || []);
    setPDesc(p.description || "");
    setPStock(p.stock || 0);
    setPIsFeatured(p.isFeatured || false);
    setPStatus(p.status || 'published');
    setPType(p.type || '' as any);
    setPSeoTitle((p as any).seoTitle || "");
    setPSeoDesc((p as any).seoDesc || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (p: Product) => {
    resetForm();
    setPName(p.name + " (Kopya)");
    const bName = brands.find(b => b.id === p.brandId)?.name || p.brandId;
    setPBrandName(bName);
    setPModel(p.model || "");
    setPImages(p.images || []);
    setPDesc(p.description || "");
    setPStock(0);
    setPIsFeatured(false);
    setPStatus('draft');
    setPType(p.type || '' as any);
    toast.success("Ürün bilgileri kopyalandı.", { id: 'copy-toast' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSell = async (p: Product) => {
    const now = Date.now();
    if (now - lastActionTime.current < 500) return; // debounce
    lastActionTime.current = now;

    if (p.stock <= 0) {
      toast.error("Stok zaten 0.", { id: `stock-err-${p.id}` });
      return;
    }

    const newStock = p.stock - 1;
    
    // Optimistic update
    setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: newStock } : prod));
    
    try {
      await updateDoc(doc(db, "products", p.id), { stock: newStock });
      
      const salesRef = await addDoc(collection(db, "sales"), {
        productId: p.id,
        productName: p.name,
        qty: 1,
        soldAt: serverTimestamp()
      });

      toast.success(
        (t) => (
          <div className="flex items-center gap-4">
            <span>Stok -1 düşüldü.</span>
            <button 
              onClick={async () => {
                toast.remove(t.id);
                // Undo
                await updateDoc(doc(db, "products", p.id), { stock: p.stock });
                try { await deleteDoc(salesRef); } catch (_) {}
                setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: p.stock } : prod));
                toast.success("İşlem geri alındı.", { id: `undo-${p.id}` });
              }}
              className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
            >
              Geri Al
            </button>
          </div>
        ), 
        { id: `sell-${p.id}`, duration: 5000 }
      );
      
    } catch (e: any) {
      toast.error(`Stok hatası: ${e?.message || JSON.stringify(e)}`, { id: `err-${p.id}` });
      loadProducts(); // revert
    }
  };

  const handleAddStock = (p: Product) => {
    toast((t) => (
      <form onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const qty = parseInt(fd.get('qty') as string, 10);
        if (isNaN(qty) || qty <= 0) return;
        toast.remove(t.id);
        const newStock = p.stock + qty;
        try {
          await updateDoc(doc(db, "products", p.id), { stock: newStock });
          setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: newStock } : prod));
          toast.success(`${qty} adet stok eklendi.`);
        } catch (e: any) { toast.error(`Stok ekleme hatası: ${e?.message || JSON.stringify(e)}`); }
      }} className="flex flex-col gap-3">
        <span className="font-bold text-sm text-white">Kaç adet stok eklenecek?</span>
        <div className="flex gap-2">
          <input type="number" name="qty" min="1" defaultValue="1" className="w-20 px-2 py-1 bg-white/10 text-white rounded outline-none border border-white/20" autoFocus />
          <button type="submit" className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded font-bold">Ekle</button>
          <button type="button" onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-bold">İptal</button>
        </div>
      </form>
    ), { duration: Infinity, id: `add-stock-${p.id}` });
  };

  const handleToggleFeatured = async (p: Product) => {
    const newFeatured = !p.isFeatured;
    const toastId = toast.loading("Güncelleniyor...");
    try {
      await updateDoc(doc(db, "products", p.id), { isFeatured: newFeatured });
      setProducts(products.map(prod => prod.id === p.id ? { ...prod, isFeatured: newFeatured } : prod));
      toast.success(newFeatured ? "Vitrine Eklendi" : "Vitrinden Çıkarıldı", { id: toastId });
    } catch (e: any) {
      toast.error(`Güncelleme hatası: ${e?.message || JSON.stringify(e)}`, { id: toastId });
    }
  };

  const filteredProducts = filter === "all" ? products : products.filter(p => p.brandId === filter);

  // Dashboard stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const featuredCount = products.filter(p => p.isFeatured).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;

  return (
    <div>
      {/* Görsel önizleme modalı */}
      {previewImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            onClick={() => setPreviewImg(null)}
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImg}
            alt="Önizleme"
            className="max-w-full max-h-[90vh] object-contain rounded-xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Glasses className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-xl md:text-3xl font-bold">Ürün Vitrini</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Toplam Ürün</span>
          <span className="text-2xl md:text-3xl font-light text-white">{totalProducts}</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Toplam Stok</span>
          <span className="text-2xl md:text-3xl font-light text-white">{totalStock}</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-[var(--accent-gold)]/20 flex flex-col bg-[var(--accent-gold)]/5">
          <span className="text-[10px] text-[var(--accent-gold)]/80 uppercase tracking-widest font-bold mb-1">Vitrindeki Ürün</span>
          <span className="text-2xl md:text-3xl font-light text-[var(--accent-gold)]">{featuredCount}</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-red-500/20 flex flex-col bg-red-500/5">
          <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold mb-1">Tükenen Ürün</span>
          <span className="text-2xl md:text-3xl font-light text-red-400">{outOfStockCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* FORM */}
        <div className="xl:col-span-1">
          <div className="glass p-5 sm:p-6 md:p-8 rounded-3xl lg:sticky lg:top-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--accent-gold)] flex items-center gap-2">
                {editId ? <Pencil className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
                {editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              {editId && (
                 <button onClick={resetForm} className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">İptal</button>
              )}
            </div>
            
            <div className="space-y-5">
              
              {/* Görseller */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs text-white/50 uppercase tracking-widest">Görseller</label>
                  <span className={`text-xs font-mono ${pImages.length >= MAX_IMAGES ? 'text-amber-400' : 'text-white/30'}`}>
                    {pImages.length}/{MAX_IMAGES}
                  </span>
                </div>

                {/* Dropzone — sadece < 5 görselde göster */}
                {pImages.length < MAX_IMAGES && (
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`w-full min-h-[100px] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center p-5 cursor-pointer hover:border-[var(--accent-gold)]/50 transition-colors bg-black/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-7 h-7 text-[var(--accent-gold)] animate-spin mb-1" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-white/30 mb-1" />
                    )}
                    <p className="text-sm font-medium text-white/70">
                      {isUploading ? "Yükleniyor…" : "Görsel eklemek için dokunun"}
                    </p>
                    {!isUploading && (
                      <p className="text-xs text-white/35 mt-0.5">fotoğraf çekin veya galeriden seçin · maks {MAX_IMAGES - pImages.length} adet</p>
                    )}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />

                {/* Thumbnails */}
                {pImages.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-4">
                    {pImages.map((img, i) => (
                      <div
                        key={`${img}-${i}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, i)}
                        className={`relative w-24 h-24 rounded-xl border-2 overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing flex-shrink-0 ${
                          i === 0
                            ? 'border-[var(--accent-gold)] shadow-[0_0_10px_rgba(201,169,110,0.3)]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="preview" className="w-full h-full object-cover" />

                        {/* Sürükle ikonu */}
                        <div className="absolute top-1 left-1 pointer-events-none z-10">
                          <GripVertical className="w-4 h-4 text-white/40 drop-shadow" />
                        </div>

                        {/* Sil butonu — her zaman üstte */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-500 active:bg-red-600 text-white rounded-full p-1.5 shadow z-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        {/* Tam görüntü butonu — sadece merkez alan, köşelere dokunmaz */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewImg(img); }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 bg-black/50 transition-opacity z-10"
                        >
                          <ZoomIn className="w-7 h-7 text-white drop-shadow" />
                        </button>

                        {/* Alt bant: Kapak etiketi veya Kapak Yap butonu */}
                        {i === 0 ? (
                          <div className="absolute bottom-0 left-0 w-full bg-[var(--accent-gold)] text-black text-[9px] font-bold text-center py-0.5 uppercase tracking-widest z-20">
                            Kapak
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCoverImage(i); }}
                            className="absolute bottom-0 left-0 w-full bg-black/70 hover:bg-[var(--accent-gold)] active:bg-[var(--accent-gold)] text-white/60 hover:text-black active:text-black text-[9px] font-bold text-center py-0.5 uppercase tracking-widest transition-colors z-20"
                          >
                            ★ Kapak Yap
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Ürün Adı</label>
                  <input type="text" value={pName} onChange={e => setPName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="Örn: Aviator Classic" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Marka</label>
                  <input 
                    list="brands-list"
                    value={pBrandName}
                    onChange={e => setPBrandName(e.target.value)}
                    placeholder="Seç veya yazarak ekle"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors"
                  />
                  <datalist id="brands-list">
                    {brands.map(b => (
                      <option key={b.id} value={b.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Model Kodu</label>
                  <input type="text" value={pModel} onChange={e => setPModel(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" placeholder="RB3025" />
                </div>
                
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Tür</label>
                  <select value={pType || ''} onChange={e => setPType(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                    <option value="">Türsüz (İsteğe Bağlı)</option>
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                    <option value="cocuk">Çocuk</option>
                    <option value="gunes">Güneş</option>
                    <option value="optik">Optik</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Stok Adedi</label>
                  <input type="number" value={pStock} onChange={e => setPStock(parseInt(e.target.value)||0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Durum</label>
                  <select value={pStatus} onChange={e => setPStatus(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors">
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1">Detaylı Açıklama</label>
                <textarea 
                  value={pDesc} 
                  onChange={e => setPDesc(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors h-24 resize-none" 
                  placeholder="Ürün özellikleri..."
                />
              </div>

              <div>
                <label className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-4 cursor-pointer select-none hover:border-white/20 transition-colors">
                  <input type="checkbox" checked={pIsFeatured} onChange={e => setPIsFeatured(e.target.checked)} className="w-6 h-6 accent-[var(--accent-gold)] rounded bg-black/50 border-white/20" />
                  <div>
                    <div className="text-base font-bold text-white mb-0.5">Öne Çıkar</div>
                    <div className="text-xs text-white/50">Ana sayfada vitrinde gösterilsin mi?</div>
                  </div>
                </label>
              </div>

              {/* SEO Bölümü (katlanabilir) */}
              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSeoOpen(!seoOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
                >
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">SEO (İsteğe Bağlı)</span>
                  <span className="text-white/30 text-xs">{seoOpen ? "▲" : "▼"}</span>
                </button>
                {seoOpen && (
                  <div className="p-4 space-y-4 bg-black/20">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <label className="text-xs text-white/50 uppercase tracking-widest">SEO Başlığı</label>
                        <span className="text-[10px] text-white/25 normal-case tracking-normal">— boş bırakılırsa otomatik üretilir</span>
                      </div>
                      <input
                        type="text"
                        value={pSeoTitle}
                        onChange={e => setPSeoTitle(e.target.value)}
                        placeholder={`${pBrandName || "Marka"} ${pModel || "Model"} — ${pName || "Ürün Adı"} | Trend Optik Mersin`}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors"
                      />
                      <p className="text-[10px] text-white/25 mt-0.5">Google'da gösterilecek başlık. 50–60 karakter idealdir.</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <label className="text-xs text-white/50 uppercase tracking-widest">SEO Açıklaması</label>
                        <span className="text-[10px] text-white/25 normal-case tracking-normal">— boş bırakılırsa otomatik üretilir</span>
                      </div>
                      <textarea
                        value={pSeoDesc}
                        onChange={e => setPSeoDesc(e.target.value)}
                        placeholder="Bu ürünün Google arama sonucundaki açıklaması. 150–160 karakter."
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors resize-none"
                      />
                      <p className="text-[10px] text-white/25 mt-0.5">{pSeoDesc.length}/160 karakter</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving || isUploading} className="w-full py-4 bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all flex justify-center items-center gap-2">
                  {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                  {editId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
                </button>
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
                <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--accent-gold)]/50 w-full sm:w-auto">
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
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-white/30 text-[10px] uppercase tracking-[0.2em]">
                      <th className="p-4 font-bold">Ürün Bilgisi</th>
                      <th className="p-4 font-bold">Vitrin / Durum</th>
                      <th className="p-4 font-bold">Stok Yönetimi</th>
                      <th className="p-4 font-bold text-right">Düzenle</th>
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
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2 shrink-0 shadow-lg">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={p.images[0] || "/placeholder.png"} alt={p.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.3em] font-extrabold mb-1.5">{bName}</span>
                                  <span className="text-base sm:text-lg font-bold text-white leading-tight mb-1">{p.name}</span>
                                  <span className="text-xs text-white/40">{p.model} {p.type ? `• ${p.type.toUpperCase()}` : ''}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-col gap-2 items-start">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${p.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                                  {p.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                                </span>
                                <button onClick={() => handleToggleFeatured(p)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all border ${p.isFeatured ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`} title="Vitrin Durumunu Değiştir">
                                  <Star className="w-3 h-3" fill={p.isFeatured ? "currentColor" : "none"} />
                                  {p.isFeatured ? 'VİTRİNDE' : 'VİTRİNE AL'}
                                </button>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1.5 border border-white/10 w-max">
                                <button onClick={() => handleSell(p)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Satıldı (-1)">
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className={`font-bold text-xl w-10 text-center ${p.stock <= 0 ? 'text-red-500' : p.stock <= 2 ? 'text-amber-500' : 'text-green-500'}`}>
                                  {p.stock}
                                </span>
                                <button onClick={() => handleAddStock(p)} className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors" title="Stok Ekle">
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right space-x-2 whitespace-nowrap">
                              <button onClick={() => handleCopy(p)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors" title="Kopyala">
                                <Copy className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleEdit(p)} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-400 transition-colors" title="Düzenle">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors" title="Sil">
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
