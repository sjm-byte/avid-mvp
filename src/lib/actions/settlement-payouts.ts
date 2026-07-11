"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getProjectSettlementById } from "@/lib/data/project-settlements";
import { getInvestorDistributionForSettlement } from "@/lib/data/settlement-distribution";
import { getSettlementPayout, saveSettlementPayout } from "@/lib/data/settlement-payouts";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import { InvestorSettlementPayoutRecord } from "@/types/settlement";

export type PayoutActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export interface MarkSettlementPayoutPaidInput {
  settlementId: string;
  investorId: string;
  paidAmount: number;
  paidDate: string;
  paymentReferenceNumber: string;
  adminNote?: string;
}

function revalidatePayoutPaths(projectSlug?: string) {
  revalidatePath("/admin/settlements");
  revalidatePath("/dashboard/investments");
  if (projectSlug) {
    revalidatePath(`/projects/${projectSlug}`);
  }
}

export async function markSettlementPayoutPaid(
  input: MarkSettlementPayoutPaidInput
): Promise<PayoutActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  const settlement = await getProjectSettlementById(input.settlementId);
  if (!settlement) {
    return { success: false, error: "تسویه یافت نشد." };
  }
  if (settlement.status !== "finalized") {
    return { success: false, error: "فقط برای تسویه‌های نهایی‌شده قابل ثبت است." };
  }

  const distribution = await getInvestorDistributionForSettlement(settlement);
  const investorRow = distribution.find((r) => r.investorId === input.investorId);
  if (!investorRow) {
    return { success: false, error: "سرمایه‌گذار در این تسویه یافت نشد." };
  }

  const existingPayout = await getSettlementPayout(
    input.settlementId,
    input.investorId
  );
  if (existingPayout) {
    return { success: false, error: "پرداخت این سرمایه‌گذار قبلاً ثبت شده است." };
  }

  if (!input.paidDate?.trim()) {
    return { success: false, error: "تاریخ پرداخت الزامی است." };
  }
  if (!Number.isFinite(input.paidAmount) || input.paidAmount <= 0) {
    return { success: false, error: "مبلغ پرداخت باید عدد معتبر و بیشتر از صفر باشد." };
  }
  if (!input.paymentReferenceNumber?.trim()) {
    return { success: false, error: "شماره پیگیری پرداخت الزامی است." };
  }

  const now = new Date().toISOString();
  const id = `mock-payout-${input.settlementId}-${input.investorId}`;

  const record: InvestorSettlementPayoutRecord = {
    id,
    settlementId: input.settlementId,
    projectId: settlement.projectId,
    investorId: input.investorId,
    investorName: investorRow.investorName,
    paidAmount: input.paidAmount,
    paidDate: input.paidDate,
    paymentReferenceNumber: input.paymentReferenceNumber.trim(),
    adminNote: input.adminNote?.trim() || null,
    recordedBy: user.id,
    recordedAt: now,
  };

  await saveSettlementPayout(record);

  const project = getMockProjectRowById(settlement.projectId);
  revalidatePayoutPaths(project?.slug);

  return { success: true, id };
}
