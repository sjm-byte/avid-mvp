"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { cn } from "@/lib/utils";

export const EN_NAV = [
  { href: "/en", label: "Home" },
  { href: "/en/transparency", label: "Transparency" },
  { href: "/en/projects", label: "Project archive" },
  { href: "/en/about", label: "About Avid" },
  { href: "/en/faq", label: "FAQ" },
];

/**
 * Over the home-page hero the bar starts transparent and turns solid navy
 * once the visitor scrolls; elsewhere it is always solid.
 */
export function EnHeader() {
  const pathname = usePathname() || "/en";
  const isHome = pathname === "/en";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = !isHome || scrolled || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          solid
            ? "border-b border-gold/25 bg-navy shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "border-b border-transparent bg-gradient-to-b from-[#0d1b3e]/70 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:h-[72px] sm:px-6">
          <AvidLogo href="/en" imageClassName="h-9 w-auto sm:h-11" />

          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Main">
            {EN_NAV.map((link) => {
              const active =
                link.href === "/en" ? pathname === "/en" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[0.95rem] text-white/85 transition-colors hover:text-white",
                    active &&
                      "text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <LanguageSwitch current="en" />
            <Link
              href="/en/contact"
              className="hidden h-9 items-center rounded-full bg-gold px-4 text-sm font-semibold text-navy transition-colors hover:bg-gold-light sm:inline-flex"
            >
              Contact us
            </Link>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="en-mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <nav
          id="en-mobile-nav"
          aria-label="Main"
          className={cn(
            "border-t border-white/10 bg-navy px-4 pb-5 pt-2 lg:hidden",
            open ? "block" : "hidden",
          )}
        >
          <ul>
            {[...EN_NAV, { href: "/en/contact", label: "Contact us" }].map((link) => (
              <li key={link.href} className="border-b border-white/10 last:border-b-0">
                <Link
                  href={link.href}
                  className="block py-3 text-base text-white/90 hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {!isHome && <div className="h-16 sm:h-[72px]" aria-hidden />}
    </>
  );
}
