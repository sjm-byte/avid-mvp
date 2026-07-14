import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorPortfolioFromOps } from "@/lib/data/investor-portfolio-from-ops";
import { getActiveProjectUpdatesFromOps } from "@/lib/data/active-updates-from-ops";
import { InvestorSummaryStats } from "@/components/investor/InvestorSummaryStats";
import { InvestorPortfolioTimeline } from "@/components/investor/InvestorPortfolioTimeline";
import { InvestorProjectsTable } from "@/components/investor/InvestorProjectsTable";
import { ActiveProjectUpdatesBox } from "@/components/investor/ActiveProjectUpdatesBox";
import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const portfolio = await getInvestorPortfolioFromOps();
  const activeUpdates = await getActiveProjectUpdatesFromOps();

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold">پروژه‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          همه پروژه‌هایی که پس از قرارداد، مشارکت شما در آن‌ها ثبت شده است.
        </p>
      </div>

      <InvestorSummaryStats summary={portfolio} />

      <InvestorPortfolioTimeline summary={portfolio} />

      <section className="min-w-0 space-y-4">
        <h2 className="text-lg font-semibold">پروژه‌های من</h2>
        <InvestorProjectsTable projects={portfolio.projects} />
      </section>

      <ActiveProjectUpdatesBox updates={activeUpdates} />

      <RiskDisclosureBox variant="compact" />
    </div>
  );
}
