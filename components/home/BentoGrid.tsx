"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, ArrowRight } from "lucide-react";

const extraGallery = [
  { id: 1, title: "Güneş Koleksiyonu", img: "/images/koleksiyon-1.jpg", desc: "Zarafetin güneşle buluştuğu an." },
  { id: 2, title: "Retro Serisi", img: "/images/koleksiyon-2.jpg", desc: "Geçmişin ruhu, bugünün tarzı." },
  { id: 3, title: "Minimalist Çizgiler", img: "/images/koleksiyon-3.jpg", desc: "Az ama öz tasarımlar." },
  { id: 4, title: "Moda İkonları", img: "/images/koleksiyon-4.jpg", desc: "Sokak stilinin lüks yorumu." },
  { id: 5, title: "Altın Saat", img: "/images/koleksiyon-5.jpg", desc: "Gün batımı yansımaları." },
  { id: 6, title: "Usta Elleri", img: "/images/koleksiyon-6.jpg", desc: "Atölyeden çıkan sanat eserleri." },
];

export default function BentoGrid() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <section className="py-16 md:py-32 bg-[var(--background)]">
      <div className="container-premium px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[var(--accent-color)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
          >
            Sıfır Taviz
          </motion.span>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tighter">
            Zanaatkarlık ve <br/> <span className="text-white/40 font-light">Mükemmeliyet</span>
          </h2>
        </div>

        {/* --- MAIN 3-BLOCK GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[800px] mb-4 md:mb-6">
          
          {/* Box 1: Zanaatın Zirvesi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] md:h-full"
          >
            <Image 
              src="/images/manken-1.jpg" 
              alt="Premium Collection" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">Zanaatın Zirvesi</h3>
              <p className="text-white/60 text-sm md:text-base font-light">Mersin'in en seçkin koleksiyonu, global markaların zirve modelleri.</p>
            </div>
          </motion.div>

          {/* Side Column (Box 2 & 3) */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4 md:gap-6">
            
            {/* Box 2: Japon Titanyumu */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] md:h-full"
            >
              <Image 
                src="/images/detay-titanyum.jpg" 
                alt="Japon Titanyumu" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h4 className="text-xl font-bold text-[var(--accent-color)] mb-2">Japon Titanyumu</h4>
                <p className="text-white/70 text-sm font-light">Sıfır ağırlık hissi, ömür boyu dayanıklılık.</p>
              </div>
            </motion.div>

            {/* Box 3: El Yapımı Asetat (GALLERY TRIGGER) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowGallery(!showGallery)}
              className="relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] md:h-full border border-white/10"
            >
              <Image 
                src="/images/asetat-detay.jpg" 
                alt="El Yapımı Asetat" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h4 className="text-2xl font-bold text-white mb-4">Özel Koleksiyon</h4>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium hover:bg-white hover:text-black transition-all duration-300">
                  {showGallery ? "Kapat" : "Koleksiyonu Keşfet"}
                  {showGallery ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- EXPANDABLE GALLERY --- */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              {/* Floating Scroll Hint */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-end mb-4 md:hidden"
              >
                <motion.span 
                  animate={{ opacity: 0 }}
                  transition={{ delay: 4, duration: 1 }}
                  className="text-[10px] text-white/30 tracking-[0.3em] uppercase font-light"
                >
                  Kaydırarak İnceleyin
                </motion.span>
              </motion.div>

              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                {extraGallery.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative min-w-[80vw] md:min-w-0 md:w-auto h-[400px] flex-shrink-0 snap-center rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5"
                  >
                    <Image 
                      src={item.img} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-white/50 text-sm font-light mb-5">{item.desc}</p>
                      
                      <a 
                        href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba Trend Optik, sayfanızdaki ${item.title} serisi ile ilgileniyorum, detaylı bilgi alabilir miyim?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[var(--accent-color)] text-xs font-bold uppercase tracking-widest md:opacity-0 md:group-hover:opacity-100 transition-all hover:gap-3"
                      >
                        İncele <ArrowRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
