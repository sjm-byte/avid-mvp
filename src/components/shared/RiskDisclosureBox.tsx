import { cn } from "@/lib/utils";

interface RiskDisclosureBoxProps {
  className?: string;
  variant?: "default" | "compact";
}

export function RiskDisclosureBox({
  className,
  variant = "default",
}: RiskDisclosureBoxProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-amber-200 bg-amber-50 text-amber-900",
        variant === "compact" ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
        className
      )}
      role="note"
    >
      <p className="font-medium">هشدار ریسک</p>
      <p className={cn("mt-1 leading-relaxed", variant === "compact" && "mt-0.5")}>
        سرمایه‌گذاری در پروژه‌های آوید دارای ریسک است. بازده پیش‌بینی‌شده صرفاً
        سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود. آوید مبلغ مشارکت یا
        بازده را وعده نمی‌دهد.
      </p>
    </div>
  );
}
