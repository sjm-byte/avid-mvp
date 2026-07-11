import { ProjectStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "پیش‌نویس",
  under_review: "در حال بررسی",
  open_for_interest: "پذیرش علاقه‌مندی",
  funding_in_progress: "در حال جذب سرمایه",
  funding_completed: "جذب تکمیل‌شده",
  in_execution: "در حال اجرا",
  delayed: "دارای تأخیر",
  settlement_in_progress: "در حال تسویه",
  closed_success: "بسته‌شده — سود",
  closed_loss: "بسته‌شده — زیان",
  cancelled: "لغوشده",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "border-muted-foreground/20 bg-muted text-muted-foreground",
  under_review: "border-slate-200 bg-slate-50 text-slate-800",
  open_for_interest: "border-blue-200 bg-blue-50 text-blue-900",
  funding_in_progress: "border-emerald-200 bg-emerald-50 text-emerald-900",
  funding_completed: "border-teal-200 bg-teal-50 text-teal-900",
  in_execution: "border-indigo-200 bg-indigo-50 text-indigo-900",
  delayed: "border-orange-200 bg-orange-50 text-orange-900",
  settlement_in_progress: "border-amber-200 bg-amber-50 text-amber-900",
  closed_success: "border-green-200 bg-green-50 text-green-900",
  closed_loss: "border-red-200 bg-red-50 text-red-900",
  cancelled: "border-gray-200 bg-gray-50 text-gray-600",
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
