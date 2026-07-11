import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getProjectBySlug } from "@/lib/data/projects";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { investorHasProjectAllocation } from "@/lib/data/investor-projects";
import { getProjectUpdates } from "@/lib/data/project-updates";
import { getProjectFinancialReports } from "@/lib/data/project-financial-reports";
import {
  getProjectMilestones,
  milestoneRecordToTimelineRow,
} from "@/lib/data/project-milestones";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { ProjectUpdatesList } from "@/components/projects/ProjectUpdatesList";
import { ProjectFinancialReportCard } from "@/components/projects/ProjectFinancialReportCard";
import { formatPercent, formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InvestorProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InvestorProjectDetailPage({
  params,
}: InvestorProjectPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "investor") return null;

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const hasAllocation = await investorHasProjectAllocation(user.id, project.id);
  if (!hasAllocation) notFound();

  const dashboardData = await getInvestorDashboardData(user.id);
  const allocation = dashboardData.allocations.find(
    (a) => a.projectId === project.id
  );

  const [updates, milestones, financialReports] = await Promise.all([
    getProjectUpdates(project.id, {
      viewerRole: "investor",
      hasAllocation: true,
    }),
    getProjectMilestones(project.id),
    getProjectFinancialReports(project.id, {
      viewerRole: "investor",
      hasAllocation: true,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="link" size="sm" className="mb-2 h-auto p-0" asChild>
            <Link href="/dashboard/projects">← بازگشت به پروژه‌ها</Link>
          </Button>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="mt-2">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">مبلغ تخصیص‌یافته</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {allocation ? formatToman(allocation.verifiedAmount) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">سهم از پروژه</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {allocation?.ownershipPercent != null
                ? formatPercent(allocation.ownershipPercent)
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">تاریخ تخصیص</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {allocation
                ? new Date(allocation.allocatedAt).toLocaleDateString("fa-IR")
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">گزارش‌های پیشرفت</h2>
        <ProjectUpdatesList updates={updates} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">زمان‌بندی / مراحل</h2>
        <ProjectTimeline
          milestones={milestones.map(milestoneRecordToTimelineRow)}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">گزارش‌های مالی پیش‌نویس</h2>
        {financialReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            هنوز گزارش مالی برای این پروژه منتشر نشده است.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {financialReports.map((report) => (
              <ProjectFinancialReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
