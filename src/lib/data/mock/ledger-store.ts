import { cookies } from "next/headers";
import { LedgerEntryRecord } from "@/types/allocation";

const COOKIE_NAME = "avid_mock_ledger_entries";

export async function getAllMockLedgerEntries(): Promise<LedgerEntryRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LedgerEntryRecord[];
  } catch {
    return [];
  }
}

export async function getMockLedgerByInvestor(
  investorId: string
): Promise<LedgerEntryRecord[]> {
  const all = await getAllMockLedgerEntries();
  return all
    .filter((e) => e.investorId === investorId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function saveMockLedgerEntry(
  entry: LedgerEntryRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockLedgerEntries();
  const index = all.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    all[index] = entry;
  } else {
    all.push(entry);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
