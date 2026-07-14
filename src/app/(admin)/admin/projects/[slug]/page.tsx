import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";
import { getProjectOpsBySlug } from "@/lib/data/mock/project-ops-store";
import {
  getProjectAllocatedTotal,
  getProjectInvestorRows,
} from "@/lib/data/admin-allocations";
import { formatPercent, formatToman } from "@/lib/utils";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { FundingProgressBar } from "@/components/projects/FundingProgressBar";
import { ManualAllocationForm } from "@/components/admin/ManualAllocationForm";
import { AdminProjectOpsPanel } from "@/components/admin/AdminProjectOpsPanel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminProjectDetailPage({
  params,
}: AdminProjectDetailPageProps) {
  const { slug } = await params;
  const ops = await getProjectOpsBySlug(slug);
  if (!ops) notFound();

  const project = await getProjectBySlug(slug);

  const [investors, allocatedTotal] = project
    ? await Promise.all([
        getProjectInvestorRows(project.id),
        getProjectAllocatedTotal(project.id),
      ])
    : [[], ops.totalCapital];

  const fundingPercent = project
    ? project.maxRaise > 0
      ? allocatedTotal / project.maxRaise
      : 0
    : 1;

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="h-auto px-0" asChild>
            <Link href="/admin/projects">← بازگشت به پروژه‌ها</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{ops.title}</h1>
            {project ? (
              <ProjectStatusBadge status={project.status} />
            ) : (
              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                {ops.lifecycle === "active"
                  ? "فعال"
                  : ops.lifecycle === "completed"
                    ? "پایان‌یافته"
                    : "تسویه‌شده"}
              </span>
            )}
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            مدیریت فیلدهای جدول، گزارش وضعیت برای سرمایه‌گذار، و ثبت تسویه —
            داده‌های mock مشترک با پنل سرمایه‌گذار.
          </p>
        </div>
      </div>

      <AdminProjectOpsPanel project={ops} />

      {project && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">وضعیت جذب (ثبت تخصیص)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FundingProgressBar percent={fundingPercent} />
              <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">هدف جذب</p>
                  <p className="font-semibold">
                    {formatToman(project.maxRaise)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">جمع ثبت‌شده</p>
                  <p className="font-semibold">
                    {formatToman(allocatedTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    تعداد سرمایه‌گذار
                  </p>
                  <p className="font-semibold">{investors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">تخصیص‌های ثبت‌شده</h2>
            {investors.length === 0 ? (
              <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
                هنوز تخصیص جداگانه‌ای ثبت نشده است.
              </div>
            ) : (
              <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-right">
                      <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                      <th className="px-4 py-3 font-medium">مبلغ</th>
                      <th className="px-4 py-3 font-medium">سهم تقریبی</th>
                      <th className="px-4 py-3 font-medium">تاریخ ثبت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((row) => (
                      <tr key={row.allocationId} className="border-b">
                        <td className="px-4 py-3 font-medium">
                          {row.investorName}
                        </td>
                        <td className="px-4 py-3">
                          {formatToman(row.amount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.ownershipPercent != null
                            ? formatPercent(row.ownershipPercent)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(row.allocatedAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <ManualAllocationForm
            projectId={project.id}
            projectTitle={project.title}
          />
        </>
      )}
    </div>
  );
}
