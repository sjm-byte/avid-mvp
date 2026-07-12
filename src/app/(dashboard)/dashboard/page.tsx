import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { getInvestorActiveProjects } from "@/lib/data/investor-projects";
import { StatCard } from "@/components/shared/StatCard";
import { DemoFlowCard } from "@/components/demo/DemoFlowCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/dashboard/investments", label: "مشارکت‌های من" },
  { href: "/dashboard/projects", label: "پروژه‌های من" },
] as const;

const INVESTOR_DEMO_FLOW = [
  {
    href: "/dashboard/investments",
    label: "مشاهده مبلغ کل و مشارکت به‌تفکیک پروژه",
  },
  {
    href: "/dashboard/projects",
    label: "مرور پروژه‌هایی که در آن‌ها مشارکت دارید",
  },
] as const;

export default async function InvestorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isDemo = Boolean((await cookies()).get("avid_demo_role")?.value);
  const [data, activeProjects] = await Promise.all([
    getInvestorDashboardData(user.id),
    getInvestorActiveProjects(user.id),
  ]);

  const allocatedCapital = data.allocations.reduce(
    (sum, a) => sum + a.verifiedAmount,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خوش آمدید {user.fullName}. وضعیت مشارکت‌های ثبت‌شده پس از قرارداد —
          فقط مشاهده.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="جمع سرمایه ثبت‌شده"
          value={formatToman(allocatedCapital)}
        />
        <StatCard title="تعداد پروژه‌ها" value={activeProjects.length} />
        <StatCard
          title="تعداد ردیف مشارکت"
          value={data.allocations.length}
        />
      </div>

      {isDemo && <DemoFlowCard steps={[...INVESTOR_DEMO_FLOW]} />}

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
          <CardTitle className="text-base">مشارکت‌های اخیر</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link href="/dashboard/investments">همه</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.allocations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              پس از ثبت قرارداد و واریز خارج از سامانه، مدیر مشارکت شما را
              ثبت می‌کند و اینجا نمایش داده می‌شود.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.allocations.slice(0, 5).map((a) => (
                <li key={a.id} className="text-sm">
                  <Link
                    href={`/dashboard/projects/${a.projectSlug}`}
                    className="font-medium hover:underline"
                  >
                    {a.projectTitle}
                  </Link>
                  <p className="text-muted-foreground">
                    {formatToman(a.verifiedAmount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            این بخش فقط ثبت حسابداری است؛ مبلغی نزد آوید نگهداری نمی‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
