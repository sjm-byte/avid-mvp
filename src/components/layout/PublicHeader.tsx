import Link from "next/link";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/transparency", label: "شفافیت" },
  { href: "/about", label: "درباره آوید" },
  { href: "/faq", label: "سوالات متداول" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 min-w-0 max-w-full items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <AvidLogo href="/" />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">ورود</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">ثبت‌نام</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
