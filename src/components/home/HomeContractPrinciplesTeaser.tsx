import Link from "next/link";
import { Scale, ShieldAlert, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  {
    icon: Scale,
    title: "پذیرش ریسک اقتصادی",
    body: "سرمایه‌گذار در صورتی مستحق دریافت سود است که ریسک اقتصادی طرح را ولو به میزان اندکی بپذیرد.",
  },
  {
    icon: ShieldAlert,
    title: "دو نوع ریسک جداگانه",
    body: "ریسک اعتباری (نکول) با وثیقه و ضمانت پوشش داده می‌شود؛ ریسک اقتصادی (بازار) تضمین نمی‌شود.",
  },
  {
    icon: Landmark,
    title: "وجه نزد آوید نمی‌ماند",
    body: "واریز مستقیم به حساب پروژه انجام می‌شود؛ آوید درگاه پرداخت نیست و وجه را نگهداری نمی‌کند.",
  },
] as const;

export function HomeContractPrinciplesTeaser() {
  return (
    <section className="border-b bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            قبل از مشارکت، این را بدانید
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            چکیده اصول قراردادی آوید؛ جزئیات کامل در صفحه شفافیت آمده است.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <li
                key={point.title}
                className="rounded-xl border border-gold/20 bg-card p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-navy">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/transparency?section=methodology">
              مطالعه کامل اصول و قراردادها
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
