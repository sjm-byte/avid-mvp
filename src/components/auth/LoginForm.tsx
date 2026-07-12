"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setError(
        "احراز هویت واقعی هنوز پیکربندی نشده است. از ورود آزمایشی پایین استفاده کنید."
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("ورود ناموفق بود. لطفاً ایمیل و رمز عبور را بررسی کنید.");
        setLoading(false);
        return;
      }

      router.push(redirectTo || "/dashboard");
      router.refresh();
    } catch {
      setError("خطا در اتصال به سرویس احراز هویت.");
      setLoading(false);
    }
  }

  function handleDemoLogin(role: "investor" | "admin") {
    document.cookie = `avid_demo_role=${role}; path=/; max-age=86400`;
    if (redirectTo && role === "investor") {
      router.push(redirectTo);
    } else {
      router.push(role === "admin" ? "/admin" : "/dashboard");
    }
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ورود به آوید</CardTitle>
        <CardDescription>
          برای مشاهده وضعیت مشارکت‌های خود وارد شوید
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-muted/40 p-4">
          <p className="text-sm font-semibold text-foreground">
            ورود آزمایشی (Demo)
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            در حالت نمایشی نیازی به حساب واقعی نیست. داده‌های مشارکت پس از
            قرارداد توسط مدیر ثبت می‌شوند. پول واقعی جابه‌جا نمی‌شود و آوید
            درگاه پرداخت نیست؛ فقط ثبت حسابداری و پیگیری مشارکت است.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="button"
              className="w-full"
              onClick={() => handleDemoLogin("investor")}
            >
              ورود آزمایشی — سرمایه‌گذار
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => handleDemoLogin("admin")}
            >
              ورود آزمایشی — مدیر
            </Button>
          </div>
        </div>

        <div className="relative">
          <Separator />
          <span className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 bg-card px-2 text-xs text-muted-foreground">
            یا ورود با حساب
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="text-left"
            />
          </div>
          <Button type="submit" className="w-full" variant="outline" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود با ایمیل"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link href="/signup" className="text-primary hover:underline">
            ثبت‌نام
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
