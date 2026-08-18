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
  hint: string;
}[] = [
  {
    key: "on_time",
    label: "سر موعد",
    hint: "سر موعد تسویه شده",
  },
  {
    key: "delay_one_month",
    label: "تا یک ماه تأخیر",
    hint: "تا یک ماه تأخیر تسویه شد",
  },
  {
    key: "delay_over_month_extra_profit",
    label: "تأخیر بیشتر با سود مازاد",
    hint: "با بیش از یک ماه تأخیر ولی با سود مازاد تسویه شد",
  },
  {
    key: "delay_over_month_no_extra_profit",
    label: "تأخیر بیشتر بدون سود مازاد",
    hint: "با بیش از یک ماه تأخیر ولی بدون سود مازاد تسویه شد",
  },
];

/**
 * Last status line from the invested-projects Word list.
 * In-progress projects have no tick.
 */
export const TRANSPARENCY_SETTLEMENT_OUTCOMES: Partial<
  Record<string, TransparencySettlementOutcome>
> = {
  p001: "on_time",
  p002: "on_time",
  p003: "delay_one_month",
  p004: "on_time",
  p005: "on_time",
  p006: "on_time",
  p008: "delay_one_month",
  p009: "on_time",
  p010: "delay_one_month",
  p011: "on_time",
  p014: "on_time",
  p016: "delay_over_month_extra_profit",
  p018: "on_time",
  p019: "on_time",
};

export function getTransparencySettlementRows(): PublicProject[] {
  return PUBLIC_PROJECTS;
}

export function getSettlementOutcome(
  projectId: string,
): TransparencySettlementOutcome | undefined {
  return TRANSPARENCY_SETTLEMENT_OUTCOMES[projectId];
}

/** Optional one-line notes; fill when a project needs extra explanation. */
export const TRANSPARENCY_NOTES: Partial<Record<string, string>> = {};

export function getTransparencyNote(projectId: string): string {
  return TRANSPARENCY_NOTES[projectId]?.trim() ?? "";
}

const PERSIAN_MONTH_WORDS: Record<string, number> = {
  یک: 1,
  دو: 2,
  سه: 3,
  چهار: 4,
  پنج: 5,
  شش: 6,
  هفت: 7,
  هشت: 8,
  نه: 9,
  ده: 10,
  یازده: 11,
  دوازده: 12,
};

function fromPersianDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[٫٬]/g, ".");
}

function isJalaliLeapYear(year: number): boolean {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
}

function jalaliMonthLength(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

export function parseDurationMonths(duration: string): number | null {
  const normalized = fromPersianDigits(duration);
  for (const [word, months] of Object.entries(PERSIAN_MONTH_WORDS)) {
    if (normalized.includes(word)) return months;
  }
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]);
}

export function addJalaliMonths(startDate: string, months: number): string | null {
  const [yearRaw, monthRaw, dayRaw] = startDate.split(/[/-]/);
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (!year || !month || !day) return null;

  const wholeMonths = Math.trunc(months);
  const fraction = months - wholeMonths;

  let nextYear = year;
  let nextMonth = month + wholeMonths;
  while (nextMonth > 12) {
    nextMonth -= 12;
    nextYear += 1;
  }
  while (nextMonth < 1) {
    nextMonth += 12;
    nextYear -= 1;
  }

  let nextDay = day + Math.round(fraction * jalaliMonthLength(nextYear, nextMonth));
  while (nextDay > jalaliMonthLength(nextYear, nextMonth)) {
    nextDay -= jalaliMonthLength(nextYear, nextMonth);
    nextMonth += 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
  }

  const maxDay = jalaliMonthLength(nextYear, nextMonth);
  if (nextDay > maxDay) nextDay = maxDay;

  return `${nextYear}/${String(nextMonth).padStart(2, "0")}/${String(nextDay).padStart(2, "0")}`;
}

export function getProjectEndDate(project: PublicProject): string | null {
  const months = parseDurationMonths(project.duration);
  if (months == null) return null;
  return addJalaliMonths(project.startDate, months);
}
