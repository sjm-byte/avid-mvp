import Link from "next/link";
import { getFeaturedProjects, getTransparencyStats } from "@/lib/data/projects";
import { formatToman, formatPersianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const valuePropositions = [
  {
    title: "هر پروژه، مستقل",
    description:
      "هر فرصت مشارکت جداگانه بررسی می‌شود. شرایط، ریسک و بازده پیش‌بینی‌شده برای هر پروژه به‌صورت مجزا اعلام می‌شود.",
  },
  {
    title: "شفافیت مرحله‌ای",
    description:
      "گزارش پیشرفت، اسناد عمومی و نتایج تسویه در دسترس شماست تا وضعیت را مرحله‌به‌مرحله دنبال کنید.",
  },
  {
    title: "بدون نگهداری وجه در آوید",
    description:
      "پول از طریق سامانه آوید عبور نمی‌کند. پس از تأیید درخواست، واریز مستقیماً به حساب معرفی‌شده همان پروژه انجام می‌شود.",
  },
  {
    title: "بازده پیش‌بینی‌شده",
    description:
      "اعداد بازده سناریو هستند، نه وعده سود. نتیجه نهایی پس از پایان پروژه و بر اساس حساب‌وکتاب واقعی محاسبه می‌شود.",
  },
];

const howItWorks = [
  {
    step: "۱",
    title: "بررسی پروژه‌ها",
    description:
      "پروژه‌های باز را مطالعه کنید: معرفی، ریسک‌ها، بازده پیش‌بینی‌شده و اسناد عمومی.",
  },
  {
    step: "۲",
    title: "ثبت درخواست مشارکت",
    description:
      "پس از پذیرش ریسک و شرایط همان پروژه، درخواست مشارکت ثبت می‌شود. این مرحله به معنی پرداخت فوری نیست.",
  },
  {
    step: "۳",
    title: "واریز به حساب پروژه",
    description:
      "در صورت تأیید آوید، دستورالعمل واریز به حساب معرفی‌شده پروژه در پنل شما نمایش داده می‌شود.",
  },
  {
    step: "۴",
    title: "پیگیری اجرا و گزارش‌ها",
    description:
      "وضعیت پروژه، گزارش‌های دوره‌ای و رویدادهای حسابداری را در طول اجرا دنبال کنید.",
  },
  {
    step: "۵",
    title: "تسویه بر اساس نتیجه واقعی پروژه",
    description:
      "پس از پایان پروژه، سهم شما بر اساس نتیجه واقعی پروژه محاسبه و به‌صورت دستی تسویه می‌شود.",
  },
];

const faqItems = [
  {
    q: "آوید صندوق سرمایه‌گذاری است؟",
    a: "خیر. آوید پلتفرم مدیریت مشارکت پروژه‌ای است. وجه نزد آوید نگهداری نمی‌شود.",
  },
  {
    q: "آیا بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه است؟",
    a: "خیر. بازده پیش‌بینی‌شده صرفاً سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود.",
  },
  {
    q: "پرداخت چگونه انجام می‌شود؟",
    a: "پس از تأیید درخواست، اطلاعات حساب مقصد همان پروژه در پنل شما نمایش داده می‌شود و پرداخت خارج از سامانه انجام می‌شود.",
  },
];

export default async function HomePage() {
  const [featuredProjects, stats] = await Promise.all([
    getFeaturedProjects(3),
    getTransparencyStats(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/60 via-muted/20 to-background">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center md:py-24">
          <p className="text-sm font-medium text-primary">
            پلتفرم مشارکت پروژه‌ای — نه صندوق، نه نگهداری وجه
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            آوید؛ مشارکت شفاف در پروژه‌های واقعی
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            پروژه‌ها را جداگانه بررسی کنید، ریسک‌ها را ببینید و بازده
            پیش‌بینی‌شده را در کنار واقعیت اجرا ارزیابی کنید — بدون وعده بازده
            پیش‌بینی‌شده به‌عنوان نتیجه واقعی پروژه.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/projects">مشاهده پروژه‌های باز</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/risk-disclosure">افشای ریسک و هشدارها</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">ورود آزمایشی</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">چرا آوید متفاوت است؟</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            مدل آوید بر شفافیت پروژه‌محور و ثبت حسابداری شفاف بنا شده است، نه
            بر بازده پیش‌بینی‌شده بدون شفافیت.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valuePropositions.map((item) => (
            <Card key={item.title} className="border-muted/80">
              <CardHeader className="space-y-2 pb-2">
                <CardTitle className="text-base font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/25">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">مسیر مشارکت در آوید</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              از بررسی پروژه تا تسویه نهایی — هر مرحله شفاف و قابل پیگیری است.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <Card key={item.step} className="bg-background">
                <CardHeader className="space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">پروژه‌های فعال</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              هر کارت را باز کنید تا جزئیات، ریسک و بازده پیش‌بینی‌شده را ببینید.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">همه پروژه‌ها</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Trust & transparency */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">شفافیت و اعتماد</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              آوید نتایج خاتمه‌یافته را منتشر می‌کند تا بتوانید بین پیش‌بینی و
              واقعیت مقایسه کنید.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="space-y-1 p-6 text-center">
                <p className="text-3xl font-bold">
                  {formatPersianNumber(stats.closedProjectsCount)}
                </p>
                <p className="text-sm text-muted-foreground">پروژه خاتمه‌یافته</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 p-6 text-center">
                <p className="text-3xl font-bold">
                  {formatToman(stats.totalManagedCapital)}
                </p>
                <p className="text-sm text-muted-foreground">
                  حجم مشارکت ثبت‌شده
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 p-6 text-center">
                <p className="text-3xl font-bold">
                  {formatPersianNumber(stats.profitableCount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  پروژه با نتیجه مثبت در تسویه
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/transparency">صفحه شفافیت آوید</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/risk-disclosure">مطالعه افشای ریسک</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Risk disclaimer */}
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <ProjectRiskDisclaimer />
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-20">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            سوالات پرتکرار
          </h2>
          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <Card key={item.q}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {item.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/faq">همه سوالات</Link>
            </Button>
            <Button asChild>
              <Link href="/projects">شروع از مشاهده پروژه‌ها</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
