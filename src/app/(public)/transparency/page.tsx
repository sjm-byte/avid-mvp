import Link from "next/link";
import {
  getClosedProjectsForTransparency,
} from "@/lib/data/projects";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TransparencyPage() {
  const closedProjects = await getClosedProjectsForTransparency();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          شفافیت و مقایسه پیش‌بینی با واقعیت
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          در این صفحه نتایج پروژه‌های خاتمه‌یافته آوید را می‌بینید: بازده
          پیش‌بینی‌شده در زمان جذب سرمایه در کنار نتیجه واقعی پروژه پس از تسویه. هدف،
          تصمیم‌گیری آگاهانه است — نه وعده عملکرد آینده.
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
            جدول وضعیت تسویه پروژه‌های خاتمه‌یافته
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            این جدول، وضعیت تسویه پروژه‌ها را بر اساس زمان و نتیجه دسته‌بندی
            می‌کند. تکمیل خانه‌ها طبق لیست و منطق موردنظر شما انجام می‌شود.
          </p>
        </div>

        {closedProjects.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            هنوز پروژه خاتمه‌یافته‌ای برای نمایش ثبت نشده است.
          </p>
        ) : (
          <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-right">
                  <th className="px-4 py-3 font-medium">پروژه‌ها (به ترتیب)</th>
                  <th className="px-4 py-3 font-medium">سر موعد تسویه شده</th>
                  <th className="px-4 py-3 font-medium">
                    با یک ماه تأخیر تسویه شد
                  </th>
                  <th className="px-4 py-3 font-medium">
                    با بیش از یک ماه تأخیر ولی با سود اضافه تسویه شد
                  </th>
                  <th className="px-4 py-3 font-medium">
                    با بیش از یک ماه تأخیر ولی بدون سود اضافه تسویه شد
                  </th>
                </tr>
              </thead>
              <tbody>
                {closedProjects.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-3">
                      <Link
                        href={`/projects/${p.slug}`}
                        className="font-medium hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                  </tr>
                ))}
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
