import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { plus: "+", number: "15", label: "پروژه خاتمه‌یافته" },
  {
    plus: "+",
    number: "50",
    suffix: "میلیارد تومن",
    label: "حجم مشارکت ثبت‌شده",
  },
  { plus: "+", number: "15", label: "پروژه‌های در جریان" },
] as const;

/** Keeps "+" visually left of digits inside RTL paragraphs. */
function LtrPlusNumber({ plus, number }: { plus: string; number: string }) {
  const value = `${plus}${number}`;
  return (
    <bdi
      dir="ltr"
      className="inline-block [unicode-bidi:isolate]"
      aria-label={value}
    >
      {"\u2066"}
      {value}
      {"\u2069"}
    </bdi>
  );
}

function StatValue({
  plus,
  number,
  suffix,
}: {
  plus: string;
  number: string;
  suffix?: string;
}) {
  return (
    <p className="text-2xl font-bold tracking-tight sm:text-[1.65rem]">
      <LtrPlusNumber plus={plus} number={number} />
      {suffix ? (
        <>
          {" \u200F"}
          <span>{suffix}</span>
        </>
      ) : null}
    </p>
  );
}

export function TransparencyStatsCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-muted/60 shadow-sm transition-shadow hover:shadow-md"
        >
          <CardContent className="space-y-1 px-4 py-5 text-center sm:px-5">
            <StatValue
              plus={stat.plus}
              number={stat.number}
              suffix={"suffix" in stat ? stat.suffix : undefined}
            />
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
