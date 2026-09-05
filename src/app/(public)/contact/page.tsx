import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
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
import {
  companyAddressLines,
  companyPhoneDisplay,
  companyPhoneTel,
} from "@/lib/company-contact";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">تماس با ما</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        برای پرسش درباره مدل مشارکت، ریسک پروژه‌ها یا هماهنگی اعلام آمادگی، با
        دفتر آوید در تماس باشید.
      </p>

      <div className="mx-auto mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">دفتر شرکت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                <Phone className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground">تلفن دفتر</p>
                <a
                  href={`tel:${companyPhoneTel}`}
                  dir="ltr"
                  className="inline-block text-base font-semibold tracking-wide text-navy hover:text-navy-light"
                >
                  {companyPhoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                <MapPin className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground">آدرس دفتر</p>
                <address className="not-italic text-sm leading-relaxed text-muted-foreground">
                  {companyAddressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">فرم تماس</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input id="name" placeholder="نام شما" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">ایمیل</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="name@example.com"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">پیام</Label>
                <Textarea
                  id="message"
                  placeholder="سوال یا درخواست خود را بنویسید..."
                  rows={4}
                />
              </div>
              <Button type="button" className="w-full" disabled>
                ارسال پیام — به‌زودی
              </Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                ارسال واقعی پیام در نسخه فعلی فعال نیست. برای تماس سریع با شماره{" "}
                <a
                  href={`tel:${companyPhoneTel}`}
                  dir="ltr"
                  className="font-medium text-primary hover:underline"
                >
                  {companyPhoneDisplay}
                </a>{" "}
                تماس بگیرید یا از{" "}
                <Link href="/login" className="text-primary hover:underline">
                  ورود آزمایشی
                </Link>{" "}
                استفاده کنید.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
