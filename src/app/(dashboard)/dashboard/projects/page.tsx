import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorActiveProjects } from "@/lib/data/investor-projects";
import { ActiveProjectCard } from "@/components/projects/ActiveProjectCard";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  const activeProjects = user
    ? await getInvestorActiveProjects(user.id)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">پروژه‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          فقط پروژه‌هایی که پس از قرارداد، مشارکت شما در آن‌ها ثبت شده است.
        </p>
      </div>

      {activeProjects.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>هنوز پروژه‌ای برای شما ثبت نشده است.</p>
          <Button className="mt-4" variant="outline" size="sm" asChild>
            <Link href="/dashboard/investments">مشاهده مشارکت‌های من</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {activeProjects.map((project) => (
            <ActiveProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      )}

      <RiskDisclosureBox variant="compact" />
    </div>
  );
}
