/**
 * Admin-entered capital movements (mock) — deposits in / settlements out.
 * No wallet; recording only.
 */

import { MOCK_INVESTOR } from "@/lib/auth/mock";

export type CapitalMovementKind = "deposit" | "settlement_out";

export interface CapitalMovementRecord {
  id: string;
  investorId: string;
  kind: CapitalMovementKind;
  /** ISO date */
  date: string;
  /** Amount in rial */
  amount: number;
  projectSlug: string | null;
  projectTitle: string | null;
  note: string | null;
}

/**
 * Demo story for علی رضایی:
 * entered capital on different dates; partially settled out later.
 */
export const SEED_CAPITAL_MOVEMENTS: CapitalMovementRecord[] = [
  {
    id: "mov-d1",
    investorId: MOCK_INVESTOR.id,
    kind: "deposit",
    date: "2025-12-01",
    amount: 18000000000,
    projectSlug: "electronics-import-closed",
    projectTitle: "واردات قطعات الکترونیکی مصرفی",
    note: "واریز اولیه پس از قرارداد",
  },
  {
    id: "mov-s1",
    investorId: MOCK_INVESTOR.id,
    kind: "settlement_out",
    date: "2026-04-15",
    amount: 6700000000,
    projectSlug: "electronics-import-closed",
    projectTitle: "واردات قطعات الکترونیکی مصرفی",
    note: "تسویه بخشی — خروج ریالی",
  },
  {
    id: "mov-d2",
    investorId: MOCK_INVESTOR.id,
    kind: "deposit",
    date: "2026-01-20",
    amount: 12000000000,
    projectSlug: "food-import-raw-materials",
    projectTitle: "واردات فویل و لفاف بسته‌بندی — فروش به صنایع غذایی",
    note: "آورده جدید",
  },
  {
    id: "mov-d3",
    investorId: MOCK_INVESTOR.id,
    kind: "deposit",
    date: "2026-02-10",
    amount: 8000000000,
    projectSlug: "date-export-uae",
    projectTitle: "صادرات خرمای مضافتی به امارات",
    note: "واریز پس از قرارداد",
  },
  {
    id: "mov-d4",
    investorId: MOCK_INVESTOR.id,
    kind: "deposit",
    date: "2026-03-15",
    amount: 15000000000,
    projectSlug: "apparel-working-capital",
    projectTitle: "سرمایه در گردش تولید پوشاک کار — صادرات به عراق",
    note: "واریز پس از قرارداد",
  },
];

export function getSeedMovementsForInvestor(
  investorId: string,
): CapitalMovementRecord[] {
  return SEED_CAPITAL_MOVEMENTS.filter((m) => m.investorId === investorId).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
