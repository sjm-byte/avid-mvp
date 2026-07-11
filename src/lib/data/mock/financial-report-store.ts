import { cookies } from "next/headers";
import {
  normalizeReportVisibility,
  ProjectFinancialReportRecord,
} from "@/types/project-report";

const COOKIE_NAME = "avid_mock_financial_reports";

function normalizeMockReport(
  raw: ProjectFinancialReportRecord
): ProjectFinancialReportRecord {
  return {
    ...raw,
    visibility: normalizeReportVisibility(
      (raw.visibility as string) ?? "investor_only"
    ),
  };
}

export async function getAllMockFinancialReports(): Promise<
  ProjectFinancialReportRecord[]
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as ProjectFinancialReportRecord[]).map(
      normalizeMockReport
    );
  } catch {
    return [];
  }
}

export async function getMockFinancialReportsByProject(
  projectId: string
): Promise<ProjectFinancialReportRecord[]> {
  const all = await getAllMockFinancialReports();
  return all
    .filter((r) => r.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function saveMockFinancialReport(
  report: ProjectFinancialReportRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockFinancialReports();
  const index = all.findIndex((r) => r.id === report.id);
  if (index >= 0) {
    all[index] = report;
  } else {
    all.push(report);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
