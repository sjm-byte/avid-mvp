import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";
import {
  getProjectAllocatedTotal,
  getProjectInvestorRows,
} from "@/lib/data/admin-allocations";
import { formatPercent, formatToman } from "@/lib/utils";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { FundingProgressBar } from "@/components/projects/FundingProgressBar";
import { ManualAllocationForm } from "@/components/admin/ManualAllocationForm";
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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [investors, allocatedTotal] = await Promise.all([
    getProjectInvestorRows(project.id),
    getProjectAllocatedTotal(project.id),
  ]);

  const fundingPercent =
    project.maxRaise > 0 ? allocatedTotal / project.maxRaise : 0;

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="h-auto px-0" asChild>
            <Link href="/admin/projects">← بازگشت به پروژه‌ها</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            مشارکت‌ها پس از قرارداد و واریز خارج از سامانه، اینجا ثبت می‌شوند.
            درخواست و رسید روی پلتفرم انجام نمی‌شود.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">وضعیت جذب (ثبت‌شده)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FundingProgressBar percent={fundingPercent} />
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">هدف جذب</p>
              <p className="font-semibold">{formatToman(project.maxRaise)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">جمع ثبت‌شده</p>
              <p className="font-semibold">{formatToman(allocatedTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تعداد سرمایه‌گذار</p>
              <p className="font-semibold">{investors.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">سرمایه‌گذاران این پروژه</h2>
        {investors.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            هنوز مشارکتی برای این پروژه ثبت نشده است. پس از قرارداد و واریز
            خارج از سامانه، از فرم زیر ثبت کنید.
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
                  <th className="px-4 py-3 font-medium">یادداشت</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((row) => (
                  <tr key={row.allocationId} className="border-b">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/investors#${row.investorId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.investorName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{formatToman(row.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.ownershipPercent != null
                        ? formatPercent(row.ownershipPercent)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(row.allocatedAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-muted-foreground">
                      {row.adminNote ?? "—"}
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
    </div>
  );
}
