import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/transparency", label: "شفافیت" },
  { href: "/about", label: "درباره آوید" },
  { href: "/faq", label: "سوالات متداول" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-full overflow-hidden border-b border-gold/30 bg-navy-light/95 backdrop-blur supports-[backdrop-filter]:bg-navy-light/90">
      <div className="container mx-auto flex h-[72px] min-w-0 max-w-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/brand/logoheader.png"
              alt="آوید"
              width={160}
              height={40}
              className="h-12 w-auto shrink-0 object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-gold"
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
            className="text-white hover:bg-white/10 hover:text-gold"
          >
            <Link href="/login">ورود</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-gold text-navy hover:bg-gold-light"
          >
            <Link href="/signup">ثبت‌نام</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
