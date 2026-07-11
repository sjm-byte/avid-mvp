"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitInvestmentRequest } from "@/lib/actions/investment-requests";
import { formatToman, formatPersianNumber } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";

const PROJECT_TERMS = `با ثبت درخواست مشارکت، شما تأیید می‌کنید که:
• این درخواست به معنی پرداخت فوری نیست.
• پس از بررسی آوید، در صورت تأیید، اطلاعات واریز به حساب معرفی‌شده پروژه ارسال می‌شود.
• پرداخت خارج از سامانه آوید انجام می‌شود و پول در حساب آوید نگهداری نمی‌شود.
• هر پروژه مستقل است و باید جداگانه تأیید شود.
• بازده پیش‌بینی‌شده سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود.`;

interface InvestmentRequestFormProps {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  minInvestment: number;
  isAuthenticated: boolean;
  loginRedirectUrl: string;
}

function parseTomanToRial(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits) * 10;
}

export function InvestmentRequestForm({
  projectId,
  projectSlug,
  projectTitle,
  minInvestment,
  isAuthenticated,
  loginRedirectUrl,
}: InvestmentRequestFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amountToman, setAmountToman] = useState("");
  const [investorNote, setInvestorNote] = useState("");
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [profitNotGuaranteed, setProfitNotGuaranteed] = useState(false);
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleOpen() {
    if (!isAuthenticated) {
      router.push(loginRedirectUrl);
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const requestedAmount = parseTomanToRial(amountToman);
    const result = await submitInvestmentRequest({
      projectId,
      projectSlug,
      projectTitle,
      minInvestment,
      requestedAmount,
      investorNote,
      riskAccepted,
      profitNotGuaranteedAccepted: profitNotGuaranteed,
      paymentInstructionsAcknowledged: paymentAcknowledged,
      termsAccepted,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <>
      <Button size="lg" onClick={handleOpen}>
        درخواست مشارکت
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onClick={() => !loading && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <Card
            className="my-8 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <>
                <CardHeader>
                  <CardTitle>درخواست ثبت شد</CardTitle>
                  <CardDescription>{projectTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    درخواست مشارکت شما ثبت شد و در وضعیت «ثبت‌شده — در انتظار
                    بررسی» قرار گرفت.
                  </p>
                  <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    هنوز پرداختی انجام نشده است. پس از بررسی آوید، اطلاعات
                    واریز به حساب معرفی‌شده پروژه در پنل سرمایه‌گذاری شما
                    نمایش داده می‌شود.
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    بستن
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard/investments">درخواست‌های من</Link>
                  </Button>
                </CardFooter>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>درخواست مشارکت</CardTitle>
                  <CardDescription>{projectTitle}</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[60vh] space-y-4 overflow-y-auto">
                  {error && (
                    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">مبلغ مشارکت (تومان)</Label>
                    <Input
                      id="amount"
                      inputMode="numeric"
                      placeholder={formatPersianNumber(
                        Math.round(minInvestment / 10)
                      )}
                      value={amountToman}
                      onChange={(e) => setAmountToman(e.target.value)}
                      required
                      dir="ltr"
                      className="text-left"
                    />
                    <p className="text-xs text-muted-foreground">
                      حداقل مشارکت: {formatToman(minInvestment)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">یادداشت (اختیاری)</Label>
                    <Textarea
                      id="note"
                      placeholder="توضیح کوتاه برای تیم آوید..."
                      value={investorNote}
                      onChange={(e) => setInvestorNote(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <RiskDisclosureBox variant="compact" />

                  <div className="rounded-md border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">
                      شرایط مشارکت در این پروژه
                    </p>
                    <pre className="whitespace-pre-wrap font-sans">
                      {PROJECT_TERMS}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={riskAccepted}
                        onChange={(e) => setRiskAccepted(e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <span>ریسک‌ها و هشدارهای این پروژه را مطالعه کردم.</span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={profitNotGuaranteed}
                        onChange={(e) =>
                          setProfitNotGuaranteed(e.target.checked)
                        }
                        className="mt-1"
                        required
                      />
                      <span>
                        می‌دانم بازده پیش‌بینی‌شده سناریو است و همان نتیجه واقعی
                        پروژه محسوب نمی‌شود.
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={paymentAcknowledged}
                        onChange={(e) =>
                          setPaymentAcknowledged(e.target.checked)
                        }
                        className="mt-1"
                        required
                      />
                      <span>
                        می‌دانم اطلاعات واریز پس از بررسی و تأیید آوید،
                        جداگانه ارسال می‌شود.
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <span>شرایط مشارکت در این پروژه را می‌پذیرم.</span>
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    انصراف
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "در حال ثبت..." : "ثبت درخواست"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
