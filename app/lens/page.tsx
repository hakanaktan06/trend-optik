import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MessageCircle } from "lucide-react";
import LensTech from "@/components/home/LensTech";

export const metadata: Metadata = {
  title: "Lens Çözümleri ve Optik Camlar | Trend Optik Mersin",
  description: "Mersin'de Zeiss, Essilor, Leica gibi premium optik cam markaları. Miyop, hipermetrop ve astigmat için özel üretim numaralı lens çözümleri.",
  alternates: { canonical: "https://trendoptikmersin.com/lens" }
};

export default function LensPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="container-premium">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12">
          <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Ana Sayfaya Dön</span>
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Lens ve <span className="text-white/20 italic">Optik Camlar</span></h1>
          <p className="text-white/40 max-w-2xl font-light text-lg">
            Göz sağlığınız için dünyanın en iyi optik cam markalarını sizlerle buluşturuyoruz. Mersin'de Zeiss, Leica ve Essilor gibi öncü markaların özel odaklama teknolojisiyle kusursuz görüş elde edin.
          </p>
          
          <div className="mt-8 flex">
            <a 
              href="https://wa.me/905312075818?text=Merhaba,%20optik%20camlar%20ve%20lens%20fiyatları%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[var(--accent-gold)] text-black px-8 py-4 rounded-full font-bold shadow-xl shadow-[var(--accent-gold)]/20 hover:scale-105 transition-transform"
            >
              <MessageCircle size={18} />
              WhatsApp ile Bilgi Alın
            </a>
          </div>
        </div>
      </div>

      {/* Leverage the existing LensTech component to show off the premium features */}
      <LensTech />
    </main>
  );
}
