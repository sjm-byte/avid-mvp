"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

export function MobilePublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-yas-night text-white">
        <div className="flex h-14 items-center gap-2 px-3">
          <AvidLogo href="/" imageClassName="h-8 w-auto brightness-0 invert" />
          <nav
            className="ms-auto flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="ناوبری موبایل"
          >
            {navLinks.slice(0, 4).map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                    active
                      ? "bg-yas-purple text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/55"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <nav
        className={cn(
          "fixed inset-x-0 top-14 z-50 border-b border-white/10 bg-yas-night px-4 py-4 shadow-xl transition-all duration-300",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={!open}
      >
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
