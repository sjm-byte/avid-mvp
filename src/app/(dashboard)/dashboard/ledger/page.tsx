import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
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
  settlement_result: "نتیجه واقعی پروژه",
};

function formatLedgerAmount(value: number | null | undefined): string {
  if (value == null) return "—";
  return formatToman(value);
}

export default async function DashboardLedgerPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const data = await getInvestorDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ثبت حسابداری</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {LEDGER_PAGE_DISCLAIMER}
        </p>
      </div>

      {data.ledgerSummary.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>هنوز رویداد ثبت حسابداری ندارید.</p>
          <p className="mt-2 text-xs">
            با ثبت درخواست مشارکت، اولین رکورد «تعهد مشارکت» اینجا ظاهر می‌شود.
            پس از تأیید رسید، رویدادهای تخصیص و تسویه نیز ثبت می‌شوند.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-right">
                <th className="px-4 py-3 font-medium">تاریخ</th>
                <th className="px-4 py-3 font-medium">پروژه</th>
                <th className="px-4 py-3 font-medium">نوع</th>
                <th className="px-4 py-3 font-medium">اصل مشارکت</th>
                <th className="px-4 py-3 font-medium">سود/زیان</th>
                <th className="px-4 py-3 font-medium">مبلغ نهایی</th>
                <th className="px-4 py-3 font-medium">تاریخ تسویه</th>
                <th className="px-4 py-3 font-medium">شرح</th>
              </tr>
            </thead>
            <tbody>
              {data.ledgerSummary.map((entry) => {
                const isSettlement = entry.entryType === "settlement_result";
                const finalAmount = isSettlement
                  ? (entry.finalReceivableAmount ?? entry.amount)
                  : entry.amount;

                return (
                  <tr key={entry.id} className="border-b">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-4 py-3">{entry.projectTitle}</td>
                    <td className="px-4 py-3">
                      {ENTRY_TYPE_LABELS[entry.entryType] ?? entry.entryType}
                    </td>
                    <td className="px-4 py-3">
                      {formatLedgerAmount(
                        isSettlement ? entry.principalAmount : null
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isSettlement && entry.profitLossAmount != null ? (
                        <span
                          className={
                            entry.profitLossAmount >= 0
                              ? "text-emerald-800"
                              : "text-red-800"
                          }
                        >
                          {entry.profitLossAmount >= 0 ? "سود: " : "زیان: "}
                          {formatToman(Math.abs(entry.profitLossAmount))}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatToman(finalAmount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.settlementDate
                        ? new Date(entry.settlementDate).toLocaleDateString(
                            "fa-IR"
                          )
                        : "—"}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted-foreground">
                      {entry.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-xs text-amber-900">
          {LEDGER_PAGE_DISCLAIMER} پول از طریق حساب آوید عبور نمی‌کند.
        </CardContent>
      </Card>
    </div>
  );
}
