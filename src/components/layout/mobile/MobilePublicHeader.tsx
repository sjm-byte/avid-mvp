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

/** Floating glass header — mirrors Yas mobile chrome. */
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
            "pointer-events-auto mx-auto flex h-14 w-full items-center gap-2 rounded-2xl px-2.5",
            "border border-white/15 text-white shadow-[0_14px_34px_rgba(20,15,29,0.28),inset_0_1px_0_rgba(255,255,255,0.14)]",
            "backdrop-blur-[18px] transition-all duration-250",
            scrolled
              ? "bg-[linear-gradient(110deg,rgba(18,13,25,0.94),rgba(43,31,57,0.91))]"
              : "bg-[linear-gradient(110deg,rgba(24,18,33,0.88),rgba(40,29,52,0.8))]",
          )}
        >
          <AvidLogo
            href="/"
            imageClassName="h-7 w-auto shrink-0 brightness-0 invert"
          />
          <nav
            className="flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      ? "bg-white/13 text-white"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span
                      className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-yas-purple-soft"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </header>
      </div>
      {/* Spacer so content clears floating header */}
      <div className="h-16" aria-hidden />
    </>
  );
}
