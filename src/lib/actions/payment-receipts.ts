"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { createClient } from "@/lib/supabase/server";
import {
  getAllMockInvestmentRequests,
  saveMockInvestmentRequest,
} from "@/lib/data/mock/investment-request-store";
import {
  getBlockingMockReceiptForRequest,
  getMockReceiptById,
  saveMockPaymentReceipt,
} from "@/lib/data/mock/receipt-store";
import { saveMockInvestment } from "@/lib/data/mock/investment-store";
import { saveMockLedgerEntry } from "@/lib/data/mock/ledger-store";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import {
  buildCapitalAllocatedDescription,
  InvestmentAllocationRecord,
  LedgerEntryRecord,
} from "@/types/allocation";
import { SubmitPaymentReceiptInput } from "@/types/receipt";
import { PaymentReceiptRecord } from "@/types/receipt";

export type ReceiptActionResult =
  | { success: true; receiptId: string }
  | { success: false; error: string };

function validateSubmission(input: SubmitPaymentReceiptInput): string | null {
  if (input.amountPaid <= 0) {
    return "مبلغ واریز باید بیشتر از صفر باشد.";
  }
  if (!input.paidAt?.trim()) {
    return "تاریخ واریز الزامی است.";
  }
  if (!input.trackingNumber?.trim()) {
    return "شماره پیگیری یا مرجع واریز الزامی است.";
  }
  return null;
}

export async function submitPaymentReceipt(
  input: SubmitPaymentReceiptInput
): Promise<ReceiptActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "investor") {
    return { success: false, error: "برای ثبت رسید باید وارد شوید." };
  }

  const validationError = validateSubmission(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  if (await shouldUseMockData()) {
    const allRequests = await getAllMockInvestmentRequests();
    const request = allRequests.find(
      (r) =>
        r.id === input.investmentRequestId && r.investorId === user.id
    );
    if (!request) {
      return { success: false, error: "درخواست مشارکت یافت نشد." };
    }
    if (request.status !== "approved_pending_payment") {
      return {
        success: false,
        error: "ثبت رسید فقط برای درخواست‌های تأییدشده امکان‌پذیر است.",
      };
    }

    const existing = await getBlockingMockReceiptForRequest(
      input.investmentRequestId
    );
    if (existing) {
      return {
        success: false,
        error: "رسید قبلاً برای این درخواست ثبت شده است.",
      };
    }

    const now = new Date().toISOString();
    const receipt: PaymentReceiptRecord = {
      id: `mock-receipt-${Date.now()}`,
      investmentRequestId: input.investmentRequestId,
      projectId: input.projectId,
      projectTitle: input.projectTitle,
      projectSlug: input.projectSlug,
      investorId: user.id,
      investorName: user.fullName,
      amount: input.amountPaid,
      paidAt: new Date(input.paidAt).toISOString(),
      trackingNumber: input.trackingNumber.trim(),
      investorNote: input.investorNote?.trim() || null,
      fileName: input.fileName?.trim() || null,
      status: "submitted",
      dbStatus: "pending",
      rejectionReason: null,
      createdAt: now,
    };

    await saveMockPaymentReceipt(receipt);
    await saveMockInvestmentRequest({
      ...request,
      status: "receipt_submitted",
      dbStatus: "receipt_uploaded",
      updatedAt: now,
    });

    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    revalidatePath("/admin/receipts");
    revalidatePath("/dashboard/ledger");
    revalidatePath(`/projects/${input.projectSlug}`);
    return { success: true, receiptId: receipt.id };
  }

  try {
    const supabase = await createClient();

    const { data: request, error: requestError } = await supabase
      .from("investment_requests")
      .select("id, status, investor_id")
      .eq("id", input.investmentRequestId)
      .eq("investor_id", user.id)
      .maybeSingle();

    if (requestError || !request) {
      return { success: false, error: "درخواست مشارکت یافت نشد." };
    }

    const allowedStatuses = [
      "approved_pending_payment",
      "payment_instructions_sent",
    ];
    if (!allowedStatuses.includes(request.status)) {
      return {
        success: false,
        error: "ثبت رسید فقط برای درخواست‌های تأییدشده امکان‌پذیر است.",
      };
    }

    const { data: existing } = await supabase
      .from("payment_receipts")
      .select("id, status")
      .eq("investment_request_id", input.investmentRequestId)
      .in("status", ["pending", "verified"]);

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: "رسید قبلاً برای این درخواست ثبت شده است.",
      };
    }

    const paidAtIso = new Date(input.paidAt).toISOString();
    const { data: receipt, error: receiptError } = await supabase
      .from("payment_receipts")
      .insert({
        investment_request_id: input.investmentRequestId,
        project_id: input.projectId,
        investor_id: user.id,
        amount: input.amountPaid,
        paid_at: paidAtIso,
        tracking_number: input.trackingNumber.trim(),
        source_account_info: input.investorNote?.trim() || null,
        file_path: input.fileName?.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (receiptError || !receipt) {
      return { success: false, error: "ثبت رسید ناموفق بود." };
    }

    const { error: updateError } = await supabase
      .from("investment_requests")
      .update({
        status: "receipt_uploaded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.investmentRequestId);

    if (updateError) {
      return { success: false, error: "به‌روزرسانی وضعیت درخواست ناموفق بود." };
    }

    revalidatePath("/dashboard/ledger");
    revalidatePath(`/projects/${input.projectSlug}`);
    return { success: true, receiptId: receipt.id };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}

function isReceiptActionable(status: PaymentReceiptRecord["status"]): boolean {
  return status === "submitted" || status === "under_review";
}

async function createAllocationFromReceipt(
  receipt: PaymentReceiptRecord
): Promise<{ investmentId: string }> {
  const now = new Date().toISOString();
  const project = getMockProjectRowById(receipt.projectId);
  const ownershipPercent =
    project && Number(project.max_raise) > 0
      ? receipt.amount / Number(project.max_raise)
      : null;

  const investmentId = `mock-inv-${Date.now()}`;

  const allocation: InvestmentAllocationRecord = {
    id: investmentId,
    investorId: receipt.investorId,
    projectId: receipt.projectId,
    projectTitle: receipt.projectTitle,
    projectSlug: receipt.projectSlug,
    investmentRequestId: receipt.investmentRequestId,
    receiptId: receipt.id,
    verifiedAmount: receipt.amount,
    ownershipPercent,
    status: "active",
    allocatedAt: now,
    projectStatus: project?.status ?? "in_execution",
    expectedReturnBase: project?.expected_return_base
      ? Number(project.expected_return_base)
      : null,
  };

  const ledgerEntry: LedgerEntryRecord = {
    id: `mock-ledger-${Date.now()}`,
    investorId: receipt.investorId,
    investorName: receipt.investorName,
    projectId: receipt.projectId,
    projectTitle: receipt.projectTitle,
    investmentId,
    receiptId: receipt.id,
    entryType: "capital_allocated",
    direction: "memo",
    amount: receipt.amount,
    description: buildCapitalAllocatedDescription(receipt.projectTitle),
    status: "posted",
    createdAt: now,
  };

  await saveMockInvestment(allocation);
  await saveMockLedgerEntry(ledgerEntry);

  return { investmentId };
}

export async function verifyPaymentReceipt(
  receiptId: string
): Promise<ReceiptActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (await shouldUseMockData()) {
    const receipt = await getMockReceiptById(receiptId);
    if (!receipt) {
      return { success: false, error: "رسید یافت نشد." };
    }
    if (!isReceiptActionable(receipt.status)) {
      return { success: false, error: "این رسید قابل تأیید نیست." };
    }

    const allRequests = await getAllMockInvestmentRequests();
    const request = allRequests.find((r) => r.id === receipt.investmentRequestId);
    if (!request) {
      return { success: false, error: "درخواست مشارکت یافت نشد." };
    }

    const allocationResult = await createAllocationFromReceipt(receipt);
    const now = new Date().toISOString();
    await saveMockPaymentReceipt({
      ...receipt,
      status: "verified",
      dbStatus: "verified",
    });
    await saveMockInvestmentRequest({
      ...request,
      status: "allocated",
      dbStatus: "allocated_to_project",
      updatedAt: now,
    });

    revalidatePath("/admin/receipts");
    revalidatePath("/admin/ledger");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ledger");
    revalidatePath(`/projects/${receipt.projectSlug}`);
    return { success: true, receiptId };
  }

  try {
    const supabase = await createClient();

    const { data: receipt, error: receiptError } = await supabase
      .from("payment_receipts")
      .select(
        `
        id,
        investment_request_id,
        project_id,
        investor_id,
        amount,
        status,
        projects ( title, slug, max_raise, status, expected_return_base )
      `
      )
      .eq("id", receiptId)
      .maybeSingle();

    if (receiptError || !receipt) {
      return { success: false, error: "رسید یافت نشد." };
    }

    if (receipt.status !== "pending") {
      return { success: false, error: "این رسید قابل تأیید نیست." };
    }

    const project = unwrapSupabaseRelation(
      receipt.projects as unknown as {
        title: string;
        slug: string;
        max_raise: number;
        status: string;
        expected_return_base: number | null;
      } | {
        title: string;
        slug: string;
        max_raise: number;
        status: string;
        expected_return_base: number | null;
      }[] | null
    );

    const maxRaise = project ? Number(project.max_raise) : 0;
    const ownershipPercent =
      maxRaise > 0 ? Number(receipt.amount) / maxRaise : null;

    const now = new Date().toISOString();

    const { data: investment, error: investmentError } = await supabase
      .from("investments")
      .insert({
        project_id: receipt.project_id,
        investor_id: receipt.investor_id,
        investment_request_id: receipt.investment_request_id,
        verified_amount: receipt.amount,
        ownership_percent: ownershipPercent,
        status: "active",
      })
      .select("id")
      .single();

    if (investmentError || !investment) {
      return { success: false, error: "ایجاد تخصیص ناموفق بود." };
    }

    const { error: ledgerError } = await supabase.from("ledger_entries").insert({
      project_id: receipt.project_id,
      investor_id: receipt.investor_id,
      investment_id: investment.id,
      entry_type: "capital_allocated",
      direction: "memo",
      amount: receipt.amount,
      description: buildCapitalAllocatedDescription(
        project?.title ?? "پروژه"
      ),
      reference_type: "payment_receipt",
      reference_id: receipt.id,
      status: "posted",
      created_by: user.id,
    });

    if (ledgerError) {
      return { success: false, error: "ثبت حسابداری ناموفق بود." };
    }

    const { error: receiptUpdateError } = await supabase
      .from("payment_receipts")
      .update({
        status: "verified",
        verified_by: user.id,
        verified_at: now,
      })
      .eq("id", receiptId);

    if (receiptUpdateError) {
      return { success: false, error: "به‌روزرسانی رسید ناموفق بود." };
    }

    const { error: requestUpdateError } = await supabase
      .from("investment_requests")
      .update({
        status: "allocated_to_project",
        approved_amount: receipt.amount,
        updated_at: now,
      })
      .eq("id", receipt.investment_request_id);

    if (requestUpdateError) {
      return { success: false, error: "به‌روزرسانی درخواست ناموفق بود." };
    }

    revalidatePath("/admin/receipts");
    revalidatePath("/admin/ledger");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ledger");
    if (project?.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }
    return { success: true, receiptId };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}

export async function rejectPaymentReceipt(
  receiptId: string,
  rejectionReason?: string
): Promise<ReceiptActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (await shouldUseMockData()) {
    const receipt = await getMockReceiptById(receiptId);
    if (!receipt) {
      return { success: false, error: "رسید یافت نشد." };
    }
    if (!isReceiptActionable(receipt.status)) {
      return { success: false, error: "این رسید قابل رد نیست." };
    }

    const allRequests = await getAllMockInvestmentRequests();
    const request = allRequests.find((r) => r.id === receipt.investmentRequestId);
    if (!request) {
      return { success: false, error: "درخواست مشارکت یافت نشد." };
    }

    const now = new Date().toISOString();
    await saveMockPaymentReceipt({
      ...receipt,
      status: "rejected",
      dbStatus: "rejected",
      rejectionReason: rejectionReason?.trim() || null,
    });
    await saveMockInvestmentRequest({
      ...request,
      status: "approved_pending_payment",
      dbStatus: "payment_instructions_sent",
      updatedAt: now,
    });

    revalidatePath("/admin/receipts");
    revalidatePath("/admin/ledger");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    revalidatePath(`/projects/${receipt.projectSlug}`);
    return { success: true, receiptId };
  }

  try {
    const supabase = await createClient();

    const { data: receipt, error: receiptError } = await supabase
      .from("payment_receipts")
      .select("id, status, investment_request_id, projects ( slug )")
      .eq("id", receiptId)
      .maybeSingle();

    if (receiptError || !receipt) {
      return { success: false, error: "رسید یافت نشد." };
    }

    if (receipt.status !== "pending") {
      return { success: false, error: "این رسید قابل رد نیست." };
    }

    const now = new Date().toISOString();

    const { error: receiptUpdateError } = await supabase
      .from("payment_receipts")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason?.trim() || null,
        verified_by: user.id,
        verified_at: now,
      })
      .eq("id", receiptId);

    if (receiptUpdateError) {
      return { success: false, error: "رد رسید ناموفق بود." };
    }

    const { error: requestUpdateError } = await supabase
      .from("investment_requests")
      .update({
        status: "payment_instructions_sent",
        updated_at: now,
      })
      .eq("id", receipt.investment_request_id);

    if (requestUpdateError) {
      return { success: false, error: "به‌روزرسانی درخواست ناموفق بود." };
    }

    const project = unwrapSupabaseRelation(
      receipt.projects as unknown as
        | { slug: string }
        | { slug: string }[]
        | null
    );

    revalidatePath("/admin/receipts");
    revalidatePath("/admin/ledger");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    if (project?.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }
    return { success: true, receiptId };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}

function unwrapSupabaseRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
