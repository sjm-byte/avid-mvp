export type TransparencyPillarId =
  | "history"
  | "methodology"
  | "contracts";

export interface TransparencyPillar {
  id: TransparencyPillarId;
  href: string;
  title: string;
  description: string;
}

export const transparencyPillars: TransparencyPillar[] = [
  {
    id: "history",
    href: "/transparency",
    title: "سابقه",
    description:
      "جدول پروژه‌های خاتمه‌یافته، وضعیت تسویه و مقایسه پیش‌بینی با واقعیت.",
  },
  {
    id: "methodology",
    href: "/transparency?section=methodology",
    title: "منطق و قواعد کاری",
    description:
      "اصول بنیادین، تفکیک ریسک اعتباری و اقتصادی، و تفاوت مدل کاری آوید.",
  },
  {
    id: "contracts",
    href: "/transparency?section=contracts",
    title: "متن قراردادها",
    description:
      "ساختار مرابحه، سلف و مشارکت؛ ریسک‌ها و الگوهای تجربه‌شده هر مدل.",
  },
];
