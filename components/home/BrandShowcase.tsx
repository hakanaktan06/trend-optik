import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/firestore-server";
import fs from "fs";
import path from "path";

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  // Triple for seamless infinite marquee on desktop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section
      id="markalar"
      className="py-10 md:py-16 bg-[var(--background-secondary)] relative overflow-hidden border-t border-b border-white/[0.02]"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-10 md:w-28 bg-gradient-to-r from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 md:w-28 bg-gradient-to-l from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />

      {/*
        Mobile: single-row horizontal scroll with snap (overflow-x:auto, no wrap).
        Desktop: infinite auto-scroll marquee.
      */}
      <div
        className={[
          /* mobile */
          "flex overflow-x-auto scroll-smooth",
          "scrollbar-hide",
          "snap-x snap-mandatory",
          /* desktop: clip overflow and let child animate */
          "md:overflow-hidden",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center flex-nowrap",
            "gap-10 md:gap-20",
            "px-10 md:px-8",
            /* desktop marquee animation */
            "md:animate-marquee md:hover:[animation-play-state:paused]",
            "w-max",
          ].join(" ")}
        >
          {marqueeBrands.map((brand, idx) => {
            const svgPath = path.join(process.cwd(), "public", "brands", `${brand.slug}.svg`);
            const pngPath = path.join(process.cwd(), "public", "brands", `${brand.slug}.png`);

            let logoSrc: string | null = null;
            if (fs.existsSync(svgPath)) {
              logoSrc = `/brands/${brand.slug}.svg`;
            } else if (fs.existsSync(pngPath)) {
              logoSrc = `/brands/${brand.slug}.png`;
            }

            return (
              <Link
                key={`${brand.id}-${idx}`}
                href={`/marka/${brand.slug}`}
                className="snap-center flex-shrink-0 flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-105 min-w-[6rem] md:min-w-[9rem]"
              >
                {logoSrc ? (
                  <div className="relative h-8 md:h-12 w-24 md:w-40">
                    <Image
                      src={logoSrc}
                      alt={brand.name}
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="(max-width: 768px) 96px, 160px"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span className="text-lg md:text-2xl font-display font-bold text-[var(--accent-gold)] whitespace-nowrap tracking-wider">
                    {brand.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
