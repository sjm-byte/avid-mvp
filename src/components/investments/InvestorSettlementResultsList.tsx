import {
  INVESTOR_SETTLEMENT_DISCLAIMER,
  INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS,
  InvestorSettlementResult,
  MANUAL_PAYOUT_DISCLAIMER,
  SETTLEMENT_STATUS_LABELS,
} from "@/types/settlement";
import { formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InvestorSettlementResultsListProps {
  settlements: InvestorSettlementResult[];
}

export function InvestorSettlementResultsList({
  settlements,
}: InvestorSettlementResultsListProps) {
  if (settlements.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">نتایج تسویه نهایی</h2>
      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
        {INVESTOR_SETTLEMENT_DISCLAIMER}
      </p>
      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
        {MANUAL_PAYOUT_DISCLAIMER}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {settlements.map((settlement) => (
          <Card key={settlement.settlementId}>
            <CardHeader>
              <CardTitle className="text-base">{settlement.projectTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">مبلغ اصل مشارکت</p>
                  <p className="font-semibold">
                    {formatToman(settlement.principalAmount)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">سهم سود/زیان</p>
                  <p
                    className={
                      settlement.profitLossShare >= 0
                        ? "font-semibold text-emerald-800"
                        : "font-semibold text-red-800"
                    }
                  >
                    {settlement.profitLossShare >= 0 ? "سود: " : "زیان: "}
                    {formatToman(Math.abs(settlement.profitLossShare))}
                  </p>
                </div>
              </div>
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">مبلغ نهایی قابل دریافت</p>
                <p className="text-lg font-semibold">
                  {formatToman(settlement.finalReceivableAmount)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                تاریخ تسویه:{" "}
                {new Date(settlement.settlementDate).toLocaleDateString("fa-IR")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                  وضعیت تسویه: {SETTLEMENT_STATUS_LABELS.finalized}
                </span>
                <span
                  className={
                    settlement.payoutStatus === "paid_manually"
                      ? "inline-flex rounded-full border bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                      : "inline-flex rounded-full border bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900"
                  }
                >
                  وضعیت پرداخت:{" "}
                  {
                    INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS[
                      settlement.payoutStatus
                    ]
                  }
                </span>
              </div>
              {settlement.payoutStatus === "paid_manually" && (
                <div className="rounded-md border bg-muted/30 p-3 text-xs">
                  <p className="font-medium">جزئیات پرداخت دستی ثبت‌شده</p>
                  {settlement.paidAmount != null && (
                    <p className="mt-2">
                      مبلغ پرداخت: {formatToman(settlement.paidAmount)}
                    </p>
                  )}
                  {settlement.paidDate && (
                    <p>
                      تاریخ پرداخت:{" "}
                      {new Date(settlement.paidDate).toLocaleDateString("fa-IR")}
                    </p>
                  )}
                  {settlement.paymentReferenceNumber && (
                    <p>شماره پیگیری: {settlement.paymentReferenceNumber}</p>
                  )}
                  {settlement.payoutAdminNote && (
                    <p className="text-muted-foreground">
                      یادداشت: {settlement.payoutAdminNote}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
