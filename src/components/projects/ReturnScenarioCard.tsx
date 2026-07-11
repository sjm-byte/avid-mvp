import { formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReturnScenarioCardProps {
  min: number | null;
  base: number | null;
  max: number | null;
  className?: string;
}

export function ReturnScenarioCard({
  min,
  base,
  max,
  className,
}: ReturnScenarioCardProps) {
  return (
    <Card className={cn("border-amber-100", className)}>
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-base font-semibold">
          بازده پیش‌بینی‌شده
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          سه سناریو بر اساس برآورد پروژه — نه وعده سود
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border bg-background px-2 py-3">
            <p className="text-xs text-muted-foreground">سناریوی محتاط</p>
            <p className="mt-1.5 text-lg font-semibold">
              {min != null ? formatPercent(min) : "—"}
            </p>
          </div>
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 px-2 py-3">
            <p className="text-xs font-medium text-primary">سناریوی پایه</p>
            <p className="mt-1.5 text-xl font-bold text-primary">
              {base != null ? formatPercent(base) : "—"}
            </p>
          </div>
          <div className="rounded-lg border bg-background px-2 py-3">
            <p className="text-xs text-muted-foreground">سناریوی خوش‌بین</p>
            <p className="mt-1.5 text-lg font-semibold">
              {max != null ? formatPercent(max) : "—"}
            </p>
          </div>
        </div>
        <p className="rounded-md border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs leading-relaxed text-amber-950">
          این اعداد پیش‌بینی هستند؛ بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه
          نیست. نتیجه واقعی ممکن است متفاوت باشد.
        </p>
      </CardContent>
    </Card>
  );
}
