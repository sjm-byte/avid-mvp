import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import {
  AdminInvestorSummary,
  ProjectInvestorRow,
} from "@/types/allocation";

export async function getProjectInvestorRows(
  projectId: string
): Promise<ProjectInvestorRow[]> {
  const all = await getAllMockInvestments();
  return all
    .filter((a) => a.projectId === projectId && a.status === "active")
    .map((a) => ({
      allocationId: a.id,
      investorId: a.investorId,
      investorName: a.investorName?.trim() || a.investorId,
      amount: a.verifiedAmount,
      allocatedAt: a.allocatedAt,
      ownershipPercent: a.ownershipPercent,
      adminNote: a.adminNote,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getAdminInvestorSummaries(): Promise<
  AdminInvestorSummary[]
> {
  const all = await getAllMockInvestments();
  const active = all.filter((a) => a.status === "active");
  const byInvestor = new Map<string, AdminInvestorSummary>();

  for (const row of active) {
    const name = row.investorName?.trim() || row.investorId;
    const existing = byInvestor.get(row.investorId);
    const projectEntry = {
      projectId: row.projectId,
      projectTitle: row.projectTitle,
      projectSlug: row.projectSlug,
      amount: row.verifiedAmount,
      allocatedAt: row.allocatedAt,
    };

    if (!existing) {
      byInvestor.set(row.investorId, {
        investorId: row.investorId,
        investorName: name,
        totalAllocated: row.verifiedAmount,
        projectCount: 1,
        allocations: [projectEntry],
      });
    } else {
      existing.totalAllocated += row.verifiedAmount;
      existing.allocations.push(projectEntry);
      existing.projectCount = new Set(
        existing.allocations.map((a) => a.projectId)
      ).size;
      if (!existing.investorName || existing.investorName === row.investorId) {
        existing.investorName = name;
      }
    }
  }

  return Array.from(byInvestor.values()).sort(
    (a, b) => b.totalAllocated - a.totalAllocated
  );
}

export async function getProjectAllocatedTotal(
  projectId: string
): Promise<number> {
  const rows = await getProjectInvestorRows(projectId);
  return rows.reduce((sum, r) => sum + r.amount, 0);
}
