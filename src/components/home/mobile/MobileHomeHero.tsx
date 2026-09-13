"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  "/assets/hero/slide-6.png",
  "/assets/hero/slide-1.png",
  "/assets/hero/slide-3.png",
  "/assets/hero/slide-7.png",
  "/assets/hero/slide-10.png",
  "/assets/hero/slide-11.png",
  "/assets/hero/slide-12.png",
] as const;

const SWIPE_THRESHOLD_PX = 48;
const AUTOPLAY_MS = 5500;

/**
 * Fixed-aspect carousel (no layout jump) + frosted CTA overlapping the image.
 */
export function MobileHomeHero() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const pauseUntil = useRef(0);

  function goTo(index: number) {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    pauseUntil.current = Date.now() + AUTOPLAY_MS;
  }

  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#18141f] pb-8">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#18141f] touch-pan-y"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          pauseUntil.current = Date.now() + AUTOPLAY_MS;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start == null) return;
          const end = e.changedTouches[0]?.clientX;
          if (end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
          if (delta < 0) goTo(current + 1);
          else goTo(current - 1);
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="گالری تصاویر آوید"
      >
        {SLIDES.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-500",
              index === current ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <div className="absolute inset-x-0 bottom-[4.75rem] z-10 flex justify-center gap-1.5">
          {SLIDES.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`تصویر ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === current ? "w-5 bg-white" : "w-1.5 bg-white/45",
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 -mt-14 px-4">
        <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <h1 className="text-[1.35rem] font-extrabold leading-snug text-white">
            با <span className="text-[#D4C0EA]">آوید</span>، به سرمایه‌گذاری
            واقعی فکر کن!
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/80">
            <span className="font-medium text-white/90">
              مشارکت شفاف در پروژه‌های واقعی.{" "}
            </span>
            پروژه‌ها را بررسی کنید، ریسک‌ها را ببینید و بازده پیش‌بینی‌شده را در
            کنار واقعیت اجرا ارزیابی کرده و به ما بپیوندید.
          </p>
        </div>
      </div>
    </section>
  );
}
