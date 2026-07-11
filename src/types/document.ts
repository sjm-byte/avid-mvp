export type AvidDocumentVisibility = "public" | "investor_only" | "admin_only";

export type AvidDocumentType =
  | "project_document"
  | "investor_contract"
  | "avid_executor_contract"
  | "risk_disclosure"
  | "financial_report"
  | "receipt"
  | "settlement";

export interface AvidDocumentRecord {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  documentType: AvidDocumentType;
  visibility: AvidDocumentVisibility;
  documentDate: string;
  notes: string | null;
  filePlaceholder: string;
  investorId: string | null;
  investorName?: string | null;
  createdBy: string | null;
  createdAt: string;
}

export const AVID_DOCUMENT_TYPE_LABELS: Record<AvidDocumentType, string> = {
  project_document: "سند پروژه",
  investor_contract: "قرارداد سرمایه‌گذار",
  avid_executor_contract: "قرارداد مجری آوید",
  risk_disclosure: "افشای ریسک",
  financial_report: "گزارش مالی",
  receipt: "رسید",
  settlement: "تسویه",
};

export const AVID_DOCUMENT_VISIBILITY_LABELS: Record<
  AvidDocumentVisibility,
  string
> = {
  public: "عمومی",
  investor_only: "فقط سرمایه‌گذاران پروژه",
  admin_only: "فقط مدیریت",
};

export const DOCUMENT_CENTER_DISCLAIMER =
  "این مرکز اسناد صرفاً برای نمایش و پیگیری قراردادها و مدارک است. دانلود واقعی فایل یا امضای دیجیتال در این نسخه فعال نیست.";

export const INVESTOR_DOCUMENT_TYPES: AvidDocumentType[] = [
  "receipt",
  "settlement",
];
