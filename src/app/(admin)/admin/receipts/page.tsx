import { getAllPaymentReceipts } from "@/lib/data/receipts";
import { formatToman } from "@/lib/utils";
import { PaymentReceiptStatusBadge } from "@/components/investments/PaymentReceiptStatusBadge";
import { AdminReceiptActions } from "@/components/investments/AdminReceiptActions";

export default async function AdminReceiptsPage() {
  const receipts = await getAllPaymentReceipts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">رسیدهای واریز</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          بررسی رسیدهای اعلام‌شده توسط سرمایه‌گذاران — تأیید به معنی ثبت
          حسابداری تخصیص است، نه دریافت وجه توسط آوید
        </p>
      </div>

      {receipts.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>هنوز رسیدی ثبت نشده است.</p>
          <p className="mt-2 text-xs">
            پس از تأیید درخواست مشارکت، سرمایه‌گذار می‌تواند رسید واریز خارج از
            سامانه را در پنل خود ثبت کند.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-right">
                <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                <th className="px-4 py-3 font-medium">پروژه</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">پیگیری</th>
                <th className="px-4 py-3 font-medium">تاریخ واریز</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">ثبت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">
                    {receipt.investorName ?? receipt.investorId.slice(0, 12) + "…"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {receipt.projectTitle}
                  </td>
                  <td className="px-4 py-3">{formatToman(receipt.amount)}</td>
                  <td className="px-4 py-3 font-mono text-xs" dir="ltr">
                    {receipt.trackingNumber}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(receipt.paidAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentReceiptStatusBadge status={receipt.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(receipt.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3">
                    <AdminReceiptActions
                      receiptId={receipt.id}
                      currentStatus={receipt.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        تأیید رسید به معنی ثبت تخصیص حسابداری است. آوید وجهی دریافت نمی‌کند و
        مبلغی نزد آوید نگهداری نمی‌شود؛ این فقط ثبت حسابداری است.
      </p>
    </div>
  );
}
