import Link from "next/link";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const riskSections = [
  {
    title: "ماهیت مشارکت در آوید",
    body: "آوید پلتفرم مدیریت مشارکت پروژه‌ای است، نه صندوق سرمایه‌گذاری و نه درگاه پرداخت. وجه نزد آوید نگهداری نمی‌شود و پس از تأیید درخواست، واریز مستقیماً به حساب معرفی‌شده همان پروژه انجام می‌شود.",
  },
  {
    title: "بازده پیش‌بینی‌شده چیست؟",
    body: "اعداد بازده در هر پروژه سناریوی پیش‌بینی هستند. نتیجه واقعی پروژه پس از اجرای واقعی، فروش، وصول مطالبات، کسر هزینه‌ها و تسویه مشخص می‌شود. آوید مبلغ مشارکت یا بازده پیش‌بینی‌شده را به‌عنوان نتیجه واقعی پروژه وعده نمی‌دهد.",
  },
  {
    title: "ریسک‌های هر پروژه",
    body: "ریسک‌ها به‌صورت کیفی و توضیحی در صفحه همان پروژه منتشر می‌شوند. آوید امتیاز عددی یکسان برای همه پروژه‌ها ارائه نمی‌دهد. هر پروژه مستقل است و باید جداگانه ارزیابی شود.",
  },
  {
    title: "پذیرش ریسک به‌ازای هر پروژه",
    body: "ثبت درخواست مشارکت در یک پروژه به معنی پذیرش ریسک همان پروژه است — نه پروژه‌های دیگر. پیش از ثبت درخواست باید معرفی، ریسک‌ها، بازده پیش‌بینی‌شده، اسناد عمومی و شرایط همان پروژه را مطالعه کرده و تأیید کنید.",
  },
  {
    title: "مسئولیت سرمایه‌گذار",
    body: "تصمیم مشارکت با شماست. مبالغ و سهم سود/زیان تا زمان تسویه نهایی ثبت نشده‌اند. در صورت تردید، از مشارکت خودداری کنید یا با مشاور مستقل مشورت کنید.",
  },
];

export default function RiskDisclosurePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          افشای ریسک و هشدارهای مشارکت
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          لطفاً پیش از بررسی یا ثبت درخواست مشارکت در هر پروژه، این صفحه و
          هشدارهای همان پروژه را با دقت مطالعه کنید.
        </p>
      </header>

      <div className="mt-8">
        <ProjectRiskDisclaimer />
      </div>

      <div className="mt-10 space-y-5">
        {riskSections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 border-primary/20 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">گام بعدی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            پس از مطالعه این صفحه، هر پروژه را جداگانه باز کنید، بازده
            پیش‌بینی‌شده و ریسک‌های اختصاصی آن را ببینید و فقط در صورت پذیرش
            کامل شرایط همان پروژه درخواست مشارکت ثبت کنید.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/projects">مشاهده پروژه‌ها</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/transparency">مشاهده شفافیت و نتایج گذشته</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
