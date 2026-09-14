import { RiskDisclosureBox } from "@/components/shared/RiskDisclosureBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MobilePublicPageShell,
} from "@/components/layout/mobile/MobilePublicPageShell";
import {
  companyAddressFull,
  companyEmail,
  companyLegalName,
  companyNationalId,
  companyPhoneDisplay,
  companyRegistrationNumber,
} from "@/lib/company-contact";
import { toPersianDigits } from "@/lib/utils";

const principles = [
  "هر پروژه مستقل است و سرمایه‌گذار هر پروژه را جداگانه انتخاب می‌کند.",
  "پول در حساب آوید نگهداری نمی‌شود؛ واریز مستقیم به حساب پروژه انجام می‌شود.",
  "آوید با سرمایه‌گذار قرارداد دارد و در نقش نماینده او عمل می‌کند.",
  "بازده پیش‌بینی‌شده صرفاً سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود.",
  "نتیجه واقعی پروژه پس از اجرای واقعی و تهیه گزارش مالی مشخص می‌شود.",
];

function AboutBody() {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold md:text-xl">هویت حقوقی</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          فعالیت پلتفرم آوید تحت شخصیت حقوقی زیر انجام می‌شود.
        </p>
        <Card className="mt-4 max-w-2xl border-gold/25 max-md:border-white/12 max-md:bg-[#242030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-navy max-md:text-[#E8DCF5]">
              {companyLegalName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-3">
              <span className="text-muted-foreground">شماره ثبت</span>
              <span className="font-semibold tracking-wide" dir="ltr">
                {toPersianDigits(companyRegistrationNumber)}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-3">
              <span className="text-muted-foreground">شناسه ملی</span>
              <span className="font-semibold tracking-wide" dir="ltr">
                {toPersianDigits(companyNationalId)}
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <p className="text-muted-foreground">نشانی دفتر</p>
              <p className="leading-relaxed text-foreground">{companyAddressFull}</p>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
              <span className="text-muted-foreground">تماس</span>
              <span className="font-medium tracking-wide" dir="ltr">
                {companyPhoneDisplay}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">ایمیل</span>
              <a
                href={`mailto:${companyEmail}`}
                dir="ltr"
                className="font-medium text-navy hover:text-navy-light max-md:text-[#C9B4DE]"
              >
                {companyEmail}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold md:text-xl">اصول کلیدی</h2>
        <div className="mt-4 space-y-3">
          {principles.map((text, i) => (
            <Card
              key={text}
              className="max-md:border-white/12 max-md:bg-[#242030]"
            >
              <CardContent className="flex items-start gap-3 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground max-md:bg-[#7B60A1]">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <RiskDisclosureBox className="max-md:border-amber-400/30 max-md:bg-amber-500/10 max-md:text-amber-100" />
      </div>
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <div className="md:hidden">
        <MobilePublicPageShell
          title="درباره آوید"
          lead="آوید پلتفرم فارسی مدیریت مشارکت پروژه‌ای است. پروژه‌ها را جداگانه ببینید، ریسک و شرایط را بخوانید و مسیر سرمایه را دنبال کنید."
        >
          <AboutBody />
        </MobilePublicPageShell>
      </div>

      <div className="container mx-auto hidden px-4 py-12 md:block">
        <h1 className="text-3xl font-bold">درباره آوید</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          آوید یک پلتفرم فارسی برای مدیریت مشارکت پروژه‌ای است. سرمایه‌گذاران
          خرد و نیمه‌خرد می‌توانند پروژه‌های بازرگانی و تولیدی را مشاهده کنند،
          ریسک‌ها و شرایط هر پروژه را بخوانند و وضعیت سرمایه خود را در طول اجرا
          دنبال کنند.
        </p>
        <div className="mt-10">
          <AboutBody />
        </div>
      </div>
    </>
  );
}
