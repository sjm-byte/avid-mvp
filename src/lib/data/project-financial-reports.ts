import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getAllMockFinancialReports,
  getMockFinancialReportsByProject,
} from "@/lib/data/mock/financial-report-store";
import {
  normalizeReportVisibility,
  ProjectFinancialReportRecord,
  ReportVisibility,
} from "@/types/project-report";

function mapSupabaseReport(row: {
  id: string;
  project_id: string;
  title: string;
  period_start: string;
  period_end: string;
  capital_allocated: number;
  costs_recorded: number;
  revenue_recorded: number;
  estimated_current_result: number;
  admin_notes: string | null;
  visibility?: string | null;
  published_at: string;
  created_by: string | null;
  created_at: string;
  projects?: { title: string } | { title: string }[] | null;
}): ProjectFinancialReportRecord {
  const project = Array.isArray(row.projects)
    ? row.projects[0]
    : row.projects;

  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: project?.title,
    title: row.title,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    capitalAllocated: Number(row.capital_allocated),
    costsRecorded: Number(row.costs_recorded),
    revenueRecorded: Number(row.revenue_recorded),
    estimatedCurrentResult: Number(row.estimated_current_result),
    adminNotes: row.admin_notes,
    visibility: normalizeReportVisibility(row.visibility ?? "investors_only"),
    publishedAt: row.published_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

async function fetchSupabaseReportsForProject(
  projectId: string
): Promise<ProjectFinancialReportRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_financial_reports")
    .select(
      `
      id,
      project_id,
      title,
      period_start,
      period_end,
      capital_allocated,
      costs_recorded,
      revenue_recorded,
      estimated_current_result,
      admin_notes,
      visibility,
      published_at,
      created_by,
      created_at,
      projects ( title )
    `
    )
    .eq("project_id", projectId)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseReport(row as Parameters<typeof mapSupabaseReport>[0])
  );
}

async function fetchSupabaseAllReports(): Promise<ProjectFinancialReportRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_financial_reports")
    .select(
      `
      id,
      project_id,
      title,
      period_start,
      period_end,
      capital_allocated,
      costs_recorded,
      revenue_recorded,
      estimated_current_result,
      admin_notes,
      visibility,
      published_at,
      created_by,
      created_at,
      projects ( title )
    `
    )
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseReport(row as Parameters<typeof mapSupabaseReport>[0])
  );
}

function filterReportsByVisibility(
  reports: ProjectFinancialReportRecord[],
  options: {
    isAdmin: boolean;
    hasAllocation: boolean;
    publicOnly?: boolean;
  }
): ProjectFinancialReportRecord[] {
  return reports.filter((report) => {
    if (options.isAdmin) return true;
    if (options.publicOnly) return report.visibility === "public";
    if (report.visibility === "public") return true;
    if (report.visibility === "investor_only" && options.hasAllocation) {
      return true;
    }
    return false;
  });
}

export async function getProjectFinancialReports(
  projectId: string,
  options: {
    viewerRole: "admin" | "investor" | "public";
    hasAllocation?: boolean;
  }
): Promise<ProjectFinancialReportRecord[]> {
  const isAdmin = options.viewerRole === "admin";
  const hasAllocation = options.hasAllocation ?? false;
  const publicOnly = options.viewerRole === "public";

  let reports: ProjectFinancialReportRecord[] = [];

  if (await shouldUseMockData()) {
    reports = await getMockFinancialReportsByProject(projectId);
  } else {
    try {
      const remote = await fetchSupabaseReportsForProject(projectId);
      reports =
        remote.length > 0
          ? remote
          : await getMockFinancialReportsByProject(projectId);
    } catch {
      reports = await getMockFinancialReportsByProject(projectId);
    }
  }

  return filterReportsByVisibility(reports, {
    isAdmin,
    hasAllocation,
    publicOnly,
  });
}

export async function getLatestFinancialReport(
  projectId: string,
  options: {
    viewerRole: "admin" | "investor" | "public";
    hasAllocation?: boolean;
  }
): Promise<ProjectFinancialReportRecord | null> {
  const reports = await getProjectFinancialReports(projectId, options);
  return reports[0] ?? null;
}

export async function getAllFinancialReports(): Promise<
  ProjectFinancialReportRecord[]
> {
  if (await shouldUseMockData()) {
    return (await getAllMockFinancialReports()).sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  try {
    const remote = await fetchSupabaseAllReports();
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  return (await getAllMockFinancialReports()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
