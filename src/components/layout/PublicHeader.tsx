"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/transparency", label: "شفافیت" },
  { href: "/about", label: "درباره آوید" },
  { href: "/faq", label: "سوالات متداول" },
];

/** Show header after leaving the top of the hero (desktop only). */
const SHOW_AFTER_SCROLL_PX = 56;

export function PublicHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");

    function updateVisibility() {
      if (mobileQuery.matches) {
        setVisible(true);
        return;
      }
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    mobileQuery.addEventListener("change", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      mobileQuery.removeEventListener("change", updateVisibility);
    };
  }, [isHome]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen]);

  const headerInteractive = visible && !mobileNavOpen;

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
        <div className="container mx-auto flex h-14 min-w-0 max-w-full items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-8">
            <AvidLogo
              href="/"
              imageClassName="h-9 w-auto drop-shadow-sm sm:h-12"
            />
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-colors hover:text-gold"
                  tabIndex={headerInteractive ? undefined : -1}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white/90 hover:bg-white/10 hover:text-gold md:hidden"
              aria-label={mobileNavOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={mobileNavOpen}
              tabIndex={headerInteractive ? undefined : -1}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden text-white/90 hover:bg-white/10 hover:text-gold min-[380px]:inline-flex sm:inline-flex"
              tabIndex={headerInteractive ? undefined : -1}
            >
              <Link href="/login">ورود</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-gold px-3 text-navy shadow-sm hover:bg-gold-light sm:px-4"
              tabIndex={headerInteractive ? undefined : -1}
            >
              <Link href="/signup">ثبت‌نام</Link>
            </Button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <nav
        className={cn(
          "fixed inset-x-0 top-14 z-40 border-b border-gold/20 bg-navy px-4 py-4 shadow-lg transition-transform duration-300 md:hidden sm:top-[72px]",
          mobileNavOpen ? "translate-y-0" : "-translate-y-full pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileNavOpen}
      >
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-gold"
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-white/10 pt-2 sm:hidden">
            <Link
              href="/login"
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-gold"
              onClick={() => setMobileNavOpen(false)}
            >
              ورود
            </Link>
          </li>
        </ul>
      </nav>

      {!isHome && <div className="h-14 sm:h-[72px]" aria-hidden />}
    </>
  );
}
