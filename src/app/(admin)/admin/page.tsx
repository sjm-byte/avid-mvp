import Link from "next/link";
import { cookies } from "next/headers";
import { StatCard } from "@/components/shared/StatCard";
import { getAdminDashboardStats } from "@/lib/data/admin-dashboard";
import { getAdminProjectSummaries } from "@/lib/data/investor-projects";
import { getAdminInvestorSummaries } from "@/lib/data/admin-allocations";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemoFlowCard } from "@/components/demo/DemoFlowCard";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectStatus } from "@/types/database";

const QUICK_LINKS = [
  { href: "/admin/projects", label: "پروژه‌ها" },
  { href: "/admin/investors", label: "سرمایه‌گذاران" },
] as const;

const ADMIN_DEMO_FLOW = [
  {
    href: "/admin/projects",
    label: "مشاهده پروژه‌ها و میزان نزدیک شدن به هدف جذب",
  },
  {
    href: "/admin/projects/food-import-raw-materials",
    label: "باز کردن یک پروژه: لیست سرمایه‌گذاران و ثبت مشارکت پس از قرارداد",
  },
  {
    href: "/admin/investors",
    label: "مشاهده جمع هر سرمایه‌گذار در همه پروژه‌ها",
  },
] as const;

export default async function AdminDashboardPage() {
  const isDemo = Boolean((await cookies()).get("avid_demo_role")?.value);
  const [stats, projects, investors] = await Promise.all([
    getAdminDashboardStats(),
    getAdminProjectSummaries(),
    getAdminInvestorSummaries(),
  ]);

  const nearTarget = [...projects]
    .map((p) => ({
      ...p,
      progress: p.maxRaise > 0 ? p.totalVerifiedAmount / p.maxRaise : 0,
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد مدیرعامل</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          پروژه‌ها، پیشرفت جذب و مشارکت‌های ثبت‌شده پس از قرارداد. اعلام، واریز و
          هماهنگی خارج از سامانه انجام می‌شود.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="کل پروژه‌ها" value={stats.totalProjects} />
        <StatCard title="پروژه‌های فعال" value={stats.activeProjects} />
        <StatCard
          title="کل سرمایه ثبت‌شده"
          value={formatToman(stats.totalAllocatedCapital)}
        />
        <StatCard title="تعداد سرمایه‌گذاران" value={investors.length} />
      </div>

      {isDemo && <DemoFlowCard steps={[...ADMIN_DEMO_FLOW]} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">دسترسی سریع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Button key={link.href} variant="outline" size="sm" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">نزدیک‌ترین پروژه‌ها به هدف</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link href="/admin/projects">همه</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {nearTarget.length === 0 ? (
            <p className="text-sm text-muted-foreground">پروژه‌ای نیست.</p>
          ) : (
            <ul className="space-y-3">
              {nearTarget.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/projects/${p.slug}`}
                      className="font-medium hover:underline"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatToman(p.totalVerifiedAmount)} از{" "}
                      {formatToman(p.maxRaise)}
                    </p>
                  </div>
                  <ProjectStatusBadge status={p.status as ProjectStatus} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
