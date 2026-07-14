export type SettlementOutlook =
  | "on_schedule"
  | "possibly_earlier"
  | "possibly_delayed";

export type UpdateMediaKind = "image" | "video" | "report";

export const SETTLEMENT_OUTLOOK_LABELS: Record<SettlementOutlook, string> = {
  on_schedule: "طبق برنامه",
  possibly_earlier: "احتمال تسویه زودتر",
  possibly_delayed: "احتمال تأخیر در تسویه",
};

export interface ActiveProjectUpdateItem {
  id: string;
  projectId: string;
  projectSlug: string;
  projectName: string;
  updateTitle: string;
  updateDate: string;
  shortStatus: string;
  settlementOutlook: SettlementOutlook;
  adminNote: string;
  media: {
    kind: UpdateMediaKind;
    label: string;
  } | null;
}
