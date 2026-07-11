"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { createClient } from "@/lib/supabase/server";
import {
  findMockPendingRequest,
  getAllMockInvestmentRequests,
  saveMockInvestmentRequest,
} from "@/lib/data/mock/investment-request-store";
import {
  InvestmentRequestRecord,
  InvestmentRequestUiStatus,
  SubmitInvestmentRequestInput,
  mapDbStatusToUi,
  mapUiStatusToDb,
} from "@/types/investment";
import { InvestmentRequestStatus } from "@/types/database";

export type ActionResult =
  | { success: true; requestId: string }
  | { success: false; error: string };

function validateSubmission(input: SubmitInvestmentRequestInput): string | null {
  if (!input.riskAccepted) {
    return "پذیرش هشدار ریسک الزامی است.";
  }
  if (!input.profitNotGuaranteedAccepted) {
    return "تأیید می‌کنید که بازده پیش‌بینی‌شده سناریو است و همان نتیجه واقعی پروژه نیست.";
  }
  if (!input.paymentInstructionsAcknowledged) {
    return "تأیید می‌کنید که اطلاعات واریز پس از بررسی آوید ارسال می‌شود.";
  }
  if (!input.termsAccepted) {
    return "پذیرش شرایط پروژه الزامی است.";
  }
  if (input.requestedAmount < input.minInvestment) {
    return `حداقل مبلغ مشارکت ${Math.round(input.minInvestment / 10).toLocaleString("fa-IR")} تومان است.`;
  }
  if (input.requestedAmount <= 0) {
    return "مبلغ مشارکت باید بیشتر از صفر باشد.";
  }
  return null;
}

export async function submitInvestmentRequest(
  input: SubmitInvestmentRequestInput
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "investor") {
    return { success: false, error: "برای ثبت درخواست باید وارد شوید." };
  }

  const validationError = validateSubmission(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  if (await shouldUseMockData()) {
    const existing = await findMockPendingRequest(user.id, input.projectId);
    if (existing) {
      return {
        success: false,
        error: "درخواست فعالی برای این پروژه دارید.",
      };
    }

    const now = new Date().toISOString();
    const record: InvestmentRequestRecord = {
      id: `mock-req-${Date.now()}`,
      projectId: input.projectId,
      projectTitle: input.projectTitle,
      projectSlug: input.projectSlug,
      investorId: user.id,
      requestedAmount: input.requestedAmount,
      investorNote: input.investorNote || null,
      status: "submitted",
      dbStatus: "submitted",
      adminNote: null,
      createdAt: now,
      updatedAt: now,
    };

    await saveMockInvestmentRequest(record);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/investments");
    revalidatePath(`/projects/${input.projectSlug}`);
    return { success: true, requestId: record.id };
  }

  try {
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("investment_requests")
      .select("id, status")
      .eq("project_id", input.projectId)
      .eq("investor_id", user.id)
      .not("status", "in", '("rejected","cancelled","cancelled_by_investor")')
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: "درخواست فعالی برای این پروژه دارید.",
      };
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("investment_requests")
      .insert({
        project_id: input.projectId,
        investor_id: user.id,
        requested_amount: input.requestedAmount,
        investor_note: input.investorNote || null,
        status: "submitted" satisfies InvestmentRequestStatus,
        risk_accepted_at: now,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "ثبت درخواست ناموفق بود." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/investments");
    revalidatePath(`/projects/${input.projectSlug}`);
    return { success: true, requestId: data.id };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}

export async function cancelInvestmentRequest(
  requestId: string
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (await shouldUseMockData()) {
    const all = await getAllMockInvestmentRequests();
    const request = all.find(
      (r) => r.id === requestId && r.investorId === user.id
    );
    if (!request) {
      return { success: false, error: "درخواست یافت نشد." };
    }
    if (!["submitted", "under_review"].includes(request.status)) {
      return { success: false, error: "این درخواست قابل لغو نیست." };
    }

    await saveMockInvestmentRequest({
      ...request,
      status: "cancelled",
      dbStatus: "cancelled_by_investor",
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/investments");
    return { success: true, requestId };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("investment_requests")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("investor_id", user.id)
      .in("status", ["submitted", "under_review", "risk_accepted", "draft", "approved_by_admin"]);

    if (error) {
      return { success: false, error: "لغو درخواست ناموفق بود." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/investments");
    return { success: true, requestId };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}

export async function updateInvestmentRequestStatus(
  requestId: string,
  status: InvestmentRequestUiStatus,
  adminNote?: string
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (await shouldUseMockData()) {
    const all = await getAllMockInvestmentRequests();
    const request = all.find((r) => r.id === requestId);
    if (!request) {
      return { success: false, error: "درخواست یافت نشد." };
    }

    const dbStatus =
      status === "approved_pending_payment"
        ? ("payment_instructions_sent" satisfies InvestmentRequestStatus)
        : mapUiStatusToDb(status);

    await saveMockInvestmentRequest({
      ...request,
      status,
      dbStatus,
      adminNote: adminNote ?? request.adminNote,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/admin/requests");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    revalidatePath(`/projects/${request.projectSlug}`);
    return { success: true, requestId };
  }

  try {
    const supabase = await createClient();
    const dbStatus =
      status === "approved_pending_payment"
        ? ("payment_instructions_sent" satisfies InvestmentRequestStatus)
        : mapUiStatusToDb(status);

    const { data: requestRow } = await supabase
      .from("investment_requests")
      .select("projects ( slug )")
      .eq("id", requestId)
      .maybeSingle();

    const { error } = await supabase
      .from("investment_requests")
      .update({
        status: dbStatus,
        admin_note: adminNote ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      return { success: false, error: "به‌روزرسانی وضعیت ناموفق بود." };
    }

    revalidatePath("/admin/requests");
    revalidatePath("/dashboard/investments");
    revalidatePath("/dashboard");
    const projectSlug = (
      requestRow?.projects as { slug: string } | { slug: string }[] | null
    );
    const slug = Array.isArray(projectSlug)
      ? projectSlug[0]?.slug
      : projectSlug?.slug;
    if (slug) {
      revalidatePath(`/projects/${slug}`);
    }
    return { success: true, requestId };
  } catch {
    return { success: false, error: "خطا در اتصال به سرور." };
  }
}
