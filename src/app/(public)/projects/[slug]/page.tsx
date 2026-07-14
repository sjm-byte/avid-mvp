import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProjectBySlug } from "@/lib/data/public-projects";
import { formatJalaliDateDisplay, formatPersianNumber } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatAmountToman(amount: number): string {
  return `${formatPersianNumber(amount)} تومان`;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const user = await getCurrentUser();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div className="flex flex-col gap-8 border-b pb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="min-w-0 flex-1 space-y-5">
          <SafeProjectCoverImage
            src={project.image}
            alt={project.title}
            aspectClassName="aspect-[21/9] max-h-72"
            className="rounded-lg border lg:max-w-3xl"
          />
          <p className="text-sm text-muted-foreground">{project.activity}</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {project.title}
          </h1>
        </div>

        <Card className="w-full shrink-0 lg:max-w-sm">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-base">خلاصه طرح</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">مبلغ طرح</span>
                <span className="font-semibold text-left">
                  {formatAmountToman(project.amount)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">تاریخ شروع</span>
                <span className="font-semibold" dir="ltr">
                  {formatJalaliDateDisplay(project.startDate)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">مدت</span>
                <span className="font-semibold">{project.duration}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">بازده پیش‌بینی‌شده</span>
                <p className="font-semibold leading-snug">
                  {project.predictedReturn}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-amber-900">
              این عدد پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              هماهنگی و واریز خارج از سامانه انجام می‌شود. آوید وجهی دریافت
              نمی‌کند.
            </p>
            {user?.role === "investor" ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/investments">مشارکت‌های ثبت‌شده من</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">ورود به پنل</Link>
              </Button>
            )}
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link href="/contact">تماس با تیم آوید</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-8">
        <ProjectRiskDisclaimer />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">معرفی طرح</h2>
          <div className="rounded-lg border bg-muted/20 px-4 py-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              {project.title} — {project.activity}. مبلغ طرح{" "}
              {formatAmountToman(project.amount)}، شروع از{" "}
              <span dir="ltr" className="inline-block">
                {formatJalaliDateDisplay(project.startDate)}
              </span>
              ، مدت {project.duration}.
            </p>
            <p className="mt-3 text-xs">
              شرح تفصیلی این طرح به‌زودی تکمیل می‌شود.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">اسناد</h2>
          <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            اسناد عمومی این طرح به‌زودی منتشر می‌شود.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">گزارش‌ها</h2>
          <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            گزارش‌های پیشرفت و مالی عمومی به‌زودی در این بخش قرار می‌گیرد.
          </div>
        </section>
      </div>
    </div>
  );
}
