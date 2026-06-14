"use client";

import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Loader2, Save, Info, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

/* ── Tooltip bileşeni ─────────────────────────────────────────────── */
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const calcAndOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setOpenLeft(window.innerWidth - rect.right < 300);
    }
    setOpen(v => !v);
  };

  const calcAndShow = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setOpenLeft(window.innerWidth - rect.right < 300);
    }
    setOpen(true);
  };

  return (
    <div ref={wrapRef} className="relative inline-flex items-center">
      <button
        ref={btnRef}
        type="button"
        onClick={calcAndOpen}
        onMouseEnter={calcAndShow}
        onMouseLeave={() => setOpen(false)}
        className="w-4 h-4 rounded-full bg-white/10 hover:bg-[var(--accent-gold)]/20 text-white/40 hover:text-[var(--accent-gold)] flex items-center justify-center text-[10px] font-bold transition-colors ml-1.5 shrink-0"
        aria-label="Bilgi"
      >
        ?
      </button>
      {open && (
        <div
          className={`absolute top-0 z-50 w-[min(288px,70vw)] bg-[#1c1a18] border border-white/10 rounded-xl p-3 text-xs text-white/60 shadow-2xl leading-relaxed pointer-events-none ${
            openLeft ? "right-6" : "left-6"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}

/* ── Alan bileşeni ────────────────────────────────────────────────── */
function Field({
  label,
  tooltip,
  value,
  onChange,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  tooltip: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <label className="text-xs text-white/50 uppercase tracking-widest font-bold">{label}</label>
        <InfoTooltip text={tooltip} />
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors"
        />
      )}
      {hint && <p className="text-[11px] text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

/* ── Ana bileşen ──────────────────────────────────────────────────── */
const DEFAULTS = {
  siteTitle: "Trend Optik Mersin | Optik, Gözlük & Güneş Gözlüğü",
  siteDesc: "Mersin Yenişehir'in premium optik mağazası. Numaralı gözlük, güneş gözlüğü, lens ve göz muayenesi. Ray-Ban, Prada, Gucci, Oakley orijinal ürünler. WhatsApp'tan hemen bilgi alın.",
  businessName: "Trend Optik Mersin",
  street: "Çiftlikköy Mah., Mimar Sinan Cad., Paradise Homes Sitesi, B-Blok No: 24/BB",
  district: "Yenişehir",
  city: "Mersin",
  postalCode: "33150",
  phone: "+905312075818",
  hoursWeekday: "08:30 - 18:30",
  hoursSaturday: "08:30 - 17:30",
  instagram: "https://instagram.com/trendoptikmersin",
  whatsapp: "https://wa.me/905312075818",
  gaId: "G-PVZTDX1VJR",
};

export default function SEOManager() {
  const [form, setForm] = useState(DEFAULTS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "seo"));
        if (snap.exists()) setForm(f => ({ ...f, ...snap.data() }));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const set = (key: keyof typeof DEFAULTS) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "seo"), form, { merge: true });
      toast.success("SEO ayarları kaydedildi.");
    } catch (e: any) {
      toast.error(`Kayıt hatası: ${e?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gold)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-xl md:text-3xl font-bold">SEO Yönetimi</h2>
      </div>

      {/* Bilgi kartı */}
      <div className="glass border border-[var(--accent-gold)]/20 rounded-2xl p-5 mb-8 flex gap-3 bg-[var(--accent-gold)]/5">
        <Info className="w-5 h-5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white mb-1">SEO Nedir?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            &ldquo;Mersin optik&rdquo;, &ldquo;mersin gözlük&rdquo; gibi aramalarda sitenizin üst sıralarda çıkması için yapılan ayarlardır.
            Her alanın yanındaki <span className="font-bold text-white/70">(?)</span> işaretine dokunarak ne işe yaradığını görebilirsiniz.
            Değişiklikler birkaç gün içinde Google&apos;a yansır.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Google Gösterimi */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Google'da Görünüm
          </h3>

          <Field
            label="Site Başlığı (Title)"
            tooltip="Google'da ve tarayıcı sekmesinde görünen ana başlık. 50–60 karakter idealdir; içinde 'Mersin' ve 'optik/gözlük' geçmeli. Örn: 'Trend Optik Mersin | Gözlük & Güneş Gözlüğü'."
            value={form.siteTitle}
            onChange={set("siteTitle")}
            placeholder="Trend Optik Mersin | Optik, Gözlük & Güneş Gözlüğü"
            hint={`${form.siteTitle.length}/60 karakter`}
          />

          <Field
            label="Site Açıklaması (Description)"
            tooltip="Google sonucunda başlığın altındaki gri yazı. 150–160 karakter olmalı. Tıklamayı artıran, davet eden bir cümle yazın."
            value={form.siteDesc}
            onChange={set("siteDesc")}
            placeholder="Mersin Yenişehir'in premium optik mağazası..."
            textarea
            hint={`${form.siteDesc.length}/160 karakter`}
          />

          {/* Google önizleme */}
          <div className="border border-white/10 rounded-xl p-4 bg-black/30">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Google Önizleme</p>
            <p className="text-blue-400 text-sm font-medium leading-tight line-clamp-1">{form.siteTitle || "Başlık"}</p>
            <p className="text-green-500/70 text-[11px] mt-0.5">trendoptikmersin.com</p>
            <p className="text-white/40 text-xs mt-1 line-clamp-2">{form.siteDesc || "Açıklama"}</p>
          </div>
        </div>

        {/* İşletme Bilgileri */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            İşletme Bilgileri
          </h3>

          <Field
            label="İşletme Adı"
            tooltip="Google'a bildirilen resmi ad. Google Haritalar / İşletme profilinizle birebir aynı olmalı. Farklı yazılırsa yerel aramada sıralamanızı olumsuz etkiler."
            value={form.businessName}
            onChange={set("businessName")}
            placeholder="Trend Optik Mersin"
          />

          <Field
            label="Adres"
            tooltip="Yerel aramada ('mersin optik', 'mersin gözlük') çıkmanız için kritik. Google Haritalar'daki adresle aynı yazın; farklı olursa yerel SEO zarar görür."
            value={form.street}
            onChange={set("street")}
            placeholder="Çiftlikköy Mah., Mimar Sinan Cad. ..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="İlçe"
              tooltip="İlçe adı — yerel aramada kritik. Google Haritalar'daki ile aynı olmalı."
              value={form.district}
              onChange={set("district")}
              placeholder="Yenişehir"
            />
            <Field
              label="Posta Kodu"
              tooltip="5 haneli posta kodu. PTT'nin resmi kodu ile aynı olmalı."
              value={form.postalCode}
              onChange={set("postalCode")}
              placeholder="33150"
            />
          </div>

          <Field
            label="Telefon"
            tooltip="Tıklanınca arama başlatan numara. Başında +90 ile yazın. Google Haritalar'daki numara ile aynı olmalı."
            value={form.phone}
            onChange={set("phone")}
            placeholder="+905312075818"
          />
        </div>

        {/* Çalışma Saatleri */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Çalışma Saatleri
          </h3>

          <Field
            label="Hafta İçi (Pzt–Cum)"
            tooltip="Google'da 'Açık/Kapalı' bilgisini gösterir ve arama sonuçlarında çalışma saatleri olarak listelenir. Doğru girin; yanlışsa müşteri memnuniyeti düşer."
            value={form.hoursWeekday}
            onChange={set("hoursWeekday")}
            placeholder="08:30 - 18:30"
          />

          <Field
            label="Cumartesi"
            tooltip="Cumartesi çalışma saati. Pazar kapalıysa bu alanı doldurup Pazar için alan eklememeniz yeterli."
            value={form.hoursSaturday}
            onChange={set("hoursSaturday")}
            placeholder="08:30 - 17:30"
          />
        </div>

        {/* Sosyal Medya & Takip */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Sosyal Medya & Takip
          </h3>

          <Field
            label="Instagram"
            tooltip="Instagram hesabınızın tam adresi. Google'a sosyal profilinizi tanıtır; markanızın doğrulanmasına yardımcı olur. Örn: https://instagram.com/trendoptikmersin"
            value={form.instagram}
            onChange={set("instagram")}
            placeholder="https://instagram.com/trendoptikmersin"
          />

          <Field
            label="WhatsApp"
            tooltip="WhatsApp linki. Müşterilerin mobil cihazlardan doğrudan yazmasını sağlar. Örn: https://wa.me/905312075818"
            value={form.whatsapp}
            onChange={set("whatsapp")}
            placeholder="https://wa.me/905312075818"
          />

          <Field
            label="Google Analytics ID"
            tooltip="G- ile başlayan ölçüm kimliği (mevcut: G-PVZTDX1VJR). Sitenizi ziyaret eden kişilerin nereden geldiğini, hangi ürünlere baktığını gösterir. Bilmiyorsanız dokunmayın."
            value={form.gaId}
            onChange={set("gaId")}
            placeholder="G-PVZTDX1VJR"
          />

          <div className="border border-amber-500/20 rounded-xl p-3 bg-amber-500/5">
            <p className="text-xs text-amber-400/80 leading-relaxed">
              <span className="font-bold">Önemli:</span> Bu sayfadaki değişiklikler referans amaçlıdır. Site kodundaki JSON-LD ve metadata değerlerinin güncellenmesi için Vercel&apos;de yeniden dağıtım (deploy) gerekir.
            </p>
          </div>
        </div>
      </div>

      {/* Google İşletme Profili hatırlatması */}
      <div className="glass border border-blue-500/20 rounded-2xl p-5 mt-6 flex gap-3 bg-blue-500/5">
        <ExternalLink className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white mb-1">Google İşletme Profili — Yerel SEO&apos;nun Yarısı</p>
          <p className="text-xs text-white/50 leading-relaxed">
            &ldquo;Mersin optik&rdquo; aramalarında haritada çıkmak için
            <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mx-1">business.google.com</a>
            adresinden işletmenizi doğrulayın. Kategori olarak <strong className="text-white/70">Gözlükçü / Optician</strong> seçin, tam adresi ve çalışma saatlerini girin, fotoğraf ekleyin. Bu adım kod değil; yalnızca siz yapabilirsiniz.
          </p>
        </div>
      </div>

      {/* Kaydet butonu */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          SEO Ayarlarını Kaydet
        </button>
      </div>
    </div>
  );
}
