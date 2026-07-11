import { PaymentReceiptRecord } from "@/types/receipt";
import { formatToman } from "@/lib/utils";
import { PaymentReceiptStatusBadge } from "@/components/investments/PaymentReceiptStatusBadge";

interface PaymentReceiptCardProps {
  receipt: PaymentReceiptRecord;
}

export function PaymentReceiptCard({ receipt }: PaymentReceiptCardProps) {
  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">رسید واریز ثبت‌شده</p>
        <PaymentReceiptStatusBadge status={receipt.status} />
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">مبلغ واریز</dt>
          <dd className="font-medium">{formatToman(receipt.amount)}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">تاریخ واریز</dt>
          <dd>
            {new Date(receipt.paidAt).toLocaleDateString("fa-IR", {
              dateStyle: "medium",
            })}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">شماره پیگیری / مرجع</dt>
          <dd className="font-mono text-xs" dir="ltr">
            {receipt.trackingNumber}
          </dd>
        </div>
        {receipt.investorNote && (
          <div>
            <dt className="text-muted-foreground">یادداشت</dt>
            <dd className="mt-0.5">{receipt.investorNote}</dd>
          </div>
        )}
        {receipt.fileName && (
          <div>
            <dt className="text-muted-foreground">فایل رسید</dt>
            <dd className="mt-0.5 text-xs text-muted-foreground">
              {receipt.fileName} — ثبت نام فایل (آپلود واقعی به‌زودی)
            </dd>
          </div>
        )}
        {receipt.rejectionReason && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-900">
            <dt className="font-medium">دلیل رد</dt>
            <dd className="mt-0.5">{receipt.rejectionReason}</dd>
          </div>
        )}
      </dl>

      <p className="text-xs text-muted-foreground">
        این رسید صرفاً ثبت اعلام واریز شما به حساب پروژه است. آوید وجهی
        دریافت نمی‌کند.
      </p>
    </div>
  );
}
