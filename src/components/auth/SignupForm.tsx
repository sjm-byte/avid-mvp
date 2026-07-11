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
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
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
        "ثبت‌نام واقعی هنوز پیکربندی نشده است. از ورود آزمایشی در صفحه ورود استفاده کنید."
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: "investor" },
        },
      });

      if (authError) {
        setError("ثبت‌نام ناموفق بود. لطفاً اطلاعات را بررسی کنید.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("خطا در اتصال به سرویس احراز هویت.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ثبت‌نام در آوید</CardTitle>
        <CardDescription>
          برای مشارکت در پروژه‌ها، ابتدا حساب کاربری بسازید
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">نام و نام خانوادگی</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="علی رضایی"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
              dir="ltr"
              className="text-left"
            />
          </div>
          <RiskDisclosureBox variant="compact" />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-primary hover:underline">
              ورود
            </Link>
          </p>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            برای آزمایش سریع بدون حساب واقعی، از{" "}
            <Link href="/login" className="text-primary hover:underline">
              ورود آزمایشی
            </Link>{" "}
            استفاده کنید.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
