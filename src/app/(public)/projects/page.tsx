import { getPublicProjects } from "@/lib/data/projects";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">پروژه‌های آوید</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          هر پروژه را جداگانه بررسی کنید. قبل از ثبت درخواست مشارکت، ریسک‌ها،
          سناریوی بازده و اسناد عمومی را مطالعه کنید.
        </p>
      </header>

      <div className="mt-6">
        <ProjectRiskDisclaimer compact />
      </div>

      {projects.length === 0 ? (
        <div className="mt-16 rounded-lg border bg-muted/30 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            در حال حاضر پروژه فعالی برای مشارکت باز نیست.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            می‌توانید عملکرد پروژه‌های خاتمه‌یافته را در صفحه شفافیت ببینید.
          </p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/transparency">مشاهده شفافیت و عملکرد</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
