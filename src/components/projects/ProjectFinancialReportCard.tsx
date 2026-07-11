import {
  FINANCIAL_REPORT_DISCLAIMER,
  ProjectFinancialReportRecord,
} from "@/types/project-report";
import { formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectFinancialReportCardProps {
  report: ProjectFinancialReportRecord;
}

export function ProjectFinancialReportCard({
  report,
}: ProjectFinancialReportCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{report.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          دوره:{" "}
          {new Date(report.periodStart).toLocaleDateString("fa-IR")}
          {" — "}
          {new Date(report.periodEnd).toLocaleDateString("fa-IR")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">سرمایه تخصیص‌یافته</p>
            <p className="font-medium">{formatToman(report.capitalAllocated)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">هزینه‌های ثبت‌شده</p>
            <p className="font-medium">{formatToman(report.costsRecorded)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">درآمدهای ثبت‌شده</p>
            <p className="font-medium">{formatToman(report.revenueRecorded)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">نتیجه برآوردی فعلی</p>
            <p className="font-medium">
              {formatToman(report.estimatedCurrentResult)}
            </p>
          </div>
        </div>
        {report.adminNotes && (
          <p className="text-xs text-muted-foreground">{report.adminNotes}</p>
        )}
        <p className="rounded-md border border-amber-200 bg-amber-50/50 p-2 text-xs text-amber-900">
          {FINANCIAL_REPORT_DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}
