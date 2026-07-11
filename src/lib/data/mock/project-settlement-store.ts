import { cookies } from "next/headers";
import { ProjectSettlementRecord } from "@/types/settlement";

const COOKIE_NAME = "avid_mock_project_settlements";

export async function getAllMockProjectSettlements(): Promise<
  ProjectSettlementRecord[]
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ProjectSettlementRecord[];
  } catch {
    return [];
  }
}

export async function getMockProjectSettlementByProject(
  projectId: string
): Promise<ProjectSettlementRecord | null> {
  const all = await getAllMockProjectSettlements();
  return all.find((s) => s.projectId === projectId) ?? null;
}

export async function saveMockProjectSettlement(
  record: ProjectSettlementRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockProjectSettlements();
  const index = all.findIndex(
    (s) => s.projectId === record.projectId || s.id === record.id
  );
  if (index >= 0) {
    all[index] = record;
  } else {
    all.push(record);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
