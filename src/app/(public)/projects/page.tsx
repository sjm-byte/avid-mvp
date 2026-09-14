import Link from "next/link";
import { getPublicProjectsSorted } from "@/lib/data/public-projects";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { Button } from "@/components/ui/button";
import { MobilePublicPageShell } from "@/components/layout/mobile/MobilePublicPageShell";

export default function ProjectsPage() {
  const projects = getPublicProjectsSorted();

  return (
    <>
      <div className="md:hidden">
        <MobilePublicPageShell
          title="پروژه‌های آوید"
          lead="طرح‌های مشارکت به‌ترتیب تاریخ شروع، از جدید به قدیم. هر طرح را جداگانه بررسی کنید."
        >
          <ProjectRiskDisclaimer
            compact
            className="border-amber-400/30 bg-amber-500/10 text-amber-100"
          />
          {projects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/12 bg-[#242030] px-5 py-10 text-center">
              <p className="text-sm text-white/60">
                در حال حاضر پروژه‌ای برای نمایش وجود ندارد.
              </p>
              <Button
                className="mt-4 rounded-full bg-[#A07CC4] hover:bg-[#946CB9]"
                asChild
              >
                <Link href="/transparency">مشاهده شفافیت و عملکرد</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {projects.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </MobilePublicPageShell>
      </div>

      <div className="container mx-auto hidden max-w-7xl px-4 py-12 md:block">
        <header className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">پروژه‌های آوید</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            طرح‌های مشارکت به‌ترتیب تاریخ شروع، از جدید به قدیم. شرکت‌های تکراری
            به‌عنوان طرح‌های جداگانه نمایش داده می‌شوند.
          </p>
        </header>

        <div className="mt-6">
          <ProjectRiskDisclaimer compact />
        </div>

        {projects.length === 0 ? (
          <div className="mt-16 rounded-lg border bg-muted/30 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              در حال حاضر پروژه‌ای برای نمایش وجود ندارد.
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
