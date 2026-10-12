import type { PublicProject } from "@/lib/data/public-projects";
import { parseDurationMonths } from "@/lib/data/transparency-settlement-table";

/**
 * English names for the public project catalog.
 * Keyed by the Persian title so every round of the same company maps once.
 */
const COMPANY_EN: Record<string, { name: string; activity: string }> = {
  "همیار مکانیک کوشا": {
    name: "Hamyar Mechanic Kousha",
    activity: "Manufacturer of curved stairlifts and home lifts",
  },
  "بهراد رویش رویان": {
    name: "Behrad Rouyesh Royan",
    activity: "Manufacturer of fertility-treatment equipment",
  },
  "توی سیتی": { name: "Toy City", activity: "Toy manufacturer" },
  "گلدیس": { name: "Goldis", activity: "Online gold-trading platform" },
  "موج پردازان فجر صنعت": {
    name: "Mowj Pardazan Fajr Sanat",
    activity: "Manufacturer of radar rangefinders",
  },
  "روشانو": {
    name: "Roshanou",
    activity: "Manufacturer of children’s playhouse equipment and related services",
  },
  "آویتا": { name: "Avita", activity: "Manufacturer of carbon-fibre wheelchairs" },
  "غرفه خانبار در باسلام": {
    name: "Khanbar store on Basalam",
    activity: "Dried fruit and nuts seller on the Basalam marketplace",
  },
  "نماموتور": { name: "Nama Motor", activity: "Manufacturer of electric motors" },
  "روشن": { name: "Roshan", activity: "Artificial-intelligence services" },
  "فاتح اسکن": { name: "Fateh Scan", activity: "Manufacturer of X-ray equipment" },
  "غرفه نوگل در باسلام": {
    name: "Nogol store on Basalam",
    activity: "Baby clothing seller on the Basalam marketplace",
  },
};

function fromPersianDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[٫]/g, ".");
}

export function projectNameEn(project: PublicProject): string {
  return COMPANY_EN[project.title]?.name ?? project.title;
}

export function projectActivityEn(project: PublicProject): string {
  return COMPANY_EN[project.title]?.activity ?? project.activity;
}

/** 2_000_000_000 → "2 billion Toman", 4_500_000_000 → "4.5 billion Toman", 700_000_000 → "700 million Toman" */
export function formatTomanEn(amount: number): string {
  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  if (amount >= 1_000_000_000) return `${fmt.format(amount / 1_000_000_000)} billion Toman`;
  if (amount >= 1_000_000) return `${fmt.format(amount / 1_000_000)} million Toman`;
  return `${fmt.format(amount)} Toman`;
}

/** "۶ ماهه" → "6 months", "۲٫۵ ماهه" → "2.5 months". */
export function durationEn(project: PublicProject): string {
  const months = parseDurationMonths(project.duration);
  if (months == null) return "—";
  return `${months} ${months === 1 ? "month" : "months"}`;
}

/** "بازده پیش‌بینی‌شده ۱۲٪ بر پایه دلار" → "12%, USD-denominated". */
export function predictedReturnEn(project: PublicProject): string {
  const text = fromPersianDigits(project.predictedReturn);
  const pct = text.match(/(\d+(?:\.\d+)?)\s*[٪%]/)?.[1];
  if (!pct) return "—";
  if (text.includes("دلار")) return `${pct}%, USD-denominated`;
  if (text.includes("طلا")) return `${pct}%, gold-denominated`;
  return `${pct}%`;
}
