"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const materials = [
  {
    title: "Japon Titanyumu",
    desc: "Hafifliğin ve dayanıklılığın zirvesi. Uzay havacılığında kullanılan 1. sınıf titanyum ile sıfır ağırlık hissi.",
    color: "from-zinc-400 to-zinc-600"
  },
  {
    title: "18 Ayar Altın İşçiliği",
    desc: "Mücevher ustalarının elinden çıkma mikro menteşe detayları. Her bir çerçeve tek tek elde parlatılır.",
    color: "from-[var(--accent-gold-light)] to-[var(--accent-gold)]"
  },
  {
    title: "El Yapımı Asetat",
    desc: "İtalya'nın en köklü atölyelerinden gelen organik selüloz asetat ile eşsiz renk derinliği ve organik dokunuş.",
    color: "from-stone-600 to-stone-800"
  }
];

export default function Craftsmanship() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".craft-card");
      
      cards.forEach((card: any, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-32 relative bg-[var(--background)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[var(--background-secondary)] opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-premium relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--accent-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
          >
            Sıfır Taviz
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tighter"
          >
            Zanaatkarlık ve <br/> <span className="text-white/40 font-light">Mükemmeliyet</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-base md:text-xl font-light leading-relaxed"
          >
            Bir gözlük sadece görme aracı değildir; yüzünüzde taşıdığınız bir mimari eserdir. Koleksiyonumuzdaki her parça, dünyanın en nadide materyalleriyle aylarca süren bir el işçiliğinin eseridir.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 sm:px-0">
          {materials.map((mat, idx) => (
            <div key={idx} className="craft-card group relative p-[1px] rounded-[2rem] overflow-hidden">
              <div className="relative h-full bg-white/[0.03] backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/[0.05] group-hover:border-[var(--accent-gold)]/20 transition-all duration-700">
                <div className={`w-12 h-12 rounded-full mb-8 bg-gradient-to-br ${mat.color} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--accent-gold)] transition-colors duration-500">{mat.title}</h3>
                <p className="text-white/50 leading-relaxed font-light text-sm md:text-base">{mat.desc}</p>
                
                <div className="mt-8 flex items-center text-sm font-medium text-white/30 group-hover:text-white/70 transition-colors duration-500">
                  <span className="tracking-widest uppercase text-[10px]">Detayı İncele</span>
                  <div className="w-8 h-[1px] bg-current ml-4 group-hover:w-12 transition-all duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
