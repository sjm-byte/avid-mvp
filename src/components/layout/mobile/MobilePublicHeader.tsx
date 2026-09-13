"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "شروع" },
  { href: "/transparency", label: "شفافیت" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/about", label: "درباره" },
  { href: "/faq", label: "سوالات" },
  { href: "/contact", label: "تماس" },
];

/** Floating glass header — brighter, glossier Yas-style chrome. */
export function MobilePublicHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] px-2 pt-2">
        <header
          className={cn(
            "pointer-events-auto relative mx-auto flex h-14 w-full items-center gap-2 overflow-hidden rounded-2xl px-2.5",
            "border border-white/35 text-white",
            "shadow-[0_18px_40px_rgba(20,15,29,0.35),inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.08)]",
            "backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-300",
            scrolled
              ? "bg-[linear-gradient(115deg,rgba(36,24,58,0.82)_0%,rgba(88,58,130,0.78)_45%,rgba(42,30,68,0.85)_100%)]"
              : "bg-[linear-gradient(115deg,rgba(48,32,78,0.72)_0%,rgba(123,96,161,0.68)_42%,rgba(52,38,88,0.75)_100%)]",
          )}
        >
          <span
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-l from-transparent via-white/70 to-transparent"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -start-8 top-1/2 size-24 -translate-y-1/2 rounded-full bg-gold/25 blur-2xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -end-6 top-0 size-20 rounded-full bg-white/20 blur-2xl"
            aria-hidden
          />

          <AvidLogo href="/" imageClassName="relative z-[1] h-8 w-auto shrink-0" />
          <nav
            className="relative z-[1] flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="ناوبری موبایل"
          >
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative shrink-0 rounded-lg px-2.5 py-2 text-[11px] font-bold transition-colors",
                    active
                      ? "bg-white/22 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span
                      className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-gradient-to-l from-gold-light to-gold"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </header>
      </div>
      <div className="h-16" aria-hidden />
    </>
  );
}
