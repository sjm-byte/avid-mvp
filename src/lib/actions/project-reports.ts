"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { saveMockProjectUpdate } from "@/lib/data/mock/update-store";
import { saveMockFinancialReport } from "@/lib/data/mock/financial-report-store";
import { saveMockMilestone } from "@/lib/data/mock/milestone-store";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import { createClient } from "@/lib/supabase/server";
import {
  MilestoneUiStatus,
  ProjectFinancialReportRecord,
  ProjectMilestoneRecord,
  ProjectUpdateRecord,
  ProjectUpdateStatus,
  ReportVisibility,
  toDbReportVisibility,
  mapUiMilestoneStatusToDb,
} from "@/types/project-report";

export type ReportActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export interface CreateProjectUpdateInput {
  projectId: string;
  title: string;
  summary: string;
  detailedNote?: string;
  status: ProjectUpdateStatus;
  visibility: ReportVisibility;
  publishedAt: string;
}

export interface CreateFinancialReportInput {
  projectId: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  capitalAllocated: number;
  costsRecorded: number;
  revenueRecorded: number;
  estimatedCurrentResult: number;
  adminNotes?: string;
  visibility: ReportVisibility;
  publishedAt: string;
}

export interface CreateMilestoneInput {
  projectId: string;
  title: string;
  description?: string;
  plannedDate?: string;
  status: MilestoneUiStatus;
  sortOrder: number;
}

function revalidateReportPaths(projectSlug?: string) {
  revalidatePath("/admin/reports");
  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/investments");
  if (projectSlug) {
    revalidatePath(`/projects/${projectSlug}`);
    revalidatePath(`/dashboard/projects/${projectSlug}`);
  }
}

export async function createProjectUpdate(
  input: CreateProjectUpdateInput
): Promise<ReportActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!input.title.trim() || !input.summary.trim()) {
    return { success: false, error: "عنوان و خلاصه الزامی است." };
  }

  const project = getMockProjectRowById(input.projectId);
  const now = new Date().toISOString();
  const id = `mock-update-${Date.now()}`;

  const record: ProjectUpdateRecord = {
    id,
    projectId: input.projectId,
    projectTitle: project?.title,
    title: input.title.trim(),
    summary: input.summary.trim(),
    detailedNote: input.detailedNote?.trim() || null,
    updateType: "general",
    operationalStatus: input.status,
    visibility: input.visibility,
    publishedAt: new Date(input.publishedAt).toISOString(),
    createdBy: user.id,
    createdAt: now,
  };

  if (await shouldUseMockData()) {
    await saveMockProjectUpdate(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_updates")
      .insert({
        project_id: input.projectId,
        title: record.title,
        summary: record.summary,
        body: record.detailedNote ?? record.summary,
        update_type: "general",
        operational_status: input.status,
        visibility: toDbReportVisibility(input.visibility),
        published_at: record.publishedAt,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "ثبت گزارش ناموفق بود." };
    }

    revalidateReportPaths(project?.slug);
    return { success: true, id: data.id };
  } catch {
    await saveMockProjectUpdate(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }
}

export async function createFinancialReport(
  input: CreateFinancialReportInput
): Promise<ReportActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!input.title.trim()) {
    return { success: false, error: "عنوان گزارش الزامی است." };
  }

  const project = getMockProjectRowById(input.projectId);
  const now = new Date().toISOString();
  const id = `mock-freport-${Date.now()}`;

  const record: ProjectFinancialReportRecord = {
    id,
    projectId: input.projectId,
    projectTitle: project?.title,
    title: input.title.trim(),
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    capitalAllocated: input.capitalAllocated,
    costsRecorded: input.costsRecorded,
    revenueRecorded: input.revenueRecorded,
    estimatedCurrentResult: input.estimatedCurrentResult,
    adminNotes: input.adminNotes?.trim() || null,
    visibility: input.visibility,
    publishedAt: new Date(input.publishedAt).toISOString(),
    createdBy: user.id,
    createdAt: now,
  };

  if (await shouldUseMockData()) {
    await saveMockFinancialReport(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_financial_reports")
      .insert({
        project_id: input.projectId,
        title: record.title,
        period_start: input.periodStart,
        period_end: input.periodEnd,
        capital_allocated: input.capitalAllocated,
        costs_recorded: input.costsRecorded,
        revenue_recorded: input.revenueRecorded,
        estimated_current_result: input.estimatedCurrentResult,
        admin_notes: record.adminNotes,
        visibility: toDbReportVisibility(input.visibility),
        published_at: record.publishedAt,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "ثبت گزارش مالی ناموفق بود." };
    }

    revalidateReportPaths(project?.slug);
    return { success: true, id: data.id };
  } catch {
    await saveMockFinancialReport(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }
}

export async function createProjectMilestone(
  input: CreateMilestoneInput
): Promise<ReportActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!input.title.trim()) {
    return { success: false, error: "عنوان مرحله الزامی است." };
  }

  const project = getMockProjectRowById(input.projectId);
  const now = new Date().toISOString();
  const id = `mock-milestone-${Date.now()}`;

  const record: ProjectMilestoneRecord = {
    id,
    projectId: input.projectId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    plannedDate: input.plannedDate || null,
    actualDate: input.status === "completed" ? now.split("T")[0] : null,
    status: input.status,
    sortOrder: input.sortOrder,
    createdAt: now,
  };

  if (await shouldUseMockData()) {
    await saveMockMilestone(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_milestones")
      .insert({
        project_id: input.projectId,
        title: record.title,
        description: record.description,
        planned_date: record.plannedDate,
        actual_date: record.actualDate,
        status: mapUiMilestoneStatusToDb(input.status),
        sort_order: input.sortOrder,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "ثبت مرحله ناموفق بود." };
    }

    revalidateReportPaths(project?.slug);
    return { success: true, id: data.id };
  } catch {
    await saveMockMilestone(record);
    revalidateReportPaths(project?.slug);
    return { success: true, id };
  }
}
