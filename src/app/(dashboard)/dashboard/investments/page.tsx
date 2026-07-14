import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorPortfolioFromOps } from "@/lib/data/investor-portfolio-from-ops";
import { InvestorSummaryStats } from "@/components/investor/InvestorSummaryStats";
import { formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardInvestmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const portfolio = await getInvestorPortfolioFromOps();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">مشارکت‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          پس از تأیید قرارداد و واریز خارج از سامانه، مدیر مشارکت شما را اینجا
          ثبت می‌کند. درخواست و رسید روی پلتفرم انجام نمی‌شود.
        </p>
      </div>

      <InvestorSummaryStats summary={portfolio} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">تفکیک آورده</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">آورده جدید</p>
              <p className="text-xl font-semibold">
                {formatToman(portfolio.newCapital)}
              </p>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                آورده منتقل‌شده از پروژه قبلی
              </p>
              <p className="text-xl font-semibold">
                {formatToman(portfolio.transferredCapital)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              این مبالغ فقط ثبت حسابداری است؛ وجهی نزد آوید نگهداری نمی‌شود.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">وضعیت تسویه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-muted-foreground">تسویه انجام‌شده</span>
              <span className="font-semibold">
                {portfolio.settlementsDone} پروژه
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-muted-foreground">در انتظار تسویه</span>
              <span className="font-semibold">
                {portfolio.settlementsPending} پروژه
              </span>
            </div>
            <ul className="space-y-2 text-xs">
              {portfolio.projects
                .filter((p) => p.lifecycle === "settled")
                .map((p) => (
                  <li
                    key={p.id}
                    className="rounded-md border border-emerald-200 bg-emerald-50/50 p-2 text-emerald-900"
                  >
                    {p.title}: تسویه شد / مبلغ واریزی:{" "}
                    {formatToman(p.settlementAmount ?? 0)}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">به‌تفکیک پروژه</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/projects">جدول کامل پروژه‌ها</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolio.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">مبلغ مشارکت</span>
                  <span className="font-medium">
                    {formatToman(project.participationAmount)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">آورده جدید</span>
                  <span>{formatToman(project.newCapital)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">آورده قبلی</span>
                  <span>
                    {project.transferredFromPrevious > 0
                      ? formatToman(project.transferredFromPrevious)
                      : "—"}
                  </span>
                </div>
                {project.lifecycle === "settled" &&
                  project.settlementAmount != null && (
                    <p className="rounded-md bg-emerald-50 p-2 font-medium text-emerald-800">
                      تسویه شد / مبلغ واریزی:{" "}
                      {formatToman(project.settlementAmount)}
                    </p>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
