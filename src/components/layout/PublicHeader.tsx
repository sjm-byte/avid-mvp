"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/transparency", label: "شفافیت" },
  { href: "/about", label: "درباره آوید" },
  { href: "/faq", label: "سوالات متداول" },
];

/** Show header after leaving the top of the hero. */
const SHOW_AFTER_SCROLL_PX = 56;

export function PublicHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }

    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 max-w-full transition-all duration-300 ease-out",
          "border-b border-gold/25",
          "bg-[rgba(13,27,62,0.42)] backdrop-blur-md backdrop-saturate-150",
          "supports-[backdrop-filter]:bg-[rgba(13,27,62,0.32)]",
          "shadow-[0_1px_0_rgba(201,162,39,0.12)]",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0",
        )}
        aria-hidden={!visible}
      >
        <div className="container mx-auto flex h-[72px] min-w-0 max-w-full items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-8">
            <AvidLogo href="/" imageClassName="h-12 w-auto drop-shadow-sm" />
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-colors hover:text-gold"
                  tabIndex={visible ? undefined : -1}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-white/90 hover:bg-white/10 hover:text-gold"
              tabIndex={visible ? undefined : -1}
            >
              <Link href="/login">ورود</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-gold text-navy shadow-sm hover:bg-gold-light"
              tabIndex={visible ? undefined : -1}
            >
              <Link href="/signup">ثبت‌نام</Link>
            </Button>
          </div>
        </div>
      </header>
      {!isHome && <div className="h-[72px]" aria-hidden />}
    </>
  );
}
