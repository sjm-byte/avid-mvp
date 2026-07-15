/**
 * Admin-entered capital movements (mock) — cash-flow recording only.
 * No wallet; deposits, profit credits, and withdrawals.
 */

import { MOCK_INVESTOR } from "@/lib/auth/mock";

export type CapitalMovementKind = "deposit" | "profit_in" | "settlement_out";

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
 * Demo cash-flow story for علی رضایی:
 * initial deposit → more capital → profit realized → withdrawal → new liquidity.
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
  {
    id: "mov-p1",
    investorId: MOCK_INVESTOR.id,
    kind: "profit_in",
    date: "2026-04-01",
    amount: 1500000000,
    projectSlug: "electronics-import-closed",
    projectTitle: "واردات قطعات الکترونیکی مصرفی",
    note: "سود محقق‌شده پروژه — افزایش مانده",
  },
  {
    id: "mov-s1",
    investorId: MOCK_INVESTOR.id,
    kind: "settlement_out",
    date: "2026-04-15",
    amount: 6700000000,
    projectSlug: "electronics-import-closed",
    projectTitle: "واردات قطعات الکترونیکی مصرفی",
    note: "برداشت وجه پس از تسویه بخشی",
  },
  {
    id: "mov-d5",
    investorId: MOCK_INVESTOR.id,
    kind: "deposit",
    date: "2026-05-10",
    amount: 5000000000,
    projectSlug: null,
    projectTitle: null,
    note: "نقدینگی جدید برای مشارکت بعدی",
  },
];

export function getSeedMovementsForInvestor(
  investorId: string,
): CapitalMovementRecord[] {
  return SEED_CAPITAL_MOVEMENTS.filter((m) => m.investorId === investorId).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
