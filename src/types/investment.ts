import { InvestmentRequestStatus } from "@/types/database";

/** Sprint 03 UI statuses shown to investors */
export type InvestmentRequestUiStatus =
  | "submitted"
  | "under_review"
  | "approved_pending_payment"
  | "receipt_submitted"
  | "allocated"
  | "rejected"
  | "cancelled";

export const INVESTMENT_REQUEST_STATUS_LABELS: Record<
  InvestmentRequestUiStatus,
  string
> = {
  submitted: "ثبت‌شده — در انتظار بررسی",
  under_review: "در حال بررسی",
  approved_pending_payment: "تأیید شده — در انتظار واریز",
  receipt_submitted: "رسید ثبت‌شده — در انتظار بررسی",
  allocated: "تخصیص تأییدشده",
  rejected: "رد شده",
  cancelled: "لغو شده توسط سرمایه‌گذار",
};

export interface InvestmentRequestRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  investorId: string;
  requestedAmount: number;
  investorNote: string | null;
  status: InvestmentRequestUiStatus;
  dbStatus: InvestmentRequestStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorAllocation {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  investmentRequestId: string | null;
  receiptId: string | null;
  verifiedAmount: number;
  ownershipPercent: number | null;
  status: string;
  allocatedAt: string;
  projectStatus: string;
  expectedReturnBase: number | null;
}

export interface InvestorLedgerSummaryItem {
  id: string;
  projectTitle: string;
  entryType: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  principalAmount?: number | null;
  profitLossAmount?: number | null;
  finalReceivableAmount?: number | null;
  settlementDate?: string | null;
}

export interface InvestorDashboardData {
  requests: InvestmentRequestRecord[];
  allocations: InvestorAllocation[];
  ledgerSummary: InvestorLedgerSummaryItem[];
  stats: {
    totalVerifiedCapital: number;
    activeCapital: number;
    pendingRequests: number;
    pendingPaymentInstructions: number;
  };
}

export interface SubmitInvestmentRequestInput {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  minInvestment: number;
  requestedAmount: number;
  investorNote: string;
  riskAccepted: boolean;
  profitNotGuaranteedAccepted: boolean;
  paymentInstructionsAcknowledged: boolean;
  termsAccepted: boolean;
}

export function mapDbStatusToUi(
  status: InvestmentRequestStatus
): InvestmentRequestUiStatus {
  switch (status) {
    case "under_review":
      return "under_review";
    case "approved_pending_payment":
    case "payment_instructions_sent":
      return "approved_pending_payment";
    case "receipt_uploaded":
      return "receipt_submitted";
    case "payment_verified":
    case "allocated_to_project":
      return "allocated";
    case "approved_by_admin":
      return "under_review";
    case "rejected":
      return "rejected";
    case "cancelled":
    case "cancelled_by_investor":
      return "cancelled";
    case "submitted":
    case "draft":
    case "risk_accepted":
    default:
      return "submitted";
  }
}

export function mapUiStatusToDb(
  status: InvestmentRequestUiStatus
): InvestmentRequestStatus {
  switch (status) {
    case "submitted":
      return "submitted";
    case "under_review":
      return "under_review";
    case "approved_pending_payment":
      return "approved_pending_payment";
    case "receipt_submitted":
      return "receipt_uploaded";
    case "allocated":
      return "allocated_to_project";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
  }
}
