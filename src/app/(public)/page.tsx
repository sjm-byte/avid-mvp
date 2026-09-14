import Link from "next/link";
import { getFeaturedPublicProjects } from "@/lib/data/public-projects";
import { Button } from "@/components/ui/button";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { HomeHeroSlideshow } from "@/components/home/HomeHeroSlideshow";
import { HomeContractPrinciplesTeaser } from "@/components/home/HomeContractPrinciplesTeaser";
import { ParticipationPathSection } from "@/components/home/ParticipationPathSection";
import { TransparencyStatsCards } from "@/components/transparency/TransparencyStatsCards";
import { MobileHomePage } from "@/components/home/mobile/MobileHomePage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <div className="md:hidden">
        <MobileHomePage projects={featuredProjects} />
      </div>

      <div className="hidden md:block">
        <HomeHeroSlideshow>
          <div className="container mx-auto max-w-6xl px-4">
            <div className="relative max-w-3xl translate-x-4 rounded-xl border border-white/10 bg-navy/50 px-4 py-5 backdrop-blur-sm sm:translate-x-6 sm:px-5 sm:py-6 md:translate-x-8">
              <h1 className="whitespace-nowrap text-[clamp(1rem,3.6vw,2.25rem)] font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
                با آوید، به سرمایه‌گذاری واقعی فکر کن!
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] sm:mt-4 sm:text-[0.9375rem] md:text-base">
                آوید گامی است برای حرکت به سمت اقتصاد مشارکتی. ابتدا شفافیت و
                سابقه طرح‌های قبلی را ببینید؛ سپس در صورت آمادگی، از مسیر تماس
                با دفتر آوید هماهنگ کنید.
              </p>
            </div>
          </div>
        </HomeHeroSlideshow>

        <section className="border-y bg-muted/30">
          <div className="container mx-auto max-w-5xl px-4 py-14 md:py-16">
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
          </div>
        </section>

        <HomeContractPrinciplesTeaser />

        <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                نمونه طرح‌های قبلی
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                آرشیو سابقه است، نه فهرست فرصت باز. جزئیات هر طرح سابق را
                ببینید؛ فرصت جدید از مسیر تماس هماهنگ می‌شود.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects">مشاهده آرشیو</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <PublicProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <ParticipationPathSection />

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
      </div>
    </>
  );
}
