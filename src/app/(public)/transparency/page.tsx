import Link from "next/link";
import { Check } from "lucide-react";
import {
  SETTLEMENT_OUTCOME_COLUMNS,
  getSettlementOutcome,
  getTransparencySettlementRows,
} from "@/lib/data/transparency-settlement-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransparencyPage() {
  const rows = getTransparencySettlementRows();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          شفافیت و مقایسه پیش‌بینی با واقعیت
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          در این صفحه طرح‌های سرمایه‌گذاری‌شده آوید را به‌ترتیب فهرست می‌بینید
          و وضعیت تسویه هر طرح، در صورت اعلام، با تیک مشخص می‌شود.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-1 p-6 text-center">
            <p className="text-3xl font-bold">+15</p>
            <p className="text-sm text-muted-foreground">پروژه خاتمه‌یافته</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-6 text-center">
            <p className="text-3xl font-bold">+50 میلیارد تومن</p>
            <p className="text-sm text-muted-foreground">
              حجم مشارکت ثبت‌شده
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-6 text-center">
            <p className="text-3xl font-bold">+15</p>
            <p className="text-sm text-muted-foreground">
              پروژه‌های در جریان
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            جدول وضعیت تسویه پروژه‌ها
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            ستون اول، فهرست طرح‌ها به‌ترتیب همان فایل فهرست سرمایه‌گذاری است.
            برای هر طرح حداکثر یک ستون تسویه تیک می‌خورد.
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            هنوز پروژه‌ای برای نمایش ثبت نشده است.
          </p>
        ) : (
          <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-right">
                  <th className="sticky right-0 bg-muted/50 px-4 py-3 font-medium">
                    پروژه‌ها (به ترتیب)
                  </th>
                  {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="min-w-[9.5rem] px-3 py-3 text-center font-medium leading-6"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const outcome = getSettlementOutcome(p.id);
                  return (
                    <tr key={p.id} className="border-b">
                      <td className="sticky right-0 bg-background px-4 py-3">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="font-medium hover:underline"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {p.activity}
                          <span className="mx-1">·</span>
                          شروع
                          {" "}
                          {p.startDate}
                        </p>
                      </td>
                      {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className="px-3 py-3 text-center text-muted-foreground"
                        >
                          {outcome === col.key ? (
                            <Check
                              className="mx-auto h-5 w-5 text-primary"
                              aria-label="تیک"
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Card className="mt-10 border-amber-200 bg-amber-50/60">
        <CardHeader>
          <CardTitle className="text-base">نکته مهم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            عملکرد گذشته معیار قطعی برای آینده نیست. هر پروژه جدید ریسک، زمان‌بندی
            و بازده پیش‌بینی‌شده مخصوص به خود را دارد.
          </p>
          <p>
            قبل از مشارکت، صفحه همان پروژه و افشای ریسک را مطالعه کنید و ریسک
            همان پروژه را جداگانه بپذیرید.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/projects">مشاهده پروژه‌های باز</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/risk-disclosure">افشای ریسک</Link>
        </Button>
      </div>
    </div>
  );
}
