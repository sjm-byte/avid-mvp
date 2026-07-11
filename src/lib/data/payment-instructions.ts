import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import { InvestmentRequestRecord } from "@/types/investment";
import {
  PaymentInstructionsContext,
  ProjectPaymentInstructions,
} from "@/types/payment";
import { ProjectRow } from "@/types/database";

const PAYMENT_DEADLINE_DAYS = 7;

const PLACEHOLDER_INSTRUCTIONS: Omit<
  ProjectPaymentInstructions,
  "paymentDeadline"
> = {
  accountHolder: "— (در انتظار تعیین توسط پروژه)",
  bankName: "—",
  accountNumberOrIban: "—",
  instructionNote:
    "اطلاعات حساب مقصد توسط تیم آوید پس از تأیید درخواست تکمیل می‌شود.",
};

function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function mapProjectRowToInstructions(
  project: Pick<
    ProjectRow,
    | "destination_account_owner"
    | "destination_bank_name"
    | "destination_iban"
    | "payment_instructions"
  >,
  context: PaymentInstructionsContext
): ProjectPaymentInstructions {
  const hasAccountDetails =
    !!project.destination_account_owner &&
    !!project.destination_bank_name &&
    !!project.destination_iban;

  const base = hasAccountDetails
    ? {
        accountHolder: project.destination_account_owner!,
        bankName: project.destination_bank_name!,
        accountNumberOrIban: project.destination_iban!,
        instructionNote:
          project.payment_instructions ??
          "مبلغ را با ذکر شناسه درخواست در توضیحات واریز ثبت کنید.",
      }
    : PLACEHOLDER_INSTRUCTIONS;

  return {
    ...base,
    paymentDeadline: addDays(context.approvedAt, PAYMENT_DEADLINE_DAYS),
  };
}

async function fetchSupabaseProjectPaymentFields(
  projectId: string
): Promise<Pick<
  ProjectRow,
  | "destination_account_owner"
  | "destination_bank_name"
  | "destination_iban"
  | "payment_instructions"
> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "destination_account_owner, destination_bank_name, destination_iban, payment_instructions"
    )
    .eq("id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Pick<
    ProjectRow,
    | "destination_account_owner"
    | "destination_bank_name"
    | "destination_iban"
    | "payment_instructions"
  >;
}

export async function getProjectPaymentInstructions(
  projectId: string,
  context: PaymentInstructionsContext
): Promise<ProjectPaymentInstructions> {
  if (!isSupabaseConfigured()) {
    const project = getMockProjectRowById(projectId);
    if (!project) {
      return {
        ...PLACEHOLDER_INSTRUCTIONS,
        paymentDeadline: addDays(context.approvedAt, PAYMENT_DEADLINE_DAYS),
      };
    }
    return mapProjectRowToInstructions(project, context);
  }

  try {
    const fields = await fetchSupabaseProjectPaymentFields(projectId);
    if (!fields) {
      const project = getMockProjectRowById(projectId);
      if (project) {
        return mapProjectRowToInstructions(project, context);
      }
      return {
        ...PLACEHOLDER_INSTRUCTIONS,
        paymentDeadline: addDays(context.approvedAt, PAYMENT_DEADLINE_DAYS),
      };
    }
    return mapProjectRowToInstructions(fields, context);
  } catch {
    const project = getMockProjectRowById(projectId);
    if (project) {
      return mapProjectRowToInstructions(project, context);
    }
    return {
      ...PLACEHOLDER_INSTRUCTIONS,
      paymentDeadline: addDays(context.approvedAt, PAYMENT_DEADLINE_DAYS),
    };
  }
}

export async function getPaymentInstructionsForRequests(
  requests: InvestmentRequestRecord[]
): Promise<Record<string, ProjectPaymentInstructions>> {
  const approved = requests.filter(
    (r) => r.status === "approved_pending_payment"
  );
  if (approved.length === 0) return {};

  const entries = await Promise.all(
    approved.map(async (request) => {
      const instructions = await getProjectPaymentInstructions(
        request.projectId,
        {
          requestedAmount: request.requestedAmount,
          approvedAt: request.updatedAt,
        }
      );
      return [request.id, instructions] as const;
    })
  );

  return Object.fromEntries(entries);
}
