import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getAllMockLedgerEntries } from "@/lib/data/mock/ledger-store";
import { LedgerEntryRecord } from "@/types/allocation";

const LEDGER_TYPE_LABELS: Record<string, string> = {
  investment_commitment: "تعهد مشارکت",
  payment_receipt_uploaded: "ثبت رسید",
  payment_verified: "تأیید پرداخت",
  capital_allocated: "تخصیص سرمایه",
  settlement_result: "نتیجه واقعی پروژه",
};

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapSupabaseRowToRecord(row: {
  id: string;
  investor_id: string | null;
  project_id: string | null;
  investment_id: string | null;
  entry_type: string;
  direction: "debit" | "credit" | "memo";
  amount: number;
  description: string | null;
  reference_id: string | null;
  status: string;
  created_at: string;
  projects?: { title: string } | { title: string }[] | null;
  profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
}): LedgerEntryRecord {
  const project = unwrapRelation(row.projects ?? null);
  const profile = unwrapRelation(row.profiles ?? null);

  return {
    id: row.id,
    investorId: row.investor_id ?? "",
    investorName: profile?.full_name ?? null,
    projectId: row.project_id ?? "",
    projectTitle: project?.title ?? "—",
    investmentId: row.investment_id,
    receiptId: row.reference_id,
    entryType: row.entry_type,
    direction: row.direction,
    amount: Number(row.amount),
    description:
      row.description ??
      LEDGER_TYPE_LABELS[row.entry_type] ??
      row.entry_type,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function fetchSupabaseLedgerEntries(): Promise<LedgerEntryRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ledger_entries")
    .select(
      `
      id,
      investor_id,
      project_id,
      investment_id,
      entry_type,
      direction,
      amount,
      description,
      reference_id,
      status,
      created_at,
      projects ( title ),
      profiles ( full_name )
    `
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) =>
    mapSupabaseRowToRecord(
      row as Parameters<typeof mapSupabaseRowToRecord>[0]
    )
  );
}

export async function getAllLedgerEntries(): Promise<LedgerEntryRecord[]> {
  const mock = await getAllMockLedgerEntries();
  if (await shouldUseMockData()) {
    return mock.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  try {
    const remote = await fetchSupabaseLedgerEntries();
    if (remote.length > 0) {
      return remote;
    }
  } catch {
    // fall through to mock
  }

  return mock.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
