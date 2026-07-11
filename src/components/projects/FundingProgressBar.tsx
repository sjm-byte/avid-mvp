import { formatPersianNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FundingProgressBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
}

export function FundingProgressBar({
  percent,
  className,
  showLabel = true,
}: FundingProgressBarProps) {
  const clamped = Math.min(Math.max(percent, 0), 1);
  const displayPercent = Math.round(clamped * 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>درصد جذب سرمایه</span>
          <span>{formatPersianNumber(displayPercent)}٪</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${displayPercent}%` }}
        />
      </div>
    </div>
  );
}
