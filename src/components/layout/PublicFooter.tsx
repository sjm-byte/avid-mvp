import Link from "next/link";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import { Separator } from "@/components/ui/separator";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <AvidLogo href="/" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              پلتفرم مدیریت مشارکت پروژه‌ای. پروژه‌ها را جداگانه بررسی کنید،
              ریسک‌ها را ببینید و وضعیت سرمایه خود را مرحله‌به‌مرحله دنبال
              کنید.
            </p>
          </div>
          <div>
            <p className="font-medium">دسترسی سریع</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/projects" className="hover:text-foreground">
                  پروژه‌ها
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-foreground">
                  شفافیت و عملکرد
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="hover:text-foreground">
                  هشدار ریسک
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <RiskDisclosureBox variant="compact" />
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} آوید — تمامی حقوق محفوظ است. این
          پلتفرم صندوق سرمایه‌گذاری رسمی نیست.
        </p>
      </div>
    </footer>
  );
}
