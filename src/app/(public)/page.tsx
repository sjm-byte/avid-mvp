import Link from "next/link";
import { Eye } from "lucide-react";
import { getFeaturedPublicProjects } from "@/lib/data/public-projects";
import { Button } from "@/components/ui/button";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { HomeHeroSlideshow } from "@/components/home/HomeHeroSlideshow";
import { ConsultationSupportSignupCard } from "@/components/home/ConsultationSupportSignupCard";
import { TransparencyStatsCards } from "@/components/transparency/TransparencyStatsCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const howItWorks = [
  {
    step: "۱",
    title: "مطالعه صفحه شفافیت آوید",
    description:
      "سابقه عملکرد، اصول قراردادی و انواع قراردادها را در صفحه شفافیت ببینید.",
  },
  {
    step: "۲",
    title: "اعلام آمادگی",
    description:
      "علاقه خود را به مشارکت در پروژه مورد نظر اعلام کنید.",
  },
  {
    step: "۳",
    title: "عقد قرارداد و واریز وجه",
    description:
      "قرارداد و واریز به حساب پروژه خارج از آوید انجام می‌شود؛ پلتفرم درگاه پرداخت ندارد.",
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
    q: "چگونه در یک پروژه مشارکت کنم؟",
    a: "ابتدا صفحه شفافیت آوید را مطالعه کرده و سپس درخواست مشارکت ثبت کنید. در صورت موافقت، پروژه مدنظر به شما معرفی خواهد شد.",
  },
];

export default function HomePage() {
  const featuredProjects = getFeaturedPublicProjects(3);

  return (
    <>
      <HomeHeroSlideshow>
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-12 md:py-16">
          <div className="relative max-w-3xl translate-x-4 translate-y-12 rounded-xl border border-white/10 bg-navy/50 px-4 py-5 backdrop-blur-sm sm:translate-x-6 sm:translate-y-16 sm:px-5 sm:py-6 md:translate-x-8 md:translate-y-20">
            <h1 className="whitespace-nowrap text-[clamp(1rem,3.6vw,2.25rem)] font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
              با آوید، به سرمایه‌گذاری واقعی فکر کن
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] sm:mt-4 sm:text-[0.9375rem] md:text-base">
              آوید، گامی است به سمت اقتصاد مشارکتی.
              <br />
              در آوید پروژه‌ها را بررسی کنید، ریسک‌ها را ببینید و بازده
              پیش‌بینی‌شده را در کنار واقعیت اجرا ارزیابی کنید.
            </p>
          </div>
        </div>
      </HomeHeroSlideshow>

      {/* Performance snapshot */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-14 md:py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              خلاصه عملکرد آوید در یک نگاه
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              آوید نتایج خاتمه‌یافته را منتشر می‌کند تا بتوانید بین پیش‌بینی و
              واقعیت مقایسه کنید.
            </p>
          </div>
          <div className="mt-8">
            <TransparencyStatsCards />
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/transparency"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 transparency-cta-shimmer"
            >
              <span className="transparency-cta-icon relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                <Eye className="size-3.5" aria-hidden />
              </span>
              <span className="relative z-[1] whitespace-nowrap">
                صفحه شفافیت آوید
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Investment plans */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">طرح‌های سرمایه‌گذاری</h2>
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
            <PublicProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/25">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">مسیر مشارکت در آوید</h2>
          </div>
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <Card key={item.step} className="h-full bg-background">
                <CardHeader className="space-y-3 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <CardTitle className="text-base leading-snug">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
            <ConsultationSupportSignupCard layout="tile" />
          </div>
        </div>
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
          </div>
        </div>
      </section>
    </>
  );
}
