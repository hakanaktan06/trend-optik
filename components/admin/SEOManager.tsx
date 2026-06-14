"use client";

import { Search, Info, ExternalLink } from "lucide-react";

/* ── Alan bileşeni (salt okunur) ────────────────────────────────── */
function Field({
  label,
  tooltip,
  value,
  textarea,
  hint,
}: {
  label: string;
  tooltip: string;
  value: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs text-white/50 uppercase tracking-widest font-bold">{label}</label>
        <span className="text-[10px] text-white/20 normal-case tracking-normal italic">— salt okunur</span>
      </div>

      {textarea ? (
        <textarea
          value={value}
          readOnly
          rows={3}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-white/60 cursor-default resize-none select-all"
        />
      ) : (
        <input
          type="text"
          value={value}
          readOnly
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-white/60 cursor-default select-all"
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
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-xl md:text-3xl font-bold">SEO Bilgileri</h2>
      </div>

      {/* Bilgi kartı */}
      <div className="glass border border-[var(--accent-gold)]/20 rounded-2xl p-5 mb-8 flex gap-3 bg-[var(--accent-gold)]/5">
        <Info className="w-5 h-5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white mb-1">Bu Bilgiler Nasıl Güncellenir?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Aşağıdaki bilgiler sitenin Google&apos;a tanıttığı resmi verilerdir. Değiştirilmesi gerekirse
            bunu yapan ekiple iletişime geçin. Yanlış ya da eksik bilgi yerel arama sıralamasını olumsuz etkiler.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Google Gösterimi */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Google&apos;da Görünüm
          </h3>

          <Field
            label="Site Başlığı (Title)"
            tooltip="Google'da ve tarayıcı sekmesinde görünen ana başlık."
            value={DEFAULTS.siteTitle}
            hint={`${DEFAULTS.siteTitle.length}/60 karakter`}
          />

          <Field
            label="Site Açıklaması (Description)"
            tooltip="Google sonucunda başlığın altındaki açıklama metni."
            value={DEFAULTS.siteDesc}
            textarea
            hint={`${DEFAULTS.siteDesc.length}/160 karakter`}
          />

          {/* Google önizleme */}
          <div className="border border-white/10 rounded-xl p-4 bg-black/30">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Google Önizleme</p>
            <p className="text-blue-400 text-sm font-medium leading-tight line-clamp-1">{DEFAULTS.siteTitle}</p>
            <p className="text-green-500/70 text-[11px] mt-0.5">trendoptikmersin.com</p>
            <p className="text-white/40 text-xs mt-1 line-clamp-2">{DEFAULTS.siteDesc}</p>
          </div>
        </div>

        {/* İşletme Bilgileri */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            İşletme Bilgileri
          </h3>

          <Field
            label="İşletme Adı"
            tooltip="Google'a bildirilen resmi işletme adı."
            value={DEFAULTS.businessName}
          />

          <Field
            label="Adres"
            tooltip="Google Haritalar ile eşleşmesi gereken açık adres."
            value={DEFAULTS.street}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="İlçe"
              tooltip="İlçe adı."
              value={DEFAULTS.district}
            />
            <Field
              label="Posta Kodu"
              tooltip="5 haneli posta kodu."
              value={DEFAULTS.postalCode}
            />
          </div>

          <Field
            label="Telefon"
            tooltip="Uluslararası formatta telefon numarası."
            value={DEFAULTS.phone}
          />
        </div>

        {/* Çalışma Saatleri */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Çalışma Saatleri
          </h3>

          <Field
            label="Hafta İçi (Pzt–Cum)"
            tooltip="Pazartesiden Cumaya çalışma saati."
            value={DEFAULTS.hoursWeekday}
          />

          <Field
            label="Cumartesi"
            tooltip="Cumartesi çalışma saati."
            value={DEFAULTS.hoursSaturday}
          />
        </div>

        {/* Sosyal Medya & Takip */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-4">
            Sosyal Medya & Takip
          </h3>

          <Field
            label="Instagram"
            tooltip="Instagram hesabı linki."
            value={DEFAULTS.instagram}
          />

          <Field
            label="WhatsApp"
            tooltip="WhatsApp direkt mesaj linki."
            value={DEFAULTS.whatsapp}
          />

          <Field
            label="Google Analytics ID"
            tooltip="Site ziyaretçi istatistikleri için kullanılan ölçüm kimliği."
            value={DEFAULTS.gaId}
          />
        </div>
      </div>

      {/* Google İşletme Profili hatırlatması */}
      <div className="glass border border-blue-500/20 rounded-2xl p-5 mt-6 flex gap-3 bg-blue-500/5">
        <ExternalLink className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white mb-1">Google İşletme Profili — Yerel SEO&apos;nun Temeli</p>
          <p className="text-xs text-white/50 leading-relaxed">
            &ldquo;Mersin optik&rdquo; aramalarında haritada çıkmak için
            <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mx-1">business.google.com</a>
            adresinden işletmenizi doğrulayın. Kategori olarak <strong className="text-white/70">Gözlükçü / Optician</strong> seçin, tam adres ve çalışma saatlerini girin, fotoğraf ekleyin.
          </p>
        </div>
      </div>
    </div>
  );
}
