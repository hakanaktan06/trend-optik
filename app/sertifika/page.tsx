import { adminDb } from "@/lib/firebaseAdmin";
import { Award, Gift, ShieldCheck, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface Cert {
  certNo: string;
  customerName: string;
  product: string;
  discountRate: string;
  duration: string;
  issuedAt: string;
}

async function getCert(id: string): Promise<Cert | null> {
  try {
    const snap = await adminDb.collection("certificates").doc(id).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
    const created = d.createdAt?.toDate?.() ?? null;
    const issuedAt = created
      ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(created)
      : "";
    return {
      certNo: d.certNo ?? "",
      customerName: d.customerName ?? "",
      product: d.product ?? "",
      discountRate: d.discountRate ?? "",
      duration: d.duration ?? "",
      issuedAt,
    };
  } catch {
    return null;
  }
}

export default async function SertifikaPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const cert = id ? await getCert(id) : null;

  if (!cert) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Sertifika Bulunamadı</h1>
        <p className="text-white/40">Bu sertifika linki geçersiz veya kaldırılmış olabilir.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl relative rounded-[2.25rem] border border-[var(--accent-gold)]/25 bg-white/[0.025] backdrop-blur-xl px-7 py-10 md:px-12 md:py-14 text-center overflow-hidden shadow-[0_0_70px_rgba(234,88,12,0.12)]">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--accent-gold)] opacity-[0.07] blur-[90px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full border border-[var(--accent-gold)]/40 flex items-center justify-center bg-[var(--accent-gold)]/5 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
            <Award className="w-9 h-9 text-[var(--accent-gold)]" />
          </div>
          <span className="mt-3 text-[9px] tracking-[0.5em] uppercase text-white/40 font-bold">Onaylı Belge</span>
        </div>

        <p className="text-[10px] tracking-[0.45em] uppercase text-white/50 font-bold mb-2">Trend Optik Mersin</p>
        <h1 style={{ fontFamily: "var(--font-playfair)" }} className="text-2xl md:text-3xl font-bold text-[var(--accent-gold)] mb-6">
          VIP Ayrıcalık &amp; Garanti Sertifikası
        </h1>

        <p className="text-white/55 font-light leading-relaxed text-sm md:text-base max-w-md mx-auto mb-8">
          Trend Optik Mersin ailesine hoş geldiniz. Bu belge, aşağıda belirtilen ürün için tarafınıza tanınan ayrıcalıkları ve garanti haklarını resmî olarak onaylar.
        </p>

        <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-1">Sertifika Sahibi</p>
        <h2 style={{ fontFamily: "var(--font-playfair)" }} className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{cert.customerName}</h2>
        <p className="text-white/50 italic font-light mb-9">{cert.product}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9 text-left">
          <div className="rounded-2xl bg-black/40 border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-[var(--accent-gold)]" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Sadakat İndirimi</span>
            </div>
            <p className="text-3xl font-bold text-[var(--accent-gold)] mb-1">%{cert.discountRate}</p>
            <p className="text-xs text-white/45 font-light">Bir sonraki alışverişinizde geçerlidir.</p>
          </div>
          <div className="rounded-2xl bg-black/40 border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Kapsamlı Garanti</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{cert.duration} Ay</p>
            <p className="text-xs text-white/45 font-light">Tüm ürünlerinizde geçerlidir.</p>
          </div>
        </div>

        <div className="h-px w-2/3 mx-auto mb-6 bg-gradient-to-r from-transparent via-[var(--accent-gold)]/40 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 mb-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-green-400" />
            <span className="font-mono text-sm text-[var(--accent-gold)] font-bold tracking-wider">{cert.certNo}</span>
          </div>
          {cert.issuedAt && <span className="text-xs text-white/35 font-light">Düzenlenme: {cert.issuedAt}</span>}
        </div>
        <p className="text-[11px] text-white/30 font-light">Bu sertifika Trend Optik Mersin tarafından dijital olarak düzenlenmiş ve doğrulanmıştır.</p>
      </div>
    </main>
  );
}
