import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";
import { getPublicDocumentsForProject } from "@/lib/data/documents";
import { getProjectUpdates } from "@/lib/data/project-updates";
import { getProjectFinancialReports } from "@/lib/data/project-financial-reports";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { formatDurationDays, formatToman } from "@/lib/utils";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { FundingProgressBar } from "@/components/projects/FundingProgressBar";
import { ReturnScenarioCard } from "@/components/projects/ReturnScenarioCard";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { AvidDocumentList } from "@/components/documents/AvidDocumentList";
import { ProjectUpdatesList } from "@/components/projects/ProjectUpdatesList";
import { ProjectFinancialReportCard } from "@/components/projects/ProjectFinancialReportCard";
import { ProjectDetailTabs } from "@/components/projects/ProjectDetailTabs";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { ProjectImagePlaceholder } from "@/components/brand/ProjectImagePlaceholder";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const user = await getCurrentUser();

  const [updates, financialReports, publicDocuments] = await Promise.all([
    getProjectUpdates(project.id, { viewerRole: "public" }),
    getProjectFinancialReports(project.id, { viewerRole: "public" }),
    getPublicDocumentsForProject(project.id),
  ]);

  const tabs = [
    { id: "intro", label: "معرفی" },
    { id: "risks", label: "ریسک‌ها" },
    { id: "timeline", label: "زمان‌بندی" },
    { id: "documents", label: "اسناد عمومی" },
    { id: "reports", label: "گزارش‌ها" },
    { id: "faq", label: "سوالات" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div className="flex flex-col gap-8 border-b pb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="min-w-0 flex-1 space-y-5">
          <ProjectImagePlaceholder
            category={project.category}
            projectType={project.projectType}
            aspectClassName="aspect-[21/9] max-h-56"
            className="lg:max-w-3xl"
          />
          <div className="flex flex-wrap items-center gap-3">
            <ProjectStatusBadge status={project.status} />
            {project.category && (
              <span className="text-sm text-muted-foreground">
                {project.category}
                {project.projectType ? ` · ${project.projectType}` : ""}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {project.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>
        </div>

        <Card className="w-full shrink-0 lg:max-w-sm">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-base">نحوه مشارکت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              اعلام علاقه، هماهنگی و واریز به حساب پروژه خارج از سامانه آوید
              انجام می‌شود. پس از قرارداد، مدیر مشارکت را در پنل ثبت می‌کند.
            </p>
            <p className="text-xs">
              حداقل مشارکت اعلام‌شده: {formatToman(project.minInvestment)} —
              این عدد اطلاع‌رسانی است و به معنی پرداخت از طریق آوید نیست.
            </p>
            {user?.role === "investor" ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/investments">مشارکت‌های ثبت‌شده من</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">ورود به پنل</Link>
              </Button>
            )}
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link href="/contact">تماس با تیم آوید</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-8">
        <ProjectRiskDisclaimer />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">وضعیت جذب سرمایه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FundingProgressBar percent={project.funding.fundingPercent} />
              <div className="grid grid-cols-2 gap-5 text-sm sm:grid-cols-4">
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
                  <p className="font-semibold">
                    {formatToman(project.minInvestment)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">مدت پیش‌بینی</p>
                  <p className="font-semibold">
                    {formatDurationDays(project.expectedDurationDays)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ReturnScenarioCard
            min={project.expectedReturnMin}
            base={project.expectedReturnBase}
            max={project.expectedReturnMax}
          />
        </div>
      </div>

      <div className="mt-12">
        <ProjectDetailTabs
          tabs={tabs}
          tabPanels={{
            intro: (
              <div className="max-w-3xl space-y-6">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.fullDescription ?? project.shortDescription}
                </p>
                {project.mitigationPlan && (
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <p className="font-medium">تدابیر کلی آوید</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.mitigationPlan}
                    </p>
                  </div>
                )}
              </div>
            ),
            risks: (
              <div className="max-w-3xl space-y-4">
                <h3 className="text-base font-semibold">
                  چه مواردی ممکن است طبق برنامه پیش نرود؟
                </h3>
                {project.riskItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    فهرست ریسک‌های این پروژه هنوز تکمیل نشده است. قبل از ثبت
                    درخواست، معرفی پروژه و هشدار ریسک بالای صفحه را مطالعه
                    کنید.
                  </p>
                ) : (
                  project.riskItems.map((risk) => (
                    <details
                      key={risk.id}
                      className="group rounded-lg border px-4 py-3"
                    >
                      <summary className="cursor-pointer font-medium">
                        {risk.risk_type}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {risk.description}
                      </p>
                      {risk.mitigation && (
                        <p className="mt-3 text-sm leading-relaxed">
                          <span className="font-medium">تدابیر: </span>
                          {risk.mitigation}
                        </p>
                      )}
                    </details>
                  ))
                )}
              </div>
            ),
            timeline: <ProjectTimeline milestones={project.milestones} />,
            documents: (
              <div className="max-w-3xl space-y-3">
                <p className="text-sm text-muted-foreground">
                  فقط اسناد با دسترسی عمومی نمایش داده می‌شوند.
                </p>
                <AvidDocumentList
                  documents={publicDocuments}
                  emptyMessage="هنوز سند عمومی برای این پروژه منتشر نشده است."
                />
              </div>
            ),
            reports: (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-base font-semibold">
                    گزارش‌های پیشرفت
                  </h3>
                  <ProjectUpdatesList
                    updates={updates}
                    emptyMessage="گزارش دوره‌ای این پروژه پس از شروع اجرا منتشر می‌شود."
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-base font-semibold">
                    خلاصه‌های مالی عمومی
                  </h3>
                  {financialReports.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      گزارش مالی عمومی برای این پروژه منتشر نشده است.
                    </p>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {financialReports.map((report) => (
                        <ProjectFinancialReportCard
                          key={report.id}
                          report={report}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ),
            faq: (
              <div className="max-w-3xl space-y-6 text-sm leading-relaxed">
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-foreground">
                    پرداخت چگونه انجام می‌شود؟
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    پس از توافق و قرارداد خارج از سامانه، واریز مستقیماً به حساب
                    معرفی‌شده پروژه انجام می‌شود. آوید وجهی دریافت نمی‌کند و
                    درخواست/رسید روی پلتفرم ثبت نمی‌شود.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-foreground">
                    آیا بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه است؟
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    خیر. اعداد بازده صرفاً سناریوی پیش‌بینی هستند؛ بازده
                    پیش‌بینی‌شده همان نتیجه واقعی پروژه محسوب نمی‌شود.
                  </p>
                </div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
