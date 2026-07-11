import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import {
  getAllMockProjectSettlements,
  getMockProjectSettlementByProject,
} from "@/lib/data/mock/project-settlement-store";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import {
  ProjectSettlementRecord,
  ProjectSettlementStatus,
} from "@/types/settlement";

function mapSupabaseRow(row: {
  id: string;
  project_id: string;
  total_verified_capital: number;
  total_revenue: number;
  total_costs: number;
  initial_fee_amount: number;
  success_fee_rate: number;
  success_fee_amount: number;
  net_result_before_success_fee: number;
  distributable_result: number;
  settlement_date?: string | null;
  admin_notes?: string | null;
  variance_reason?: string | null;
  finalized_at: string | null;
  finalized_by: string | null;
  created_at: string;
  updated_at: string;
  projects?: { title: string } | { title: string }[] | null;
}): ProjectSettlementRecord {
  const project = Array.isArray(row.projects)
    ? row.projects[0]
    : row.projects;

  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: project?.title,
    totalVerifiedCapital: Number(row.total_verified_capital),
    totalRevenue: Number(row.total_revenue),
    totalCosts: Number(row.total_costs),
    initialFeeAmount: Number(row.initial_fee_amount),
    successFeeRate: Number(row.success_fee_rate),
    successFeeAmount: Number(row.success_fee_amount),
    netResult: Number(row.net_result_before_success_fee),
    distributableAmount: Number(row.distributable_result),
    settlementDate:
      row.settlement_date ??
      (row.finalized_at ? row.finalized_at.split("T")[0] : row.created_at.split("T")[0]),
    adminNotes: row.admin_notes ?? row.variance_reason ?? null,
    status: row.finalized_at ? "finalized" : "draft",
    finalizedAt: row.finalized_at,
    createdBy: row.finalized_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchSupabaseSettlement(
  projectId: string
): Promise<ProjectSettlementRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_financial_results")
    .select(
      `
      id,
      project_id,
      total_verified_capital,
      total_revenue,
      total_costs,
      initial_fee_amount,
      success_fee_rate,
      success_fee_amount,
      net_result_before_success_fee,
      distributable_result,
      settlement_date,
      admin_notes,
      variance_reason,
      finalized_at,
      finalized_by,
      created_at,
      updated_at,
      projects ( title )
    `
    )
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return mapSupabaseRow(data as Parameters<typeof mapSupabaseRow>[0]);
}

async function fetchSupabaseAllSettlements(): Promise<ProjectSettlementRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_financial_results")
    .select(
      `
      id,
      project_id,
      total_verified_capital,
      total_revenue,
      total_costs,
      initial_fee_amount,
      success_fee_rate,
      success_fee_amount,
      net_result_before_success_fee,
      distributable_result,
      settlement_date,
      admin_notes,
      variance_reason,
      finalized_at,
      finalized_by,
      created_at,
      updated_at,
      projects ( title )
    `
    )
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseRow(row as Parameters<typeof mapSupabaseRow>[0])
  );
}

export async function getTotalVerifiedCapitalForProject(
  projectId: string
): Promise<number> {
  if (await shouldUseMockData()) {
    return getAllMockInvestments()
      .then((all) =>
        all
          .filter((i) => i.projectId === projectId && i.status === "active")
          .reduce((sum, i) => sum + i.verifiedAmount, 0)
      );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("investments")
      .select("verified_amount")
      .eq("project_id", projectId)
      .in("status", ["active", "settlement_pending"]);

    if (error || !data) {
      return getAllMockInvestments().then((all) =>
        all
          .filter((i) => i.projectId === projectId && i.status === "active")
          .reduce((sum, i) => sum + i.verifiedAmount, 0)
      );
    }

    return data.reduce((sum, row) => sum + Number(row.verified_amount), 0);
  } catch {
    return getAllMockInvestments().then((all) =>
      all
        .filter((i) => i.projectId === projectId && i.status === "active")
        .reduce((sum, i) => sum + i.verifiedAmount, 0)
    );
  }
}

export async function getProjectSettlement(
  projectId: string
): Promise<ProjectSettlementRecord | null> {
  if (await shouldUseMockData()) {
    return getMockProjectSettlementByProject(projectId);
  }

  try {
    const remote = await fetchSupabaseSettlement(projectId);
    if (remote) return remote;
  } catch {
    // fall through
  }

  return getMockProjectSettlementByProject(projectId);
}

export async function getProjectSettlementById(
  settlementId: string
): Promise<ProjectSettlementRecord | null> {
  const all = await getAllProjectSettlements();
  return all.find((s) => s.id === settlementId) ?? null;
}

export async function getAllProjectSettlements(): Promise<
  ProjectSettlementRecord[]
> {
  if (await shouldUseMockData()) {
    return (await getAllMockProjectSettlements()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  try {
    const remote = await fetchSupabaseAllSettlements();
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  return (await getAllMockProjectSettlements()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function isSettlementEditable(status: ProjectSettlementStatus): boolean {
  return status === "draft";
}

export { getMockProjectRowById };
