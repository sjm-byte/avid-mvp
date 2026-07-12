"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { MOCK_INVESTOR } from "@/lib/auth/mock";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import { saveMockInvestment } from "@/lib/data/mock/investment-store";
import { saveMockLedgerEntry } from "@/lib/data/mock/ledger-store";
import {
  InvestmentAllocationRecord,
  LedgerEntryRecord,
  buildCapitalAllocatedDescription,
} from "@/types/allocation";

export type ManualAllocationResult =
  | { success: true; allocationId: string }
  | { success: false; error: string };

export interface CreateManualAllocationInput {
  projectId: string;
  investorName: string;
  /** Optional link to demo/login investor; otherwise a new mock id is created. */
  investorId?: string | null;
  /** Amount in Rial (same unit as rest of app). */
  amountRial: number;
  adminNote?: string | null;
  linkToDemoInvestor?: boolean;
}

/**
 * Admin records a confirmed post-contract participation.
 * Money movement happened outside Avid; this is accounting/display only.
 */
export async function createManualAllocation(
  input: CreateManualAllocationInput
): Promise<ManualAllocationResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  const name = input.investorName.trim();
  if (!name) {
    return { success: false, error: "نام سرمایه‌گذار الزامی است." };
  }
  if (!Number.isFinite(input.amountRial) || input.amountRial <= 0) {
    return { success: false, error: "مبلغ مشارکت معتبر نیست." };
  }

  const project = getMockProjectRowById(input.projectId);
  if (!project) {
    return { success: false, error: "پروژه یافت نشد." };
  }

  if (!(await shouldUseMockData())) {
    return {
      success: false,
      error:
        "ثبت دستی مشارکت در این نسخه فقط در حالت نمایشی فعال است.",
    };
  }

  const now = new Date().toISOString();
  const investorId = input.linkToDemoInvestor
    ? MOCK_INVESTOR.id
    : input.investorId?.trim() || `mock-investor-${Date.now()}`;

  const maxRaise = Number(project.max_raise) || 0;
  const ownershipPercent =
    maxRaise > 0 ? input.amountRial / maxRaise : null;

  const allocationId = `mock-inv-${Date.now()}`;
  const allocation: InvestmentAllocationRecord = {
    id: allocationId,
    investorId,
    investorName: name,
    projectId: project.id,
    projectTitle: project.title,
    projectSlug: project.slug,
    investmentRequestId: null,
    receiptId: null,
    verifiedAmount: input.amountRial,
    ownershipPercent,
    status: "active",
    allocatedAt: now,
    projectStatus: project.status,
    expectedReturnBase: project.expected_return_base
      ? Number(project.expected_return_base)
      : null,
    adminNote: input.adminNote?.trim() || null,
  };

  const ledgerEntry: LedgerEntryRecord = {
    id: `mock-ledger-${Date.now()}`,
    investorId,
    investorName: name,
    projectId: project.id,
    projectTitle: project.title,
    investmentId: allocationId,
    receiptId: null,
    entryType: "capital_allocated",
    direction: "memo",
    amount: input.amountRial,
    description: buildCapitalAllocatedDescription(project.title),
    status: "posted",
    createdAt: now,
  };

  await saveMockInvestment(allocation);
  await saveMockLedgerEntry(ledgerEntry);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${project.slug}`);
  revalidatePath("/admin/investors");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/investments");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/ledger");

  return { success: true, allocationId };
}
