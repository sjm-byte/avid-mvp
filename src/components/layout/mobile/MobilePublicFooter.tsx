"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import {
  companyAddressFull,
  companyEmail,
  companyLegalName,
  companyPhoneDisplay,
  companyPhoneTel,
} from "@/lib/company-contact";

const quickLinks = [
  { href: "/transparency", label: "صفحه شفافیت" },
  { href: "/projects", label: "آرشیو طرح‌ها" },
  { href: "/about", label: "درباره آوید" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/contact", label: "تماس با ما" },
];

export function MobilePublicFooter() {
  const pathname = usePathname();
  if (pathname === "/transparency") return null;

  return (
    <footer
      className="border-t border-white/15 text-white"
      style={{
        backgroundImage:
          "radial-gradient(80% 60% at 0% 0%, rgba(148,108,185,0.32), transparent 55%), linear-gradient(165deg, #241833 0%, #18141f 70%)",
      }}
    >
      <div className="px-4 py-10">
        <AvidLogo href="/" imageClassName="h-11 w-auto" />
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          بستری برای مشارکت در اقتصاد
        </p>

        <nav className="mt-8" aria-label="دسترسی سریع">
          <p className="text-xs font-semibold tracking-wide text-yas-purple-soft">
            دسترسی سریع
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-2 text-sm text-white/65">
          <p className="font-semibold text-yas-purple-soft">دفتر شرکت</p>
          <a
            href={`tel:${companyPhoneTel}`}
            dir="ltr"
            className="block tracking-wide text-white hover:text-yas-purple-soft"
          >
            {companyPhoneDisplay}
          </a>
          <a
            href={`mailto:${companyEmail}`}
            dir="ltr"
            className="block text-white hover:text-yas-purple-soft"
          >
            {companyEmail}
          </a>
          <p className="leading-relaxed">{companyAddressFull}</p>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-[11px] text-white/45">
          © {new Date().getFullYear()} {companyLegalName}
        </p>
      </div>
    </footer>
  );
}
