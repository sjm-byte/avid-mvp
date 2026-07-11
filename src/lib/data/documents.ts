import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getAllMockDocuments,
  saveMockDocument,
} from "@/lib/data/mock/document-store";
import { getMockProjectRowById, getAllSeedDocuments } from "@/lib/data/mock/seed-projects";
import { getInvestorRequests } from "@/lib/data/investor-dashboard";
import { getMockInvestmentsByInvestor } from "@/lib/data/mock/investment-store";
import { MOCK_INVESTOR } from "@/lib/auth/mock";
import { ProjectDocumentRow } from "@/types/database";
import {
  AvidDocumentRecord,
  AvidDocumentType,
  AvidDocumentVisibility,
  INVESTOR_DOCUMENT_TYPES,
} from "@/types/document";

const MOCK_INVESTOR_NAMES: Record<string, string> = {
  [MOCK_INVESTOR.id]: MOCK_INVESTOR.fullName,
};

function mapLegacyDocType(documentType: string): AvidDocumentType {
  if (documentType === "contract") return "investor_contract";
  if (documentType === "report") return "financial_report";
  if (documentType === "audit") return "financial_report";
  return "project_document";
}

function mapDbVisibility(visibility: string): AvidDocumentVisibility {
  if (visibility === "investors_only") return "investor_only";
  if (visibility === "public") return "public";
  return "admin_only";
}

function toDbVisibility(visibility: AvidDocumentVisibility): string {
  if (visibility === "investor_only") return "investors_only";
  return visibility;
}

function mapSeedDocument(
  doc: ProjectDocumentRow,
  projectTitle: string
): AvidDocumentRecord {
  return {
    id: doc.id,
    projectId: doc.project_id,
    projectTitle,
    title: doc.title,
    documentType: mapLegacyDocType(doc.document_type),
    visibility: mapDbVisibility(doc.visibility),
    documentDate: doc.created_at.split("T")[0],
    notes: null,
    filePlaceholder: doc.file_path,
    investorId: null,
    createdBy: doc.uploaded_by,
    createdAt: doc.created_at,
  };
}

function mapSupabaseRow(row: {
  id: string;
  project_id: string;
  title: string;
  document_type: string;
  file_path: string;
  visibility: string;
  uploaded_by: string | null;
  created_at: string;
  document_date?: string | null;
  notes?: string | null;
  investor_id?: string | null;
  projects?: { title: string } | { title: string }[] | null;
}): AvidDocumentRecord {
  const project = Array.isArray(row.projects)
    ? row.projects[0]
    : row.projects;

  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: project?.title,
    title: row.title,
    documentType: mapLegacyDocType(row.document_type),
    visibility: mapDbVisibility(row.visibility),
    documentDate: row.document_date ?? row.created_at.split("T")[0],
    notes: row.notes ?? null,
    filePlaceholder: row.file_path,
    investorId: row.investor_id ?? null,
    createdBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

async function getSeedDocuments(): Promise<AvidDocumentRecord[]> {
  return getAllSeedDocuments().map(({ doc, projectTitle }) =>
    mapSeedDocument(doc, projectTitle)
  );
}

function mergeDocuments(
  ...sources: AvidDocumentRecord[][]
): AvidDocumentRecord[] {
  const byId = new Map<string, AvidDocumentRecord>();
  for (const list of sources) {
    for (const doc of list) {
      byId.set(doc.id, doc);
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
  );
}

async function fetchSupabaseDocuments(): Promise<AvidDocumentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_documents")
    .select(
      `
      id,
      project_id,
      title,
      document_type,
      file_path,
      visibility,
      uploaded_by,
      created_at,
      projects ( title )
    `
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseRow(row as Parameters<typeof mapSupabaseRow>[0])
  );
}

export async function getAllDocuments(): Promise<AvidDocumentRecord[]> {
  const mockCreated = await getAllMockDocuments();
  if (await shouldUseMockData()) {
    return mergeDocuments(await getSeedDocuments(), mockCreated);
  }

  try {
    const remote = await fetchSupabaseDocuments();
    if (remote.length > 0) {
      return mergeDocuments(remote, mockCreated);
    }
  } catch {
    // fall through
  }

  return mergeDocuments(await getSeedDocuments(), mockCreated);
}

export async function getPublicDocumentsForProject(
  projectId: string
): Promise<AvidDocumentRecord[]> {
  const all = await getAllDocuments();
  return all.filter(
    (doc) => doc.projectId === projectId && doc.visibility === "public"
  );
}

async function getInvestorProjectIds(investorId: string): Promise<Set<string>> {
  const projectIds = new Set<string>();
  const requests = await getInvestorRequests(investorId);
  for (const request of requests) {
    if (!["cancelled", "rejected"].includes(request.status)) {
      projectIds.add(request.projectId);
    }
  }

  if (await shouldUseMockData()) {
    const allocations = await getMockInvestmentsByInvestor(investorId);
    for (const allocation of allocations) {
      projectIds.add(allocation.projectId);
    }
  } else {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("investments")
        .select("project_id")
        .eq("investor_id", investorId);
      for (const row of data ?? []) {
        projectIds.add(row.project_id);
      }
    } catch {
      const allocations = await getMockInvestmentsByInvestor(investorId);
      for (const allocation of allocations) {
        projectIds.add(allocation.projectId);
      }
    }
  }

  return projectIds;
}

export function isDocumentVisibleToInvestor(
  doc: AvidDocumentRecord,
  investorId: string,
  projectIds: Set<string>
): boolean {
  if (doc.visibility === "admin_only") return false;

  if (doc.visibility === "public") return true;

  const isPersonalDoc =
    INVESTOR_DOCUMENT_TYPES.includes(doc.documentType) && doc.investorId;

  if (isPersonalDoc) {
    return doc.investorId === investorId;
  }

  if (doc.visibility === "investor_only" && projectIds.has(doc.projectId)) {
    if (doc.investorId && doc.investorId !== investorId) return false;
    return true;
  }

  if (
    INVESTOR_DOCUMENT_TYPES.includes(doc.documentType) &&
    doc.investorId === investorId
  ) {
    return true;
  }

  return false;
}

export async function getInvestorDocuments(
  investorId: string
): Promise<AvidDocumentRecord[]> {
  const [all, projectIds] = await Promise.all([
    getAllDocuments(),
    getInvestorProjectIds(investorId),
  ]);

  return all
    .filter((doc) => isDocumentVisibleToInvestor(doc, investorId, projectIds))
    .map((doc) => ({
      ...doc,
      investorName: doc.investorId
        ? (MOCK_INVESTOR_NAMES[doc.investorId] ?? doc.investorName)
        : doc.investorName,
    }));
}

export async function persistDocument(
  record: AvidDocumentRecord
): Promise<void> {
  if (await shouldUseMockData()) {
    await saveMockDocument(record);
    return;
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_documents").insert({
      project_id: record.projectId,
      title: record.title,
      document_type: record.documentType,
      file_path: record.filePlaceholder,
      visibility: toDbVisibility(record.visibility),
      uploaded_by: record.createdBy,
      created_at: record.createdAt,
    });

    if (error) {
      await saveMockDocument(record);
    }
  } catch {
    await saveMockDocument(record);
  }
}

export { toDbVisibility, mapDbVisibility };
