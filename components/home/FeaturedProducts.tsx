"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Sparkles, Shield, Star } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Göz Muayenesi",
    description: "Uzman optometristlerimiz ile dijital göz muayenesi ve kişiselleştirilmiş reçete.",
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Sparkles,
    title: "Premium Markalar",
    description: "Ray-Ban, Gucci, Prada, Tom Ford ve daha fazlası. Orijinal garantili koleksiyonlar.",
    accent: "from-[var(--accent-gold)]/20 to-[var(--accent-gold)]/5",
  },
  {
    icon: Shield,
    title: "Lens Teknolojisi",
    description: "Anti-refleks, mavi ışık filtresi, fotokromik lensler. İhtiyacınıza özel çözümler.",
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Star,
    title: "Özel Tasarım",
    description: "Yüz formunuza uygun, kişiye özel çerçeve danışmanlığı ve tasarım hizmeti.",
    accent: "from-purple-500/20 to-purple-600/5",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="hizmetler"
      ref={ref}
      className="relative py-[var(--section-padding)] bg-[var(--background)]"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 bg-noise" />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-4"
          >
            Hizmetlerimiz
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            Mükemmellik,{" "}
            <span className="text-gradient-gold">Detaylarda</span> Gizlidir
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-4 text-sm md:text-base text-white/35 max-w-md mx-auto font-light"
          >
            Her bir müşterimize premium deneyim sunmak için tasarlanmış hizmetler.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="group relative rounded-2xl glass glass-hover p-6 md:p-7 transition-all duration-500 hover:border-[var(--border-gold)] cursor-default"
            >
              {/* Gradient Orb */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${feature.accent} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />

              {/* Icon */}
              <div className="relative mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[var(--accent-gold)]/30 transition-colors duration-500">
                  <feature.icon
                    size={20}
                    className="text-[var(--accent-gold)] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-white mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed font-light group-hover:text-white/50 transition-colors duration-500">
                {feature.description}
              </p>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-gold)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
