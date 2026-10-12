"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FilePenLine,
  FileText,
  HandHelping,
  ScrollText,
  Table2,
} from "lucide-react";
import type { PublicProject } from "@/lib/data/public-projects";
import { useDeferredSlides } from "@/components/home/useDeferredSlides";
import { EnMobilePhoneCapture } from "@/components/en/mobile/EnMobilePhoneCapture";
import { EnMobileProjectCard } from "@/components/en/mobile/EnMobileProjectCard";
import { EN_FAQ_HOME } from "@/components/en/en-faq";
import { enTransparencyHref } from "@/components/en/EnTransparencyTeaser";
import { cn } from "@/lib/utils";

const SLIDES = ["slide-12", "slide-11", "slide-6", "slide-3", "slide-7", "slide-10"] as const;

const TRANSPARENCY = [
  { id: "history" as const, title: "Track record", hook: "Settlement table, and the gap between projection and outcome", icon: Table2 },
  { id: "methodology" as const, title: "Contract principles", hook: "Credit risk, economic risk, and where your money sits", icon: ScrollText },
  { id: "contracts" as const, title: "Contract texts", hook: "Murabaha, salaf and musharakah: how each model is structured", icon: FileText },
];

const STEPS = [
  { title: "Read the transparency page", description: "Review the track record, contract principles and contract texts before taking part.", href: "/en/transparency", icon: BookOpen },
  { title: "Express your interest", description: "Leave a phone number and the Avid team will call to coordinate with you.", href: "/en/contact", icon: HandHelping },
  { title: "Sign the contract and transfer funds", description: "Once agreed, the contract is drawn up and payment instructions are issued.", href: "/en/projects", icon: FilePenLine },
];

const STATS = [
  { label: "Completed projects", value: "15+" },
  { label: "Participation recorded", value: "50+", unit: "bn Toman" },
  { label: "Avg. realised monthly return", value: "5%+" },
] as const;

const scroller =
  "flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function MobileHero() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const loadRest = useDeferredSlides(ref);
  const touchX = useRef<number | null>(null);
  const pauseUntil = useRef(0);

  const goTo = (i: number) => {
    setCurrent(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    pauseUntil.current = Date.now() + 5500;
  };

  useEffect(() => {
    const t = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="bg-[#18141f] pb-4">
      <div
        className="relative aspect-[16/9] w-full touch-pan-y overflow-hidden bg-[#18141f]"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
          pauseUntil.current = Date.now() + 5500;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          const end = e.changedTouches[0]?.clientX;
          if (start == null || end == null || Math.abs(end - start) < 48) return;
          goTo(end < start ? current + 1 : current - 1);
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Avid image gallery"
      >
        {SLIDES.map((name, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={name}
            src={i === 0 || loadRest ? `/assets/hero/${name}-m.webp` : undefined}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full select-none object-cover object-left-top transition-opacity duration-500",
              i === current ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {SLIDES.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-label={`Image ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => goTo(i)}
              className={cn("h-1.5 rounded-full transition-all", i === current ? "w-5 bg-white" : "w-1.5 bg-white/45")}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 -mt-8 px-4">
        <div className="rounded-2xl border border-white/20 bg-white/[0.07] p-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-lg">
          <h1 className="font-display text-[1.75rem] font-bold leading-tight text-white">
            Think real investment, with <span className="text-[#D4C0EA]">Avid</span>.
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">
            <span className="font-semibold text-white/90">Transparent participation in real projects. </span>
            Review the projects, see the risks, weigh projected returns against what actually
            happened — and join us.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Alternating bands, same structure as the Persian mobile home page. */
export function EnMobileHome({ projects }: { projects: PublicProject[] }) {
  return (
    <div className="bg-[#18141f] text-white">
      <MobileHero />

      <section className="px-4 py-5">
        <h2 className="text-center font-display text-2xl font-bold leading-snug text-white">
          Avid’s performance at a glance
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-[#242030]">
          <div className="grid grid-cols-3 divide-x divide-white/12">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col px-2 py-3.5 text-center">
                <p className="min-h-[2.6rem] text-[11px] leading-snug text-white/55">{s.label}</p>
                <p className="mt-auto pt-1.5 font-display text-2xl font-bold leading-none text-[#C9B4DE] [font-variant-numeric:lining-nums]">
                  {s.value}
                  {"unit" in s ? (
                    <span className="ms-1 font-en text-[11px] font-semibold">{s.unit}</span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-6 text-[#292334]"
        style={{
          backgroundColor: "#F5F3F8",
          backgroundImage: "radial-gradient(75% 55% at 15% 0%, rgba(167,139,250,0.18), transparent 62%)",
        }}
      >
        <div className="px-4 text-center">
          <p className="text-xs font-medium text-[#6B5F7E]">Read before you take part</p>
          <Link
            href="/en/transparency"
            className="mt-1 inline-block font-display text-[1.55rem] font-bold leading-snug text-[#3A2F4F] underline decoration-[#D4AF37]/55 underline-offset-4"
          >
            Avid’s transparency page
          </Link>
        </div>
        <ul className={cn(scroller, "mt-5 px-4 pb-1")} aria-label="Transparency sections">
          {TRANSPARENCY.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="w-[78%] shrink-0 snap-center">
                <Link
                  href={enTransparencyHref(item.id)}
                  className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-[#1F1A2A]/10 bg-white/90 p-5 shadow-[0_10px_24px_-18px_rgba(40,30,60,0.28)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl font-bold leading-none text-[#B8962E] [font-variant-numeric:lining-nums]">
                      {i + 1}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7B60A1]/15 text-[#5C4A78]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-[#292334]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C5368]">{item.hook}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-white">Examples of past projects</h2>
          <Link href="/en/projects" className="text-sm font-medium text-[#C9B4DE]">
            Archive
          </Link>
        </div>
        <ul className={cn(scroller, "mt-5 pb-1")}>
          {projects.map((p) => (
            <li key={p.id} className="w-[82%] shrink-0 snap-center">
              <EnMobileProjectCard project={p} />
            </li>
          ))}
        </ul>
      </section>

      <section
        className="relative overflow-hidden px-4 py-8 text-[#292334]"
        style={{
          backgroundColor: "#F5F3F8",
          backgroundImage: `
            radial-gradient(95% 55% at 50% 100%, rgba(167, 139, 250, 0.28), transparent 68%),
            repeating-linear-gradient(32deg, transparent 0, transparent 14px, rgba(123, 96, 161, 0.055) 14px, rgba(123, 96, 161, 0.055) 15px),
            linear-gradient(180deg, #F7F5FA 0%, #F2EFF7 100%)
          `,
        }}
      >
        <h2 className="text-center font-display text-[1.8rem] font-bold leading-snug">
          How to take part with{" "}
          <span className="bg-gradient-to-r from-[#7B60A1] to-[#B9A0D4] bg-clip-text text-transparent">Avid</span>
        </h2>
        <ul className={cn(scroller, "mt-6 pb-2")}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="w-[78%] shrink-0 snap-center">
                <Link
                  href={s.href}
                  className="relative flex h-full min-h-[10.5rem] flex-col overflow-hidden rounded-[1.35rem] bg-white p-5 shadow-[0_14px_36px_-18px_rgba(72,56,110,0.28)]"
                >
                  <span
                    className="pointer-events-none absolute start-5 top-3 font-display text-[3.6rem] font-bold leading-none text-[#292334]/[0.08] [font-variant-numeric:lining-nums]"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <div className="relative z-[1] flex justify-end">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[#7B60A1] text-white shadow-[0_8px_18px_-10px_rgba(123,96,161,0.7)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="relative z-[1] mt-10 text-base font-bold leading-snug text-[#292334]">{s.title}</h3>
                  <p className="relative z-[1] mt-2 text-[13px] leading-relaxed text-[#292334]/55">{s.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <EnMobilePhoneCapture />
        </div>
      </section>

      <section
        className="px-4 py-10 pb-14"
        style={{ backgroundImage: "linear-gradient(180deg, #2a2438 0%, #221e30 55%, #1c1826 100%)" }}
      >
        <h2 className="text-center font-display text-2xl font-bold text-white">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {EN_FAQ_HOME.map((item, i) => (
            <details key={item.q} className="rounded-2xl border border-white/12 bg-[#2e2840]" open={i === 0}>
              <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="me-2 text-[#C9B4DE]">{i + 1}</span>
                {item.q}
              </summary>
              <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/70">{item.a}</p>
            </details>
          ))}
        </div>
        <Link href="/en/faq" className="mt-5 block text-center text-sm font-medium text-[#C9B4DE]">
          All questions
        </Link>
      </section>
    </div>
  );
}
