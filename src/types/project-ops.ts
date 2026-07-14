export type ProjectOpsLifecycle = "active" | "completed" | "settled";

export type SettlementOutlook =
  | "on_schedule"
  | "possibly_earlier"
  | "possibly_delayed";

export type SettlementTimingStatus = "settled_on_time" | "settled_late";

export type UpdateMediaKind = "image" | "video" | "report";

export const SETTLEMENT_OUTLOOK_LABELS: Record<SettlementOutlook, string> = {
  on_schedule: "طبق برنامه",
  possibly_earlier: "احتمال تسویه زودتر",
  possibly_delayed: "احتمال تأخیر در تسویه",
};

export const SETTLEMENT_TIMING_LABELS: Record<SettlementTimingStatus, string> = {
  settled_on_time: "سر موعد تسویه شد",
  settled_late: "با تأخیر تسویه شد",
};

export interface ProjectOpsInvestor {
  name: string;
  amount: number;
  /** Marks the demo investor portfolio row. */
  isDemoInvestor?: boolean;
  newCapital: number;
  transferredFromPrevious: number;
  /** Paid/settled amount after project settlement (rial). */
  settledPaidAmount: number | null;
}

export interface ProjectOpsReport {
  id: string;
  title: string;
  reportDate: string;
  shortStatus: string;
  settlementOutlook: SettlementOutlook;
  adminNote: string;
  mediaKind: UpdateMediaKind | null;
  mediaLabel: string | null;
}

export interface ProjectOpsRecord {
  id: string;
  slug: string;
  title: string;
  totalCapital: number;
  investors: ProjectOpsInvestor[];
  profitDue: number | null;
  startDate: string | null;
  endDate: string | null;
  predictedReturn: number;
  collateral: string;
  commissionPercent: number;
  commissionStatus: string;
  lifecycle: ProjectOpsLifecycle;
  actualResult: string | null;
  settlementDate: string | null;
  settlementTiming: SettlementTimingStatus | null;
  reports: ProjectOpsReport[];
}
