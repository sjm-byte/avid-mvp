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

const STAGE_HEIGHT_CLASS = "h-[260px]";
const SWIPE_THRESHOLD_PX = 40;
const AUTOPLAY_MS = 5500;

export function MobileHomeHero() {
  const [current, setCurrent] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const pauseUntil = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setDragPx(0);
    pauseUntil.current = Date.now() + AUTOPLAY_MS;
  }

  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      setTrackWidth(el.offsetWidth);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    if (delta < 0) goTo(current + 1);
    else goTo(current - 1);
  }

  const offsetX = trackWidth > 0 ? -current * trackWidth + dragPx : 0;
  const progress = ((current + 1) / SLIDES.length) * 100;

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
            "relative overflow-hidden rounded-2xl bg-[#1a1228] shadow-[0_18px_40px_-20px_rgba(20,15,29,0.45)] touch-pan-y",
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
              "flex h-full will-change-transform",
              !dragging &&
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            )}
            style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
          >
            {SLIDES.map((src) => (
              <div
                key={src}
                className="relative h-full shrink-0"
                style={{ width: trackWidth > 0 ? trackWidth : "100%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full select-none object-cover object-center"
                />
              </div>
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-8 start-0 w-8 bg-gradient-to-l from-transparent to-black/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-8 end-0 w-8 bg-gradient-to-r from-transparent to-black/20"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 pt-10">
            <div className="mb-2.5 h-[3px] overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-l from-gold-light via-white to-yas-purple-soft transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md active:scale-95"
                aria-label="اسلاید قبلی"
              >
                قبلی
              </button>
              <p
                className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md"
                dir="ltr"
              >
                {current + 1} / {SLIDES.length}
              </p>
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md active:scale-95"
                aria-label="اسلاید بعدی"
              >
                بعدی
              </button>
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
          <p className="mt-2 text-[13px] leading-relaxed text-yas-ink/70">
            <span className="font-medium text-yas-ink/80">
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
