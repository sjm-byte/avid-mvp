import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getMockMilestonesByProject,
  getAllMockMilestoneOverrides,
} from "@/lib/data/mock/milestone-store";
import { getSeedMilestonesForProject } from "@/lib/data/mock/seed-projects";
import {
  mapDbMilestoneStatusToUi,
  mapUiMilestoneStatusToDb,
  MilestoneUiStatus,
  ProjectMilestoneRecord,
} from "@/types/project-report";
import { ProjectMilestoneRow } from "@/types/database";

function mapSeedRow(row: ProjectMilestoneRow): ProjectMilestoneRecord {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    plannedDate: row.planned_date,
    actualDate: row.actual_date,
    status: mapDbMilestoneStatusToUi(row.status),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapSupabaseRow(row: {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  planned_date: string | null;
  actual_date: string | null;
  status: string;
  sort_order: number;
  created_at: string;
}): ProjectMilestoneRecord {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    plannedDate: row.planned_date,
    actualDate: row.actual_date,
    status: mapDbMilestoneStatusToUi(row.status),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mergeMilestones(
  seed: ProjectMilestoneRecord[],
  overrides: ProjectMilestoneRecord[]
): ProjectMilestoneRecord[] {
  const overrideIds = new Set(overrides.map((m) => m.id));
  const merged = [
    ...overrides,
    ...seed.filter((m) => !overrideIds.has(m.id)),
  ];
  return merged.sort((a, b) => a.sortOrder - b.sortOrder);
}

async function fetchSupabaseMilestones(
  projectId: string
): Promise<ProjectMilestoneRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order");

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseRow(row as Parameters<typeof mapSupabaseRow>[0])
  );
}

export async function getProjectMilestones(
  projectId: string
): Promise<ProjectMilestoneRecord[]> {
  const seed = getSeedMilestonesForProject(projectId).map(mapSeedRow);

  if (await shouldUseMockData()) {
    const overrides = await getMockMilestonesByProject(projectId);
    return mergeMilestones(seed, overrides);
  }

  try {
    const remote = await fetchSupabaseMilestones(projectId);
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  const overrides = await getMockMilestonesByProject(projectId);
  return mergeMilestones(seed, overrides);
}

export async function getAllMilestoneOverrides(): Promise<
  ProjectMilestoneRecord[]
> {
  return getAllMockMilestoneOverrides();
}

export function milestoneRecordToTimelineRow(
  milestone: ProjectMilestoneRecord
): ProjectMilestoneRow {
  return {
    id: milestone.id,
    project_id: milestone.projectId,
    title: milestone.title,
    description: milestone.description,
    planned_date: milestone.plannedDate,
    actual_date: milestone.actualDate,
    status: mapUiMilestoneStatusToDb(milestone.status) as ProjectMilestoneRow["status"],
    sort_order: milestone.sortOrder,
    created_at: milestone.createdAt,
  };
}
