"use client";

import { useEffect, useRef, useState } from "react";
import { useDeferredSlides } from "@/components/home/useDeferredSlides";
import { cn } from "@/lib/utils";

const SLIDES = [
  { name: "slide-12", position: "object-center" },
  { name: "slide-11", position: "object-center" },
  { name: "slide-6", position: "object-left-top" },
  { name: "slide-3", position: "object-left-top" },
  { name: "slide-7", position: "object-left-top" },
  { name: "slide-10", position: "object-center" },
] as const;

/** Full-bleed photographic hero with a quiet cross-fade between scenes. */
export function EnHero() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const loadRest = useDeferredSlides(ref);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setCurrent((i) => (i + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#0d1b3e] text-white md:min-h-[100svh]"
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        {SLIDES.map((s, i) => (
          <picture key={s.name}>
            {(i === 0 || loadRest) && (
              <source media="(max-width: 767px)" srcSet={`/assets/hero/${s.name}-m.webp`} />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={i === 0 || loadRest ? `/assets/hero/${s.name}.webp` : undefined}
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]",
                s.position,
                i === current ? "opacity-100" : "opacity-0",
              )}
            />
          </picture>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1633] via-[#0b1633]/55 to-[#0b1633]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1633]/60 via-transparent to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6 md:pb-20">
        <h1 className="max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.01em] text-white sm:text-6xl md:text-[4.5rem]">
          Think real investment, with&nbsp;Avid.
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/85 md:text-lg">
          Avid is a step towards a participatory economy. Start by reviewing our transparency
          record and the ventures we have backed; when you are ready, arrange the next step
          directly with the Avid office.
        </p>

        <div className="mt-10 flex items-center gap-2" role="group" aria-label="Choose background image">
          {SLIDES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-label={`Image ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-[3px] rounded-full transition-all duration-500",
                i === current ? "w-10 bg-gold" : "w-5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
