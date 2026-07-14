"use server";

import { revalidatePath } from "next/cache";
import {
  addProjectOpsReport,
  getProjectOpsBySlug,
  settleProjectOps,
  updateProjectOpsFields,
} from "@/lib/data/mock/project-ops-store";
import {
  ProjectOpsInvestor,
  SettlementOutlook,
  SettlementTimingStatus,
  UpdateMediaKind,
} from "@/types/project-ops";

function tomanToRial(toman: number): number {
  return Math.round(toman) * 10;
}

function parseTomanInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return tomanToRial(n);
}

function revalidateProjectPaths(slug: string) {
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/investments");
}

export async function updateManagedProjectAction(input: {
  slug: string;
  totalCapitalToman: string;
  profitDueToman: string;
  startDate: string;
  endDate: string;
  predictedReturnPercent: string;
  collateral: string;
  commissionPercent: string;
  commissionStatus: string;
  investorsText: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const totalCapital = parseTomanInput(input.totalCapitalToman);
  if (totalCapital == null) {
    return { ok: false, error: "سرمایه کل نامعتبر است." };
  }

  const profitDueRaw = input.profitDueToman.trim();
  const profitDue =
    profitDueRaw === "" ? null : parseTomanInput(profitDueRaw);
  if (profitDueRaw !== "" && profitDue == null) {
    return { ok: false, error: "سود مستحق نامعتبر است." };
  }

  const predictedPct = Number(
    input.predictedReturnPercent.replace("%", "").trim(),
  );
  if (!Number.isFinite(predictedPct) || predictedPct < 0) {
    return { ok: false, error: "بازده ماهانه نامعتبر است." };
  }

  const commissionPct = Number(
    input.commissionPercent.replace("%", "").trim(),
  );
  if (!Number.isFinite(commissionPct) || commissionPct < 0) {
    return { ok: false, error: "کارمزد نامعتبر است." };
  }

  const existing = await getProjectOpsBySlug(input.slug);
  if (!existing) return { ok: false, error: "پروژه یافت نشد." };

  const previousByName = new Map(
    existing.investors.map((inv) => [inv.name, inv]),
  );

  const investors: ProjectOpsInvestor[] = [];
  for (const line of input.investorsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [namePart, amountPart, newPart, transferredPart] = trimmed
      .split("|")
      .map((s) => s.trim());
    if (!namePart || !amountPart) {
      return {
        ok: false,
        error:
          "هر سطر سرمایه‌گذار باید به صورت «نام | مبلغ تومان | آورده جدید | آورده قبلی» باشد.",
      };
    }
    const amount = parseTomanInput(amountPart);
    if (amount == null) {
      return { ok: false, error: `مبلغ نامعتبر برای ${namePart}` };
    }
    const newCapital =
      newPart && newPart.length > 0
        ? parseTomanInput(newPart)
        : amount;
    const transferred =
      transferredPart && transferredPart.length > 0
        ? parseTomanInput(transferredPart)
        : 0;
    if (newCapital == null || transferred == null) {
      return { ok: false, error: `مبالغ آورده برای ${namePart} نامعتبر است.` };
    }
    const prev = previousByName.get(namePart);
    investors.push({
      name: namePart,
      amount,
      newCapital,
      transferredFromPrevious: transferred,
      settledPaidAmount: prev?.settledPaidAmount ?? null,
      isDemoInvestor: namePart === "علی رضایی" || prev?.isDemoInvestor,
    });
  }

  if (investors.length === 0) {
    return { ok: false, error: "حداقل یک سرمایه‌گذار لازم است." };
  }

  const updated = await updateProjectOpsFields(input.slug, {
    totalCapital,
    profitDue,
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    predictedReturn: predictedPct / 100,
    collateral: input.collateral.trim(),
    commissionPercent: commissionPct / 100,
    commissionStatus: input.commissionStatus.trim(),
    investors,
  });

  if (!updated) return { ok: false, error: "پروژه یافت نشد." };
  revalidateProjectPaths(input.slug);
  return { ok: true };
}

export async function addManagedProjectReportAction(input: {
  slug: string;
  title: string;
  reportDate: string;
  shortStatus: string;
  settlementOutlook: SettlementOutlook;
  adminNote: string;
  mediaKind: UpdateMediaKind | "";
  mediaLabel: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.title.trim() || !input.reportDate || !input.shortStatus.trim()) {
    return { ok: false, error: "عنوان، تاریخ و وضعیت کوتاه الزامی است." };
  }

  const updated = await addProjectOpsReport(input.slug, {
    title: input.title.trim(),
    reportDate: input.reportDate,
    shortStatus: input.shortStatus.trim(),
    settlementOutlook: input.settlementOutlook,
    adminNote: input.adminNote.trim(),
    mediaKind: input.mediaKind || null,
    mediaLabel: input.mediaLabel.trim() || null,
  });

  if (!updated) return { ok: false, error: "پروژه یافت نشد." };
  revalidateProjectPaths(input.slug);
  return { ok: true };
}

export async function settleManagedProjectAction(input: {
  slug: string;
  actualResult: string;
  settlementDate: string;
  settlementTiming: SettlementTimingStatus;
  /** Lines: نام | مبلغ واریزی تومان */
  settlementsText: string;
  markCompletedOnly: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.actualResult.trim() || !input.settlementDate) {
    return { ok: false, error: "نتیجه واقعی و تاریخ تسویه الزامی است." };
  }

  const investorSettlements: { name: string; settledPaidAmount: number }[] =
    [];
  for (const line of input.settlementsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [namePart, amountPart] = trimmed.split("|").map((s) => s.trim());
    if (!namePart || !amountPart) {
      return {
        ok: false,
        error: "هر سطر تسویه باید «نام | مبلغ واریزی تومان» باشد.",
      };
    }
    const amount = parseTomanInput(amountPart);
    if (amount == null) {
      return { ok: false, error: `مبلغ تسویه نامعتبر برای ${namePart}` };
    }
    investorSettlements.push({ name: namePart, settledPaidAmount: amount });
  }

  const updated = await settleProjectOps(input.slug, {
    actualResult: input.actualResult.trim(),
    settlementDate: input.settlementDate,
    settlementTiming: input.settlementTiming,
    investorSettlements,
    markCompletedOnly: input.markCompletedOnly,
  });

  if (!updated) return { ok: false, error: "پروژه یافت نشد." };
  revalidateProjectPaths(input.slug);
  return { ok: true };
}
