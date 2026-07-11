import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  ProjectDocumentRow,
  ProjectFundingSummaryRow,
  ProjectMilestoneRow,
  ProjectRiskItemRow,
  ProjectRow,
  ProjectFinancialResultRow,
  ProjectStatus,
} from "@/types/database";
import {
  ClosedProjectTransparency,
  ProjectDetail,
  ProjectFunding,
  ProjectListItem,
  TransparencyStats,
  mapFinancialResultToTransparency,
  mapProjectRowToListItem,
  mapToProjectDetail,
} from "@/types/project";
import {
  getMockClosedProjects,
  getMockFeaturedProjects,
  getMockProjectBySlug,
  getMockPublicProjects,
  getMockTransparencyStats,
} from "@/lib/data/mock/seed-projects";

const ACTIVE_STATUSES: ProjectStatus[] = [
  "open_for_interest",
  "funding_in_progress",
  "funding_completed",
  "in_execution",
];

const CLOSED_STATUSES: ProjectStatus[] = ["closed_success", "closed_loss"];

function mapFundingFromSummary(row: ProjectFundingSummaryRow): ProjectFunding {
  return {
    totalVerifiedAmount: Number(row.total_verified_amount),
    investorCount: Number(row.investor_count),
    fundingPercent: Number(row.funding_percent),
  };
}

function emptyFunding(): ProjectFunding {
  return { totalVerifiedAmount: 0, investorCount: 0, fundingPercent: 0 };
}

async function fetchFundingMap(
  projectIds: string[]
): Promise<Map<string, ProjectFunding>> {
  const map = new Map<string, ProjectFunding>();
  if (projectIds.length === 0) return map;

  const supabase = await createClient();
  const { data } = await supabase
    .from("project_funding_summary")
    .select("*")
    .in("project_id", projectIds);

  for (const row of (data ?? []) as ProjectFundingSummaryRow[]) {
    map.set(row.project_id, mapFundingFromSummary(row));
  }
  return map;
}

export async function getPublicProjects(): Promise<ProjectListItem[]> {
  if (!isSupabaseConfigured()) {
    return getMockPublicProjects();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_public", true)
      .in("status", ACTIVE_STATUSES)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return getMockPublicProjects();
    }

    const projects = data as ProjectRow[];
    const fundingMap = await fetchFundingMap(projects.map((p) => p.id));

    return projects.map((p) =>
      mapProjectRowToListItem(
        p,
        fundingMap.get(p.id) ?? emptyFunding()
      )
    );
  } catch {
    return getMockPublicProjects();
  }
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectListItem[]> {
  const projects = await getPublicProjects();
  return projects.slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!isSupabaseConfigured()) {
    return getMockProjectBySlug(slug);
  }

  try {
    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (error || !project) {
      return getMockProjectBySlug(slug);
    }

    const p = project as ProjectRow;

    const [fundingMap, riskRes, milestoneRes, docRes] = await Promise.all([
      fetchFundingMap([p.id]),
      supabase
        .from("project_risk_items")
        .select("*")
        .eq("project_id", p.id)
        .order("sort_order"),
      supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", p.id)
        .order("sort_order"),
      supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", p.id)
        .eq("visibility", "public")
        .order("created_at", { ascending: false }),
    ]);

    return mapToProjectDetail(
      p,
      fundingMap.get(p.id) ?? emptyFunding(),
      (riskRes.data ?? []) as ProjectRiskItemRow[],
      (milestoneRes.data ?? []) as ProjectMilestoneRow[],
      (docRes.data ?? []) as ProjectDocumentRow[]
    );
  } catch {
    return getMockProjectBySlug(slug);
  }
}

export async function getClosedProjectsForTransparency(): Promise<
  ClosedProjectTransparency[]
> {
  if (!isSupabaseConfigured()) {
    return getMockClosedProjects();
  }

  try {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_public", true)
      .in("status", CLOSED_STATUSES);

    if (error || !projects?.length) {
      return getMockClosedProjects();
    }

    const rows = projects as ProjectRow[];
    const { data: results } = await supabase
      .from("project_financial_results")
      .select("*")
      .in(
        "project_id",
        rows.map((p) => p.id)
      );

    const resultMap = new Map(
      ((results ?? []) as ProjectFinancialResultRow[]).map((r) => [
        r.project_id,
        r,
      ])
    );

    return rows
      .map((p) => {
        const result = resultMap.get(p.id);
        if (!result) return null;
        return mapFinancialResultToTransparency(p, result);
      })
      .filter((x): x is ClosedProjectTransparency => x !== null);
  } catch {
    return getMockClosedProjects();
  }
}

export async function getTransparencyStats(): Promise<TransparencyStats> {
  if (!isSupabaseConfigured()) {
    return getMockTransparencyStats();
  }

  try {
    const closed = await getClosedProjectsForTransparency();
    const active = await getPublicProjects();

    const totalManaged =
      closed.reduce((s, p) => s + p.totalVerifiedCapital, 0) +
      active.reduce((s, p) => s + p.funding.totalVerifiedAmount, 0);

    const avgDuration =
      closed.length > 0
        ? closed.reduce((s, p) => s + (p.actualDurationDays ?? 0), 0) /
          closed.length
        : 0;

    return {
      closedProjectsCount: closed.length,
      totalManagedCapital: totalManaged,
      averageDurationDays: Math.round(avgDuration),
      profitableCount: closed.filter((p) => (p.actualReturnRate ?? 0) > 0)
        .length,
      lossCount: closed.filter((p) => (p.actualReturnRate ?? 0) < 0).length,
      delayedCount: closed.filter((p) =>
        p.varianceReason?.includes("تأخیر")
      ).length,
    };
  } catch {
    return getMockTransparencyStats();
  }
}

export { isSupabaseConfigured };
