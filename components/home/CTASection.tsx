"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Calendar, ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="iletisim"
      ref={ref}
      className="relative py-16 md:py-32 bg-[var(--background)]"
    >
      <div className="container-premium relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl mx-auto text-center"
        >
          {/* Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--accent-gold)] opacity-[0.03] blur-[120px]" />

          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-6">
            Bir Adım Uzağınızdayız
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.05]">
            Mükemmel Görüşün
            <br />
            <span className="text-gradient-gold">Hikayeniz</span> Burada Başlıyor
          </h2>

          <p className="mt-5 md:mt-6 text-sm md:text-base text-white/35 max-w-lg mx-auto font-light leading-relaxed">
            Premium gözlük deneyimi için hemen randevu alın veya WhatsApp üzerinden
            uzman ekibimize danışın.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-10">
            <a
              href="https://wa.me/905312075818?text=Merhaba%2C%20Trend%20Optik%20Mersin%27den%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 text-sm font-medium text-[#050505] bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] rounded-2xl md:rounded-full hover:shadow-xl hover:shadow-[var(--accent-gold)]/20 transition-all duration-500 active:scale-[0.97]"
            >
              <MessageCircle size={18} />
              WhatsApp ile Ulaşın
            </a>
            <a
              href="tel:+905312075818"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 text-sm font-medium text-white/70 hover:text-white rounded-2xl md:rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md transition-all duration-300"
            >
              <Calendar size={18} className="text-[var(--accent-gold)]" />
              Randevu Al
            </a>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center justify-center gap-6 mt-12 md:mt-14"
          >
            {["Orijinal Ürün Garantisi", "Ücretsiz Kargo", "Kolay İade"].map(
              (badge) => (
                <span
                  key={badge}
                  className="text-[10px] md:text-xs text-white/20 uppercase tracking-wider font-medium"
                >
                  {badge}
                </span>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
