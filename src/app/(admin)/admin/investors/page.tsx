import Link from "next/link";
import { getAdminInvestorSummaries } from "@/lib/data/admin-allocations";
import { formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminInvestorsPage() {
  const investors = await getAdminInvestorSummaries();

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">سرمایه‌گذاران</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          جمع مشارکت ثبت‌شده پس از قرارداد، به‌تفکیک فرد و پروژه. واریز خارج از
          سامانه است.
        </p>
      </div>

      {investors.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          هنوز سرمایه‌گذاری ثبت نشده است. از صفحه هر پروژه، مشارکت پس از قرارداد
          را ثبت کنید.
        </div>
      ) : (
        <div className="space-y-4">
          {investors.map((investor) => (
            <Card key={investor.investorId} id={investor.investorId}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {investor.investorName}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {investor.projectCount} پروژه
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">جمع کل</p>
                  <p className="text-lg font-semibold">
                    {formatToman(investor.totalAllocated)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y rounded-md border">
                  {investor.allocations.map((a) => (
                    <li
                      key={`${a.projectId}-${a.allocatedAt}-${a.amount}`}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                    >
                      <Link
                        href={`/admin/projects/${a.projectSlug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {a.projectTitle}
                      </Link>
                      <span className="font-medium">
                        {formatToman(a.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
