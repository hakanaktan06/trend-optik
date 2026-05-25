"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShieldCheck, Gem, Sparkles } from "lucide-react";

const collections = {
  1: {
    title: "Güneş Koleksiyonu",
    img: "/images/hero_koleksiyon_1.png",
    subtitle: "Zarafetin güneşle buluştuğu an.",
    longDesc: "Güneşin sıcaklığını ve zarafetini yüzünüzde hissedin. Premium asetat çerçeveler ve %100 UV korumalı polarize camlarla donatılan bu seri, lüksü ve göz sağlığını mükemmel bir harmoni içinde bir araya getiriyor. Dünyaca ünlü markaların en ikonik parçalarıyla yazın tadını çıkarın.",
    features: ["%100 UV400 Koruması", "Polarize Premium Camlar", "Hafif Asetat Çerçeve"]
  },
  2: {
    title: "Retro Serisi",
    img: "/images/hero_koleksiyon_2.png",
    subtitle: "Geçmişin ruhu, bugünün tarzı.",
    longDesc: "1970'lerin nostaljik havasını modern dokunuşlarla yeniden keşfedin. Klasik aviator silüetleri, altın kaplama köprü detayları ve vintage renk paletleriyle Retro Serisi, zamansız bir zarafet sunuyor. Geçmişin ihtişamını günümüze taşıyan özel koleksiyonumuzla tarzınızı konuşturun.",
    features: ["Klasik Aviator Tasarım", "Vintage Renk Tonları", "Altın Kaplama Detaylar"]
  },
  3: {
    title: "Minimalist Çizgiler",
    img: "/images/hero_koleksiyon_3.png",
    subtitle: "Az ama öz tasarımlar.",
    longDesc: "Sade, şık ve sofistike. İnce titanyum çerçeveler ve çerçevesiz tasarımlarla minimalist estetiğin doruklarına ulaşın. Tüy kadar hafif yapısı sayesinde gün boyu yüzünüzde varlığını bile hissetmeyeceğiniz bu seri, modern sadeliği arayanların ilk tercihi.",
    features: ["Ultra Hafif Titanyum", "Çerçevesiz Tasarımlar", "Zen Estetiği"]
  },
  4: {
    title: "Moda İkonları",
    img: "/images/hero_koleksiyon_4.png",
    subtitle: "Sokak stilinin lüks yorumu.",
    longDesc: "Cesur, dinamik ve dikkat çekici. Yüksek modanın sokak stiliyle buluştuğu Moda İkonları serisi, kalın asetat çerçeveler, neon yansımalar ve avangart kesimlerle sınırları zorluyor. Kalabalıktan sıyrılmak ve kendi stil manifestosunu yaratmak isteyenler için tasarlandı.",
    features: ["Avangart Tasarım", "Kalın Asetat Profil", "Dikkat Çekici Silüet"]
  },
  5: {
    title: "Altın Saat",
    img: "/images/hero_koleksiyon_5.png",
    subtitle: "Gün batımı yansımaları.",
    longDesc: "Altın saatlerin o büyülü ışığını yansıtan sıcak tonlar... Özel degrade camlar ve lüks detaylarla bezenmiş bu koleksiyon, her anınıza sinematik bir hava katıyor. Göz kamaştırıcı ve bir o kadar da gözleri dinlendiren premium bir vizyon deneyimi.",
    features: ["Degrade Cam Teknolojisi", "Sıcak Amber Tonları", "Sinematik Görünüm"]
  },
  6: {
    title: "Usta Elleri",
    img: "/images/hero_koleksiyon_6.png",
    subtitle: "Atölyeden çıkan sanat eserleri.",
    longDesc: "Her biri usta zanaatkarların ellerinde titizlikle şekillenen premium asetat çerçeveler. Seri üretimden uzak, tamamen el işçiliğiyle üretilen Usta Elleri koleksiyonu, malzemenin en saf ve kaliteli halini sizlere sunuyor. Dokunduğunuzda gerçek kaliteyi hissedeceksiniz.",
    features: ["%100 El İşçiliği", "Premium Tortoise Asetat", "Zanaatkar Dokunuşu"]
  },
};

export default function CollectionDetailClient({ id }: { id: string }) {
  const collection = collections[Number(id) as keyof typeof collections];

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <h1 className="text-3xl font-bold text-white">Koleksiyon Bulunamadı</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent-color)] selection:text-white pb-20">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image 
            src={collection.img}
            alt={collection.title}
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/40 to-transparent" />
        
        {/* Geri Dön Button - Moved down to avoid Navbar overlap */}
        <div className="absolute top-24 left-0 w-full px-6 md:px-10 z-30 flex justify-start items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg hover:bg-black/80">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold tracking-widest uppercase">Geri Dön</span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="container-premium mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-[var(--accent-color)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-bold drop-shadow-md">
                Özel Koleksiyon İncelemesi
              </span>
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-xl">
                {collection.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl drop-shadow-md">
                {collection.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="container-premium mx-auto px-6 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Koleksiyonun Hikayesi</h2>
            <div className="w-16 h-1 bg-[var(--accent-color)]/50 rounded-full" />
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
              {collection.longDesc}
            </p>
            <p className="text-white/40 text-base font-light leading-relaxed">
              Tasarımcılarımızın her bir detayı ince ince işlediği bu seri, tarzınızı bir üst seviyeye taşıyacak. Size en uygun parçayı seçmek veya uzman stil danışmanlarımızdan destek almak için bizimle iletişime geçebilirsiniz.
            </p>
          </motion.div>

          {/* Features & Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--accent-color)]" />
                Öne Çıkan Özellikler
              </h3>
              <ul className="space-y-4">
                {collection.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <ShieldCheck size={18} className="text-[var(--accent-color)]" />
                  <span>2 Yıl Garanti ve Orijinallik Sertifikası</span>
                </div>
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <Gem size={18} className="text-[var(--accent-color)]" />
                  <span>Mağazamızda VIP Deneyim İmkanı</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-dark)] rounded-3xl p-8 shadow-[0_10px_40px_-10px_var(--accent-color)] relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Bu Seriyi Sevdiniz mi?</h3>
              <p className="text-white/80 text-sm mb-8 relative z-10">
                Stil danışmanlarımız size en uygun modeli seçmeniz için bekliyor. Hemen WhatsApp üzerinden iletişime geçin.
              </p>
              
              <a 
                href={`https://wa.me/905312075818?text=${encodeURIComponent(`Merhaba Trend Optik, ${collection.title} serisini inceledim, detaylı bilgi alabilir miyim?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition-all duration-300"
              >
                <MessageCircle size={18} />
                WhatsApp'tan Bilgi Al
              </a>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
