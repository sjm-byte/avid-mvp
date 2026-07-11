import Link from "next/link";
import { cookies } from "next/headers";
import { StatCard } from "@/components/shared/StatCard";
import { getAdminDashboardStats } from "@/lib/data/admin-dashboard";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemoFlowCard } from "@/components/demo/DemoFlowCard";

const QUICK_LINKS = [
  { href: "/admin/requests", label: "درخواست‌ها" },
  { href: "/admin/receipts", label: "رسیدها" },
  { href: "/admin/projects", label: "پروژه‌ها" },
  { href: "/admin/reports", label: "گزارش‌ها" },
  { href: "/admin/settlements", label: "تسویه‌ها" },
  { href: "/admin/ledger", label: "ثبت حسابداری" },
] as const;

const ADMIN_DEMO_FLOW = [
  { href: "/admin/requests", label: "بررسی و تأیید درخواست‌های مشارکت" },
  { href: "/admin/receipts", label: "بررسی رسیدهای بارگذاری‌شده" },
  { href: "/admin/ledger", label: "مشاهده ثبت حسابداری تخصیص و تسویه" },
  { href: "/admin/reports", label: "ثبت گزارش پیشرفت و گزارش مالی پروژه" },
  { href: "/admin/settlements", label: "تسویه نهایی و ثبت پرداخت دستی" },
] as const;

export default async function AdminDashboardPage() {
  const isDemo = Boolean((await cookies()).get("avid_demo_role")?.value);
  const stats = await getAdminDashboardStats();

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد مدیرعامل</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          نمای کلی وضعیت پروژه‌ها، درخواست‌ها و عملیات آوید
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="کل پروژه‌ها" value={stats.totalProjects} />
        <StatCard title="پروژه‌های فعال" value={stats.activeProjects} />
        <StatCard
          title="درخواست‌های در انتظار"
          value={stats.pendingInvestmentRequests}
          description="ثبت‌شده یا در بررسی"
        />
        <StatCard
          title="رسیدهای در انتظار"
          value={stats.pendingReceipts}
          description="نیاز به بررسی"
        />
        <StatCard
          title="کل سرمایه تخصیص‌یافته"
          value={formatToman(stats.totalAllocatedCapital)}
        />
        <StatCard
          title="تسویه‌های نهایی‌شده"
          value={stats.finalizedSettlements}
        />
        <StatCard
          title="پرداخت دستی در انتظار"
          value={stats.pendingManualPayouts}
          description="سرمایه‌گذار بدون ثبت پرداخت"
        />
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
    </div>
  );
}
