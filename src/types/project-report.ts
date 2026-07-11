export type ProjectUpdateType =
  | "general"
  | "financial"
  | "operational"
  | "delay"
  | "risk"
  | "settlement";

/** UI visibility — stored as `investors_only` in Supabase for investor-only rows. */
export type ReportVisibility = "public" | "investor_only";

export type ProjectUpdateStatus =
  | "normal"
  | "important"
  | "delayed"
  | "resolved";

/** @deprecated Use ProjectUpdateStatus */
export type ProjectUpdateOperationalStatus = ProjectUpdateStatus;

export type MilestoneUiStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "delayed"
  | "cancelled";

export interface ProjectUpdateRecord {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  summary: string;
  detailedNote: string | null;
  updateType: ProjectUpdateType;
  operationalStatus: ProjectUpdateStatus;
  visibility: ReportVisibility;
  publishedAt: string;
  createdBy: string | null;
  createdAt: string;
}

export interface ProjectMilestoneRecord {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  plannedDate: string | null;
  actualDate: string | null;
  status: MilestoneUiStatus;
  sortOrder: number;
  createdAt: string;
}

export interface ProjectFinancialReportRecord {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  capitalAllocated: number;
  costsRecorded: number;
  revenueRecorded: number;
  estimatedCurrentResult: number;
  adminNotes: string | null;
  visibility: ReportVisibility;
  publishedAt: string;
  createdBy: string | null;
  createdAt: string;
}

export interface AdminProjectSummary {
  id: string;
  title: string;
  slug: string;
  status: string;
  maxRaise: number;
  totalVerifiedAmount: number;
  investorCount: number;
  allocationCount: number;
  updateCount: number;
}

export interface InvestorActiveProject {
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  projectStatus: string;
  allocatedAmount: number;
  ownershipPercent: number | null;
  allocatedAt: string;
  latestUpdate: ProjectUpdateRecord | null;
  milestones: ProjectMilestoneRecord[];
  latestFinancialReport: ProjectFinancialReportRecord | null;
}

export const PROJECT_UPDATE_TYPE_LABELS: Record<ProjectUpdateType, string> = {
  general: "عمومی",
  financial: "مالی",
  operational: "عملیاتی",
  delay: "تأخیر",
  risk: "ریسک",
  settlement: "تسویه",
};

export const REPORT_VISIBILITY_LABELS: Record<ReportVisibility, string> = {
  public: "عمومی",
  investor_only: "فقط سرمایه‌گذاران",
};

/** @deprecated Use REPORT_VISIBILITY_LABELS */
export const UPDATE_VISIBILITY_LABELS = REPORT_VISIBILITY_LABELS;

export const UPDATE_STATUS_LABELS: Record<ProjectUpdateStatus, string> = {
  normal: "عادی",
  important: "مهم",
  delayed: "با تأخیر",
  resolved: "رفع‌شده",
};

/** @deprecated Use UPDATE_STATUS_LABELS */
export const OPERATIONAL_STATUS_LABELS = UPDATE_STATUS_LABELS;

export const MILESTONE_STATUS_LABELS: Record<MilestoneUiStatus, string> = {
  planned: "برنامه‌ریزی‌شده",
  in_progress: "در حال اجرا",
  completed: "تکمیل‌شده",
  delayed: "با تأخیر",
  cancelled: "لغوشده",
};

export const FINANCIAL_REPORT_DISCLAIMER =
  "ارقام این گزارش پیش‌نویس و عملیاتی است و تا زمان تسویه نهایی ثبت نشده‌اند. بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه نیست.";

export function normalizeReportVisibility(value: string): ReportVisibility {
  if (value === "public") return "public";
  return "investor_only";
}

export function toDbReportVisibility(visibility: ReportVisibility): string {
  return visibility === "public" ? "public" : "investors_only";
}

export function mapDbUpdateStatus(value: string | null): ProjectUpdateStatus {
  const map: Record<string, ProjectUpdateStatus> = {
    normal: "normal",
    important: "important",
    delayed: "delayed",
    resolved: "resolved",
    on_track: "normal",
    at_risk: "important",
    completed: "resolved",
  };
  return map[value ?? ""] ?? "normal";
}

export function mapDbMilestoneStatusToUi(
  status: string
): MilestoneUiStatus {
  if (status === "done") return "completed";
  if (
    status === "planned" ||
    status === "in_progress" ||
    status === "delayed" ||
    status === "cancelled"
  ) {
    return status;
  }
  return "planned";
}

export function mapUiMilestoneStatusToDb(
  status: MilestoneUiStatus
): string {
  return status === "completed" ? "done" : status;
}
