import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import { MOCK_ADMIN, MOCK_INVESTOR } from "@/lib/auth/mock";
import {
  calculateInvestorSettlementDistribution,
  InvestorSettlementDistributionRow,
  InvestorSettlementResult,
  ProjectSettlementRecord,
  SettlementAllocationInput,
} from "@/types/settlement";
import { getAllProjectSettlements } from "@/lib/data/project-settlements";
import { getSettlementPayout } from "@/lib/data/settlement-payouts";

const MOCK_INVESTOR_NAMES: Record<string, string> = {
  [MOCK_INVESTOR.id]: MOCK_INVESTOR.fullName,
  [MOCK_ADMIN.id]: MOCK_ADMIN.fullName,
};

function resolveInvestorName(investorId: string): string {
  return MOCK_INVESTOR_NAMES[investorId] ?? investorId;
}

async function getMockAllocationsForProject(
  projectId: string
): Promise<SettlementAllocationInput[]> {
  const all = await getAllMockInvestments();
  return all
    .filter(
      (row) =>
        row.projectId === projectId &&
        (row.status === "active" || row.status === "settlement_pending")
    )
    .map((row) => ({
      investorId: row.investorId,
      investorName: resolveInvestorName(row.investorId),
      allocatedAmount: row.verifiedAmount,
    }));
}

async function fetchSupabaseAllocationsForProject(
  projectId: string
): Promise<SettlementAllocationInput[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("investments")
    .select(
      `
      investor_id,
      verified_amount,
      profiles ( full_name )
    `
    )
    .eq("project_id", projectId)
    .in("status", ["active", "settlement_pending"]);

  if (error || !data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    return {
      investorId: row.investor_id,
      investorName: profile?.full_name ?? row.investor_id,
      allocatedAmount: Number(row.verified_amount),
    };
  });
}

export async function getAllocationsForSettlement(
  projectId: string
): Promise<SettlementAllocationInput[]> {
  if (await shouldUseMockData()) {
    return getMockAllocationsForProject(projectId);
  }

  try {
    const remote = await fetchSupabaseAllocationsForProject(projectId);
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  return getMockAllocationsForProject(projectId);
}

export async function getInvestorDistributionForSettlement(
  settlement: ProjectSettlementRecord
): Promise<InvestorSettlementDistributionRow[]> {
  const allocations = await getAllocationsForSettlement(settlement.projectId);
  return calculateInvestorSettlementDistribution(settlement, allocations);
}

export async function getInvestorFinalizedSettlementResults(
  investorId: string
): Promise<InvestorSettlementResult[]> {
  const settlements = await getAllProjectSettlements();
  const finalized = settlements.filter((s) => s.status === "finalized");

  const results: InvestorSettlementResult[] = [];

  for (const settlement of finalized) {
    if (!settlement.finalizedAt) continue;

    const distribution = await getInvestorDistributionForSettlement(settlement);
    const investorRow = distribution.find((row) => row.investorId === investorId);
    if (!investorRow) continue;

    const payout = await getSettlementPayout(settlement.id, investorId);

    results.push({
      settlementId: settlement.id,
      projectId: settlement.projectId,
      projectTitle: settlement.projectTitle ?? "پروژه",
      principalAmount: investorRow.principalAmount,
      profitLossShare: investorRow.profitLossShare,
      finalReceivableAmount: investorRow.finalAmount,
      settlementDate: settlement.settlementDate,
      finalizedAt: settlement.finalizedAt,
      payoutStatus: payout ? "paid_manually" : "pending_manual_payout",
      paidAmount: payout?.paidAmount,
      paidDate: payout?.paidDate,
      paymentReferenceNumber: payout?.paymentReferenceNumber,
      payoutAdminNote: payout?.adminNote,
    });
  }

  return results.sort(
    (a, b) =>
      new Date(b.finalizedAt).getTime() - new Date(a.finalizedAt).getTime()
  );
}
