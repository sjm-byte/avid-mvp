"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Desktop hero slideshow. Mobile homepage uses MobileHomeHero instead.
 * Slide order matches MobileHomeHero (no slide-1).
 */
const SLIDES = [
  {
    src: "/assets/hero/slide-12.png",
    /** Wider scene — avoid corner crop that feels over-zoomed. */
    objectClass: "object-cover object-center",
  },
  {
    src: "/assets/hero/slide-11.png",
    objectClass: "object-cover object-center",
  },
  {
    src: "/assets/hero/slide-6.png",
    objectClass: "object-cover object-left-top",
  },
  {
    src: "/assets/hero/slide-3.png",
    objectClass: "object-cover object-left-top",
  },
  {
    src: "/assets/hero/slide-7.png",
    objectClass: "object-cover object-left-top",
  },
  {
    src: "/assets/hero/slide-10.png",
    objectClass: "object-cover object-center",
  },
] as const;

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
        {SLIDES.map((slide, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-1000",
              slide.objectClass,
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
      <div className="relative z-10 flex min-h-dvh flex-col justify-end gap-6 pb-14 pt-32 md:pb-16">
        {children}
        <div className="container mx-auto max-w-6xl px-4">
          <div
            className="inline-flex flex-wrap items-center gap-2.5 rounded-full bg-navy/55 px-3.5 py-2.5 backdrop-blur-sm ring-1 ring-white/15"
            aria-label="انتخاب تصویر پس‌زمینه"
          >
            {SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`تصویر ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
                className={cn(
                  "shrink-0 rounded-full transition-all duration-300",
                  index === current
                    ? "h-3 w-7 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.55)]"
                    : "h-3 w-3 bg-white/55 ring-1 ring-white/70 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
