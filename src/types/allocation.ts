export type InvestmentAllocationStatus =
  | "active"
  | "settlement_pending"
  | "settled"
  | "cancelled";

export interface InvestmentAllocationRecord {
  id: string;
  investorId: string;
  /** Display name entered by admin after contract (outside-platform flow). */
  investorName: string | null;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  /** Optional — legacy request/receipt flow; null for manager-entered records. */
  investmentRequestId: string | null;
  receiptId: string | null;
  verifiedAmount: number;
  ownershipPercent: number | null;
  status: InvestmentAllocationStatus;
  allocatedAt: string;
  projectStatus: string;
  expectedReturnBase: number | null;
  /** Optional admin note after contract confirmation. */
  adminNote: string | null;
}

export interface AdminInvestorSummary {
  investorId: string;
  investorName: string;
  totalAllocated: number;
  projectCount: number;
  allocations: Array<{
    projectId: string;
    projectTitle: string;
    projectSlug: string;
    amount: number;
    allocatedAt: string;
  }>;
}

export interface ProjectInvestorRow {
  allocationId: string;
  investorId: string;
  investorName: string;
  amount: number;
  allocatedAt: string;
  ownershipPercent: number | null;
  adminNote: string | null;
}

export interface LedgerEntryRecord {
  id: string;
  investorId: string;
  investorName: string | null;
  projectId: string;
  projectTitle: string;
  investmentId: string | null;
  receiptId: string | null;
  entryType: string;
  direction: "debit" | "credit" | "memo";
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  principalAmount?: number | null;
  profitLossAmount?: number | null;
  finalReceivableAmount?: number | null;
  settlementDate?: string | null;
}

export const SETTLEMENT_RESULT_LEDGER_DESCRIPTION =
  "ثبت حسابداری نتیجه واقعی پروژه است؛ پرداخت دستی ثبت‌شده خارج از سامانه است و وجهی نزد آوید نگهداری نمی‌شود.";

export const LEDGER_ACCOUNTING_DISCLAIMER =
  "ثبت حسابداری — وجهی نزد آوید نگهداری نمی‌شود.";

export function buildCapitalAllocatedDescription(projectTitle: string): string {
  return `ثبت حسابداری تخصیص سرمایه در پروژه «${projectTitle}» — ${LEDGER_ACCOUNTING_DISCLAIMER} آوید وجهی دریافت نکرده است.`;
}
