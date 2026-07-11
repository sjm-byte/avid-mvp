import Link from "next/link";
import {
  FINANCIAL_REPORT_DISCLAIMER,
  InvestorActiveProject,
  MILESTONE_STATUS_LABELS,
} from "@/types/project-report";
import { formatPercent, formatToman } from "@/lib/utils";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectStatus } from "@/types/database";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActiveProjectCardProps {
  project: InvestorActiveProject;
}

export function ActiveProjectCard({ project }: ActiveProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{project.projectTitle}</CardTitle>
          <ProjectStatusBadge
            status={project.projectStatus as ProjectStatus}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          مبلغ تخصیص‌یافته:{" "}
          <span className="font-medium">
            {formatToman(project.allocatedAmount)}
          </span>
        </p>
        {project.ownershipPercent != null && (
          <p className="text-muted-foreground">
            سهم از پروژه: {formatPercent(project.ownershipPercent)}
          </p>
        )}
        {project.latestUpdate ? (
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">آخرین گزارش</p>
            <p className="mt-1 font-medium">{project.latestUpdate.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {project.latestUpdate.summary}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            هنوز گزارش عملیاتی منتشر نشده است.
          </p>
        )}
        {project.milestones.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              مراحل اجرا
            </p>
            <ul className="space-y-1.5">
              {project.milestones.slice(0, 4).map((milestone) => (
                <li
                  key={milestone.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="truncate">{milestone.title}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                    {MILESTONE_STATUS_LABELS[milestone.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.latestFinancialReport && (
          <div className="rounded-md border border-dashed bg-muted/20 p-3 text-xs">
            <p className="font-medium">{project.latestFinancialReport.title}</p>
            <p className="mt-1 text-muted-foreground">
              نتیجه برآوردی:{" "}
              {formatToman(project.latestFinancialReport.estimatedCurrentResult)}
            </p>
            <p className="mt-2 text-amber-800">{FINANCIAL_REPORT_DISCLAIMER}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/projects/${project.projectSlug}`}>
            گزارش‌ها و جزئیات پروژه
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
