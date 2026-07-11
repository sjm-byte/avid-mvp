import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { getPaymentInstructionsForRequests } from "@/lib/data/payment-instructions";
import {
  getInvestorPaymentReceipts,
  receiptsByRequestId,
} from "@/lib/data/receipts";
import { getInvestorActiveProjects } from "@/lib/data/investor-projects";
import { getInvestorFinalizedSettlementResults } from "@/lib/data/settlement-distribution";
import { StatCard } from "@/components/shared/StatCard";
import { InvestmentRequestsList } from "@/components/investments/InvestmentRequestsList";
import { ActiveProjectCard } from "@/components/projects/ActiveProjectCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPercent, formatToman } from "@/lib/utils";
import { DemoFlowCard } from "@/components/demo/DemoFlowCard";

const QUICK_LINKS = [
  { href: "/projects", label: "ویترین پروژه‌ها" },
  { href: "/dashboard/projects", label: "پروژه‌های من" },
  { href: "/dashboard/investments", label: "درخواست‌ها و تخصیص" },
  { href: "/dashboard/ledger", label: "ثبت حسابداری" },
  { href: "/dashboard/documents", label: "اسناد" },
] as const;

const INVESTOR_DEMO_FLOW = [
  { href: "/projects", label: "مشاهده پروژه‌های باز در ویترین عمومی" },
  {
    href: "/projects/food-import-raw-materials",
    label: "باز کردن جزئیات یک پروژه و ثبت درخواست مشارکت",
  },
  { href: "/dashboard/investments", label: "پیگیری درخواست، رسید و تخصیص" },
  { href: "/dashboard/ledger", label: "مشاهده ثبت حسابداری رویدادها" },
  { href: "/dashboard/documents", label: "دانلود اسناد عمومی پروژه‌ها" },
] as const;

export default async function InvestorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isDemo = Boolean((await cookies()).get("avid_demo_role")?.value);

  const data = await getInvestorDashboardData(user.id);
  const [paymentInstructionsByRequestId, receipts, activeProjects, finalizedSettlements] =
    await Promise.all([
      getPaymentInstructionsForRequests(data.requests),
      getInvestorPaymentReceipts(user.id),
      getInvestorActiveProjects(user.id),
      getInvestorFinalizedSettlementResults(user.id),
    ]);
  const receiptsByRequestIdMap = receiptsByRequestId(receipts);

  const myRequestsCount = data.requests.filter(
    (r) => !["cancelled", "rejected"].includes(r.status)
  ).length;
  const allocatedCapital = data.allocations.reduce(
    (sum, a) => sum + a.verifiedAmount,
    0
  );
  const pendingReceiptsCount = receipts.filter((r) =>
    ["submitted", "under_review"].includes(r.status)
  ).length;
  const pendingManualPayoutsCount = finalizedSettlements.filter(
    (s) => s.payoutStatus === "pending_manual_payout"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خوش آمدید {user.fullName}. وضعیت سرمایه‌گذاری‌های شما در یک نگاه.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="درخواست‌های من" value={myRequestsCount} />
        <StatCard
          title="سرمایه تخصیص‌یافته"
          value={formatToman(allocatedCapital)}
        />
        <StatCard
          title="پروژه‌های فعال من"
          value={activeProjects.length}
        />
        <StatCard
          title="رسیدهای در انتظار بررسی"
          value={pendingReceiptsCount}
        />
        <StatCard
          title="تسویه‌های نهایی"
          value={finalizedSettlements.length}
        />
        <StatCard
          title="پرداخت‌های دستی در انتظار"
          value={pendingManualPayoutsCount}
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">درخواست‌های مشارکت من</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link href="/dashboard/investments">همه</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <InvestmentRequestsList
              requests={data.requests.slice(0, 3)}
              showCancel={false}
              paymentInstructionsByRequestId={paymentInstructionsByRequestId}
              receiptsByRequestId={receiptsByRequestIdMap}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">تخصیص‌های فعال</CardTitle>
          </CardHeader>
          <CardContent>
            {data.allocations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                هنوز تخصیص تأییدشده‌ای ندارید. پس از تأیید رسید پرداخت، سرمایه
                شما به پروژه تخصیص داده می‌شود.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.allocations.map((a) => (
                  <li key={a.id} className="text-sm">
                    <Link
                      href={`/dashboard/projects/${a.projectSlug}`}
                      className="font-medium hover:underline"
                    >
                      {a.projectTitle}
                    </Link>
                    <p className="text-muted-foreground">
                      {formatToman(a.verifiedAmount)}
                      {a.expectedReturnBase != null && (
                        <span className="mr-2 text-xs">
                          · بازده پیش‌بینی‌شده (پایه){" "}
                          {formatPercent(a.expectedReturnBase)} (پیش‌بینی)
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">پروژه‌های فعال من</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link href="/dashboard/projects">همه</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                پس از تأیید رسید و تخصیص سرمایه، پروژه‌های فعال شما اینجا
                نمایش داده می‌شود.
              </p>
            ) : (
              <ul className="space-y-3">
                {activeProjects.slice(0, 3).map((p) => (
                  <li key={p.projectId} className="text-sm">
                    <Link
                      href={`/dashboard/projects/${p.projectSlug}`}
                      className="font-medium hover:underline"
                    >
                      {p.projectTitle}
                    </Link>
                    <p className="text-muted-foreground">
                      {formatToman(p.allocatedAmount)}
                      {p.latestUpdate && (
                        <span className="mr-2 text-xs">
                          · {p.latestUpdate.title}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">خلاصه ثبت حسابداری</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link href="/dashboard/ledger">همه</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.ledgerSummary.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                رویداد مالی ثبت نشده است.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.ledgerSummary.slice(0, 4).map((entry) => (
                  <li key={entry.id} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      {entry.projectTitle}
                    </span>
                    <span>{formatToman(entry.amount)}</span>
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

      {activeProjects.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">پروژه‌های فعال من</h2>
            <Button variant="link" size="sm" asChild>
              <Link href="/dashboard/projects">مشاهده همه</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.slice(0, 3).map((project) => (
              <ActiveProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
