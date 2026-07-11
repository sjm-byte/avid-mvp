import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getAllMockProjectUpdates,
  getMockProjectUpdatesByProject,
} from "@/lib/data/mock/update-store";
import {
  mapDbUpdateStatus,
  normalizeReportVisibility,
  ProjectUpdateRecord,
  ProjectUpdateType,
  ReportVisibility,
} from "@/types/project-report";

function mapSupabaseUpdate(row: {
  id: string;
  project_id: string;
  title: string;
  summary: string | null;
  body: string;
  update_type: string;
  operational_status: string | null;
  visibility: string;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  projects?: { title: string } | { title: string }[] | null;
}): ProjectUpdateRecord {
  const project = Array.isArray(row.projects)
    ? row.projects[0]
    : row.projects;

  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: project?.title,
    title: row.title,
    summary: row.summary ?? row.body.slice(0, 200),
    detailedNote: row.body || null,
    updateType: row.update_type as ProjectUpdateType,
    operationalStatus: mapDbUpdateStatus(row.operational_status),
    visibility: normalizeReportVisibility(row.visibility),
    publishedAt: row.published_at ?? row.created_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

async function fetchSupabaseUpdatesForProject(
  projectId: string
): Promise<ProjectUpdateRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_updates")
    .select(
      `
      id,
      project_id,
      title,
      summary,
      body,
      update_type,
      operational_status,
      visibility,
      published_at,
      created_by,
      created_at,
      projects ( title )
    `
    )
    .eq("project_id", projectId)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseUpdate(row as Parameters<typeof mapSupabaseUpdate>[0])
  );
}

async function fetchSupabaseAllUpdates(): Promise<ProjectUpdateRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_updates")
    .select(
      `
      id,
      project_id,
      title,
      summary,
      body,
      update_type,
      operational_status,
      visibility,
      published_at,
      created_by,
      created_at,
      projects ( title )
    `
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseUpdate(row as Parameters<typeof mapSupabaseUpdate>[0])
  );
}

function filterByVisibility(
  updates: ProjectUpdateRecord[],
  options: {
    isAdmin: boolean;
    hasAllocation: boolean;
    publicOnly?: boolean;
  }
): ProjectUpdateRecord[] {
  return updates.filter((u) => {
    if (options.isAdmin) return true;
    if (options.publicOnly) return u.visibility === "public";
    if (u.visibility === "public") return true;
    if (u.visibility === "investor_only" && options.hasAllocation) return true;
    return false;
  });
}

export async function getProjectUpdates(
  projectId: string,
  options: {
    viewerRole: "admin" | "investor" | "public";
    hasAllocation?: boolean;
  }
): Promise<ProjectUpdateRecord[]> {
  const isAdmin = options.viewerRole === "admin";
  const hasAllocation = options.hasAllocation ?? false;
  const publicOnly = options.viewerRole === "public";

  if (await shouldUseMockData()) {
    const updates = await getMockProjectUpdatesByProject(projectId);
    return filterByVisibility(updates, { isAdmin, hasAllocation, publicOnly });
  }

  try {
    const remote = await fetchSupabaseUpdatesForProject(projectId);
    const updates =
      remote.length > 0
        ? remote
        : await getMockProjectUpdatesByProject(projectId);
    return filterByVisibility(updates, { isAdmin, hasAllocation, publicOnly });
  } catch {
    const updates = await getMockProjectUpdatesByProject(projectId);
    return filterByVisibility(updates, { isAdmin, hasAllocation, publicOnly });
  }
}

export async function getAllProjectUpdates(): Promise<ProjectUpdateRecord[]> {
  if (await shouldUseMockData()) {
    return (await getAllMockProjectUpdates()).sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  try {
    const remote = await fetchSupabaseAllUpdates();
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  return (await getAllMockProjectUpdates()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function countProjectUpdates(projectId: string): Promise<number> {
  const updates = await getProjectUpdates(projectId, { viewerRole: "admin" });
  return updates.length;
}
