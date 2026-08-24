"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SLIDES = Array.from(
  { length: 12 },
  (_, i) => `/assets/hero/slide-${i + 1}.png`,
);

interface HomeHeroSlideshowProps {
  children: ReactNode;
}

export function HomeHeroSlideshow({ children }: HomeHeroSlideshowProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[calc(100dvh-72px)] overflow-hidden bg-[#0d1b3e] text-white">
      <div className="absolute inset-0" aria-hidden>
        {SLIDES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000",
              index === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to left, rgba(13, 27, 62, 0.52) 0%, rgba(13, 27, 62, 0.22) 34%, transparent 62%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[calc(100dvh-72px)] flex-col justify-center">
        {children}
        <div className="container mx-auto max-w-6xl px-4 pb-10">
          <div className="flex gap-2" aria-label="انتخاب اسلاید تصاویر">
            {SLIDES.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`اسلاید ${index + 1}`}
                onClick={() => setActive(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2 border-gold/70 transition",
                  index === active ? "scale-110 bg-gold" : "bg-transparent",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
