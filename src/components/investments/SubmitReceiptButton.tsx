"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitPaymentReceipt } from "@/lib/actions/payment-receipts";
import { InvestmentRequestRecord } from "@/types/investment";
import { formatPersianNumber, formatToman } from "@/lib/utils";
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

function parseTomanToRial(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits) * 10;
}

interface SubmitReceiptButtonProps {
  request: InvestmentRequestRecord;
}

export function SubmitReceiptButton({ request }: SubmitReceiptButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amountToman, setAmountToman] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [investorNote, setInvestorNote] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await submitPaymentReceipt({
      investmentRequestId: request.id,
      projectId: request.projectId,
      projectSlug: request.projectSlug,
      projectTitle: request.projectTitle,
      amountPaid: parseTomanToRial(amountToman),
      paidAt,
      trackingNumber,
      investorNote,
      fileName,
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
      <Button type="button" size="sm" onClick={() => setOpen(true)}>
        ثبت رسید واریز
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
                  <CardTitle>رسید ثبت شد</CardTitle>
                  <CardDescription>{request.projectTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    رسید واریز شما ثبت شد و در وضعیت «ثبت‌شده — در انتظار
                    بررسی» قرار گرفت.
                  </p>
                  <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    این ثبت به معنی تأیید پرداخت یا تخصیص سرمایه نیست. تیم مالی
                    آوید رسید را بررسی می‌کند.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setOpen(false)}>بستن</Button>
                </CardFooter>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>ثبت رسید واریز</CardTitle>
                  <CardDescription>{request.projectTitle}</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[60vh] space-y-4 overflow-y-auto">
                  {error && (
                    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <p className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-900">
                    رسید را پس از واریز به حساب معرفی‌شده پروژه ثبت کنید.
                    آوید واسطه مالی نیست و وجهی دریافت نمی‌کند.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-amount">مبلغ واریزشده (تومان)</Label>
                    <Input
                      id="receipt-amount"
                      inputMode="numeric"
                      placeholder={formatPersianNumber(
                        Math.round(request.requestedAmount / 10)
                      )}
                      value={amountToman}
                      onChange={(e) => setAmountToman(e.target.value)}
                      required
                      dir="ltr"
                      className="text-left"
                    />
                    <p className="text-xs text-muted-foreground">
                      مبلغ درخواستی: {formatToman(request.requestedAmount)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-date">تاریخ واریز</Label>
                    <Input
                      id="receipt-date"
                      type="date"
                      value={paidAt}
                      onChange={(e) => setPaidAt(e.target.value)}
                      required
                      dir="ltr"
                      className="text-left"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-tracking">
                      شماره پیگیری / مرجع واریز
                    </Label>
                    <Input
                      id="receipt-tracking"
                      placeholder="مثلاً ۱۲۳۴۵۶۷۸۹۰"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      required
                      dir="ltr"
                      className="text-left"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-note">یادداشت (اختیاری)</Label>
                    <Textarea
                      id="receipt-note"
                      placeholder="توضیح کوتاه درباره واریز..."
                      value={investorNote}
                      onChange={(e) => setInvestorNote(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-file">فایل رسید (اختیاری)</Label>
                    <Input
                      id="receipt-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setFileName(e.target.files?.[0]?.name ?? "")
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      در نسخه نمایشی فقط نام فایل ثبت می‌شود؛ آپلود واقعی
                      به‌زودی فعال می‌شود.
                    </p>
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
                    {loading ? "در حال ثبت..." : "ثبت رسید"}
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
