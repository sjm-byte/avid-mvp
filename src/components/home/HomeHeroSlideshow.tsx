"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ترتیب نمایش اسلایدر هیرو.
 * برای تغییر ترتیب، فقط همین لیست را جابه‌جا کنید — اولین آیتم، اول نشان داده می‌شود.
 */
const SLIDES = [
  "/assets/hero/slide-6.png",
  "/assets/hero/slide-1.png",
  "/assets/hero/slide-2.png",
  "/assets/hero/slide-3.png",
  "/assets/hero/slide-4.png",
  "/assets/hero/slide-5.png",
  "/assets/hero/slide-7.png",
  "/assets/hero/slide-8.png",
  "/assets/hero/slide-9.png",
  "/assets/hero/slide-10.png",
  "/assets/hero/slide-11.png",
  "/assets/hero/slide-12.png",
];

/** Light scrim on the text side only; keeps full slide artwork visible. */
const HERO_OVERLAY =
  "linear-gradient(to left, rgba(13, 27, 62, 0.52) 0%, rgba(13, 27, 62, 0.22) 34%, transparent 62%)";

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
    <section className="relative min-h-dvh overflow-hidden bg-[#0d1b3e] text-white">
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
      <div
        className="absolute inset-0"
        style={{ background: HERO_OVERLAY }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-dvh flex-col justify-center pt-10 md:pt-14">
        {children}
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
