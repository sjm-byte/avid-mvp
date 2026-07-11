import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorRequests } from "@/lib/data/investor-dashboard";
import { getPublicProjects } from "@/lib/data/projects";
import {
  getInvestorActiveProjects,
  splitProjectsForInvestor,
} from "@/lib/data/investor-projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ActiveProjectCard } from "@/components/projects/ActiveProjectCard";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import { InvestmentRequestUiStatus } from "@/types/investment";

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  const [projects, requests, activeProjects] = await Promise.all([
    getPublicProjects(),
    user ? getInvestorRequests(user.id) : Promise.resolve([]),
    user ? getInvestorActiveProjects(user.id) : Promise.resolve([]),
  ]);

  const requestByProject = new Map<string, InvestmentRequestUiStatus>();
  for (const request of requests) {
    if (!["rejected", "cancelled"].includes(request.status)) {
      requestByProject.set(request.projectId, request.status);
    }
  }

  const activeProjectIds = new Set(activeProjects.map((p) => p.projectId));
  const { available, active } = splitProjectsForInvestor(
    projects,
    activeProjectIds
  );

  const latestUpdateByProject = new Map(
    activeProjects.map((p) => [p.projectId, p.latestUpdate])
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">پروژه‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          پروژه‌های قابل مشارکت و پروژه‌هایی که سرمایه شما در آن‌ها تخصیص یافته
          است.
        </p>
      </div>

      {activeProjects.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">پروژه‌های فعال من</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeProjects.map((project) => (
              <ActiveProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">پروژه‌های قابل مشارکت</h2>
        {available.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            <p>
              {active.length > 0
                ? "همه پروژه‌های باز را قبلاً انتخاب کرده‌اید یا پروژه جدیدی برای مشارکت وجود ندارد."
                : "در حال حاضر پروژه فعالی برای مشارکت باز نیست."}
            </p>
            {active.length === 0 && (
              <p className="mt-2 text-xs">
                پروژه‌های خاتمه‌یافته را در{" "}
                <Link href="/transparency" className="text-primary hover:underline">
                  صفحه شفافیت
                </Link>{" "}
                ببینید.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {available.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                ctaLabel="مشاهده جزئیات و درخواست مشارکت"
                requestStatus={requestByProject.get(project.id) ?? null}
              />
            ))}
          </div>
        )}
      </section>

      {active.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            پروژه‌های دارای تخصیص — وضعیت کلی
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {active.map((project) => {
              const latest = latestUpdateByProject.get(project.id);
              return (
                <div key={project.id} className="relative">
                  <ProjectCard
                    project={project}
                    ctaLabel="گزارش‌ها و جزئیات"
                    requestStatus="allocated"
                  />
                  {latest && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      آخرین گزارش: {latest.title}
                    </p>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.slug}`}
                    className="mt-1 inline-block text-xs text-primary hover:underline"
                  >
                    مشاهده گزارش‌های پروژه
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <RiskDisclosureBox variant="compact" />
    </div>
  );
}
