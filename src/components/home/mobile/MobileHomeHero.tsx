"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MobilePhoneCapture } from "@/components/home/mobile/MobilePhoneCapture";

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
const AUTOPLAY_MS = 5000;

export function MobileHomeHero() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const pauseUntil = useRef(0);

  function goTo(index: number) {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    pauseUntil.current = Date.now() + AUTOPLAY_MS;
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-yas-mist">
      <div
        className="relative w-full touch-pan-y bg-yas-night"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
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
            className={cn(
              "h-auto w-full max-w-none select-none",
              index === current ? "block" : "hidden",
            )}
          />
        ))}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
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

      <div className="relative z-10 -mt-8 px-4 pb-8">
        <MobilePhoneCapture title="با آوید، به سرمایه‌گذاری واقعی فکر کن!" />
        <p className="mt-3 px-1 text-sm leading-relaxed text-yas-ink/70">
          آوید گامی است برای حرکت به سمت اقتصاد مشارکتی. پروژه‌ها را بررسی کنید،
          ریسک‌ها را ببینید و بازده پیش‌بینی‌شده را در کنار واقعیت اجرا ارزیابی
          کرده و به ما بپیوندید.
        </p>
      </div>
    </section>
  );
}
