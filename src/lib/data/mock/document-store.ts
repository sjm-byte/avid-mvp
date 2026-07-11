import { cookies } from "next/headers";
import { AvidDocumentRecord } from "@/types/document";

const COOKIE_NAME = "avid_mock_project_documents";

export async function getAllMockDocuments(): Promise<AvidDocumentRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AvidDocumentRecord[];
  } catch {
    return [];
  }
}

export async function saveMockDocument(
  record: AvidDocumentRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockDocuments();
  const index = all.findIndex((d) => d.id === record.id);
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
