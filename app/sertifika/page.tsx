import { adminDb } from "@/lib/firebaseAdmin";
import { BadgeCheck, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface Cert { certNo: string; customerName: string; product: string; discountRate: string; duration: string; }

async function getCert(id: string): Promise<Cert | null> {
  try {
    const snap = await adminDb.collection("certificates").doc(id).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
    return {
      certNo: d.certNo ?? "",
      customerName: d.customerName ?? "",
      product: d.product ?? "",
      discountRate: d.discountRate ?? "",
      duration: d.duration ?? "",
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
      <div className="w-full max-w-lg relative rounded-[2rem] border border-[var(--accent-gold)]/25 bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 shadow-[0_0_60px_rgba(234,88,12,0.12)] text-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-gold)] opacity-[0.06] blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)]" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold">Trend Optik Mersin</span>
        </div>
        <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--accent-gold)] font-bold mb-3">VIP Dijital Garanti Sertifikası</p>
        <h1 style={{ fontFamily: "var(--font-playfair)" }} className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{cert.customerName}</h1>
        <p className="text-white/50 italic font-light mb-8">{cert.product}</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-black/40 border border-white/5 py-5">
            <p className="text-3xl font-bold text-[var(--accent-gold)]">%{cert.discountRate}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Özel İndirim</p>
          </div>
          <div className="rounded-2xl bg-black/40 border border-white/5 py-5">
            <p className="text-3xl font-bold text-white">{cert.duration} Ay</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Garanti Süresi</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <BadgeCheck className="w-4 h-4 text-green-400" />
          <span className="font-mono text-sm text-[var(--accent-gold)] font-bold tracking-wider">{cert.certNo}</span>
        </div>
        <p className="text-[11px] text-white/30 font-light">Bu sertifika Trend Optik Mersin tarafından dijital olarak düzenlenmiştir.</p>
      </div>
    </main>
  );
}
