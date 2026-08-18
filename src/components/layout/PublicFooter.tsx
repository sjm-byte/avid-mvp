"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import { Separator } from "@/components/ui/separator";

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
                  شفافیت و عملکرد
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="hover:text-gold">
                  هشدار ریسک
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <RiskDisclosureBox variant="compact" />
          </div>
        </div>
        <Separator className="my-8 bg-white/10" />
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} آوید — تمامی حقوق محفوظ است. این
          پلتفرم صندوق سرمایه‌گذاری رسمی نیست.
        </p>
      </div>
    </footer>
  );
}
