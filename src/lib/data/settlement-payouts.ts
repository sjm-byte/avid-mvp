import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { getAllMockInvestments } from "@/lib/data/mock/investment-store";
import {
  getAllMockSettlementPayouts,
  getMockSettlementPayout,
  saveMockSettlementPayout,
} from "@/lib/data/mock/settlement-payout-store";
import { InvestorSettlementPayoutRecord } from "@/types/settlement";

function mapSupabaseRow(row: {
  id: string;
  project_id: string;
  investor_id: string;
  paid_amount: number;
  paid_at: string | null;
  payment_tracking_number: string | null;
  note: string | null;
  created_by: string | null;
  updated_at: string;
  profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
}): InvestorSettlementPayoutRecord {
  const profile = Array.isArray(row.profiles)
    ? row.profiles[0]
    : row.profiles;

  return {
    id: row.id,
    settlementId: row.id,
    projectId: row.project_id,
    investorId: row.investor_id,
    investorName: profile?.full_name ?? row.investor_id,
    paidAmount: Number(row.paid_amount),
    paidDate: row.paid_at ? row.paid_at.split("T")[0] : "",
    paymentReferenceNumber: row.payment_tracking_number ?? "",
    adminNote: row.note,
    recordedBy: row.created_by ?? "",
    recordedAt: row.updated_at,
  };
}

async function fetchSupabasePayouts(): Promise<InvestorSettlementPayoutRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settlements")
    .select(
      `
      id,
      project_id,
      investor_id,
      paid_amount,
      paid_at,
      payment_tracking_number,
      note,
      created_by,
      updated_at,
      profiles ( full_name )
    `
    )
    .eq("status", "paid")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) =>
    mapSupabaseRow(row as Parameters<typeof mapSupabaseRow>[0])
  );
}

export async function getAllSettlementPayouts(): Promise<
  InvestorSettlementPayoutRecord[]
> {
  const mock = await getAllMockSettlementPayouts();
  if (await shouldUseMockData()) {
    return mock;
  }

  try {
    const remote = await fetchSupabasePayouts();
    if (remote.length > 0) return remote;
  } catch {
    // fall through
  }

  return mock;
}

export async function getSettlementPayout(
  settlementId: string,
  investorId: string
): Promise<InvestorSettlementPayoutRecord | null> {
  if (await shouldUseMockData()) {
    return getMockSettlementPayout(settlementId, investorId);
  }

  const mock = await getMockSettlementPayout(settlementId, investorId);
  if (mock) return mock;

  try {
    const all = await fetchSupabasePayouts();
    return (
      all.find(
        (p) => p.settlementId === settlementId && p.investorId === investorId
      ) ?? null
    );
  } catch {
    return mock;
  }
}

export async function saveSettlementPayout(
  record: InvestorSettlementPayoutRecord
): Promise<void> {
  if (await shouldUseMockData()) {
    await saveMockSettlementPayout(record);
    return;
  }

  try {
    const supabase = await createClient();
    const investments = await getAllMockInvestments();
    const investment = investments.find(
      (i) =>
        i.projectId === record.projectId && i.investorId === record.investorId
    );

    const { error } = await supabase.from("settlements").insert({
      project_id: record.projectId,
      investor_id: record.investorId,
      investment_id: investment?.id ?? record.investorId,
      principal_amount: 0,
      profit_or_loss_amount: 0,
      total_due_amount: record.paidAmount,
      paid_amount: record.paidAmount,
      status: "paid",
      paid_at: `${record.paidDate}T12:00:00.000Z`,
      payment_tracking_number: record.paymentReferenceNumber,
      note: record.adminNote,
      created_by: record.recordedBy,
      updated_at: record.recordedAt,
    });

    if (error) {
      await saveMockSettlementPayout(record);
    }
  } catch {
    await saveMockSettlementPayout(record);
  }
}
