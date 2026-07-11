import { getAllLedgerEntries } from "@/lib/data/ledger";
import { LEDGER_PAGE_DISCLAIMER } from "@/lib/data/mock-data-mode";
import { formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const ENTRY_TYPE_LABELS: Record<string, string> = {
  investment_commitment: "تعهد مشارکت",
  payment_receipt_uploaded: "ثبت رسید",
  payment_verified: "تأیید پرداخت",
  capital_allocated: "تخصیص سرمایه",
};

const DIRECTION_LABELS: Record<string, string> = {
  debit: "بدهکار",
  credit: "بستانکار",
  memo: "یادداشت حسابداری",
};

export default async function AdminLedgerPage() {
  const entries = await getAllLedgerEntries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ثبت حسابداری پروژه‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {LEDGER_PAGE_DISCLAIMER}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>هنوز رویداد ثبت حسابداری ثبت نشده است.</p>
          <p className="mt-2 text-xs">
            پس از تأیید رسید واریز در بخش رسیدها، ثبت تخصیص سرمایه اینجا نمایش
            داده می‌شود.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-right">
                <th className="px-4 py-3 font-medium">تاریخ</th>
                <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                <th className="px-4 py-3 font-medium">پروژه</th>
                <th className="px-4 py-3 font-medium">نوع</th>
                <th className="px-4 py-3 font-medium">جهت</th>
                <th className="px-4 py-3 font-medium">شرح</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.investorName ??
                      (entry.investorId
                        ? entry.investorId.slice(0, 12) + "…"
                        : "—")}
                  </td>
                  <td className="px-4 py-3">{entry.projectTitle}</td>
                  <td className="px-4 py-3">
                    {ENTRY_TYPE_LABELS[entry.entryType] ?? entry.entryType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {DIRECTION_LABELS[entry.direction] ?? entry.direction}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground">
                    {entry.description}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatToman(entry.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-xs text-amber-900">
          {LEDGER_PAGE_DISCLAIMER} آوید وجهی دریافت نمی‌کند و این جدول
          فقط ثبت حسابداری است.
        </CardContent>
      </Card>
    </div>
  );
}
