import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getAllMockPaymentReceipts,
  getMockPaymentReceiptsByInvestor,
  getMockReceiptByRequestId,
} from "@/lib/data/mock/receipt-store";
import {
  PaymentReceiptDbStatus,
  PaymentReceiptRecord,
  mapReceiptDbStatusToUi,
} from "@/types/receipt";
import { PaymentReceiptRow } from "@/types/database";

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapRowToRecord(
  row: PaymentReceiptRow & {
    projects?: { title: string; slug: string } | { title: string; slug: string }[] | null;
    profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
  }
): PaymentReceiptRecord {
  const project = unwrapRelation(row.projects ?? null);
  const profile = unwrapRelation(row.profiles ?? null);
  const dbStatus = row.status as PaymentReceiptDbStatus;

  return {
    id: row.id,
    investmentRequestId: row.investment_request_id,
    projectId: row.project_id,
    projectTitle: project?.title ?? "پروژه",
    projectSlug: project?.slug ?? "",
    investorId: row.investor_id,
    investorName: profile?.full_name ?? null,
    amount: Number(row.amount),
    paidAt: row.paid_at ?? row.created_at,
    trackingNumber: row.tracking_number ?? "",
    investorNote: row.source_account_info,
    fileName: row.file_path,
    status: mapReceiptDbStatusToUi(dbStatus),
    dbStatus,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
  };
}

const RECEIPT_SELECT = `
  id,
  investment_request_id,
  project_id,
  investor_id,
  amount,
  paid_at,
  source_account_info,
  tracking_number,
  file_path,
  status,
  rejection_reason,
  created_at,
  projects ( title, slug ),
  profiles ( full_name )
`;

async function fetchSupabaseReceipts(
  filter?: { investorId?: string }
): Promise<PaymentReceiptRecord[]> {
  const supabase = await createClient();
  let query = supabase.from("payment_receipts").select(RECEIPT_SELECT);

  if (filter?.investorId) {
    query = query.eq("investor_id", filter.investorId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) =>
    mapRowToRecord(row as PaymentReceiptRow & {
      projects?: { title: string; slug: string } | { title: string; slug: string }[] | null;
      profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
    })
  );
}

export async function getInvestorPaymentReceipts(
  investorId: string
): Promise<PaymentReceiptRecord[]> {
  const mock = await getMockPaymentReceiptsByInvestor(investorId);
  if (await shouldUseMockData()) {
    return mock;
  }
  try {
    const remote = await fetchSupabaseReceipts({ investorId });
    return remote.length > 0 ? remote : mock;
  } catch {
    return mock;
  }
}

export async function getAllPaymentReceipts(): Promise<PaymentReceiptRecord[]> {
  const mock = await getAllMockPaymentReceipts();
  if (await shouldUseMockData()) {
    return mock;
  }
  try {
    const remote = await fetchSupabaseReceipts();
    return remote.length > 0 ? remote : mock;
  } catch {
    return mock;
  }
}

export async function getReceiptForInvestmentRequest(
  investmentRequestId: string
): Promise<PaymentReceiptRecord | null> {
  const mock = await getMockReceiptByRequestId(investmentRequestId);
  if (await shouldUseMockData()) {
    return mock;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_receipts")
      .select(RECEIPT_SELECT)
      .eq("investment_request_id", investmentRequestId)
      .maybeSingle();

    if (error || !data) {
      return mock;
    }

    return mapRowToRecord(
      data as PaymentReceiptRow & {
        projects?: { title: string; slug: string } | { title: string; slug: string }[] | null;
        profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
      }
    );
  } catch {
    return mock;
  }
}

export function receiptsByRequestId(
  receipts: PaymentReceiptRecord[]
): Record<string, PaymentReceiptRecord> {
  const grouped = new Map<string, PaymentReceiptRecord[]>();
  for (const receipt of receipts) {
    const list = grouped.get(receipt.investmentRequestId) ?? [];
    list.push(receipt);
    grouped.set(receipt.investmentRequestId, list);
  }

  const map: Record<string, PaymentReceiptRecord> = {};
  for (const [requestId, list] of grouped) {
    const sorted = [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    map[requestId] =
      sorted.find((r) => r.status !== "rejected") ?? sorted[0]!;
  }
  return map;
}
