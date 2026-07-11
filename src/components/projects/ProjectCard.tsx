import Link from "next/link";
import { ProjectListItem } from "@/types/project";
import {
  INVESTMENT_REQUEST_STATUS_LABELS,
  InvestmentRequestUiStatus,
} from "@/types/investment";
import { cn, formatDurationDays, formatPercent, formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { FundingProgressBar } from "@/components/projects/FundingProgressBar";
import { ProjectImagePlaceholder } from "@/components/brand/ProjectImagePlaceholder";

const REQUEST_STATUS_STYLES: Record<InvestmentRequestUiStatus, string> = {
  submitted: "border-blue-200 bg-blue-50 text-blue-900",
  under_review: "border-indigo-200 bg-indigo-50 text-indigo-900",
  approved_pending_payment: "border-emerald-200 bg-emerald-50 text-emerald-900",
  receipt_submitted: "border-sky-200 bg-sky-50 text-sky-900",
  allocated: "border-teal-200 bg-teal-50 text-teal-900",
  rejected: "border-red-200 bg-red-50 text-red-900",
  cancelled: "border-gray-200 bg-gray-50 text-gray-600",
};

interface ProjectCardProps {
  project: ProjectListItem;
  ctaLabel?: string;
  requestStatus?: InvestmentRequestUiStatus | null;
}

export function ProjectCard({
  project,
  ctaLabel = "بررسی جزئیات و ثبت درخواست",
  requestStatus = null,
}: ProjectCardProps) {
  const baseReturn = project.expectedReturnBase;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <ProjectImagePlaceholder
        category={project.category}
        projectType={project.projectType}
        className="rounded-none border-0 border-b"
      />
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-snug">
            {project.title}
          </CardTitle>
          <ProjectStatusBadge status={project.status} className="shrink-0" />
        </div>
        {project.category && (
          <p className="text-xs text-muted-foreground">
            {project.category}
            {project.projectType ? ` · ${project.projectType}` : ""}
          </p>
        )}
        {requestStatus && (
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              REQUEST_STATUS_STYLES[requestStatus]
            )}
          >
            {INVESTMENT_REQUEST_STATUS_LABELS[requestStatus]}
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 pb-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        <FundingProgressBar percent={project.funding.fundingPercent} />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">هدف جذب</p>
            <p className="font-semibold">{formatToman(project.maxRaise)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">جذب‌شده</p>
            <p className="font-semibold">
              {formatToman(project.funding.totalVerifiedAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">حداقل مشارکت</p>
            <p className="font-semibold">{formatToman(project.minInvestment)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">مدت پیش‌بینی</p>
            <p className="font-semibold">
              {formatDurationDays(project.expectedDurationDays)}
            </p>
          </div>
        </div>

        {baseReturn != null && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
            <p className="text-xs font-medium text-amber-950">
              بازده پیش‌بینی‌شده (سناریوی پایه)
            </p>
            <p className="mt-1 text-base font-bold text-amber-950">
              {formatPercent(baseReturn)}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-900">
              این عدد پیش‌بینی است؛ بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه
              محسوب نمی‌شود.
            </p>
          </div>
        )}

        {project.riskSummary && (
          <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">خلاصه ریسک: </span>
            {project.riskSummary}
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/20 pt-4">
        <Button asChild className="w-full" size="lg">
          <Link href={`/projects/${project.slug}`}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
