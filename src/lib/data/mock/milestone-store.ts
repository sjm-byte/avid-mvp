import { cookies } from "next/headers";
import { ProjectMilestoneRecord } from "@/types/project-report";

const COOKIE_NAME = "avid_mock_project_milestones";

export async function getAllMockMilestoneOverrides(): Promise<
  ProjectMilestoneRecord[]
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ProjectMilestoneRecord[];
  } catch {
    return [];
  }
}

export async function getMockMilestonesByProject(
  projectId: string
): Promise<ProjectMilestoneRecord[]> {
  const all = await getAllMockMilestoneOverrides();
  return all
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveMockMilestone(
  milestone: ProjectMilestoneRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockMilestoneOverrides();
  const index = all.findIndex((m) => m.id === milestone.id);
  if (index >= 0) {
    all[index] = milestone;
  } else {
    all.push(milestone);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
