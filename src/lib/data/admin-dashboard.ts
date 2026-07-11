import { getAdminProjectSummaries } from "@/lib/data/investor-projects";
import { getAllInvestmentRequests } from "@/lib/data/investor-dashboard";
import { getAllPaymentReceipts } from "@/lib/data/receipts";
import { getAllProjectSettlements } from "@/lib/data/project-settlements";
import { getAllSettlementPayouts } from "@/lib/data/settlement-payouts";
import { getInvestorDistributionForSettlement } from "@/lib/data/settlement-distribution";
import { ProjectStatus } from "@/types/database";
import { settlementPayoutKey } from "@/types/settlement";

const ADMIN_ACTIVE_STATUSES: ProjectStatus[] = [
  "open_for_interest",
  "funding_in_progress",
  "funding_completed",
  "in_execution",
  "delayed",
  "settlement_in_progress",
];

export interface AdminDashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingInvestmentRequests: number;
  pendingReceipts: number;
  totalAllocatedCapital: number;
  finalizedSettlements: number;
  pendingManualPayouts: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [projects, requests, receipts, settlements, payouts] =
    await Promise.all([
      getAdminProjectSummaries(),
      getAllInvestmentRequests(),
      getAllPaymentReceipts(),
      getAllProjectSettlements(),
      getAllSettlementPayouts(),
    ]);

  const payoutKeys = new Set(
    payouts.map((p) => settlementPayoutKey(p.settlementId, p.investorId))
  );

  const finalized = settlements.filter((s) => s.status === "finalized");
  let pendingManualPayouts = 0;

  for (const settlement of finalized) {
    const distribution = await getInvestorDistributionForSettlement(settlement);
    for (const row of distribution) {
      const key = settlementPayoutKey(settlement.id, row.investorId);
      if (!payoutKeys.has(key)) {
        pendingManualPayouts += 1;
      }
    }
  }

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) =>
      ADMIN_ACTIVE_STATUSES.includes(p.status as ProjectStatus)
    ).length,
    pendingInvestmentRequests: requests.filter((r) =>
      ["submitted", "under_review"].includes(r.status)
    ).length,
    pendingReceipts: receipts.filter((r) =>
      ["submitted", "under_review"].includes(r.status)
    ).length,
    totalAllocatedCapital: projects.reduce(
      (sum, p) => sum + p.totalVerifiedAmount,
      0
    ),
    finalizedSettlements: finalized.length,
    pendingManualPayouts,
  };
}
