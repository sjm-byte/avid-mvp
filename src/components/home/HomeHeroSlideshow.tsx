"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDES = Array.from({ length: 12 }, (_, index) => {
  return `/assets/hero/slide-${index + 1}.png`;
});

export function HomeHeroSlideshow({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100dvh-72px)] overflow-hidden text-white">
      <div className="absolute inset-0" aria-hidden>
        {SLIDES.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000",
              index === current ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-l from-[#1a2f52]/92 via-[#243f6b]/78 to-[#243f6b]/35"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[calc(100dvh-72px)] flex-col justify-center">
        <div className="[&_h1]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] [&_p]:drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
          {children}
        </div>
        <div className="container mx-auto max-w-6xl px-4 pb-10">
          <div className="flex gap-2" aria-label="انتخاب تصویر پس‌زمینه">
            {SLIDES.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`تصویر ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2 border-gold/70 transition",
                  index === current ? "scale-110 bg-gold" : "bg-transparent",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
