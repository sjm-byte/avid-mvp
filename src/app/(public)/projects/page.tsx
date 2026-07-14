import Link from "next/link";
import { getPublicProjectsSorted } from "@/lib/data/public-projects";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const projects = getPublicProjectsSorted();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
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
  );
}
