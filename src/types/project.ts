import {
  ProjectDocumentRow,
  ProjectFinancialResultRow,
  ProjectMilestoneRow,
  ProjectRiskItemRow,
  ProjectRow,
  ProjectStatus,
} from "@/types/database";

export interface ProjectFunding {
  totalVerifiedAmount: number;
  investorCount: number;
  fundingPercent: number;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  category: string | null;
  projectType: string | null;
  shortDescription: string | null;
  minRaise: number;
  maxRaise: number;
  minInvestment: number;
  expectedDurationDays: number | null;
  expectedReturnMin: number | null;
  expectedReturnBase: number | null;
  expectedReturnMax: number | null;
  riskSummary: string | null;
  funding: ProjectFunding;
}

export interface ProjectDetail extends ProjectListItem {
  fullDescription: string | null;
  mitigationPlan: string | null;
  riskItems: ProjectRiskItemRow[];
  milestones: ProjectMilestoneRow[];
  documents: ProjectDocumentRow[];
  expectedEndsAt: string | null;
  actualEndsAt: string | null;
}

export interface ClosedProjectTransparency {
  id: string;
  title: string;
  slug: string;
  projectType: string | null;
  status: ProjectStatus;
  expectedDurationDays: number | null;
  actualDurationDays: number | null;
  expectedReturnBase: number | null;
  actualReturnRate: number | null;
  varianceReason: string | null;
  totalVerifiedCapital: number;
  distributableResult: number;
}

export interface TransparencyStats {
  closedProjectsCount: number;
  totalManagedCapital: number;
  averageDurationDays: number;
  profitableCount: number;
  lossCount: number;
  delayedCount: number;
}

export function mapProjectRowToListItem(
  project: ProjectRow,
  funding: ProjectFunding
): ProjectListItem {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    status: project.status,
    category: project.category,
    projectType: project.project_type,
    shortDescription: project.short_description,
    minRaise: Number(project.min_raise),
    maxRaise: Number(project.max_raise),
    minInvestment: Number(project.min_investment),
    expectedDurationDays: project.expected_duration_days,
    expectedReturnMin: project.expected_return_min
      ? Number(project.expected_return_min)
      : null,
    expectedReturnBase: project.expected_return_base
      ? Number(project.expected_return_base)
      : null,
    expectedReturnMax: project.expected_return_max
      ? Number(project.expected_return_max)
      : null,
    riskSummary: project.risk_summary,
    funding,
  };
}

export function mapToProjectDetail(
  project: ProjectRow,
  funding: ProjectFunding,
  riskItems: ProjectRiskItemRow[],
  milestones: ProjectMilestoneRow[],
  documents: ProjectDocumentRow[]
): ProjectDetail {
  return {
    ...mapProjectRowToListItem(project, funding),
    fullDescription: project.full_description,
    mitigationPlan: project.mitigation_plan,
    riskItems,
    milestones,
    documents,
    expectedEndsAt: project.expected_ends_at,
    actualEndsAt: project.actual_ends_at,
  };
}

export function mapFinancialResultToTransparency(
  project: ProjectRow,
  result: ProjectFinancialResultRow
): ClosedProjectTransparency {
  const capital = Number(result.total_verified_capital);
  const distributable = Number(result.distributable_result);
  const actualReturnRate =
    capital > 0 ? distributable / capital : null;

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    projectType: project.project_type,
    status: project.status,
    expectedDurationDays: project.expected_duration_days,
    actualDurationDays: project.expected_duration_days
      ? project.expected_duration_days + 21
      : null,
    expectedReturnBase: result.expected_return_base
      ? Number(result.expected_return_base)
      : project.expected_return_base
        ? Number(project.expected_return_base)
        : null,
    actualReturnRate,
    varianceReason: result.variance_reason,
    totalVerifiedCapital: capital,
    distributableResult: distributable,
  };
}
