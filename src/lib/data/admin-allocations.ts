import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import { getAllProjectOps } from "@/lib/data/mock/project-ops-store";
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

/**
 * Investor summaries for admin — built from shared project-ops mock
 * (same source as /admin/projects table).
 */
export async function getAdminInvestorSummaries(): Promise<
  AdminInvestorSummary[]
> {
  const projects = await getAllProjectOps();
  const byInvestor = new Map<string, AdminInvestorSummary>();

  for (const project of projects) {
    for (const inv of project.investors) {
      const name = inv.name.trim();
      if (!name) continue;
      const investorId = inv.isDemoInvestor
        ? "mock-investor-1"
        : `ops-investor-${name}`;

      const projectEntry = {
        projectId: project.id,
        projectTitle: project.title,
        projectSlug: project.slug,
        amount: inv.amount,
        allocatedAt: project.startDate ?? new Date().toISOString(),
      };

      const existing = byInvestor.get(investorId);
      if (!existing) {
        byInvestor.set(investorId, {
          investorId,
          investorName: name,
          totalAllocated: inv.amount,
          projectCount: 1,
          allocations: [projectEntry],
        });
      } else {
        existing.totalAllocated += inv.amount;
        existing.allocations.push(projectEntry);
        existing.projectCount = new Set(
          existing.allocations.map((a) => a.projectId),
        ).size;
      }
    }
  }

  return Array.from(byInvestor.values()).sort(
    (a, b) => b.totalAllocated - a.totalAllocated,
  );
}

export async function getProjectAllocatedTotal(
  projectId: string
): Promise<number> {
  const rows = await getProjectInvestorRows(projectId);
  return rows.reduce((sum, r) => sum + r.amount, 0);
}
