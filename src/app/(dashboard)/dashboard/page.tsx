import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorPortfolioFromOps } from "@/lib/data/investor-portfolio-from-ops";
import { getActiveProjectUpdatesFromOps } from "@/lib/data/active-updates-from-ops";
import { InvestorSummaryStats } from "@/components/investor/InvestorSummaryStats";
import { InvestorPortfolioTimeline } from "@/components/investor/InvestorPortfolioTimeline";
import { InvestorProjectsTable } from "@/components/investor/InvestorProjectsTable";
import { ActiveProjectUpdatesBox } from "@/components/investor/ActiveProjectUpdatesBox";
import { DemoFlowCard } from "@/components/demo/DemoFlowCard";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";

const INVESTOR_DEMO_FLOW = [
  {
    href: "/dashboard",
    label: "مرور خلاصه آورده، خط زمانی و جدول پروژه‌ها",
  },
  {
    href: "/dashboard/documents",
    label: "مشاهده اسناد مرتبط با مشارکت",
  },
] as const;

export default async function InvestorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isDemo = Boolean((await cookies()).get("avid_demo_role")?.value);
  const portfolio = await getInvestorPortfolioFromOps();
  const activeUpdates = await getActiveProjectUpdatesFromOps();

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خوش آمدید {user.fullName}. وضعیت مشارکت‌های ثبت‌شده پس از قرارداد —
          فقط مشاهده.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          مبالغ و بازده پیش‌بینی‌شده تا زمان تسویه نهایی قطعی نیستند.
        </p>
      </div>

      <InvestorSummaryStats summary={portfolio} />

      <InvestorPortfolioTimeline summary={portfolio} />

      <section className="min-w-0 space-y-4">
        <h2 className="text-lg font-semibold">پروژه‌های من</h2>
        <InvestorProjectsTable projects={portfolio.projects} />
      </section>

      <ActiveProjectUpdatesBox updates={activeUpdates} />

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-base">اسناد و تسویه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex min-w-0 flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/documents">اسناد و قراردادها</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/investments">وضعیت تسویه مشارکت‌ها</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/profile">پروفایل</Link>
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            این بخش فقط ثبت حسابداری است؛ مبلغی نزد آوید نگهداری نمی‌شود و
            پرداخت از طریق درگاه یا کیف پول انجام نمی‌شود.
          </p>
        </CardContent>
      </Card>

      {isDemo && <DemoFlowCard steps={[...INVESTOR_DEMO_FLOW]} />}

      <RiskDisclosureBox variant="compact" />
    </div>
  );
}
