import { getAdminProjectSummaries } from "@/lib/data/investor-projects";
import { getAllProjectUpdates } from "@/lib/data/project-updates";
import { getAllFinancialReports } from "@/lib/data/project-financial-reports";
import { AdminReportsPanel } from "@/components/admin/AdminReportsPanel";
import { ProjectUpdatesList } from "@/components/projects/ProjectUpdatesList";
import { ProjectFinancialReportCard } from "@/components/projects/ProjectFinancialReportCard";
import { REPORT_VISIBILITY_LABELS } from "@/types/project-report";
import { formatToman } from "@/lib/utils";

export default async function AdminReportsPage() {
  const [projects, updates, financialReports] = await Promise.all([
    getAdminProjectSummaries(),
    getAllProjectUpdates(),
    getAllFinancialReports(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">گزارش‌های پروژه</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ثبت گزارش پیشرفت، گزارش مالی پیش‌نویس و مراحل اجرای پروژه. گزارش‌ها
          عملیاتی هستند و بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه محسوب نمی‌شود.
        </p>
      </div>

      <AdminReportsPanel projects={projects} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">گزارش‌های منتشرشده</h2>
        <ProjectUpdatesList
          updates={updates.slice(0, 10)}
          showVisibility
          emptyMessage="هنوز گزارشی ثبت نشده است."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">گزارش‌های مالی پیش‌نویس</h2>
        {financialReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            هنوز گزارش مالی ثبت نشده است.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {financialReports.slice(0, 6).map((report) => (
              <div key={report.id}>
                <p className="mb-2 text-sm font-medium">
                  {report.projectTitle ?? "پروژه"}
                  <span className="mr-2 text-xs font-normal text-muted-foreground">
                    · {REPORT_VISIBILITY_LABELS[report.visibility]}
                  </span>
                </p>
                <ProjectFinancialReportCard report={report} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full max-w-full min-w-0 rounded-md border">
        <h2 className="border-b px-4 py-3 text-lg font-semibold">
          خلاصه پروژه‌ها
        </h2>
        <div className="w-full max-w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-right">
              <th className="px-4 py-3 font-medium">پروژه</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">جذب‌شده</th>
              <th className="px-4 py-3 font-medium">تخصیص‌ها</th>
              <th className="px-4 py-3 font-medium">گزارش‌ها</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.status}</td>
                <td className="px-4 py-3">{formatToman(p.totalVerifiedAmount)}</td>
                <td className="px-4 py-3">{p.allocationCount}</td>
                <td className="px-4 py-3">{p.updateCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
