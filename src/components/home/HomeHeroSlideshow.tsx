"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero slideshow display order (index 0 = first shown on load).
 * Playground / indoor play area (slide-6) must lead; then 1–5, 7–12.
 * Do not use Array.from or sequential slide-(n+1) generation — order is this list only.
 */
const SLIDES = [
  "/assets/hero/slide-6.png", // first shown
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
] as const;

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
    <section className="relative min-h-[85dvh] overflow-hidden bg-[#0d1b3e] text-white sm:min-h-dvh">
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
      <div className="relative z-10 flex min-h-[85dvh] flex-col justify-center pt-14 sm:min-h-dvh sm:pt-16 md:pt-14">
        {children}
        <div className="container mx-auto max-w-6xl px-4 pb-8 sm:pb-10">
          <div
            className="inline-flex flex-wrap items-center gap-2 rounded-full bg-navy/55 px-3 py-2 backdrop-blur-sm ring-1 ring-white/15 sm:gap-2.5 sm:px-3.5 sm:py-2.5"
            aria-label="انتخاب تصویر پس‌زمینه"
          >
            {SLIDES.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`تصویر ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
                className={cn(
                  "shrink-0 rounded-full transition-all duration-300",
                  index === current
                    ? "h-2.5 w-6 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.55)] sm:h-3 sm:w-7"
                    : "h-2.5 w-2.5 bg-white/55 ring-1 ring-white/70 hover:bg-white/80 sm:h-3 sm:w-3",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}