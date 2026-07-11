"use client";

import { useState } from "react";
import { FinalizeSettlementButton } from "@/components/admin/FinalizeSettlementButton";
import { SettlementInvestorPayoutCell } from "@/components/admin/SettlementInvestorPayoutCell";
import {
  InvestorSettlementDistributionRow,
  InvestorSettlementPayoutRecord,
  ProjectSettlementRecord,
  SETTLEMENT_DISTRIBUTION_DISCLAIMER,
  SETTLEMENT_STATUS_LABELS,
  MANUAL_PAYOUT_DISCLAIMER,
  settlementPayoutKey,
} from "@/types/settlement";
import { formatPercent, formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface SettlementRecordsTableProps {
  settlements: ProjectSettlementRecord[];
  distributionBySettlementId: Record<string, InvestorSettlementDistributionRow[]>;
  payoutByKey: Record<string, InvestorSettlementPayoutRecord>;
}

export function SettlementRecordsTable({
  settlements,
  distributionBySettlementId,
  payoutByKey,
}: SettlementRecordsTableProps) {
  const [openSettlementId, setOpenSettlementId] = useState<string | null>(null);

  const activeSettlement = settlements.find((s) => s.id === openSettlementId);
  const activeRows = openSettlementId
    ? (distributionBySettlementId[openSettlementId] ?? [])
    : [];

  if (settlements.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-muted-foreground">
        هنوز تسویه‌ای ثبت نشده است.
      </p>
    );
  }

  return (
    <>
      <table className="w-full min-w-[1200px] text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-right">
            <th className="px-4 py-3 font-medium">پروژه</th>
            <th className="px-4 py-3 font-medium">وضعیت</th>
            <th className="px-4 py-3 font-medium">سرمایه</th>
            <th className="px-4 py-3 font-medium">درآمد</th>
            <th className="px-4 py-3 font-medium">هزینه</th>
            <th className="px-4 py-3 font-medium">نتیجه خالص</th>
            <th className="px-4 py-3 font-medium">کارمزد اولیه</th>
            <th className="px-4 py-3 font-medium">کارمزد موفقیت</th>
            <th className="px-4 py-3 font-medium">قابل توزیع</th>
            <th className="px-4 py-3 font-medium">تاریخ</th>
            <th className="px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="px-4 py-3">{s.projectTitle ?? "پروژه"}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {SETTLEMENT_STATUS_LABELS[s.status]}
              </td>
              <td className="px-4 py-3">
                {formatToman(s.totalVerifiedCapital)}
              </td>
              <td className="px-4 py-3">{formatToman(s.totalRevenue)}</td>
              <td className="px-4 py-3">{formatToman(s.totalCosts)}</td>
              <td className="px-4 py-3">{formatToman(s.netResult)}</td>
              <td className="px-4 py-3">{formatToman(s.initialFeeAmount)}</td>
              <td className="px-4 py-3">{formatToman(s.successFeeAmount)}</td>
              <td className="px-4 py-3 font-medium">
                {formatToman(s.distributableAmount)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(s.settlementDate).toLocaleDateString("fa-IR")}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenSettlementId(s.id)}
                  >
                    مشاهده محاسبه سهم سرمایه‌گذاران
                  </Button>
                  {s.status === "draft" && (
                    <FinalizeSettlementButton
                      settlementId={s.id}
                      projectTitle={s.projectTitle}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openSettlementId && activeSettlement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenSettlementId(null)}
          role="dialog"
          aria-modal="true"
        >
          <Card
            className="max-h-[90vh] w-full min-w-0 max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="space-y-4 overflow-y-auto p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    پیش‌نمایش سهم سرمایه‌گذاران
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeSettlement.projectTitle ?? "پروژه"} — مبلغ قابل توزیع:{" "}
                    {formatToman(activeSettlement.distributableAmount)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenSettlementId(null)}
                >
                  بستن
                </Button>
              </div>

              <p className="rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
                {SETTLEMENT_DISTRIBUTION_DISCLAIMER}
              </p>
              {activeSettlement.status === "finalized" && (
                <p className="rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
                  {MANUAL_PAYOUT_DISCLAIMER}
                </p>
              )}

              {activeRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  برای این پروژه تخصیص فعالی یافت نشد. ابتدا باید رسید تأیید و
                  تخصیص سرمایه انجام شود.
                </p>
              ) : (
                <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
                  <table className="w-full min-w-[1100px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-right">
                        <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                        <th className="px-4 py-3 font-medium">مبلغ تخصیص</th>
                        <th className="px-4 py-3 font-medium">سهم</th>
                        <th className="px-4 py-3 font-medium">اصل</th>
                        <th className="px-4 py-3 font-medium">سهم سود/زیان</th>
                        <th className="px-4 py-3 font-medium">مبلغ نهایی</th>
                        <th className="px-4 py-3 font-medium">پرداخت دستی</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRows.map((row) => (
                        <tr key={row.investorId} className="border-b">
                          <td className="px-4 py-3">{row.investorName}</td>
                          <td className="px-4 py-3">
                            {formatToman(row.allocatedAmount)}
                          </td>
                          <td className="px-4 py-3">
                            {formatPercent(row.shareRatio)}
                          </td>
                          <td className="px-4 py-3">
                            {formatToman(row.principalAmount)}
                          </td>
                          <td
                            className={
                              row.profitLossShare >= 0
                                ? "px-4 py-3 text-emerald-800"
                                : "px-4 py-3 text-red-800"
                            }
                          >
                            {row.profitLossShare >= 0 ? "سود: " : "زیان: "}
                            {formatToman(Math.abs(row.profitLossShare))}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatToman(row.finalAmount)}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <SettlementInvestorPayoutCell
                              settlementId={activeSettlement.id}
                              row={row}
                              payout={
                                payoutByKey[
                                  settlementPayoutKey(
                                    activeSettlement.id,
                                    row.investorId
                                  )
                                ] ?? null
                              }
                              isFinalized={activeSettlement.status === "finalized"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
