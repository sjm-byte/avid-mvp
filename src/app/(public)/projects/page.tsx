import Link from "next/link";
import { getPublicProjectsArchive } from "@/lib/data/public-projects";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { Button } from "@/components/ui/button";
import { MobilePublicPageShell } from "@/components/layout/mobile/MobilePublicPageShell";

export default function ProjectsPage() {
  const projects = getPublicProjectsArchive();

  return (
    <>
      <div className="md:hidden">
        <MobilePublicPageShell
          title="آرشیو طرح‌های قبلی"
          lead="این صفحه ویترین فرصت باز نیست. نمونه‌ای از طرح‌های سابق آوید است تا سابقه مشارکت را ببینید. فرصت‌های جدید از مسیر تماس و معرفی هماهنگ می‌شوند."
        >
          <div className="rounded-2xl border border-[#1F1A2A]/10 bg-[#242030] px-4 py-3.5 text-sm leading-relaxed text-white/75 shadow-[0_14px_32px_-22px_rgba(40,30,60,0.35)]">
            برای مقایسه پیش‌بینی و نتیجه واقعی،{" "}
            <Link
              href="/transparency"
              className="font-medium text-[#C9B4DE] underline-offset-2 hover:underline"
            >
              صفحه شفافیت
            </Link>{" "}
            را ببینید. برای اعلام آمادگی، از{" "}
            <Link
              href="/contact"
              className="font-medium text-[#C9B4DE] underline-offset-2 hover:underline"
            >
              تماس با دفتر آوید
            </Link>{" "}
            استفاده کنید.
          </div>
          <ProjectRiskDisclaimer
            compact
            className="mt-4 border-amber-300/80 bg-amber-50/95 text-amber-950"
          />
          {projects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#1F1A2A]/10 bg-[#242030] px-5 py-10 text-center text-white shadow-[0_14px_32px_-22px_rgba(40,30,60,0.35)]">
              <p className="text-sm text-white/60">
                در حال حاضر طرحی در آرشیو عمومی ثبت نشده است.
              </p>
              <Button
                className="mt-4 rounded-full bg-[#A07CC4] hover:bg-[#946CB9]"
                asChild
              >
                <Link href="/transparency">مشاهده شفافیت و عملکرد</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4 [&_.rounded-lg]:max-md:rounded-2xl [&_.rounded-lg]:max-md:border-[#1F1A2A]/10 [&_.rounded-lg]:max-md:bg-[#242030] [&_.rounded-lg]:max-md:text-white [&_.text-muted-foreground]:max-md:text-white/60 [&_.bg-amber-50\/60]:max-md:border-amber-300/40 [&_.bg-amber-50\/60]:max-md:bg-amber-500/15 [&_.bg-amber-50\/60]:max-md:text-amber-100 [&_.bg-muted\/20]:max-md:bg-white/5">
              {projects.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </MobilePublicPageShell>
      </div>

      <div className="container mx-auto hidden max-w-7xl px-4 py-12 md:block">
        <header className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            آرشیو طرح‌های قبلی
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            این صفحه محل اعلام فرصت باز نیست. نمونه‌ای از طرح‌های سابق آوید است
            تا سابقه مشارکت را ببینید. فرصت‌های جدید از مسیر تماس و معرفی
            هماهنگ می‌شوند؛ شرکت‌های تکراری به‌عنوان طرح‌های جداگانه نمایش داده
            می‌شوند.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            برای مقایسه پیش‌بینی و نتیجه واقعی،{" "}
            <Link
              href="/transparency"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              صفحه شفافیت
            </Link>{" "}
            را ببینید. برای اعلام آمادگی، از{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              تماس با دفتر آوید
            </Link>{" "}
            استفاده کنید.
          </p>
        </header>

        <div className="mt-6">
          <ProjectRiskDisclaimer compact />
        </div>

        {projects.length === 0 ? (
          <div className="mt-16 rounded-lg border bg-muted/30 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              در حال حاضر طرحی در آرشیو عمومی ثبت نشده است.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/transparency">مشاهده شفافیت و عملکرد</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <PublicProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
