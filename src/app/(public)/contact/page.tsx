import { Mail, MapPin, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MobilePublicPageShell, mobileDarkCardClassName } from "@/components/layout/mobile/MobilePublicPageShell";
import { cn } from "@/lib/utils";
import {
  companyAddressLines,
  companyEmail,
  companyPhoneDisplay,
  companyPhoneTel,
} from "@/lib/company-contact";

function ContactBody() {
  return (
    <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2 lg:gap-6">
      <Card className={cn(mobileDarkCardClassName)}>
        <CardHeader>
          <CardTitle className="text-lg max-md:text-white">دفتر شرکت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold max-md:border-white/15 max-md:bg-[#7B60A1]/25 max-md:text-[#C9B4DE]">
              <Phone className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground max-md:text-white/90">
                شماره تماس
              </p>
              <a
                href={`tel:${companyPhoneTel}`}
                dir="ltr"
                className="inline-block text-base font-semibold tracking-wide text-navy hover:text-navy-light max-md:text-[#E8DCF5]"
              >
                {companyPhoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold max-md:border-white/15 max-md:bg-[#7B60A1]/25 max-md:text-[#C9B4DE]">
              <MapPin className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground max-md:text-white/90">
                آدرس دفتر
              </p>
              <address className="not-italic text-sm leading-relaxed text-muted-foreground max-md:text-white/60">
                {companyAddressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold max-md:border-white/15 max-md:bg-[#7B60A1]/25 max-md:text-[#C9B4DE]">
              <Mail className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground max-md:text-white/90">
                ایمیل
              </p>
              <a
                href={`mailto:${companyEmail}`}
                dir="ltr"
                className="inline-block text-base font-semibold tracking-wide text-navy hover:text-navy-light max-md:text-[#E8DCF5]"
              >
                {companyEmail}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(mobileDarkCardClassName)}>
        <CardHeader>
          <CardTitle className="text-lg max-md:text-white">فرم تماس</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="max-md:text-white/75">
                نام و نام خانوادگی
              </Label>
              <Input
                id="name"
                placeholder="نام شما"
                className="max-md:border-white/15 max-md:bg-[#18141f] max-md:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="max-md:text-white/75">
                ایمیل
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="name@example.com"
                dir="ltr"
                className="text-left max-md:border-white/15 max-md:bg-[#18141f] max-md:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="max-md:text-white/75">
                پیام
              </Label>
              <Textarea
                id="message"
                placeholder="سوال یا درخواست خود را بنویسید..."
                rows={4}
                className="max-md:border-white/15 max-md:bg-[#18141f] max-md:text-white"
              />
            </div>
            <Button
              type="button"
              className="w-full max-md:rounded-full max-md:bg-[#A07CC4] max-md:hover:bg-[#946CB9]"
              disabled
            >
              ارسال پیام — به‌زودی
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground max-md:text-white/50">
              ارسال واقعی پیام در نسخه فعلی فعال نیست. برای تماس سریع با شماره{" "}
              <a
                href={`tel:${companyPhoneTel}`}
                dir="ltr"
                className="font-medium text-primary hover:underline max-md:text-[#C9B4DE]"
              >
                {companyPhoneDisplay}
              </a>{" "}
              تماس بگیرید.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <div className="md:hidden">
        <MobilePublicPageShell
          title="تماس با ما"
          lead="برای پرسش درباره مدل مشارکت، ریسک پروژه‌ها یا هماهنگی اعلام آمادگی، با دفتر آوید در تماس باشید."
        >
          <ContactBody />
        </MobilePublicPageShell>
      </div>

      <div className="container mx-auto hidden px-4 py-12 md:block">
        <h1 className="text-3xl font-bold">تماس با ما</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          برای پرسش درباره مدل مشارکت، ریسک پروژه‌ها یا هماهنگی اعلام آمادگی، با
          دفتر آوید در تماس باشید.
        </p>
        <div className="mt-8">
          <ContactBody />
        </div>
      </div>
    </>
  );
}
