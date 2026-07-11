import { cn } from "@/lib/utils";

interface ProjectRiskDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function ProjectRiskDisclaimer({
  className,
  compact = false,
}: ProjectRiskDisclaimerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-300 bg-amber-50/90 text-amber-950",
        compact ? "px-4 py-3 text-xs leading-relaxed" : "px-5 py-4 text-sm leading-relaxed",
        className
      )}
      role="note"
    >
      <p className="font-semibold">هشدار مهم ریسک</p>
      <p className={cn(compact ? "mt-1.5" : "mt-2")}>
        مشارکت در پروژه‌های آوید دارای ریسک است. اعداد بازده صرفاً سناریوی
        پیش‌بینی هستند؛ بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه نیست. آوید
        مبلغ مشارکت یا بازده را وعده نمی‌دهد. پرداخت خارج از سامانه انجام می‌شود و
        وجهی نزد آوید نگهداری نمی‌شود.
      </p>
    </div>
  );
}
