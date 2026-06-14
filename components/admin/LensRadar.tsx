"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Eye, UserPlus, Trash2, Camera, Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface LensItem {
  id: string;
  customerName: string;
  product: string;
  duration: number;
  photoUrl: string;
  createdAt: any;
}

export default function LensRadar() {
  const [lenses, setLenses] = useState<LensItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [lName, setLName] = useState("");
  const [lPhone, setLPhone] = useState("");
  const [lProduct, setLProduct] = useState("");
  const [lDuration, setLDuration] = useState("30");
  const [isSaving, setIsSaving] = useState(false);
  
  // Photo State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modal State
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadLenses();
  }, []);

  const loadLenses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "lenses"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: LensItem[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() } as LensItem));
      setLenses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const compressImageToBase64 = async (file: File, maxWidth = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let scaleSize = maxWidth / img.width;
          if (scaleSize >= 1) scaleSize = 1;
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); 
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!lName || !lPhone || !lProduct) {
      toast.error("Lütfen müşteri adı, telefon ve lens modelini girin.");
      return;
    }
    setIsSaving(true);
    try {
      let photoData = "";
      if (selectedFile) {
        photoData = await compressImageToBase64(selectedFile);
      }

      await addDoc(collection(db, "lenses"), {
        customerName: lName,
        phone: lPhone,
        product: lProduct,
        duration: parseInt(lDuration),
        photoUrl: photoData,
        createdAt: serverTimestamp()
      });

      setLName(""); setLPhone(""); setLProduct(""); setLDuration("30");
      removePhoto();
      loadLenses();
      toast.success("Lens kaydı başarıyla eklendi.");
    } catch (e) {
      toast.error("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-bold text-sm">Bu müşterinin lens takibi kaydını silmek istediğinize emin misiniz?</span>
        <div className="flex gap-2">
          <button onClick={async () => { 
            toast.dismiss(t.id); 
            await deleteDoc(doc(db, "lenses", id));
            loadLenses(); 
            toast.success("Kayıt silindi.");
          }} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">Evet, Sil</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-white/10 text-white rounded">İptal</button>
        </div>
      </div>
    ), { duration: Infinity, id: 'delete-confirm' });
  };

  const calculateDaysLeft = (createdAt: any, duration: number) => {
    if (!createdAt) return 0;
    const date = createdAt.toDate();
    const expiryDate = new Date(date.getTime() + (duration * 24 * 60 * 60 * 1000));
    const diffTime = expiryDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Eye className="w-8 h-8 text-cyan-500" />
        <h2 className="text-xl md:text-3xl font-bold text-white">Akıllı Lens Takip Radarı</h2>
      </div>
      <p className="text-white/50 mb-10 max-w-2xl">
        Lens alan müşterilerini buraya kaydet, süresi bitince sistem seni uyarsın. (Reçete fotoğraflarını güvenle yükleyebilirsin, veritabanında şifrelenir).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD LENS FORM */}
        <div className="lg:col-span-1">
          <div className="glass p-5 md:p-6 rounded-3xl lg:sticky lg:top-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5"/> Müşteri Ekle
            </h3>
            
            <div className="space-y-4">
              <div>
                <input type="text" value={lName} onChange={e => setLName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" placeholder="Müşteri Ad Soyad" />
              </div>
              <div>
                <input type="tel" value={lPhone} onChange={e => setLPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" placeholder="Telefon (Örn: 5551234567)" />
              </div>
              <div>
                <input type="text" value={lProduct} onChange={e => setLProduct(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" placeholder="Lens Markası (Örn: Acuvue)" />
              </div>

              {/* Photo Upload Section */}
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-1">
                  <Camera className="w-4 h-4"/> Reçete Fotoğrafı <span className="font-light text-cyan-400/50">(İsteğe Bağlı)</span>
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 transition-all cursor-pointer"
                />
                
                {photoPreview && (
                  <div className="mt-4 relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Preview" className="h-24 object-contain rounded-lg border border-cyan-500/50" />
                    <button 
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1 mt-2">Kaç Aylık Kutu Aldı?</label>
                <select value={lDuration} onChange={e => setLDuration(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors">
                  <option value="30">1 Aylık Kutu (30 Gün)</option>
                  <option value="90">3 Aylık Kutu (90 Gün)</option>
                  <option value="180">6 Aylık Kutu (180 Gün)</option>
                  <option value="365">Yıllık Kutu (365 Gün)</option>
                </select>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={isSaving} className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  LENS TAKİBİNİ BAŞLAT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LENS LIST */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 min-h-[500px]">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              Aktif Müşteri Radarı
            </h3>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-20 text-cyan-500"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Lens Modeli</th>
                      <th className="p-3">Kalan Süre</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lenses.length === 0 ? (
                      <tr><td colSpan={4} className="text-center p-8 text-white/30">Lens takibi yapılan müşteri yok.</td></tr>
                    ) : (
                      lenses.map((l) => {
                        const daysLeft = calculateDaysLeft(l.createdAt, l.duration);
                        const isExpired = daysLeft <= 0;
                        const statusColor = isExpired ? "text-red-400" : (daysLeft <= 10 ? "text-amber-400" : "text-green-400");
                        
                        return (
                          <tr key={l.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isExpired ? 'border-l-4 border-l-red-500 bg-red-500/5' : ''}`}>
                            <td className="p-3 font-bold">{l.customerName}</td>
                            <td className="p-3 text-white/70">{l.product}</td>
                            <td className={`p-3 font-bold ${statusColor}`}>
                              {isExpired ? "Süresi Bitti!" : `${daysLeft} Gün`}
                            </td>
                            <td className="p-3 text-right space-x-2 whitespace-nowrap flex items-center justify-end">
                              {l.photoUrl && (
                                <button onClick={() => setViewPhoto(l.photoUrl)} className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg text-cyan-400 transition-colors" title="Reçeteyi Gör">
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => handleDelete(l.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors" title="Sil">
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

      {/* Photo View Modal */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setViewPhoto(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-cyan-400 font-bold flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Müşteri Reçetesi</h4>
              <button onClick={() => setViewPhoto(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewPhoto} alt="Reçete" className="w-full max-h-[70vh] object-contain rounded-xl border border-white/10" />
            <div className="mt-6 flex justify-center">
              <a href={viewPhoto} download="trend-optik-recete.jpg" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-full flex items-center gap-2 transition-colors">
                Görseli İndir
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
