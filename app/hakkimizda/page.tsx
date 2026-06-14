import type { Metadata } from "next";
import BentoGrid from "@/components/home/BentoGrid";
import LensTech from "@/components/home/LensTech";
import ParallaxBanner from "@/components/home/ParallaxBanner";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import { faqs } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hakkımızda | Trend Optik Mersin",
  description:
    "Trend Optik Mersin hakkında: 15+ yıllık deneyim, Zeiss/Leica cam teknolojisi, el işçiliği ve premium gözlük koleksiyonlarımız hakkında bilgi edinin.",
  alternates: { canonical: "https://trendoptikmersin.com/hakkimizda" },
};

export default function HakkimizdaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[var(--background)] text-center px-6">
        <span className="text-[var(--accent-gold)] text-[11px] tracking-[0.5em] uppercase mb-4 block font-bold">
          Neden Trend Optik
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6">
          Hakkımızda
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-base md:text-lg">
          15 yılı aşkın tecrübemiz, üstün zanaat anlayışımız ve Mersin&apos;in en seçkin
          gözlük koleksiyonuyla her detayda mükemmelliği sunuyoruz.
        </p>
        <div className="w-16 h-px bg-[var(--accent-gold)]/50 mx-auto mt-10" />
      </section>

      {/* Zanaatkarlık / Sıfır Taviz Bento */}
      <BentoGrid />

      {/* Zeiss / Leica Cam Teknolojisi */}
      <LensTech />

      {/* Lifestyle Banner */}
      <ParallaxBanner />

      {/* SSS / FAQ */}
      <FAQSection />

      {/* İletişim CTA */}
      <CTASection />
    </>
  );
}
