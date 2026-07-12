import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import { getAllMockProjectUpdates } from "@/lib/data/mock/update-store";
import { getMockProjectRowById, getMockPublicProjects } from "@/lib/data/mock/seed-projects";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { getProjectUpdates } from "@/lib/data/project-updates";
import { getLatestFinancialReport } from "@/lib/data/project-financial-reports";
import { getProjectMilestones } from "@/lib/data/project-milestones";
import { getPublicProjects } from "@/lib/data/projects";
import {
  AdminProjectSummary,
  InvestorActiveProject,
} from "@/types/project-report";
import { ProjectListItem } from "@/types/project";

export async function getAdminProjectSummaries(): Promise<AdminProjectSummary[]> {
  const projects = await getPublicProjects();
  const allocations = await getAllMockInvestments();
  const updates = await getAllMockProjectUpdates();

  if (!(await shouldUseMockData())) {
    try {
      const supabase = await createClient();
      const { data: allProjects } = await supabase
        .from("projects")
        .select("id, title, slug, status, max_raise")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (allProjects?.length) {
        const projectIds = allProjects.map((p) => p.id);
        const [{ data: funding }, { data: invData }, { data: updateData }] =
          await Promise.all([
            supabase
              .from("project_funding_summary")
              .select("*")
              .in("project_id", projectIds),
            supabase
              .from("investments")
              .select("id, project_id")
              .in("project_id", projectIds)
              .in("status", ["active", "settlement_pending"]),
            supabase
              .from("project_updates")
              .select("id, project_id")
              .in("project_id", projectIds)
              .not("published_at", "is", null),
          ]);

        const fundingMap = new Map(
          (funding ?? []).map((f) => [f.project_id, f])
        );
        const allocCount = new Map<string, number>();
        for (const inv of invData ?? []) {
          allocCount.set(
            inv.project_id,
            (allocCount.get(inv.project_id) ?? 0) + 1
          );
        }
        const updateCount = new Map<string, number>();
        for (const u of updateData ?? []) {
          updateCount.set(
            u.project_id,
            (updateCount.get(u.project_id) ?? 0) + 1
          );
        }

        return allProjects.map((p) => {
          const f = fundingMap.get(p.id);
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status,
            maxRaise: Number(p.max_raise),
            totalVerifiedAmount: f ? Number(f.total_verified_amount) : 0,
            investorCount: f ? Number(f.investor_count) : 0,
            allocationCount: allocCount.get(p.id) ?? 0,
            updateCount: updateCount.get(p.id) ?? 0,
          };
        });
      }
    } catch {
      // fall through to mock
    }
  }

  return projects.map((p) => {
    const projectAllocs = allocations.filter(
      (a) => a.projectId === p.id && a.status === "active"
    );
    const fromAllocations = projectAllocs.reduce(
      (sum, a) => sum + a.verifiedAmount,
      0
    );
    const uniqueInvestors = new Set(projectAllocs.map((a) => a.investorId))
      .size;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      maxRaise: p.maxRaise,
      totalVerifiedAmount:
        projectAllocs.length > 0
          ? fromAllocations
          : p.funding.totalVerifiedAmount,
      investorCount:
        projectAllocs.length > 0 ? uniqueInvestors : p.funding.investorCount,
      allocationCount: projectAllocs.length,
      updateCount: updates.filter((u) => u.projectId === p.id).length,
    };
  });
}

export async function getInvestorActiveProjects(
  investorId: string
): Promise<InvestorActiveProject[]> {
  const data = await getInvestorDashboardData(investorId);

  const activeProjects: InvestorActiveProject[] = [];

  for (const allocation of data.allocations) {
    const [updates, milestones, financialReport] = await Promise.all([
      getProjectUpdates(allocation.projectId, {
        viewerRole: "investor",
        hasAllocation: true,
      }),
      getProjectMilestones(allocation.projectId),
      getLatestFinancialReport(allocation.projectId, {
        viewerRole: "investor",
        hasAllocation: true,
      }),
    ]);

    const projectRow = getMockProjectRowById(allocation.projectId);

    activeProjects.push({
      projectId: allocation.projectId,
      projectTitle: allocation.projectTitle,
      projectSlug: allocation.projectSlug,
      projectStatus: allocation.projectStatus || projectRow?.status || "in_execution",
      allocatedAmount: allocation.verifiedAmount,
      ownershipPercent: allocation.ownershipPercent,
      allocatedAt: allocation.allocatedAt,
      latestUpdate: updates[0] ?? null,
      milestones,
      latestFinancialReport: financialReport,
    });
  }

  return activeProjects.sort(
    (a, b) =>
      new Date(b.allocatedAt).getTime() - new Date(a.allocatedAt).getTime()
  );
}

export async function investorHasProjectAllocation(
  investorId: string,
  projectId: string
): Promise<boolean> {
  const data = await getInvestorDashboardData(investorId);
  return data.allocations.some(
    (a) => a.projectId === projectId && a.status === "active"
  );
}

export function splitProjectsForInvestor(
  allProjects: ProjectListItem[],
  activeProjectIds: Set<string>
): { available: ProjectListItem[]; active: ProjectListItem[] } {
  const active: ProjectListItem[] = [];
  const available: ProjectListItem[] = [];

  for (const project of allProjects) {
    if (activeProjectIds.has(project.id)) {
      active.push(project);
    } else {
      available.push(project);
    }
  }

  return { available, active };
}

export { getMockPublicProjects };
