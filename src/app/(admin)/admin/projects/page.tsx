import Link from "next/link";
import { getAdminProjectSummaries } from "@/lib/data/investor-projects";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectStatus } from "@/types/database";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjectSummaries();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مدیریت پروژه‌ها</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            وضعیت جذب، تخصیص‌ها و گزارش‌های هر پروژه
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/reports">ثبت گزارش جدید</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>پروژه‌ای در سامانه ثبت نشده است.</p>
          <p className="mt-2 text-xs">
            در حالت نمایشی، پروژه‌های نمونه از قبل بارگذاری شده‌اند.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-right">
                <th className="px-4 py-3 font-medium">پروژه</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">هدف جذب</th>
                <th className="px-4 py-3 font-medium">جذب‌شده</th>
                <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                <th className="px-4 py-3 font-medium">تخصیص</th>
                <th className="px-4 py-3 font-medium">گزارش</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <ProjectStatusBadge
                      status={project.status as ProjectStatus}
                    />
                  </td>
                  <td className="px-4 py-3">{formatToman(project.maxRaise)}</td>
                  <td className="px-4 py-3">
                    {formatToman(project.totalVerifiedAmount)}
                  </td>
                  <td className="px-4 py-3">{project.investorCount}</td>
                  <td className="px-4 py-3">{project.allocationCount}</td>
                  <td className="px-4 py-3">{project.updateCount}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-primary hover:underline"
                    >
                      جزئیات و ثبت مشارکت
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
