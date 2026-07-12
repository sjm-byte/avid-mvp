"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createManualAllocation } from "@/lib/actions/manual-allocations";
import { formatPersianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ManualAllocationFormProps {
  projectId: string;
  projectTitle: string;
}

export function ManualAllocationForm({
  projectId,
  projectTitle,
}: ManualAllocationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [investorName, setInvestorName] = useState("");
  const [amountToman, setAmountToman] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [linkToDemo, setLinkToDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const toman = Number(
      amountToman.replace(/[^\d.]/g, "").replace(/,/g, "")
    );
    if (!Number.isFinite(toman) || toman <= 0) {
      setError("مبلغ را به تومان وارد کنید.");
      return;
    }

    startTransition(async () => {
      const result = await createManualAllocation({
        projectId,
        investorName,
        amountRial: Math.round(toman * 10),
        adminNote: adminNote || null,
        linkToDemoInvestor: linkToDemo,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("مشارکت پس از قرارداد ثبت شد.");
      setInvestorName("");
      setAmountToman("");
      setAdminNote("");
      setLinkToDemo(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ثبت مشارکت پس از قرارداد</CardTitle>
        <CardDescription>
          واریز خارج از سامانه انجام شده است. اینجا فقط ثبت حسابداری برای «
          {projectTitle}» است — آوید وجهی دریافت نمی‌کند.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="investor-name">نام سرمایه‌گذار</Label>
            <Input
              id="investor-name"
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              placeholder="مثلاً علی اکبر محمدی"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount-toman">مبلغ مشارکت (تومان)</Label>
            <Input
              id="amount-toman"
              inputMode="numeric"
              dir="ltr"
              className="text-left"
              value={amountToman}
              onChange={(e) => setAmountToman(e.target.value)}
              placeholder={formatPersianNumber(100000000)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-note">یادداشت (اختیاری)</Label>
            <Textarea
              id="admin-note"
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="مثلاً قرارداد ۱۴۰۵/۰۱/۲۰ — واریز به حساب پروژه"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={linkToDemo}
              onChange={(e) => setLinkToDemo(e.target.checked)}
            />
            <span className="text-muted-foreground">
              اتصال به حساب نمایشی سرمایه‌گذار (علی رضایی) تا در پنل او دیده
              شود
            </span>
          </label>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "در حال ثبت…" : "ثبت مشارکت"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
