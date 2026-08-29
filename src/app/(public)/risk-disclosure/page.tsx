import type { Metadata } from "next";
import Link from "next/link";
import { ProjectRiskDisclaimer } from "@/components/projects/ProjectRiskDisclaimer";
import { TransparencyHubNav } from "@/components/transparency/TransparencyHubNav";
import { TransparencyNextSteps } from "@/components/transparency/TransparencyNextSteps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "روش کار و تحلیل ریسک — آوید",
  description:
    "اصول سرمایه‌گذاری در آوید، تفکیک ریسک اعتباری و اقتصادی، و تفاوت مدل کاری با سایر بسترها.",
};

const collateralCases = [
  {
    title: "۱. کوتاهی در انجام تعهدات",
    body: "اگر سرمایه‌پذیر نسبت به انجام تعهدات خود کوتاهی کند؛ برای مثال، کالای موردنظر را در سررسید توافق‌شده ارائه نکند، سرمایه‌گذار (خریدار کالا) می‌تواند از محل وثایق، عین همین کالا را تهیه کند.",
  },
  {
    title: "۲. عدم بازگرداندن سرمایه پس از پایان عملیات اقتصادی",
    body: "اگر عملیات اقتصادی پایان یافته و سود مشخص شده باشد، اما سرمایه‌پذیر (فروشنده کالا) در سررسید مورد توافق، سرمایه را بازنگرداند، در این صورت نیز می‌توان از محل وثایق اقدام کرد.",
  },
];

export default function RiskDisclosurePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">
          بخش دوم شفافیت — روش کار و تحلیل ریسک
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          روش کار و تحلیل ریسک در سرمایه‌گذاری
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          این صفحه اصول بنیادین و تفکیک ریسک را توضیح می‌دهد. برای جزئیات
          ساختار هر قرارداد — مرابحه، سلف و مشارکت —{" "}
          <Link
            href="/contracts"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            صفحه قراردادها و مدل‌های اجرایی
          </Link>{" "}
          را ببینید.
        </p>
      </header>

      <div className="mt-8 max-w-5xl">
        <TransparencyHubNav current="/risk-disclosure" />
      </div>

      <div className="mt-8">
        <ProjectRiskDisclaimer />
      </div>

      <div className="mt-10 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۱. اصل بنیادین و ساختاری سرمایه‌گذاری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              قاعده اصلی و زیرساختی ما در هرگونه تأمین مالی و سرمایه‌گذاری این
              است:
            </p>
            <blockquote className="rounded-md border-r-4 border-primary/40 bg-muted/40 px-4 py-3 text-sm font-medium leading-relaxed">
              «هرکس که می‌خواهد از یک فعالیت اقتصادی سود ببرد، باید ولو به
              میزان اندکی، ریسک اقتصادی آن طرح را بپذیرد.»
            </blockquote>
            <p className="text-sm leading-relaxed text-muted-foreground">
              به عبارت دیگر، سرمایه‌گذار نمی‌تواند در حالی که بابت اصل سرمایه
              خود تضمین دریافت می‌کند، از سرمایه‌پذیر مطالبه سود نیز داشته
              باشد. اگر سرمایه‌پذیر اصل مال را به‌صورت مطلق تضمین کند، ماهیت
              قرارداد به «قرض» تغییر می‌کند و در نتیجه، تنها مستحق دریافت اصل
              سرمایه خواهد بود و نه بیشتر.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۲. تفکیک انواع ریسک در سرمایه‌گذاری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              در تمام طرح‌های سرمایه‌گذاری و مالی، به‌طور کلی با دو دسته ریسک
              مواجه هستیم که ماهیت و نحوه مواجهه با آن‌ها کاملاً متفاوت است:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-4">
                <h3 className="text-base font-semibold">الف) ریسک اعتباری (نکول)</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  این ریسک به اعتبار شخص یا نهاد دریافت‌کننده تسهیلات مربوط
                  می‌شود؛ اینکه آیا شخص می‌تواند چک یا تعهدات خود را در
                  سررسید ایفا کند یا دچار مشکل می‌شود. این ریسک در تمام انواع
                  قراردادها وجود دارد و معمولاً با اخذ ضمانت‌نامه‌ها، اسناد
                  معتبر و چندلایه چک، تلاش می‌شود اصل سرمایه پوشش داده شود.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <h3 className="text-base font-semibold">ب) ریسک اقتصادی (بازار)</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  این ریسک به نوسانات اقتصادی و تغییرات قیمت کالای موضوع
                  قرارداد مربوط است. برای مثال، اگر سرمایه‌گذار کالایی را
                  پیش‌خرید کند یا منابعی را برای خرید مواد اولیه تخصیص دهد و در
                  زمان سررسید، قیمت بازار آن کالا به نصف کاهش یابد، زیان
                  اقتصادی رخ داده است.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">
                سرمایه‌پذیر چه زمانی می‌تواند از اسناد ضمانتی استفاده کند؟
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                همان‌طور که گفته شد، ریسکی که نباید توسط سرمایه‌پذیر تضمین
                شود، ریسک اقتصادی است. اما برای پوشش ریسک نکول، دریافت هر
                نوع ضمانتی اشکالی ندارد.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                به عبارت دیگر، سرمایه‌پذیر در دو حالت می‌تواند از محل اسناد
                ضمانتی اقدام کند:
              </p>
              <div className="space-y-3">
                {collateralCases.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-md border border-dashed px-4 py-3"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
              <p className="text-sm font-medium">نکته کلیدی</p>
              <p className="mt-1 text-sm leading-relaxed">
                ریسکی که نباید توسط سرمایه‌پذیر تضمین شود، ریسک اقتصادی است.
                بنابراین، ضرری که در نتیجه عملیات اقتصادی متوجه اصل سرمایه یا
                میزان سود شود، قابل تضمین نیست؛ یعنی سرمایه‌گذار نمی‌تواند از
                محل وثایق، این ضرر و زیان را جبران کند.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۳. تفاوت سرمایه‌گذاری از طریق آوید با دیگر بسترهای سرمایه‌گذاری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              در آوید، اصل سرمایه و سود تضمین نمی‌شود اما این به معنی پذیرش
              ریسک بالا نیست.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              به‌طور کلی اکثر بسترهای جذب سرمایه از جمله سکوهای تأمین مالی
              جمعی (کراود فاندینگ‌ها)، با تضمین اصل و فرع، وعده سود می‌دهند.
              از سوی دیگر، عملیات اقتصادی همواره با ریسک‌های پیش‌بینی‌شده و
              نشده‌ای همراه است که می‌تواند در دوره‌هایی منجر به سود زیاد یا
              حتی ضرر شود.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              آوید هرچند وعده سود نمی‌دهد و اصل و فرع را تضمین نمی‌کند، اما با
              توجه به تعلقی که به حوزه تأمین مالی دارد، تنها گام کوچکی به سمت
              عملیات اقتصادی برداشته است. یعنی سرمایه‌گذاری از طریق آوید با
              وجود ریسک‌ها به معنی ورود به دنیای پرتلاطم عملیات اقتصادی
              نیست. به عبارتی، ما به‌جای ورود مستقیم به فعالیت‌های پرریسک و
              عملیاتی، سرمایه را در قراردادهای مشخص و بررسی‌شده به کار
              می‌گیریم جایی که عملاً یک حاشیه امن محسوب می‌شود. بنابراین ریسک
              وجود دارد، اما جنس آن با ریسک یک کسب‌وکار یا فعالیت اقتصادی
              مستقیم بسیار متفاوت است.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              برای مثال، اگر کالایی را امروز برای تحویل شش ماه بعد خریداری
              کنیم، ریسک اصلی این است که قیمت کالا در این مدت کاهش پیدا کند.
              فروشنده که در ضمن چنین قراردادی سرمایه‌پذیر محسوب می‌شود،
              وظیفه‌ای نسبت به اصل سرمایه ندارد و سرمایه‌گذار مالک حقیقی کالا
              است. ناگفته پیداست که ریسک کاهش قیمت یک کالا در شرایط تورمی،
              ریسک بسیار اندک و ناچیزی است.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              در آوید ترجیح می‌دهیم به‌جای وعده «سرمایه‌گذاری بدون ریسک»،
              ریسک واقعی را شفاف کرده و با انتخاب قراردادهای مناسب، آن را تا
              حد امکان محدود کنیم. شما می‌توانید انواع مدل‌های قراردادی و
              ریسک هر کدام را در{" "}
              <Link
                href="/contracts"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                صفحه قراردادها و مدل‌های اجرایی
              </Link>{" "}
              مطالعه و بررسی نمایید.
            </p>
          </CardContent>
        </Card>
      </div>

      <TransparencyNextSteps current="risk-disclosure" />
    </div>
  );
}
