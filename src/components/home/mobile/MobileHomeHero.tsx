"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

/** Fixed stage height — prevents layout jump when slides change. */
const STAGE_HEIGHT_CLASS = "h-[260px]";

const SWIPE_THRESHOLD_PX = 40;
const AUTOPLAY_MS = 5500;

export function MobileHomeHero() {
  const [current, setCurrent] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pauseUntil = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setDragPx(0);
    pauseUntil.current = Date.now() + AUTOPLAY_MS;
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntil.current || dragging) return;
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [dragging]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
    setDragging(true);
    pauseUntil.current = Date.now() + AUTOPLAY_MS;
  }

  function onTouchMove(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start == null) return;
    const x = e.changedTouches[0]?.clientX;
    if (x == null) return;
    setDragPx(x - start);
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    setDragging(false);
    if (start == null) {
      setDragPx(0);
      return;
    }
    const end = e.changedTouches[0]?.clientX;
    if (end == null) {
      setDragPx(0);
      return;
    }
    const delta = end - start;
    setDragPx(0);
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    // Finger left → next; finger right → previous
    if (delta < 0) goTo(current + 1);
    else goTo(current - 1);
  }

  const trackWidth = trackRef.current?.offsetWidth ?? 1;
  const dragPercent = dragging ? (dragPx / trackWidth) * 100 : 0;
  const translatePercent = -current * 100 + dragPercent;

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
      <div className="relative mx-auto w-full max-w-[28rem] px-3">
        <div
          ref={trackRef}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-yas-night shadow-[0_18px_40px_-20px_rgba(20,15,29,0.45)] touch-pan-y",
            STAGE_HEIGHT_CLASS,
          )}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="گالری تصاویر آوید"
        >
          <div
            className={cn(
              "flex h-full w-full",
              !dragging && "transition-transform duration-500 ease-out",
            )}
            style={{ transform: `translateX(${translatePercent}%)` }}
          >
            {SLIDES.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                draggable={false}
                className="h-full w-full shrink-0 select-none object-cover object-center"
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 start-0 w-10 bg-gradient-to-l from-transparent to-black/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 end-0 w-10 bg-gradient-to-r from-transparent to-black/25"
            aria-hidden
          />

          <button
            type="button"
            aria-label="اسلاید قبلی"
            onClick={() => goTo(current - 1)}
            className="absolute start-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md active:scale-95"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="اسلاید بعدی"
            onClick={() => goTo(current + 1)}
            className="absolute end-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md active:scale-95"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-3 pb-3 pt-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-white/80">
                بکشید یا فلش بزنید
              </p>
              <div className="flex items-center gap-1.5" aria-label="انتخاب تصویر">
                {SLIDES.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`تصویر ${index + 1}`}
                    aria-current={index === current ? "true" : undefined}
                    onClick={() => goTo(index)}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      index === current
                        ? "h-2 w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]"
                        : "h-2 w-2 bg-white/45",
                    )}
                  />
                ))}
              </div>
              <p className="min-w-[2.5rem] text-end text-[11px] font-semibold tabular-nums text-white/90" dir="ltr">
                {current + 1}/{SLIDES.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-3 px-4">
        <div className="rounded-[1.35rem] border border-white/70 bg-white/92 p-4 shadow-[0_28px_70px_rgba(72,56,85,0.12),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-md">
          <h1 className="text-[1.35rem] font-extrabold leading-snug text-yas-ink">
            با <span className="text-yas-purple">آوید</span>، به سرمایه‌گذاری
            واقعی فکر کن!
          </h1>
          <p className="mt-1.5 text-sm text-yas-ink/55">
            مشارکت شفاف در پروژه‌های واقعی
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-yas-ink/70">
            پروژه‌ها را بررسی کنید، ریسک‌ها را ببینید و بازده پیش‌بینی‌شده را در
            کنار واقعیت اجرا ارزیابی کرده و به ما بپیوندید.
          </p>
        </div>
      </div>
    </section>
  );
}
