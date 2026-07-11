import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  "هر پروژه مستقل است و سرمایه‌گذار هر پروژه را جداگانه انتخاب می‌کند.",
  "پول در حساب آوید نگهداری نمی‌شود؛ واریز مستقیم به حساب پروژه انجام می‌شود.",
  "آوید با سرمایه‌گذار قرارداد دارد و در نقش نماینده او عمل می‌کند.",
  "بازده پیش‌بینی‌شده صرفاً سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود.",
  "نتیجه واقعی پروژه پس از اجرای واقعی و تهیه گزارش مالی مشخص می‌شود.",
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">درباره آوید</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        آوید یک پلتفرم فارسی برای مدیریت مشارکت پروژه‌ای است. سرمایه‌گذاران
        خرد و نیمه‌خرد می‌توانند پروژه‌های بازرگانی و تولیدی را مشاهده کنند،
        ریسک‌ها و شرایط هر پروژه را بخوانند و وضعیت سرمایه خود را در طول
        اجرا دنبال کنند.
      </p>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">اصول کلیدی</h2>
        <div className="mt-4 space-y-3">
          {principles.map((text, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <RiskDisclosureBox />
      </div>
    </div>
  );
}
