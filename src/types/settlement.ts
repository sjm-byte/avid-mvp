export type ProjectSettlementStatus = "draft" | "finalized";

export interface ProjectSettlementRecord {
  id: string;
  projectId: string;
  projectTitle?: string;
  totalVerifiedCapital: number;
  totalRevenue: number;
  totalCosts: number;
  initialFeeAmount: number;
  successFeeRate: number;
  successFeeAmount: number;
  netResult: number;
  distributableAmount: number;
  settlementDate: string;
  adminNotes: string | null;
  status: ProjectSettlementStatus;
  finalizedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementCalculationInput {
  totalRevenue: number;
  totalCosts: number;
  initialFeeAmount: number;
  successFeeRate: number;
  successFeeAmountOverride?: number | null;
}

export interface SettlementCalculationResult {
  netResult: number;
  successFeeAmount: number;
  distributableAmount: number;
}

export interface SettlementAllocationInput {
  investorId: string;
  investorName: string;
  allocatedAmount: number;
}

export interface InvestorSettlementDistributionRow {
  investorId: string;
  investorName: string;
  allocatedAmount: number;
  shareRatio: number;
  principalAmount: number;
  profitLossShare: number;
  finalAmount: number;
}

export const SETTLEMENT_DISTRIBUTION_DISCLAIMER =
  "این جدول صرفاً پیش‌نمایش محاسبه تسویه است و به معنی پرداخت انجام‌شده یا نگهداری وجه نزد آوید نیست.";

export const SETTLEMENT_SAVE_DISCLAIMER =
  "این ثبت تسویه فقط ثبت حسابداری است؛ پرداخت دستی ثبت‌شده خارج از سامانه گزارش می‌شود و وجهی نزد آوید نگهداری نمی‌شود.";

export const SETTLEMENT_FORM_DISCLAIMER =
  "این محاسبات نهایی پس از بررسی مالی پروژه ثبت می‌شود و بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه نیست. " +
  SETTLEMENT_SAVE_DISCLAIMER;

export const SETTLEMENT_STATUS_LABELS: Record<ProjectSettlementStatus, string> = {
  draft: "پیش‌نویس",
  finalized: "نهایی‌شده",
};

export type InvestorSettlementPayoutStatus =
  | "pending_manual_payout"
  | "paid_manually";

export interface InvestorSettlementPayoutRecord {
  id: string;
  settlementId: string;
  projectId: string;
  investorId: string;
  investorName: string;
  paidAmount: number;
  paidDate: string;
  paymentReferenceNumber: string;
  adminNote: string | null;
  recordedBy: string;
  recordedAt: string;
}

export interface InvestorSettlementResult {
  settlementId: string;
  projectId: string;
  projectTitle: string;
  principalAmount: number;
  profitLossShare: number;
  finalReceivableAmount: number;
  settlementDate: string;
  finalizedAt: string;
  payoutStatus: InvestorSettlementPayoutStatus;
  paidAmount?: number;
  paidDate?: string;
  paymentReferenceNumber?: string;
  payoutAdminNote?: string | null;
}

export const INVESTOR_SETTLEMENT_DISCLAIMER =
  "این مبلغ نتیجه محاسبه تسویه است؛ پرداخت دستی ثبت‌شده خارج از سامانه است و وجهی نزد آوید نگهداری نمی‌شود.";

export const MANUAL_PAYOUT_DISCLAIMER =
  "این ثبت صرفاً گزارش پرداخت دستی ثبت‌شده است و به معنی نگهداری وجه نزد آوید نیست.";

export const INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS: Record<
  InvestorSettlementPayoutStatus,
  string
> = {
  pending_manual_payout: "در انتظار پرداخت دستی",
  paid_manually: "پرداخت دستی ثبت‌شده",
};

export function settlementPayoutKey(
  settlementId: string,
  investorId: string
): string {
  return `${settlementId}:${investorId}`;
}

export const FINALIZE_SETTLEMENT_CONFIRM_MESSAGE =
  "آیا از نهایی‌سازی این تسویه اطمینان دارید؟ پس از نهایی‌سازی امکان ویرایش وجود ندارد و نتیجه برای سرمایه‌گذاران نمایش داده می‌شود.";

/** Net result after costs and initial fee; success fee only on positive profit. */
export function calculateSettlementFigures(
  input: SettlementCalculationInput
): SettlementCalculationResult {
  const netResult =
    input.totalRevenue - input.totalCosts - input.initialFeeAmount;

  let successFeeAmount = 0;
  if (netResult > 0) {
    if (
      input.successFeeAmountOverride != null &&
      input.successFeeAmountOverride >= 0
    ) {
      successFeeAmount = input.successFeeAmountOverride;
    } else {
      successFeeAmount = netResult * input.successFeeRate;
    }
  }

  const distributableAmount = netResult - successFeeAmount;

  return {
    netResult,
    successFeeAmount,
    distributableAmount,
  };
}

/** Proportional investor settlement preview from distributable pool. */
export function calculateInvestorSettlementDistribution(
  settlement: Pick<ProjectSettlementRecord, "distributableAmount">,
  allocations: SettlementAllocationInput[]
): InvestorSettlementDistributionRow[] {
  const totalAllocated = allocations.reduce(
    (sum, row) => sum + row.allocatedAmount,
    0
  );
  if (totalAllocated <= 0) return [];

  return allocations.map((allocation) => {
    const shareRatio = allocation.allocatedAmount / totalAllocated;
    const principalAmount = allocation.allocatedAmount;
    const finalAmount = settlement.distributableAmount * shareRatio;
    const profitLossShare = finalAmount - principalAmount;

    return {
      investorId: allocation.investorId,
      investorName: allocation.investorName,
      allocatedAmount: allocation.allocatedAmount,
      shareRatio,
      principalAmount,
      profitLossShare,
      finalAmount,
    };
  });
}
