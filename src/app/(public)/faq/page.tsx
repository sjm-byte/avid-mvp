import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MobilePublicPageShell } from "@/components/layout/mobile/MobilePublicPageShell";

const faqItems = [
  {
    q: "آوید چیست؟",
    a: "آوید یک پلتفرم مدیریت مشارکت پروژه‌ای است که به سرمایه‌گذاران امکان می‌دهد پروژه‌ها را جداگانه بررسی و انتخاب کنند.",
  },
  {
    q: "آیا آوید صندوق سرمایه‌گذاری است؟",
    a: "خیر. آوید صندوق سرمایه‌گذاری کلاسیک یا درگاه پرداخت نیست و وجه نزد آوید نگهداری نمی‌شود.",
  },
  {
    q: "پول من کجا نگهداری می‌شود؟",
    a: "پول در حساب آوید نگهداری نمی‌شود. پرداخت مستقیماً به حساب معرفی‌شده برای همان پروژه انجام می‌شود.",
  },
  {
    q: "آیا بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه است؟",
    a: "خیر. بازده پیش‌بینی‌شده در هر پروژه صرفاً سناریوی مالی است. نتیجه واقعی پروژه پس از اجرای واقعی مشخص می‌شود.",
  },
  {
    q: "چگونه در یک پروژه مشارکت کنم؟",
    a: "ابتدا صفحه شفافیت آوید را مطالعه کرده و سپس درخواست مشارکت ثبت کنید. در صورت موافقت، پروژه مدنظر به شما معرفی خواهد شد.",
  },
  {
    q: "آیا می‌توانم در چند پروژه همزمان مشارکت کنم؟",
    a: "بله. هر پروژه مستقل است و شما می‌توانید در چند پروژه به‌صورت جداگانه مشارکت کنید.",
  },
  {
    q: "درآمد آوید از کجاست؟",
    a: "کارمزد اولیه از سرمایه‌پذیر و درصدی از سود محقق‌شده در پایان پروژه (فقط در صورت تحقق سود).",
  },
];

function FaqList() {
  return (
    <div className="mx-auto max-w-3xl space-y-3 md:space-y-4">
      {faqItems.map((item, index) => (
        <Card
          key={item.q}
          className="max-md:border-white/12 max-md:bg-[#242030]"
        >
          <CardHeader className="pb-2 max-md:px-4 max-md:pt-4">
            <CardTitle className="text-base leading-snug max-md:flex max-md:gap-2">
              <span className="hidden text-[#C9B4DE] max-md:inline">
                {["۱", "۲", "۳", "۴", "۵", "۶", "۷"][index]}
              </span>
              {item.q}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-md:px-4 max-md:pb-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <div className="md:hidden">
        <MobilePublicPageShell
          title="سوالات متداول"
          lead="پاسخ سوالات رایج درباره مدل آوید، وجه، بازده پیش‌بینی‌شده و مسیر مشارکت."
        >
          <FaqList />
        </MobilePublicPageShell>
      </div>

      <div className="container mx-auto hidden px-4 py-12 md:block">
        <h1 className="text-3xl font-bold">سوالات متداول</h1>
        <p className="mt-2 text-muted-foreground">
          پاسخ سوالات رایج درباره مدل آوید
        </p>
        <div className="mt-8">
          <FaqList />
        </div>
      </div>
    </>
  );
}
