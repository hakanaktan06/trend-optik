"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-32 bg-[var(--background)]">
      <div className="container-premium px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[var(--accent-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
          >
            Sıfır Taviz
          </motion.span>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tighter">
            Zanaatkarlık ve <br/> <span className="text-white/40 font-light">Mükemmeliyet</span>
          </h2>
        </div>

        {/* Bento Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[800px]">
          
          {/* Main Large Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 relative rounded-[2rem] overflow-hidden group cursor-pointer"
          >
            <Image 
              src="/images/manken-1.jpg" 
              alt="Premium Collection" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-2">Premium Çerçeveler</h3>
              <p className="text-white/60 font-light">Mersin'in en seçkin koleksiyonu, global markaların zirve modelleri.</p>
            </div>
          </motion.div>

          {/* Side Boxes Stack */}
          <div className="md:col-span-4 grid grid-rows-2 gap-4 md:gap-6">
            
            {/* Small Box 1: Japon Titanyumu */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <Image 
                src="/images/detay-titanyum.jpg" 
                alt="Japon Titanyumu" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-none" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h4 className="text-xl font-bold text-[var(--accent-gold)] mb-2">Japon Titanyumu</h4>
                <p className="text-white/70 text-sm font-light">Sıfır ağırlık hissi, ömür boyu dayanıklılık.</p>
              </div>
            </motion.div>

            {/* Small Box 2: El Yapımı Asetat */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-[2rem] overflow-hidden group cursor-pointer bg-white/[0.03] border border-white/[0.05] flex flex-col justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h4 className="text-xl font-bold text-white mb-2">El Yapımı Asetat</h4>
              <p className="text-white/50 text-sm font-light">İtalyan zanaatkarların elinden çıkan organik doku ve derin renkler.</p>
              <div className="mt-6 flex items-center text-[var(--accent-gold)] text-xs font-bold uppercase tracking-widest gap-2">
                Keşfet <span className="text-lg">→</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
