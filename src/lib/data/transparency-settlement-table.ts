import { PUBLIC_PROJECTS, type PublicProject } from "@/lib/data/public-projects";

/**
 * Settlement buckets for the public transparency table.
 * One project gets at most one tick.
 */
export type TransparencySettlementOutcome =
  | "on_time"
  | "delay_one_month"
  | "delay_over_month_extra_profit"
  | "delay_over_month_no_extra_profit";

export const SETTLEMENT_OUTCOME_COLUMNS: {
  key: TransparencySettlementOutcome;
  label: string;
}[] = [
  { key: "on_time", label: "سر موعد تسویه شده" },
  { key: "delay_one_month", label: "با یک ماه تأخیر تسویه شد" },
  {
    key: "delay_over_month_extra_profit",
    label: "با بیش از یک ماه تأخیر ولی با سود اضافه تسویه شد",
  },
  {
    key: "delay_over_month_no_extra_profit",
    label: "با بیش از یک ماه تأخیر ولی بدون سود اضافه تسویه شد",
  },
];

/**
 * Outcomes are filled when settlement result is known.
 * Source list (Word, chronological catalog order) currently has names only.
 */
export const TRANSPARENCY_SETTLEMENT_OUTCOMES: Partial<
  Record<string, TransparencySettlementOutcome>
> = {};

export function getTransparencySettlementRows(): PublicProject[] {
  return PUBLIC_PROJECTS;
}

export function getSettlementOutcome(
  projectId: string,
): TransparencySettlementOutcome | undefined {
  return TRANSPARENCY_SETTLEMENT_OUTCOMES[projectId];
}
