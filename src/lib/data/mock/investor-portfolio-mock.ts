export type InvestorProjectLifecycle = "active" | "completed" | "settled";

/** Short status for timeline tooltip (capital tracking). */
export type InvestorTimelineStatus =
  | "active"
  | "settled_on_time"
  | "settled_late"
  | "awaiting_settlement";

export const TIMELINE_STATUS_LABELS: Record<InvestorTimelineStatus, string> = {
  active: "فعال",
  settled_on_time: "سر موعد تسویه شد",
  settled_late: "با تأخیر تسویه شد",
  awaiting_settlement: "در انتظار تسویه",
};

export interface InvestorProjectRow {
  id: string;
  slug: string;
  title: string;
  participationAmount: number;
  newCapital: number;
  transferredFromPrevious: number;
  /** Capital still with Avid after this project (تراز سرمایه نزد آوید). */
  balanceAfterProject: number;
  timelineStatus: InvestorTimelineStatus;
  startDate: string;
  endDate: string | null;
  profitDueDate: string | null;
  lifecycle: InvestorProjectLifecycle;
  statusLabel: string;
  settlementAmount: number | null;
}

export interface CapitalMovementDetail {
  id: string;
  date: string;
  amount: number;
  projectTitle: string | null;
  note: string | null;
}

/** Cash-flow event kinds shown on the investor timeline. */
export type CashFlowKind = "deposit" | "withdrawal" | "profit";

export const CASH_FLOW_KIND_LABELS: Record<CashFlowKind, string> = {
  deposit: "واریز وجه",
  withdrawal: "برداشت وجه",
  profit: "واریز سود",
};

export interface CashFlowEvent {
  id: string;
  kind: CashFlowKind;
  date: string;
  amount: number;
  /** Running cash balance after this event (rial). */
  balanceAfter: number;
  projectTitle: string | null;
  note: string | null;
}

export interface InvestorPortfolioSummary {
  /** Total capital entered (admin-recorded deposits). */
  cumulativeCapital: number;
  /** Capital currently in active projects (تراز سرمایه نزد آوید). */
  activeProjectCapital: number;
  /**
   * Rial held after a finished project, not yet returned or rolled
   * (تراز ریالی نزد آوید).
   */
  rialBalanceWithAvid: number;
  /** Total settled/withdrawn out to date (تراز تسویه شده تاکنون). */
  settledBalanceToDate: number;
  /** @deprecated Prefer activeProjectCapital + rialBalanceWithAvid */
  currentCapital: number;
  newCapital: number;
  transferredCapital: number;
  activeProjectCount: number;
  endedProjectCount: number;
  settlementsDone: number;
  settlementsPending: number;
  /** Deposit lines for hover on تراز سرمایه / مجموع آورده */
  depositDetails: CapitalMovementDetail[];
  /** Settlement-out lines for hover on تراز تسویه شده */
  settlementDetails: CapitalMovementDetail[];
  /** Ordered cash-flow events for the liquidity timeline. */
  cashFlowEvents: CashFlowEvent[];
  timelineStartDate: string;
  timelineStartLabel: string;
  projects: InvestorProjectRow[];
}
