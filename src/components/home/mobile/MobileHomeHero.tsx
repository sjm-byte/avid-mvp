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

/** Fixed stage height — prevents layout jump when slides change (Yas figure ~288px). */
const STAGE_HEIGHT_CLASS = "h-[260px]";

const SWIPE_THRESHOLD_PX = 48;
const AUTOPLAY_MS = 5500;

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

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) goTo(current + 1);
    else goTo(current - 1);
  }

  return (
    <section
      className="relative overflow-hidden pb-6 pt-2"
      style={{
        backgroundImage: `
          radial-gradient(105% 58% at 100% 0px, rgba(225, 244, 221, 0.94) 0px, transparent 68%),
          radial-gradient(112% 66% at 0px 100%, rgba(232, 220, 241, 0.96) 0px, transparent 72%),
          linear-gradient(180deg, #f7f4fb 0%, #eef6ef 48%, #f3eaf8 100%)
        `,
      }}
    >
      {/* Fixed-height visual stage — full width, no height jitter */}
      <div
        className={cn(
          "relative mx-auto w-full max-w-[28rem] touch-pan-y overflow-hidden",
          STAGE_HEIGHT_CLASS,
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
              "absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-700",
              index === current ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {SLIDES.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`تصویر ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === current
                  ? "w-5 bg-yas-ink/80"
                  : "w-1.5 bg-yas-ink/30",
              )}
            />
          ))}
        </div>
      </div>

      {/* Floating CTA card — Yas pattern */}
      <div className="relative z-10 -mt-4 px-4">
        <MobilePhoneCapture
          title="با آوید، به سرمایه‌گذاری واقعی فکر کن!"
          highlight="آوید"
          subtitle="مشارکت شفاف در پروژه‌های واقعی"
        />
        <p className="mt-3 px-1 text-center text-[13px] leading-relaxed text-yas-ink/60">
          پروژه‌ها را بررسی کنید، ریسک‌ها را ببینید و بازده پیش‌بینی‌شده را در
          کنار واقعیت اجرا ارزیابی کرده و به ما بپیوندید.
        </p>
      </div>
    </section>
  );
}
