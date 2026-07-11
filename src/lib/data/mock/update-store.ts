import { cookies } from "next/headers";
import {
  mapDbUpdateStatus,
  normalizeReportVisibility,
  ProjectUpdateRecord,
} from "@/types/project-report";

const COOKIE_NAME = "avid_mock_project_updates";

function normalizeMockUpdate(raw: ProjectUpdateRecord): ProjectUpdateRecord {
  return {
    ...raw,
    operationalStatus: mapDbUpdateStatus(raw.operationalStatus),
    visibility: normalizeReportVisibility(
      (raw.visibility as string) ?? "investor_only"
    ),
  };
}

export async function getAllMockProjectUpdates(): Promise<ProjectUpdateRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as ProjectUpdateRecord[]).map(normalizeMockUpdate);
  } catch {
    return [];
  }
}

export async function getMockProjectUpdatesByProject(
  projectId: string
): Promise<ProjectUpdateRecord[]> {
  const all = await getAllMockProjectUpdates();
  return all
    .filter((u) => u.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function saveMockProjectUpdate(
  update: ProjectUpdateRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockProjectUpdates();
  const index = all.findIndex((u) => u.id === update.id);
  if (index >= 0) {
    all[index] = update;
  } else {
    all.push(update);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
