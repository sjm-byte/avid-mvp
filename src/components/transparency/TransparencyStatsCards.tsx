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
    <p className="text-3xl font-bold">
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
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="space-y-1 p-6 text-center">
            <StatValue
              plus={stat.plus}
              number={stat.number}
              suffix={"suffix" in stat ? stat.suffix : undefined}
            />
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
