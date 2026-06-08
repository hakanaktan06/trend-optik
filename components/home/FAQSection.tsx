"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const faqs = [
  {
    question: "Mersin'de göz muayenesi yapıyor musunuz?",
    answer: "Mağazamızda modern cihazlarla detaylı ölçüm ve gözlük numarası tespiti yapıyoruz. Resmi göz muayenesi için anlaşmalı olduğumuz hekimlere yönlendirme sağlıyoruz."
  },
  {
    question: "Hangi güneş gözlüğü ve çerçeve markaları var?",
    answer: "Trend Optik Mersin'de Ray-Ban, Prada, Gucci, Oakley, Tom Ford, Persol ve Vogue gibi dünyaca ünlü markaların %100 orijinal, garantili ürünlerini bulabilirsiniz."
  },
  {
    question: "Online sipariş alıyor musunuz?",
    answer: "Mersin dışına da hizmet veriyoruz! Beğendiğiniz modelleri WhatsApp üzerinden sorgulayabilir, güvenli ödeme ile aynı gün kargo hizmetimizden faydalanabilirsiniz."
  },
  {
    question: "Mağazanız tam olarak nerede?",
    answer: "Mersin Yenişehir'deyiz. Çiftlikköy Mah., Mimar Sinan Cad., Paradise Homes Sitesi, B-Blok No: 24/BB adresinde hizmet vermekteyiz."
  },
  {
    question: "Çalışma saatleriniz nedir?",
    answer: "Hafta içi Pazartesi - Cuma günleri 08:30 - 18:30, Cumartesi günleri ise 08:30 - 17:30 saatleri arasında açığız. Pazar günleri kapalıyız."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[var(--background)] relative border-t border-white/[0.04]">
      <div className="container-premium max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Sıkça Sorulan <span className="text-white/20 italic">Sorular</span>
          </h2>
          <p className="text-white/40 font-light max-w-2xl mx-auto">
            Mersin'deki optik mağazamız ve hizmetlerimiz hakkında merak ettikleriniz.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white/5 border-[var(--accent-gold)]/30" : "bg-transparent border-white/10 hover:border-white/20"}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-semibold text-sm md:text-base ${isOpen ? "text-[var(--accent-gold)]" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--accent-gold)]" : "text-white/40"}`} 
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-0 text-white/50 font-light text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
