/** DB statuses in payment_receipts table */
export type PaymentReceiptDbStatus = "pending" | "verified" | "rejected";

/** Sprint 04 UI statuses shown to investors and admins */
export type PaymentReceiptUiStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected";

export const PAYMENT_RECEIPT_STATUS_LABELS: Record<
  PaymentReceiptUiStatus,
  string
> = {
  submitted: "ثبت‌شده — در انتظار بررسی",
  under_review: "در حال بررسی",
  verified: "تأیید شده",
  rejected: "رد شده",
};

export interface PaymentReceiptRecord {
  id: string;
  investmentRequestId: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  investorId: string;
  investorName: string | null;
  amount: number;
  paidAt: string;
  trackingNumber: string;
  investorNote: string | null;
  fileName: string | null;
  status: PaymentReceiptUiStatus;
  dbStatus: PaymentReceiptDbStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface SubmitPaymentReceiptInput {
  investmentRequestId: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  amountPaid: number;
  paidAt: string;
  trackingNumber: string;
  investorNote: string;
  fileName: string;
}

export function mapReceiptDbStatusToUi(
  status: PaymentReceiptDbStatus,
  options?: { underReview?: boolean }
): PaymentReceiptUiStatus {
  if (status === "verified") return "verified";
  if (status === "rejected") return "rejected";
  if (options?.underReview) return "under_review";
  return "submitted";
}

export function mapReceiptUiStatusToDb(
  status: PaymentReceiptUiStatus
): PaymentReceiptDbStatus {
  switch (status) {
    case "verified":
      return "verified";
    case "rejected":
      return "rejected";
    case "submitted":
    case "under_review":
    default:
      return "pending";
  }
}
