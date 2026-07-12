import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDashboardData } from "@/lib/data/investor-dashboard";
import { formatPercent, formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectStatus } from "@/types/database";
import { Button } from "@/components/ui/button";

export default async function DashboardInvestmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const data = await getInvestorDashboardData(user.id);
  const total = data.allocations.reduce((s, a) => s + a.verifiedAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">مشارکت‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          پس از تأیید قرارداد و واریز خارج از سامانه، مدیر مشارکت شما را اینجا
          ثبت می‌کند. درخواست و رسید روی پلتفرم انجام نمی‌شود.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">جمع کل سرمایه ثبت‌شده</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatToman(total)}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            این مبلغ فقط ثبت حسابداری است؛ وجهی نزد آوید نگهداری نمی‌شود.
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold">به‌تفکیک پروژه</h2>
        {data.allocations.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            <p>هنوز مشارکتی برای شما ثبت نشده است.</p>
            <p className="mt-2 text-xs">
              پس از قرارداد و واریز به حساب پروژه، مدیر مبلغ را در پنل مدیریت
              ثبت می‌کند و اینجا نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.allocations.map((allocation) => (
              <Card key={allocation.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {allocation.projectTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">
                      مبلغ مشارکت ثبت‌شده
                    </p>
                    <p className="text-lg font-semibold">
                      {formatToman(allocation.verifiedAmount)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    تاریخ ثبت:{" "}
                    {new Date(allocation.allocatedAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                  {allocation.ownershipPercent != null && (
                    <p>
                      سهم تقریبی از هدف پروژه:{" "}
                      {formatPercent(allocation.ownershipPercent)}
                    </p>
                  )}
                  <ProjectStatusBadge
                    status={allocation.projectStatus as ProjectStatus}
                  />
                  {allocation.expectedReturnBase != null && (
                    <p className="text-xs text-amber-800">
                      بازده پیش‌بینی‌شده (پایه):{" "}
                      {formatPercent(allocation.expectedReturnBase)} — پیش‌بینی
                      است، همان نتیجه واقعی پروژه نیست.
                    </p>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/projects/${allocation.projectSlug}`}
                    >
                      جزئیات پروژه
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
