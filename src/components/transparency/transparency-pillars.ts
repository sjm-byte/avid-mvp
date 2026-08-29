export type TransparencyPillarId =
  | "transparency"
  | "risk-disclosure"
  | "contracts";

export interface TransparencyPillar {
  id: TransparencyPillarId;
  href: string;
  title: string;
  description: string;
}

export const transparencyPillars: TransparencyPillar[] = [
  {
    id: "transparency",
    href: "/transparency",
    title: "سابقه عملکرد و نتایج",
    description:
      "جدول پروژه‌های خاتمه‌یافته، وضعیت تسویه و مقایسه پیش‌بینی با واقعیت.",
  },
  {
    id: "risk-disclosure",
    href: "/risk-disclosure",
    title: "روش کار و تحلیل ریسک",
    description:
      "اصول بنیادین، تفکیک ریسک اعتباری و اقتصادی، و تفاوت مدل کاری آوید.",
  },
  {
    id: "contracts",
    href: "/contracts",
    title: "قراردادها و مدل‌های اجرایی",
    description:
      "ساختار مرابحه، سلف و مشارکت؛ ریسک‌ها و الگوهای تجربه‌شده هر مدل.",
  },
];

export const transparencyPillarPaths = transparencyPillars.map(
  (pillar) => pillar.href,
);

export type TransparencyPillarPath = (typeof transparencyPillarPaths)[number];
