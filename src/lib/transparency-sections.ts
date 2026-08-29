export type TransparencySectionId = "history" | "methodology" | "contracts";

export interface TransparencySection {
  id: TransparencySectionId;
  label: string;
  description: string;
}

export const transparencySections: TransparencySection[] = [
  {
    id: "history",
    label: "سابقه",
    description:
      "جدول پروژه‌های خاتمه‌یافته، وضعیت تسویه و مقایسه پیش‌بینی با واقعیت.",
  },
  {
    id: "methodology",
    label: "منطق و قواعد کاری",
    description:
      "اصول بنیادین، تفکیک ریسک اعتباری و اقتصادی، و تفاوت مدل کاری آوید.",
  },
  {
    id: "contracts",
    label: "متن قراردادها",
    description:
      "ساختار مرابحه، سلف و مشارکت؛ ریسک‌ها و الگوهای تجربه‌شده هر مدل.",
  },
];

export function isTransparencySectionId(
  value: string | null | undefined,
): value is TransparencySectionId {
  return (
    value === "history" ||
    value === "methodology" ||
    value === "contracts"
  );
}

export function transparencySectionHref(id: TransparencySectionId): string {
  return id === "history" ? "/transparency" : `/transparency?section=${id}`;
}
