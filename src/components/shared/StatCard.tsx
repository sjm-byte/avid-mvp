import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatPersianNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, description, className }: StatCardProps) {
  const displayValue =
    typeof value === "number" ? formatPersianNumber(value) : value;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{displayValue}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
