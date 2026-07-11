import { InvestmentRequestUiStatus } from "@/types/investment";
import { INVESTMENT_REQUEST_STATUS_LABELS } from "@/types/investment";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<InvestmentRequestUiStatus, string> = {
  submitted: "bg-blue-50 text-blue-800",
  under_review: "bg-indigo-50 text-indigo-800",
  approved_pending_payment: "bg-emerald-50 text-emerald-800",
  receipt_submitted: "bg-sky-50 text-sky-800",
  allocated: "bg-teal-50 text-teal-800",
  rejected: "bg-red-50 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

interface InvestmentRequestStatusBadgeProps {
  status: InvestmentRequestUiStatus;
  className?: string;
}

export function InvestmentRequestStatusBadge({
  status,
  className,
}: InvestmentRequestStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {INVESTMENT_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}
