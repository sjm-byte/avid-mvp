"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/en", label: "Home" },
  { href: "/en/transparency", label: "Transparency" },
  { href: "/en/projects", label: "Archive" },
  { href: "/en/about", label: "About" },
  { href: "/en/faq", label: "FAQ" },
  { href: "/en/contact", label: "Contact" },
];

/** Floating glass header — mirrors the Persian mobile header. */
export function EnMobileHeader() {
  const pathname = usePathname() || "/en";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
            "border border-white/20 text-white",
            "shadow-[0_14px_34px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]",
            "backdrop-blur-xl backdrop-saturate-150 transition-all duration-300",
            scrolled ? "bg-[rgba(24,18,40,0.78)]" : "bg-[rgba(32,22,52,0.68)]",
          )}
        >
          <span
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
            aria-hidden
          />
          <AvidLogo href="/en" imageClassName="relative z-[1] h-8 w-auto shrink-0" />
          <nav
            className="relative z-[1] flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            {NAV.map((link) => {
              const active =
                link.href === "/en" ? pathname === "/en" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative shrink-0 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition-colors",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span
                      className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-[#C9B4DE]"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitch
            current="en"
            short
            className="relative z-[1] h-8 shrink-0 gap-1 px-2 text-[12px]"
          />
        </header>
      </div>
      <div className="h-16" aria-hidden />
    </>
  );
}
