import Link from "next/link";
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

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">تماس با ما</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        برای پرسش درباره مدل مشارکت، ریسک پروژه‌ها یا نحوه استفاده از نسخه
        نمایشی، پیام بگذارید.
      </p>
      <Card className="mx-auto mt-8 max-w-lg">
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
              ارسال واقعی پیام در نسخه فعلی فعال نیست. برای آزمایش سامانه از{" "}
              <Link href="/login" className="text-primary hover:underline">
                ورود آزمایشی
              </Link>{" "}
              استفاده کنید.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
