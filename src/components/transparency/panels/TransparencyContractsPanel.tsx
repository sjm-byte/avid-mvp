import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sectionBodyIndent = "pr-4 sm:pr-6";

const murabahaRisks = [
  {
    title: "۱. ریسک انصراف",
    body: "در این قرارداد، از ابتدا و پیش از خرید کالا، نمی‌توان وکیل را مجبور به خرید کالا پس از تهیه آن کرد. بنابراین ممکن است وکیل کالا را برای سرمایه‌گذار خریداری کند و سپس آن را به خود نفروشد. در این صورت، کالا برای سرمایه‌گذار خواهد بود.",
  },
  {
    title: "۲. ریسک هلاکت",
    body: "در بازه‌ای که کالا توسط وکیل خریداری شده و سپس وکیل قرار است آن را به خود بفروشد، ممکن است کالا از بین برود. در این صورت، مشروط بر اینکه وکیل کوتاهی نکرده باشد ضرر متوجه مالک کالا یعنی سرمایه‌گذار خواهد بود.",
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

export function TransparencyContractsPanel() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold md:text-2xl">متن قراردادها</h2>
        <p className="text-sm leading-relaxed text-justify text-muted-foreground">
          ما با توجه به ریسک‌های اقتصادی پروژه‌های مختلف و همچنین میزان
          ریسک‌پذیری سرمایه‌گذار، نوع قرارداد مناسب را انتخاب می‌کنیم. در
          ادامه با سه نوع قرارداد مورد استفاده و ریسک‌های هر کدام آشنا
          می‌شوید.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              ۱. قرارداد خرید نقد و فروش اقساطی کالا (مرابحه)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`space-y-3 text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
            >
                <p>
                  در این قرارداد، سرمایه‌گذار به‌جای پرداخت مستقیم وجه نقد،
                  دارایی یا مواد اولیه مورد نیاز مانند آهن یا ماشین‌آلات را
                  خریداری کرده و آن را به‌صورت اقساطی و با نرخ مشخص به متقاضی
                  می‌فروشد. در این نوع قرارداد، نرخ بازدهی تقریباً ثابت و قابل
                  پیش‌بینی است. چراکه عملیات اقتصادی در بازه کوتاهی مثلاً یک
                  هفته پایان یافته و سود مشخص می‌شود.
                </p>
                <p>
                  برای راحتی سرمایه‌گذار، پروژه عملاً به این شکل پیش می‌رود که
                  سرمایه‌گذار ابتدا به سرمایه‌پذیر وکالت می‌دهد تا وی ظرف مدت
                  مشخص، مثلاً یک هفته، کالا را به‌صورت نقدی و از محل آورده
                  سرمایه‌گذار خریداری کند. پس از تهیه کالا، وکیل آن را در قالب
                  اقساطی که از پیش مورد توافق قرار گرفته است، به خود می‌فروشد.
                  در این فرایند، هم سرمایه‌پذیر تأمین مالی شده و به مقصود خود
                  یعنی تهیه کالا رسیده است و هم سرمایه‌گذار به سود مورد انتظار.
                </p>
            </div>

            <div>
              <h3 className="text-base font-semibold">ریسک قرارداد</h3>
              <div className={`mt-3 space-y-3 ${sectionBodyIndent}`}>
                {murabahaRisks.map((risk) => (
                  <div
                    key={risk.title}
                    className="rounded-md border border-dashed px-4 py-3"
                  >
                    <p className="text-sm font-medium">{risk.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-justify text-muted-foreground">
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
              ۲. قرارداد پیش‌خرید کالا و فروش بعد از تحویل (سلف و وکالت در فروش)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
            >
                <p>
                  در این قرارداد، سرمایه‌گذار وجه نقد را امروز پرداخت می‌کند تا
                  کالا را در آینده، مثلاً شش ماه بعد، تحویل بگیرد. در این
                  فرایند، سرمایه‌پذیر به وجه نقد دسترسی پیدا می‌کند و می‌تواند
                  آن را به هر نحو که مدنظرش است مصرف کند. سرمایه‌گذار نیز با
                  تخفیف، کالایی را خریداری کرده است کالایی که پایین‌تر از
                  قیمت امروز خریداری شده و ممکن است در ماه‌های آینده نسبت به
                  قیمت امروز گران‌تر شود. در این مدل قرارداد خود سرمایه‌پذیر
                  که در واقع فروشنده کالا است معمولاً فروش کالا را در سررسید
                  به عهده می‌گیرد. وی موظف است تلاش کند کالا را به قیمتی
                  بفروشد که حداقل سود مدنظر سرمایه‌گذار فراهم شود. یکی از
                  مزیت‌های مهم این قرارداد، امکان بهره‌مندی سرمایه‌گذار از
                  افزایش قیمت کالا در آینده است. در قرارداد مرابحه، نرخ سود از
                  همان ابتدا مشخص شده و پس از انجام خرید و فروش قابل تغییر
                  نیست؛ اما در قرارداد پیش‌خرید، سرمایه‌گذار می‌تواند قرارداد را
                  به نحوی تنظیم کند که در صورت افزایش قیمت کالا، سود بیشتری
                  نصیب او شود.
                </p>
            </div>

            <div>
              <h3 className="text-base font-semibold">ریسک قرارداد</h3>
              <div
                className={`mt-2 text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
              >
                <p>
                  سرمایه‌گذار مالک کالا است. اگر در سررسید قیمت کالا کاهش پیدا
                  کند ضرر متوجه وی خواهد بود. ریسک دیگر این قرارداد، فروش
                  نرفتن کالا در سررسید است.
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
            <p
              className={`text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
            >
              در این قرارداد، هم سرمایه‌گذار و هم مجری آورده مالی دارند و در
              سود و زیان شریک می‌شوند.
            </p>

            <div>
              <h3 className="text-base font-semibold">انواع آن</h3>
              <div className={`mt-3 space-y-3 ${sectionBodyIndent}`}>
                {partnershipTypes.map((type) => (
                  <div
                    key={type.title}
                    className="rounded-lg border bg-muted/20 p-4"
                  >
                    <p className="text-sm font-medium">{type.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-justify text-muted-foreground">
                      {type.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">مثال</h3>
              <div
                className={`mt-2 space-y-3 text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
              >
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
              <h3 className="text-base font-semibold">ریسک قرارداد</h3>
              <div
                className={`mt-2 space-y-3 text-sm leading-relaxed text-justify text-muted-foreground ${sectionBodyIndent}`}
              >
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
            <p className="text-sm leading-relaxed text-justify text-muted-foreground">
              به‌زودی نمونه قراردادهای مرابحه، سلف و مشارکت در این بخش برای
              مطالعه و دانلود در دسترس قرار می‌گیرد.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
