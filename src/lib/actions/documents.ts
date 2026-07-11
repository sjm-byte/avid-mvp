"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { persistDocument } from "@/lib/data/documents";
import { getMockProjectRowById } from "@/lib/data/mock/seed-projects";
import {
  AvidDocumentRecord,
  AvidDocumentType,
  AvidDocumentVisibility,
  INVESTOR_DOCUMENT_TYPES,
} from "@/types/document";

export type DocumentActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  documentType: AvidDocumentType;
  visibility: AvidDocumentVisibility;
  documentDate: string;
  notes?: string;
  filePlaceholder?: string;
  investorId?: string | null;
}

function revalidateDocumentPaths(projectSlug?: string) {
  revalidatePath("/admin/documents");
  revalidatePath("/dashboard/documents");
  if (projectSlug) {
    revalidatePath(`/projects/${projectSlug}`);
  }
}

export async function createDocument(
  input: CreateDocumentInput
): Promise<DocumentActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  if (!input.projectId?.trim()) {
    return { success: false, error: "انتخاب پروژه الزامی است." };
  }
  if (!input.title?.trim()) {
    return { success: false, error: "عنوان سند الزامی است." };
  }
  if (!input.documentDate?.trim()) {
    return { success: false, error: "تاریخ سند الزامی است." };
  }

  const project = getMockProjectRowById(input.projectId);
  const now = new Date().toISOString();
  const id = `mock-doc-${Date.now()}`;

  const record: AvidDocumentRecord = {
    id,
    projectId: input.projectId,
    projectTitle: project?.title,
    title: input.title.trim(),
    documentType: input.documentType,
    visibility: input.visibility,
    documentDate: input.documentDate,
    notes: input.notes?.trim() || null,
    filePlaceholder:
      input.filePlaceholder?.trim() ||
      `/placeholder/${input.documentType}.placeholder`,
    investorId:
      INVESTOR_DOCUMENT_TYPES.includes(input.documentType) &&
      input.investorId?.trim()
        ? input.investorId.trim()
        : null,
    createdBy: user.id,
    createdAt: now,
  };

  await persistDocument(record);
  revalidateDocumentPaths(project?.slug);

  return { success: true, id };
}
