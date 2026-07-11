"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { saveMockProjectSettlement } from "@/lib/data/mock/project-settlement-store";
import { getProjectSettlement, getProjectSettlementById } from "@/lib/data/project-settlements";
import { createSettlementResultLedgerEntries } from "@/lib/data/settlement-ledger";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import { createClient } from "@/lib/supabase/server";
import {
  calculateSettlementFigures,
  ProjectSettlementRecord,
} from "@/types/settlement";

export type SettlementActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export interface SaveProjectSettlementDraftInput {
  projectId: string;
  totalVerifiedCapital: number;
  totalRevenue: number;
  totalCosts: number;
  initialFeeAmount: number;
  successFeeRatePercent: number;
  successFeeAmountOverride?: number | null;
  settlementDate: string;
  adminNotes?: string;
}

function revalidateSettlementPaths(projectSlug?: string) {
  revalidatePath("/admin/settlements");
  revalidatePath("/admin/projects");
  revalidatePath("/dashboard/investments");
  revalidatePath("/dashboard/ledger");
  if (projectSlug) {
    revalidatePath(`/projects/${projectSlug}`);
    revalidatePath("/transparency");
  }
}

export async function saveProjectSettlementDraft(
  input: SaveProjectSettlementDraftInput
): Promise<SettlementActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!input.projectId?.trim()) {
    return { success: false, error: "انتخاب پروژه الزامی است." };
  }

  if (!input.settlementDate?.trim()) {
    return { success: false, error: "تاریخ تسویه الزامی است." };
  }

  const numericFields: { value: number; label: string }[] = [
    { value: input.totalVerifiedCapital, label: "سرمایه تخصیص‌یافته" },
    { value: input.totalRevenue, label: "کل درآمد" },
    { value: input.totalCosts, label: "کل هزینه‌ها" },
    { value: input.initialFeeAmount, label: "کارمزد اولیه آوید" },
    { value: input.successFeeRatePercent, label: "درصد کارمزد موفقیت" },
  ];

  for (const field of numericFields) {
    if (!Number.isFinite(field.value) || field.value < 0) {
      return {
        success: false,
        error: `مقدار «${field.label}» باید عدد معتبر و غیرمنفی باشد.`,
      };
    }
  }

  if (
    input.successFeeAmountOverride != null &&
    (!Number.isFinite(input.successFeeAmountOverride) ||
      input.successFeeAmountOverride < 0)
  ) {
    return {
      success: false,
      error: "مبلغ کارمزد موفقیت باید عدد معتبر و غیرمنفی باشد.",
    };
  }

  const existing = await getProjectSettlement(input.projectId);
  if (existing?.status === "finalized") {
    return {
      success: false,
      error: "تسویه این پروژه قبلاً نهایی شده و قابل ویرایش نیست.",
    };
  }

  const project = getMockProjectRowById(input.projectId);
  const successFeeRate = input.successFeeRatePercent / 100;
  const calculated = calculateSettlementFigures({
    totalRevenue: input.totalRevenue,
    totalCosts: input.totalCosts,
    initialFeeAmount: input.initialFeeAmount,
    successFeeRate,
    successFeeAmountOverride: input.successFeeAmountOverride,
  });

  const now = new Date().toISOString();
  const id = existing?.id ?? `mock-settlement-${Date.now()}`;

  const record: ProjectSettlementRecord = {
    id,
    projectId: input.projectId,
    projectTitle: project?.title,
    totalVerifiedCapital: input.totalVerifiedCapital,
    totalRevenue: input.totalRevenue,
    totalCosts: input.totalCosts,
    initialFeeAmount: input.initialFeeAmount,
    successFeeRate,
    successFeeAmount: calculated.successFeeAmount,
    netResult: calculated.netResult,
    distributableAmount: calculated.distributableAmount,
    settlementDate: input.settlementDate,
    adminNotes: input.adminNotes?.trim() || null,
    status: "draft",
    finalizedAt: null,
    createdBy: user.id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  if (await shouldUseMockData()) {
    await saveMockProjectSettlement(record);
    revalidateSettlementPaths(project?.slug);
    return { success: true, id };
  }

  try {
    const supabase = await createClient();
    const payload = {
      project_id: input.projectId,
      total_verified_capital: record.totalVerifiedCapital,
      total_revenue: record.totalRevenue,
      total_costs: record.totalCosts,
      initial_fee_amount: record.initialFeeAmount,
      success_fee_rate: record.successFeeRate,
      success_fee_amount: record.successFeeAmount,
      net_result_before_success_fee: record.netResult,
      distributable_result: record.distributableAmount,
      settlement_date: record.settlementDate,
      admin_notes: record.adminNotes,
      finalized_at: null,
      finalized_by: null,
      updated_at: now,
    };

    if (existing) {
      const { error } = await supabase
        .from("project_financial_results")
        .update(payload)
        .eq("project_id", input.projectId)
        .is("finalized_at", null);

      if (error) {
        return { success: false, error: "به‌روزرسانی پیش‌نویس تسویه ناموفق بود." };
      }
    } else {
      const { data, error } = await supabase
        .from("project_financial_results")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        return { success: false, error: "ثبت پیش‌نویس تسویه ناموفق بود." };
      }
      record.id = data.id;
    }

    revalidateSettlementPaths(project?.slug);
    return { success: true, id: record.id };
  } catch {
    await saveMockProjectSettlement(record);
    revalidateSettlementPaths(project?.slug);
    return { success: true, id };
  }
}

export async function finalizeProjectSettlement(
  settlementId: string
): Promise<SettlementActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!settlementId?.trim()) {
    return { success: false, error: "شناسه تسویه نامعتبر است." };
  }

  const existing = await getProjectSettlementById(settlementId);
  if (!existing) {
    return { success: false, error: "تسویه یافت نشد." };
  }

  if (existing.status === "finalized") {
    return { success: false, error: "این تسویه قبلاً نهایی شده است." };
  }

  const project = getMockProjectRowById(existing.projectId);
  const now = new Date().toISOString();
  const record: ProjectSettlementRecord = {
    ...existing,
    status: "finalized",
    finalizedAt: now,
    updatedAt: now,
  };

  if (await shouldUseMockData()) {
    await saveMockProjectSettlement(record);
    await createSettlementResultLedgerEntries(record, user.id);
    revalidateSettlementPaths(project?.slug);
    return { success: true, id: settlementId };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("project_financial_results")
      .update({
        finalized_at: now,
        finalized_by: user.id,
        updated_at: now,
      })
      .eq("id", settlementId)
      .is("finalized_at", null);

    if (error) {
      return { success: false, error: "نهایی‌سازی تسویه ناموفق بود." };
    }

    await createSettlementResultLedgerEntries(record, user.id);
    revalidateSettlementPaths(project?.slug);
    return { success: true, id: settlementId };
  } catch {
    await saveMockProjectSettlement(record);
    await createSettlementResultLedgerEntries(record, user.id);
    revalidateSettlementPaths(project?.slug);
    return { success: true, id: settlementId };
  }
}
