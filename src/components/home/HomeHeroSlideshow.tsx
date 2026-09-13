"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero slideshow display order (index 0 = first shown on load).
 * Playground / indoor play area (slide-6) must lead.
 * Do not use Array.from or sequential slide-(n+1) generation — order is this list only.
 */
const SLIDES = [
  "/assets/hero/slide-6.png", // first shown
  "/assets/hero/slide-1.png",
  "/assets/hero/slide-3.png",
  "/assets/hero/slide-7.png",
  "/assets/hero/slide-10.png",
  "/assets/hero/slide-11.png",
  "/assets/hero/slide-12.png",
] as const;

/** Light scrim on the text side only; keeps full slide artwork visible (desktop). */
const HERO_OVERLAY =
  "linear-gradient(to left, rgba(13, 27, 62, 0.52) 0%, rgba(13, 27, 62, 0.22) 34%, transparent 62%)";

const SWIPE_THRESHOLD_PX = 48;
const AUTOPLAY_MS = 5000;

export function HomeHeroSlideshow({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const pauseAutoplayUntil = useRef(0);

  function goTo(index: number) {
    const next = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length;
    setCurrent(next);
    pauseAutoplayUntil.current = Date.now() + AUTOPLAY_MS;
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < pauseAutoplayUntil.current) return;
      setCurrent((index) => (index + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX == null) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX == null) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    // Finger moves left → next; finger moves right → previous
    if (deltaX < 0) goTo(current + 1);
    else goTo(current - 1);
  }

  const dots = (
    <div
      className="inline-flex flex-wrap items-center gap-2 rounded-full bg-navy/55 px-3 py-2 backdrop-blur-sm ring-1 ring-white/15 sm:gap-2.5 sm:px-3.5 sm:py-2.5"
      aria-label="انتخاب تصویر"
    >
      {SLIDES.map((src, index) => (
        <button
          key={src}
          type="button"
          aria-label={`تصویر ${index + 1}`}
          aria-current={index === current ? "true" : undefined}
          onClick={() => goTo(index)}
          className={cn(
            "shrink-0 rounded-full transition-all duration-300",
            index === current
              ? "h-2.5 w-6 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.55)] sm:h-3 sm:w-7"
              : "h-2.5 w-2.5 bg-white/55 ring-1 ring-white/70 hover:bg-white/80 sm:h-3 sm:w-3",
          )}
        />
      ))}
    </div>
  );

  const mobileDots = (
    <div
      className="mt-4 flex justify-center gap-2"
      aria-label="انتخاب تصویر"
    >
      {SLIDES.map((src, index) => (
        <button
          key={src}
          type="button"
          aria-label={`تصویر ${index + 1}`}
          aria-current={index === current ? "true" : undefined}
          onClick={() => goTo(index)}
          className={cn(
            "shrink-0 rounded-full transition-all duration-300",
            index === current
              ? "h-2 w-5 bg-navy"
              : "h-2 w-2 bg-navy/30 hover:bg-navy/50",
          )}
        />
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-background text-foreground md:min-h-dvh md:bg-[#0d1b3e] md:text-white">
      {/* Desktop: full-bleed background slideshow */}
      <div className="absolute inset-0 hidden md:block" aria-hidden>
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
        className="absolute inset-0 hidden md:block"
        style={{ background: HERO_OVERLAY }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col md:min-h-dvh md:justify-end md:gap-6 md:pb-14 md:pt-32">
        {/* Copy: stacked above media on mobile; overlaid on desktop */}
        <div className="order-1 px-4 pb-5 pt-24 md:order-none md:px-0 md:pb-0 md:pt-0">
          {children}
        </div>

        {/* Mobile: contained swipeable carousel (not full-viewport) */}
        <div className="order-2 px-4 pb-10 md:hidden">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy shadow-[0_16px_40px_-24px_rgba(13,27,62,0.55)] ring-1 ring-navy/10 touch-pan-y"
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
                  "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 select-none",
                  index === current ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/35 to-transparent"
              aria-hidden
            />
          </div>
          {mobileDots}
        </div>

        {/* Desktop dots */}
        <div className="container mx-auto hidden max-w-6xl px-4 md:block">
          {dots}
        </div>
      </div>
    </section>
  );
}
