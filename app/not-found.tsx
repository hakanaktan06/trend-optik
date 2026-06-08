import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-gold)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="text-center z-10 px-6">
        {/* 404 Background Text */}
        <h1 className="text-[120px] md:text-[200px] font-bold text-white/5 leading-none select-none tracking-tighter">
          404
        </h1>
        
        {/* Content */}
        <div className="-mt-12 md:-mt-20 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Görüş <span className="text-[var(--accent-gold)] italic">Alanımızda Değil</span>
          </h2>
          <p className="text-white/40 font-light max-w-md mx-auto mb-10 text-lg leading-relaxed">
            Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak ulaşılamıyor olabilir. Ana sayfaya dönerek koleksiyonumuzu incelemeye devam edebilirsiniz.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black px-8 py-4 rounded-full font-bold shadow-xl shadow-[var(--accent-gold)]/20 hover:scale-105 transition-all duration-300"
          >
            Ana Sayfaya Dön <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
