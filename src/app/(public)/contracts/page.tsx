import type { Metadata } from "next";
import { TransparencyHubNav } from "@/components/transparency/TransparencyHubNav";
import { TransparencyNextSteps } from "@/components/transparency/TransparencyNextSteps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "قراردادها و مدل‌های اجرایی — آوید",
  description:
    "مرور ساختار قراردادهای مرابحه، سلف و مشارکت در آوید؛ ریسک‌های مرتبط با هر مدل و الگوهای تجربه‌شده.",
};

const murabahaRisks = [
  {
    title: "۱. ریسک انصراف",
    body: "در این قرارداد، از ابتدا و پیش از خرید کالا، نمی‌توان وکیل را مجبور به فروش کالا پس از تهیه آن کرد. بنابراین ممکن است وکیل کالا را برای سرمایه‌گذار خریداری کند و سپس آن را به خود نفروشد. در این صورت، کالا برای سرمایه‌گذار خواهد بود.",
  },
  {
    title: "۲. ریسک هلاکت",
    body: "در بازه‌ای که کالا توسط وکیل خریداری شده و سپس وکیل آن را به خود فروخته است، ممکن است کالا از بین برود. در این صورت، مشروط بر اینکه وکیل کوتاهی نکرده باشد، ضرر متوجه مالک کالا، یعنی سرمایه‌گذار، خواهد بود.",
  },
];

const partnershipTypes = [
  {
    title: "مشارکت کامل",
    body: "سود و زیان بر اساس عملکرد واقعی تقسیم می‌شود؛ مانند تعیین سقف سود برای سرمایه‌گذار و اختصاص مازاد سود به مجری. در حال حاضر، به دلیل نبود زیرساخت کافی، این قرارداد کمتر مورد استفاده قرار می‌گیرد. با این حال، درصدد هستیم فضایی را برای مشارکت کامل نیز فراهم کنیم.",
  },
  {
    title: "مشارکت اولویت‌دار",
    body: "در زمان برداشت سود، سرمایه‌گذار اولویت دارد؛ اما در صورت بروز زیان، زیان ابتدا به اصل مال سرمایه‌گذار وارد می‌شود و سپس به مجری می‌رسد.",
  },
];

export default function ContractsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">
          بخش سوم شفافیت آوید — انواع قرارداد و ریسک‌های مرتبط
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          قراردادها و مدل‌های اجرایی
        </h1>
        <p className="text-lg text-muted-foreground">
          ریسک‌ها و الگوهای تجربه‌شده
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          ما با توجه به ریسک‌های اقتصادی پروژه‌های مختلف و همچنین میزان
          ریسک‌پذیری سرمایه‌گذار، نوع قرارداد مناسب را انتخاب می‌کنیم.
          مهم‌ترین قراردادهای مورد استفاده عبارت‌اند از:
        </p>
      </header>

      <div className="mt-8 max-w-5xl">
        <TransparencyHubNav current="/contracts" />
      </div>

      <div className="mt-10 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۱. قرارداد مرابحه (خرید نقد و فروش اقساطی)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-semibold">ساختار</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  در این قرارداد، سرمایه‌گذار به‌جای پرداخت مستقیم وجه نقد،
                  دارایی یا مواد اولیه موردنیاز، مانند آهن یا ماشین‌آلات، را
                  خریداری کرده و آن را به‌صورت اقساطی و با نرخ مشخص به متقاضی
                  می‌فروشد.
                </p>
                <p>
                  فعالیت اقتصادی و میزان سود در بازه کوتاهی پایان یافته و مشخص
                  می‌شود. در این نوع قرارداد، نرخ بازدهی تقریباً ثابت و قابل
                  پیش‌بینی است.
                </p>
                <p>
                  برای راحتی سرمایه‌گذار، پروژه عملاً به این شکل پیش می‌رود که
                  سرمایه‌گذار ابتدا به سرمایه‌پذیر وکالت می‌دهد تا وی ظرف مدت
                  مشخص، مثلاً یک هفته، کالا را به‌صورت نقدی و از محل آورده
                  سرمایه‌گذار خریداری کند. پس از تهیه کالا، وکیل آن را در قالب
                  اقساطی که از پیش مورد توافق قرار گرفته است، به خود خریداری
                  می‌کند.
                </p>
                <p>
                  در این فرایند، هم سرمایه‌پذیر تأمین مالی شده و به مقصود خود،
                  یعنی تهیه کالا، رسیده است و هم سرمایه‌گذار.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">ریسک‌های مرتبط</h3>
              <div className="mt-3 space-y-3">
                {murabahaRisks.map((risk) => (
                  <div
                    key={risk.title}
                    className="rounded-md border border-dashed px-4 py-3"
                  >
                    <p className="text-sm font-medium">{risk.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {risk.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۲. قرارداد سلف (پیش‌خرید کالا)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-semibold">ساختار</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  در این قرارداد، سرمایه‌گذار وجه نقد را امروز پرداخت می‌کند تا
                  کالا را در آینده، مثلاً شش ماه بعد، تحویل بگیرد.
                </p>
                <p>
                  در این فرایند، سرمایه‌پذیر به وجه نقد دسترسی پیدا می‌کند و
                  می‌تواند آن را به هر نحو که مدنظرش است مصرف کند. سرمایه‌گذار
                  نیز با تخفیف، کالایی را خریداری کرده است؛ کالایی که پایین‌تر
                  از قیمت امروز خریداری شده و ممکن است در ماه‌های آینده نسبت به
                  قیمت امروز گران‌تر شود.
                </p>
                <p>
                  در این مدل قرارداد نیز معمولاً خود سرمایه‌پذیر، که در واقع
                  فروشنده کالا است، پس از سررسید به‌عنوان وکیل در فروش نیز
                  عمل می‌کند. بنابراین کالا را با قیمتی که مدنظر خریدار، یعنی
                  سرمایه‌گذار، است به فروش می‌رساند و مبلغ حاصل را در پایان
                  دوره به وی پرداخت می‌کند.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">مزیت و ریسک</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  سرمایه‌گذار مالک کالا است. اگر در سررسید قیمت کالا کاهش پیدا
                  کند، ضرر متوجه وی خواهد بود. همچنین ریسک دیگر این قرارداد،
                  فروش نرفتن کالا در سررسید است.
                </p>
                <p>
                  برای یک قرارداد شش‌ماهه، معمولاً سه تا چهار ماه برای فرایند
                  ساخت و تحویل و حدود دو ماه برای فرایند فروش در نظر گرفته
                  می‌شود. با این حال، ممکن است کالا در این بازه به فروش نرسد.
                </p>
                <p>
                  یکی از مزیت‌های مهم این قرارداد، امکان بهره‌مندی سرمایه‌گذار
                  از افزایش قیمت کالا در آینده است. در قرارداد مرابحه، نرخ سود از
                  همان ابتدا مشخص شده و پس از انجام خرید و فروش قابل تغییر
                  نیست؛ اما در قرارداد پیش‌خرید، سرمایه‌گذار می‌تواند قرارداد را
                  به نحوی تنظیم کند که در صورت افزایش قیمت کالا، سود بیشتری
                  نصیب او شود.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۳. قرارداد مشارکت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-semibold">ساختار</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                در این قرارداد، هم سرمایه‌گذار و هم مجری آورده مالی دارند و در
                سود و زیان شریک می‌شوند.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold">انواع آن</h3>
              <div className="mt-3 space-y-3">
                {partnershipTypes.map((type) => (
                  <div
                    key={type.title}
                    className="rounded-lg border bg-muted/20 p-4"
                  >
                    <p className="text-sm font-medium">{type.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {type.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">مثال</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  فرض کنیم آورده سرمایه‌گذار یک میلیارد تومان است و انتظار دارد
                  طی هفت ماه حدود ۴۰٪ سود برداشت کند؛ یعنی یک میلیارد تومان
                  سرمایه او در پایان هفت ماه به یک میلیارد و چهارصد میلیون
                  تومان برسد.
                </p>
                <p>
                  فرض کنیم در این قرارداد، سرمایه‌پذیر نیز باید یک میلیارد تومان
                  آورده مالی داشته باشد. بنابراین، آورده طرفین در مجموع دو
                  میلیارد تومان است.
                </p>
                <p>
                  پس از پایان عملیات اقتصادی، تا سقف ۴۰۰ میلیون تومان سود، که در
                  واقع معادل ۲۰٪ سود کل است، متعلق به سرمایه‌گذار خواهد بود و
                  مابقی سود، به هر میزان که باشد، برای سرمایه‌پذیر خواهد بود.
                </p>
                <p>
                  اگر سود کل پروژه پس از هفت ماه کمتر از ۴۰۰ میلیون تومان باشد،
                  همان میزان سود متعلق به سرمایه‌گذار خواهد بود و سرمایه‌پذیر
                  سودی برداشت نخواهد کرد.
                </p>
                <p>
                  در صورتی که زیان متوجه اصل سرمایه شود نیز تا سقف یک میلیارد
                  تومان، زیان متوجه آورده سرمایه‌پذیر خواهد بود و مازاد آن به
                  آورده سرمایه‌گذار وارد می‌شود.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">مزیت و ریسک</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  اصل سرمایه در این قرارداد، نسبت به مرابحه و سلف، به میزان
                  بیشتری در معرض ریسک قرار دارد. در مورد سود نیز میزان
                  نااطمینانی کمی بیشتر است؛ اما در مقابل، امکان برداشت سود
                  بیشتر وجود دارد.
                </p>
                <p>
                  همچنین در فعالیت‌هایی که منجر به تولید کالا نمی‌شوند و عملیات
                  از نوع ارائه خدمات است، این قرارداد نسبت به دو مورد دیگر
                  ترجیح خواهد داشت.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              دانلود نمونه قراردادها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              به‌زودی نمونه قراردادهای مرابحه، سلف و مشارکت در این بخش برای
              مطالعه و دانلود در دسترس قرار می‌گیرد.
            </p>
          </CardContent>
        </Card>
      </div>

      <TransparencyNextSteps current="contracts" />
    </div>
  );
}
