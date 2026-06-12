import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/firestore-server";
import fs from "fs";
import path from "path";

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  // Duplicate for seamless infinite scroll on desktop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section id="markalar" className="py-12 md:py-20 bg-[var(--background-secondary)] relative overflow-hidden border-t border-b border-white/[0.02]">
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />
      
      <div className="mobile-marquee-container md:overflow-hidden w-full flex">
        <div className="flex items-center gap-12 md:gap-24 px-8 md:animate-marquee md:hover:[animation-play-state:paused] w-max">
          {marqueeBrands.map((brand, idx) => {
            const svgPath = path.join(process.cwd(), "public", "brands", `${brand.slug}.svg`);
            const pngPath = path.join(process.cwd(), "public", "brands", `${brand.slug}.png`);
            
            let logoSrc = null;
            if (fs.existsSync(svgPath)) {
              logoSrc = `/brands/${brand.slug}.svg`;
            } else if (fs.existsSync(pngPath)) {
              logoSrc = `/brands/${brand.slug}.png`;
            }

            return (
              <Link 
                key={`${brand.id}-${idx}`}
                href={`/marka/${brand.slug}`}
                className="snap-center flex-shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 hover:scale-105"
              >
                {logoSrc ? (
                  <div className="relative h-10 md:h-14 w-32 md:w-48">
                    <Image 
                      src={logoSrc} 
                      alt={brand.name} 
                      fill 
                      className="object-contain brightness-0 invert" 
                      sizes="(max-width: 768px) 128px, 192px"
                    />
                  </div>
                ) : (
                  <div className="text-xl md:text-3xl font-display font-bold text-[var(--accent-gold)] whitespace-nowrap tracking-wider">
                    {brand.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
