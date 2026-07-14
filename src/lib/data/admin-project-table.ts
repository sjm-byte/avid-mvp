import { ProjectOpsRecord } from "@/types/project-ops";

export interface AdminProjectTableRow {
  id: string;
  slug: string;
  title: string;
  totalCapital: number;
  investors: string[];
  investorAmounts: number[];
  startDate: string | null;
  endDate: string | null;
  monthlyReturn: number;
  collateral: string;
  commissionPercent: number;
  commissionStatus: string;
  lifecycle: ProjectOpsRecord["lifecycle"];
}

export function mapProjectOpsToTableRows(
  projects: ProjectOpsRecord[],
): AdminProjectTableRow[] {
  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    totalCapital: p.totalCapital,
    investors: p.investors.map((i) => i.name),
    investorAmounts: p.investors.map((i) => i.amount),
    startDate: p.startDate,
    endDate: p.endDate,
    monthlyReturn: p.predictedReturn,
    collateral: p.collateral,
    commissionPercent: p.commissionPercent,
    commissionStatus: p.commissionStatus,
    lifecycle: p.lifecycle,
  }));
}
