import { PaymentReceiptUiStatus } from "@/types/receipt";
import { PAYMENT_RECEIPT_STATUS_LABELS } from "@/types/receipt";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<PaymentReceiptUiStatus, string> = {
  submitted: "bg-blue-50 text-blue-800",
  under_review: "bg-indigo-50 text-indigo-800",
  verified: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-800",
};

interface PaymentReceiptStatusBadgeProps {
  status: PaymentReceiptUiStatus;
  className?: string;
}

export function PaymentReceiptStatusBadge({
  status,
  className,
}: PaymentReceiptStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {PAYMENT_RECEIPT_STATUS_LABELS[status]}
    </span>
  );
}
