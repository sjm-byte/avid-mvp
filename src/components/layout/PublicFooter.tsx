"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { Separator } from "@/components/ui/separator";
import {
  companyAddressFull,
  companyEmail,
  companyPhoneDisplay,
  companyPhoneTel,
} from "@/lib/company-contact";

export function PublicFooter() {
  const pathname = usePathname();
  if (pathname === "/transparency") {
    return null;
  }

  return (
    <footer className="border-t border-gold/25 bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <AvidLogo href="/" imageClassName="h-12" />
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              پلتفرم مدیریت مشارکت پروژه‌ای. پروژه‌ها را جداگانه بررسی کنید،
              ریسک‌ها را ببینید و وضعیت سرمایه خود را مرحله‌به‌مرحله دنبال
              کنید.
            </p>
          </div>

          <div>
            <p className="font-medium text-gold">دسترسی سریع</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/projects" className="hover:text-gold">
                  پروژه‌ها
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-gold">
                  صفحه شفافیت آوید
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <p className="font-medium text-gold">دفتر شرکت</p>
            <p>
              <span className="text-white/90">شماره تماس: </span>
              <a
                href={`tel:${companyPhoneTel}`}
                dir="ltr"
                className="tracking-wide text-white hover:text-gold"
              >
                {companyPhoneDisplay}
              </a>
            </p>
            <p>
              <span className="text-white/90">آدرس دفتر: </span>
              <span>{companyAddressFull}</span>
            </p>
            <p>
              <span className="text-white/90">ایمیل: </span>
              <a
                href={`mailto:${companyEmail}`}
                dir="ltr"
                className="text-white hover:text-gold"
              >
                {companyEmail}
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} آوید — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
