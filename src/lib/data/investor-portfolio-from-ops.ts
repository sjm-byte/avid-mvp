import { getAllProjectOps } from "@/lib/data/mock/project-ops-store";
import {
  CapitalMovementKind,
  getSeedMovementsForInvestor,
} from "@/lib/data/mock/capital-movements-mock";
import { MOCK_INVESTOR } from "@/lib/auth/mock";
import {
  CapitalMovementDetail,
  CashFlowEvent,
  CashFlowKind,
  InvestorPortfolioSummary,
  InvestorProjectLifecycle,
  InvestorProjectRow,
  InvestorTimelineStatus,
} from "@/lib/data/mock/investor-portfolio-mock";
import { SETTLEMENT_TIMING_LABELS } from "@/types/project-ops";

function timelineStatus(
  lifecycle: InvestorProjectLifecycle,
  timing: string | null,
): InvestorTimelineStatus {
  if (lifecycle === "active") return "active";
  if (lifecycle === "completed") return "awaiting_settlement";
  if (timing === "settled_on_time") return "settled_on_time";
  return "settled_late";
}

function statusLabel(
  lifecycle: InvestorProjectLifecycle,
  timing: string | null,
): string {
  if (lifecycle === "active") return "در حال اجرا";
  if (lifecycle === "completed") return "پایان‌یافته — در انتظار تسویه";
  if (timing === "settled_on_time") {
    return SETTLEMENT_TIMING_LABELS.settled_on_time;
  }
  if (timing === "settled_late") {
    return SETTLEMENT_TIMING_LABELS.settled_late;
  }
  return "تسویه‌شده";
}

function toCashFlowKind(kind: CapitalMovementKind): CashFlowKind {
  switch (kind) {
    case "deposit":
      return "deposit";
    case "profit_in":
      return "profit";
    case "settlement_out":
      return "withdrawal";
  }
}

/** Build investor portfolio summary from shared project-ops + capital movements. */
export async function getInvestorPortfolioFromOps(): Promise<InvestorPortfolioSummary> {
  const projects = await getAllProjectOps();
  const rows: InvestorProjectRow[] = [];

  for (const project of projects) {
    const demo =
      project.investors.find((i) => i.isDemoInvestor) ??
      project.investors.find((i) => i.name === "علی رضایی");
    if (!demo) continue;

    const lifecycle = project.lifecycle;
    const balanceAfter =
      lifecycle === "settled"
        ? (demo.settledPaidAmount ?? demo.amount)
        : demo.amount;

    rows.push({
      id: project.id,
      slug: project.slug,
      title: project.title,
      participationAmount: demo.amount,
      newCapital: demo.newCapital,
      transferredFromPrevious: demo.transferredFromPrevious,
      balanceAfterProject: balanceAfter,
      timelineStatus: timelineStatus(lifecycle, project.settlementTiming),
      startDate:
        project.startDate ?? project.endDate ?? new Date().toISOString(),
      endDate: project.endDate,
      profitDueDate: project.endDate,
      lifecycle,
      statusLabel: statusLabel(lifecycle, project.settlementTiming),
      settlementAmount: demo.settledPaidAmount,
    });
  }

  const electronics = rows.find((r) => r.slug === "electronics-import-closed");
  if (electronics && electronics.lifecycle === "settled") {
    electronics.balanceAfterProject = 13000000000;
  }

  const activeRows = rows.filter((p) => p.lifecycle === "active");
  const rialHeldRows = rows.filter((p) => p.lifecycle === "completed");
  const activeProjectCapital = activeRows.reduce(
    (s, p) => s + p.participationAmount,
    0,
  );
  const rialBalanceWithAvid = rialHeldRows.reduce(
    (s, p) => s + p.participationAmount,
    0,
  );

  const movements = getSeedMovementsForInvestor(MOCK_INVESTOR.id);
  const deposits = movements.filter((m) => m.kind === "deposit");
  const settlements = movements.filter((m) => m.kind === "settlement_out");

  const toDetail = (
    m: (typeof movements)[number],
  ): CapitalMovementDetail => ({
    id: m.id,
    date: m.date,
    amount: m.amount,
    projectTitle: m.projectTitle,
    note: m.note,
  });

  const depositDetails = deposits.map(toDetail);
  const settlementDetails = settlements.map(toDetail);

  let runningBalance = 0;
  const cashFlowEvents: CashFlowEvent[] = movements.map((m) => {
    if (m.kind === "settlement_out") {
      runningBalance -= m.amount;
    } else {
      runningBalance += m.amount;
    }
    return {
      id: m.id,
      kind: toCashFlowKind(m.kind),
      date: m.date,
      amount: m.amount,
      balanceAfter: runningBalance,
      projectTitle: m.projectTitle,
      note: m.note,
    };
  });

  const totalDeposited = deposits.reduce((s, m) => s + m.amount, 0);
  const settledBalanceToDate = settlements.reduce((s, m) => s + m.amount, 0);

  return {
    cumulativeCapital:
      totalDeposited > 0
        ? totalDeposited
        : rows.reduce((s, p) => s + p.participationAmount, 0),
    activeProjectCapital,
    rialBalanceWithAvid,
    settledBalanceToDate,
    currentCapital: activeProjectCapital + rialBalanceWithAvid,
    newCapital: rows.reduce((s, p) => s + p.newCapital, 0),
    transferredCapital: rows.reduce(
      (s, p) => s + p.transferredFromPrevious,
      0,
    ),
    activeProjectCount: activeRows.length,
    endedProjectCount: rows.filter(
      (p) => p.lifecycle === "completed" || p.lifecycle === "settled",
    ).length,
    settlementsDone: rows.filter((p) => p.lifecycle === "settled").length,
    settlementsPending: rialHeldRows.length,
    depositDetails,
    settlementDetails,
    cashFlowEvents,
    timelineStartDate: "2025-11-01",
    timelineStartLabel: "شروع همکاری",
    projects: [...rows].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    ),
  };
}
