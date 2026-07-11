import { createClient } from "@/lib/supabase/server";
import { shouldUseMockData } from "@/lib/data/mock-data-mode";
import { saveMockLedgerEntry } from "@/lib/data/mock/ledger-store";
import { getInvestorDistributionForSettlement } from "@/lib/data/settlement-distribution";
import {
  LedgerEntryRecord,
  SETTLEMENT_RESULT_LEDGER_DESCRIPTION,
} from "@/types/allocation";
import { ProjectSettlementRecord } from "@/types/settlement";

export async function createSettlementResultLedgerEntries(
  settlement: ProjectSettlementRecord,
  createdBy: string
): Promise<void> {
  const distribution = await getInvestorDistributionForSettlement(settlement);
  if (distribution.length === 0) return;

  const createdAt = settlement.finalizedAt ?? new Date().toISOString();
  const projectTitle = settlement.projectTitle ?? "پروژه";

  if (await shouldUseMockData()) {
    for (const row of distribution) {
      const entry: LedgerEntryRecord = {
        id: `mock-ledger-settlement-${settlement.id}-${row.investorId}`,
        investorId: row.investorId,
        investorName: row.investorName,
        projectId: settlement.projectId,
        projectTitle,
        investmentId: null,
        receiptId: settlement.id,
        entryType: "settlement_result",
        direction: "memo",
        amount: row.finalAmount,
        description: SETTLEMENT_RESULT_LEDGER_DESCRIPTION,
        status: "posted",
        createdAt,
        principalAmount: row.principalAmount,
        profitLossAmount: row.profitLossShare,
        finalReceivableAmount: row.finalAmount,
        settlementDate: settlement.settlementDate,
      };
      await saveMockLedgerEntry(entry);
    }
    return;
  }

  try {
    const supabase = await createClient();
    for (const row of distribution) {
      const entry: LedgerEntryRecord = {
        id: `mock-ledger-settlement-${settlement.id}-${row.investorId}`,
        investorId: row.investorId,
        investorName: row.investorName,
        projectId: settlement.projectId,
        projectTitle,
        investmentId: null,
        receiptId: settlement.id,
        entryType: "settlement_result",
        direction: "memo",
        amount: row.finalAmount,
        description: SETTLEMENT_RESULT_LEDGER_DESCRIPTION,
        status: "posted",
        createdAt,
        principalAmount: row.principalAmount,
        profitLossAmount: row.profitLossShare,
        finalReceivableAmount: row.finalAmount,
        settlementDate: settlement.settlementDate,
      };

      const { error } = await supabase.from("ledger_entries").insert({
        project_id: settlement.projectId,
        investor_id: row.investorId,
        entry_type: "settlement_result",
        direction: "memo",
        amount: row.finalAmount,
        description: SETTLEMENT_RESULT_LEDGER_DESCRIPTION,
        reference_type: "project_settlement",
        reference_id: settlement.id,
        status: "posted",
        created_by: createdBy,
        created_at: createdAt,
      });

      if (error) {
        await saveMockLedgerEntry(entry);
      }
    }
  } catch {
    for (const row of distribution) {
      await saveMockLedgerEntry({
        id: `mock-ledger-settlement-${settlement.id}-${row.investorId}`,
        investorId: row.investorId,
        investorName: row.investorName,
        projectId: settlement.projectId,
        projectTitle,
        investmentId: null,
        receiptId: settlement.id,
        entryType: "settlement_result",
        direction: "memo",
        amount: row.finalAmount,
        description: SETTLEMENT_RESULT_LEDGER_DESCRIPTION,
        status: "posted",
        createdAt,
        principalAmount: row.principalAmount,
        profitLossAmount: row.profitLossShare,
        finalReceivableAmount: row.finalAmount,
        settlementDate: settlement.settlementDate,
      });
    }
  }
}
