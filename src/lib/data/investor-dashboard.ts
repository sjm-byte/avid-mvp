import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import {
  getAllMockInvestmentRequests,
  getMockInvestmentRequestsByInvestor,
} from "@/lib/data/mock/investment-request-store";
import {
  getMockInvestmentsByInvestor,
} from "@/lib/data/mock/investment-store";
import {
  getMockLedgerByInvestor,
} from "@/lib/data/mock/ledger-store";
import {
  InvestorAllocation,
  InvestorDashboardData,
  InvestorLedgerSummaryItem,
  InvestmentRequestRecord,
  INVESTMENT_REQUEST_STATUS_LABELS,
  mapDbStatusToUi,
} from "@/types/investment";
import { InvestmentAllocationRecord, LedgerEntryRecord } from "@/types/allocation";
import { InvestmentRequestStatus } from "@/types/database";

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

function buildLedgerFromRequests(
  requests: InvestmentRequestRecord[]
): InvestorLedgerSummaryItem[] {
  return requests
    .filter((r) => r.status !== "cancelled")
    .map((r) => ({
      id: `ledger-${r.id}`,
      projectTitle: r.projectTitle,
      entryType: "investment_commitment",
      description: `ثبت درخواست مشارکت — ${INVESTMENT_REQUEST_STATUS_LABELS[r.status]}`,
      amount: r.requestedAmount,
      status: "posted",
      createdAt: r.createdAt,
    }));
}

async function fetchSupabaseRequests(
  investorId: string
): Promise<InvestmentRequestRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("investment_requests")
    .select(
      `
      id,
      project_id,
      investor_id,
      requested_amount,
      investor_note,
      status,
      admin_note,
      created_at,
      updated_at,
      projects ( title, slug )
    `
    )
    .eq("investor_id", investorId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const project = unwrapRelation(
      row.projects as { title: string; slug: string } | { title: string; slug: string }[] | null
    );
    const dbStatus = row.status as InvestmentRequestStatus;
    return {
      id: row.id,
      projectId: row.project_id,
      projectTitle: project?.title ?? "پروژه",
      projectSlug: project?.slug ?? "",
      investorId: row.investor_id,
      requestedAmount: Number(row.requested_amount),
      investorNote: row.investor_note,
      status: mapDbStatusToUi(dbStatus),
      dbStatus,
      adminNote: row.admin_note,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}

function mapMockAllocationToInvestor(
  record: InvestmentAllocationRecord
): InvestorAllocation {
  return {
    id: record.id,
    projectId: record.projectId,
    projectTitle: record.projectTitle,
    projectSlug: record.projectSlug,
    investmentRequestId: record.investmentRequestId,
    receiptId: record.receiptId,
    verifiedAmount: record.verifiedAmount,
    ownershipPercent: record.ownershipPercent,
    status: record.status,
    allocatedAt: record.allocatedAt,
    projectStatus: record.projectStatus,
    expectedReturnBase: record.expectedReturnBase,
  };
}

function mapMockLedgerToSummary(
  entry: LedgerEntryRecord
): InvestorLedgerSummaryItem {
  return {
    id: entry.id,
    projectTitle: entry.projectTitle,
    entryType: entry.entryType,
    description: entry.description,
    amount: entry.amount,
    status: entry.status,
    createdAt: entry.createdAt,
    principalAmount: entry.principalAmount,
    profitLossAmount: entry.profitLossAmount,
    finalReceivableAmount: entry.finalReceivableAmount,
    settlementDate: entry.settlementDate,
  };
}

function buildLedgerSummary(
  requests: InvestmentRequestRecord[],
  allocations: InvestorAllocation[],
  persistedLedger: InvestorLedgerSummaryItem[]
): InvestorLedgerSummaryItem[] {
  const allocatedRequestIds = new Set(
    allocations.map((a) => a.investmentRequestId)
  );
  const commitmentLedger = buildLedgerFromRequests(
    requests.filter(
      (r) =>
        !allocatedRequestIds.has(r.id) &&
        !["cancelled", "rejected"].includes(r.status)
    )
  );

  return [...persistedLedger, ...commitmentLedger].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function fetchSupabaseAllocations(
  investorId: string
): Promise<InvestorAllocation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("investments")
    .select(
      `
      id,
      project_id,
      investment_request_id,
      verified_amount,
      ownership_percent,
      status,
      created_at,
      projects ( title, slug, status, expected_return_base )
    `
    )
    .eq("investor_id", investorId)
    .in("status", ["active", "settlement_pending"]);

  if (error || !data) return [];

  return data.map((row) => {
    const project = unwrapRelation(
      row.projects as {
        title: string;
        slug: string;
        status: string;
        expected_return_base: number | null;
      } | {
        title: string;
        slug: string;
        status: string;
        expected_return_base: number | null;
      }[] | null
    );
    return {
      id: row.id,
      projectId: row.project_id,
      projectTitle: project?.title ?? "پروژه",
      projectSlug: project?.slug ?? "",
      investmentRequestId: row.investment_request_id ?? "",
      receiptId: "",
      verifiedAmount: Number(row.verified_amount),
      ownershipPercent: row.ownership_percent
        ? Number(row.ownership_percent)
        : null,
      status: row.status,
      allocatedAt: row.created_at,
      projectStatus: project?.status ?? "",
      expectedReturnBase: project?.expected_return_base
        ? Number(project.expected_return_base)
        : null,
    };
  });
}

async function fetchSupabaseLedger(
  investorId: string
): Promise<InvestorLedgerSummaryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ledger_entries")
    .select(
      `
      id,
      entry_type,
      description,
      amount,
      status,
      created_at,
      projects ( title )
    `
    )
    .eq("investor_id", investorId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    projectTitle:
      unwrapRelation(row.projects as { title: string } | { title: string }[] | null)
        ?.title ?? "—",
    entryType: row.entry_type,
    description:
      row.description ??
      LEDGER_TYPE_LABELS[row.entry_type] ??
      row.entry_type,
    amount: Number(row.amount),
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function getInvestorRequests(
  investorId: string
): Promise<InvestmentRequestRecord[]> {
  const mock = await getMockInvestmentRequestsByInvestor(investorId);
  if (await shouldUseMockData()) {
    return mock;
  }
  try {
    const remote = await fetchSupabaseRequests(investorId);
    return remote.length > 0 ? remote : mock;
  } catch {
    return mock;
  }
}

export async function getAllInvestmentRequests(): Promise<
  InvestmentRequestRecord[]
> {
  const mock = await getAllMockInvestmentRequests();
  if (await shouldUseMockData()) {
    return mock;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("investment_requests")
      .select(
        `
        id,
        project_id,
        investor_id,
        requested_amount,
        investor_note,
        status,
        admin_note,
        created_at,
        updated_at,
        projects ( title, slug ),
        profiles ( full_name, email )
      `
      )
      .order("created_at", { ascending: false });

    if (error || !data) {
      return mock;
    }

    const mapped = data.map((row) => {
      const project = unwrapRelation(
        row.projects as { title: string; slug: string } | { title: string; slug: string }[] | null
      );
      const dbStatus = row.status as InvestmentRequestStatus;
      return {
        id: row.id,
        projectId: row.project_id,
        projectTitle: project?.title ?? "پروژه",
        projectSlug: project?.slug ?? "",
        investorId: row.investor_id,
        requestedAmount: Number(row.requested_amount),
        investorNote: row.investor_note,
        status: mapDbStatusToUi(dbStatus),
        dbStatus,
        adminNote: row.admin_note,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });
    return mapped.length > 0 ? mapped : mock;
  } catch {
    return mock;
  }
}

export async function getInvestorDashboardData(
  investorId: string
): Promise<InvestorDashboardData> {
  const requests = await getInvestorRequests(investorId);

  let allocations: InvestorAllocation[] = [];
  let persistedLedger: InvestorLedgerSummaryItem[] = [];

  if (await shouldUseMockData()) {
    allocations = (await getMockInvestmentsByInvestor(investorId)).map(
      mapMockAllocationToInvestor
    );
    persistedLedger = (await getMockLedgerByInvestor(investorId)).map(
      mapMockLedgerToSummary
    );
  } else {
    try {
      allocations = await fetchSupabaseAllocations(investorId);
      if (allocations.length === 0) {
        allocations = (await getMockInvestmentsByInvestor(investorId)).map(
          mapMockAllocationToInvestor
        );
      }

      const remoteLedger = await fetchSupabaseLedger(investorId);
      if (remoteLedger.length > 0) {
        persistedLedger = remoteLedger;
      } else {
        persistedLedger = (await getMockLedgerByInvestor(investorId)).map(
          mapMockLedgerToSummary
        );
      }
    } catch {
      allocations = (await getMockInvestmentsByInvestor(investorId)).map(
        mapMockAllocationToInvestor
      );
      persistedLedger = (await getMockLedgerByInvestor(investorId)).map(
        mapMockLedgerToSummary
      );
    }
  }

  const ledgerSummary = buildLedgerSummary(
    requests,
    allocations,
    persistedLedger
  );

  const totalVerifiedCapital = allocations.reduce(
    (s, a) => s + a.verifiedAmount,
    0
  );

  return {
    requests,
    allocations,
    ledgerSummary,
    stats: {
      totalVerifiedCapital,
      activeCapital: totalVerifiedCapital,
      pendingRequests: requests.filter((r) =>
        ["submitted", "under_review"].includes(r.status)
      ).length,
      pendingPaymentInstructions: requests.filter(
        (r) => r.status === "approved_pending_payment"
      ).length,
    },
  };
}

export async function getExistingRequestForProject(
  investorId: string,
  projectId: string
): Promise<InvestmentRequestRecord | null> {
  const requests = await getInvestorRequests(investorId);
  return (
    requests.find(
      (r) =>
        r.projectId === projectId &&
        !["rejected", "cancelled"].includes(r.status)
    ) ?? null
  );
}
