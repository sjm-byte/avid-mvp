import { AdminSettlementPanel } from "@/components/admin/AdminSettlementPanel";
import { SettlementRecordsTable } from "@/components/admin/SettlementRecordsTable";
import { getAdminProjectSummaries } from "@/lib/data/investor-projects";
import { getAllProjectSettlements } from "@/lib/data/project-settlements";
import { getInvestorDistributionForSettlement } from "@/lib/data/settlement-distribution";
import { getAllSettlementPayouts } from "@/lib/data/settlement-payouts";
import { SETTLEMENT_FORM_DISCLAIMER, MANUAL_PAYOUT_DISCLAIMER, settlementPayoutKey } from "@/types/settlement";

export default async function AdminSettlementsPage() {
  const [projects, settlements, payouts] = await Promise.all([
    getAdminProjectSummaries(),
    getAllProjectSettlements(),
    getAllSettlementPayouts(),
  ]);

  const projectsWithAllocations = projects.filter((p) => p.allocationCount > 0);
  const settlementsByProjectId = Object.fromEntries(
    settlements.map((s) => [s.projectId, s])
  );

  const distributionEntries = await Promise.all(
    settlements.map(async (settlement) => ({
      settlementId: settlement.id,
      rows: await getInvestorDistributionForSettlement(settlement),
    }))
  );
  const distributionBySettlementId = Object.fromEntries(
    distributionEntries.map((entry) => [entry.settlementId, entry.rows])
  );

  const payoutByKey = Object.fromEntries(
    payouts.map((p) => [settlementPayoutKey(p.settlementId, p.investorId), p])
  );

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">تسویه نهایی پروژه‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ثبت نتیجه مالی نهایی پس از پایان اجرای پروژه و پیش‌نمایش سهم
          سرمایه‌گذاران.
        </p>
        <p className="mt-2 text-xs text-amber-800">{SETTLEMENT_FORM_DISCLAIMER}</p>
        <p className="mt-1 text-xs text-amber-800">{MANUAL_PAYOUT_DISCLAIMER}</p>
      </div>

      <AdminSettlementPanel
        projects={projectsWithAllocations.map((p) => ({
          id: p.id,
          title: p.title,
          totalVerifiedAmount: p.totalVerifiedAmount,
        }))}
        settlementsByProjectId={settlementsByProjectId}
      />

      <section className="w-full max-w-full min-w-0 rounded-md border">
        <h2 className="border-b px-4 py-3 text-lg font-semibold">
          تسویه‌های ثبت‌شده
        </h2>
        <div className="w-full max-w-full min-w-0 overflow-x-auto">
          <SettlementRecordsTable
            settlements={settlements}
            distributionBySettlementId={distributionBySettlementId}
            payoutByKey={payoutByKey}
          />
        </div>
      </section>
    </div>
  );
}
