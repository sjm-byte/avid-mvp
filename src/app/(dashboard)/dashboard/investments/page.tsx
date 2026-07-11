import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { getPaymentInstructionsForRequests } from "@/lib/data/payment-instructions";
import {
  getInvestorPaymentReceipts,
  receiptsByRequestId,
} from "@/lib/data/receipts";
import { getInvestorFinalizedSettlementResults } from "@/lib/data/settlement-distribution";
import { InvestmentRequestsList } from "@/components/investments/InvestmentRequestsList";
import { InvestorSettlementResultsList } from "@/components/investments/InvestorSettlementResultsList";
import { formatPercent, formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectStatus } from "@/types/database";

export default async function DashboardInvestmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const data = await getInvestorDashboardData(user.id);
  const [paymentInstructionsByRequestId, receipts, finalizedSettlements] =
    await Promise.all([
      getPaymentInstructionsForRequests(data.requests),
      getInvestorPaymentReceipts(user.id),
      getInvestorFinalizedSettlementResults(user.id),
    ]);
  const receiptsByRequestIdMap = receiptsByRequestId(receipts);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">سرمایه‌گذاری‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          درخواست‌های مشارکت و تخصیص‌های تأییدشده شما
        </p>
      </div>

      <InvestorSettlementResultsList settlements={finalizedSettlements} />

      <section>
        <h2 className="mb-4 text-lg font-semibold">درخواست‌های مشارکت</h2>
        <InvestmentRequestsList
          requests={data.requests}
          showConfirmations
          paymentInstructionsByRequestId={paymentInstructionsByRequestId}
          receiptsByRequestId={receiptsByRequestIdMap}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">تخصیص‌های فعال</h2>
        {data.allocations.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            <p>هنوز تخصیص تأییدشده‌ای ندارید.</p>
            <p className="mt-2 text-xs">
              پس از تأیید درخواست و ثبت رسید واریز، تیم مالی رسید را بررسی
              می‌کند و سرمایه شما به‌صورت حسابداری به پروژه تخصیص می‌یابد.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.allocations.map((allocation) => (
              <Card key={allocation.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/projects/${allocation.projectSlug}`}
                      className="hover:underline"
                    >
                      {allocation.projectTitle}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">مبلغ تأییدشده</p>
                    <p className="text-lg font-semibold">
                      {formatToman(allocation.verifiedAmount)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    تاریخ تخصیص:{" "}
                    {new Date(allocation.allocatedAt).toLocaleDateString("fa-IR")}
                  </p>
                  {allocation.ownershipPercent != null && (
                    <p>
                      سهم از پروژه:{" "}
                      {formatPercent(allocation.ownershipPercent)}
                    </p>
                  )}
                  <ProjectStatusBadge
                    status={allocation.projectStatus as ProjectStatus}
                  />
                  {allocation.expectedReturnBase != null && (
                    <p className="text-xs text-amber-800">
                      بازده پیش‌بینی‌شده (پایه):{" "}
                      {formatPercent(allocation.expectedReturnBase)} — پیش‌بینی
                      است، همان نتیجه واقعی پروژه نیست.
                    </p>
                  )}
                  <Link
                    href={`/dashboard/projects/${allocation.projectSlug}`}
                    className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-primary hover:bg-muted/50"
                  >
                    گزارش‌ها و وضعیت پروژه
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
