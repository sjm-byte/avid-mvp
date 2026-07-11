import {
  ProjectDocumentRow,
  ProjectFinancialResultRow,
  ProjectMilestoneRow,
  ProjectRiskItemRow,
  ProjectRow,
} from "@/types/database";
import {
  ClosedProjectTransparency,
  ProjectDetail,
  ProjectFunding,
  ProjectListItem,
  TransparencyStats,
  mapFinancialResultToTransparency,
  mapProjectRowToListItem,
  mapToProjectDetail,
} from "@/types/project";

const MOCK_PROJECTS: ProjectRow[] = [
  {
    id: "b2000000-0000-4000-8000-000000000001",
    capital_seeker_id: "a1000000-0000-4000-8000-000000000001",
    title: "واردات فویل و لفاف بسته‌بندی — فروش به صنایع غذایی",
    slug: "food-import-raw-materials",
    short_description:
      "خرید ارزی یک محموله فویل آلومینیومی و لفاف پلی‌اتیلن با قرارداد فروش به دو کارخانه بسته‌بندی در تهران و البرز.",
    full_description:
      "سرمایه این پروژه صرف خرید ارزی، حمل دریایی، ترخیص گمرکی و انبارداری کوتاه‌مدت یک محموله مواد اولیه بسته‌بندی غذایی می‌شود. فروش به دو خریدار داخلی از قبل در قراردادهای جداگانه تعریف شده است. سناریوی بازده پیش‌بینی‌شده (پایه) حدود ۱۹٪ است و همان نتیجه واقعی پروژه محسوب نمی‌شود. تسویه نهایی پس از تحویل کالا و ثبت وصول مطالبات انجام می‌شود.",
    category: "بازرگانی",
    project_type: "واردات",
    status: "in_execution",
    min_raise: 30000000000,
    max_raise: 90000000000,
    min_investment: 5000000000,
    expected_duration_days: 120,
    expected_return_min: 0.15,
    expected_return_base: 0.19,
    expected_return_max: 0.23,
    risk_summary: "نوسان نرخ ارز؛ احتمال تأخیر ترخیص در بندر",
    risk_details: null,
    mitigation_plan:
      "قرارداد فروش مرحله‌ای، بیمه محموله، کارگزار گمرکی با سابقه وصول",
    payment_instructions:
      "پس از تأیید درخواست، واریز خارج از سامانه به حساب معرفی‌شده همین پروژه انجام می‌شود. در توضیحات، شناسه درخواست آوید را درج کنید. آوید وجهی دریافت نمی‌کند.",
    destination_account_owner: "بازرگانی آذین بسته‌بندی",
    destination_iban: "IR120170000000123456789012",
    destination_bank_name: "بانک ملت",
    starts_at: "2026-01-20T00:00:00Z",
    expected_ends_at: "2026-05-20T00:00:00Z",
    actual_ends_at: null,
    is_public: true,
    created_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "b2000000-0000-4000-8000-000000000002",
    capital_seeker_id: "a1000000-0000-4000-8000-000000000002",
    title: "سرمایه در گردش تولید پوشاک کار — صادرات به عراق",
    slug: "apparel-working-capital",
    short_description:
      "تأمین پارچه و هزینه تولید برای سفارش ۳۵ هزار دست لباس کار با قرارداد صادراتی به بازار بغداد.",
    full_description:
      "این پروژه سرمایه در گردش تولیدی است: خرید پارچه کجراه و ملزومات دوخت، پرداخت دستمزد خط تولید و بسته‌بندی صادراتی. درآمد از فروش سفارش به خریدار عراقی حاصل می‌شود. سناریوی بازده پیش‌بینی‌شده (پایه) ۲۱٪ برآورد شده و تا پایان اجرا و تسویه نهایی ثبت نشده است. مدت اجرا حدود ۵ ماه تخمین زده می‌شود.",
    category: "تولیدی",
    project_type: "سرمایه در گردش",
    status: "funding_in_progress",
    min_raise: 60000000000,
    max_raise: 150000000000,
    min_investment: 10000000000,
    expected_duration_days: 150,
    expected_return_min: 0.16,
    expected_return_base: 0.21,
    expected_return_max: 0.27,
    risk_summary: "تأخیر تولید؛ نوسان قیمت پارچه و نخ",
    risk_details: null,
    mitigation_plan:
      "قرارداد صادراتی، برنامه تولید هفتگی، ذخیره ۸٪ contingency در بودجه",
    payment_instructions:
      "واریز خارج از سامانه به حساب زیر. نام پروژه و شناسه درخواست را در توضیحات بنویسید. واریز به حساب آوید مجاز نیست.",
    destination_account_owner: "نساجی و پوشاک مهر",
    destination_iban: "IR620560000000001234567890",
    destination_bank_name: "بانک سامان",
    starts_at: null,
    expected_ends_at: null,
    actual_ends_at: null,
    is_public: true,
    created_by: null,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "b2000000-0000-4000-8000-000000000003",
    capital_seeker_id: "a1000000-0000-4000-8000-000000000003",
    title: "صادرات خرمای مضافتی به امارات",
    slug: "date-export-uae",
    short_description:
      "خرید از باغ‌داران جنوب، بسته‌بندی ۱۰ کیلوگرمی و حمل به انبار توزیع‌کننده در دبی.",
    full_description:
      "پروژه کوتاه‌مدت صادراتی: خرید خرمای مضافتی درجه یک از باغ‌داران استان کرمان، بسته‌بندی مطابق استاندارد صادراتی GCC، و حمل دریایی به امارات. سناریوی بازده پیش‌بینی‌شده (پایه) ۱۵٪ بر اساس قیمت قرارداد و هزینه لجستیک برآورد شده و ممکن است با نتیجه واقعی پروژه متفاوت باشد.",
    category: "بازرگانی",
    project_type: "صادرات",
    status: "open_for_interest",
    min_raise: 20000000000,
    max_raise: 60000000000,
    min_investment: 3000000000,
    expected_duration_days: 75,
    expected_return_min: 0.11,
    expected_return_base: 0.15,
    expected_return_max: 0.19,
    risk_summary: "کنترل کیفیت صادراتی؛ زمان‌بندی بارگیری بندر",
    risk_details: null,
    mitigation_plan:
      "آزمایش نمونه قبل از خرید انبوه، بیمه محموله، پیش‌پرداخت ۲۰٪ از خریدار",
    payment_instructions:
      "پس از تأیید درخواست، مبلغ مشارکت به حساب معرفی‌شده همین پروژه واریز می‌شود. آوید واسطه مالی نیست.",
    destination_account_owner: "بازرگانی خرمای کهنود",
    destination_iban: "IR450180000000009876543210",
    destination_bank_name: "بانک تجارت",
    starts_at: null,
    expected_ends_at: null,
    actual_ends_at: null,
    is_public: true,
    created_by: null,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "b2000000-0000-4000-8000-000000000004",
    capital_seeker_id: "a1000000-0000-4000-8000-000000000004",
    title: "واردات قطعات الکترونیکی مصرفی",
    slug: "electronics-import-closed",
    short_description:
      "واردات خازن، مقاومت و آی‌سی از تأمین‌کننده آسیایی — تسویه‌شده؛ نتیجه واقعی پروژه ۹.۶٪.",
    full_description:
      "واردات قطعات الکترونیکی مصرفی برای سه مونتاژکار تهران و کرج. پروژه با تأخیر سه‌هفته‌ای در ترخیص بسته شد. سناریوی بازده پیش‌بینی‌شده (پایه) ۲۲٪ بود؛ نتیجه واقعی پروژه پس از تسویه ۹.۶٪ ثبت شد.",
    category: "بازرگانی",
    project_type: "واردات",
    status: "closed_success",
    min_raise: 20000000000,
    max_raise: 45000000000,
    min_investment: 2000000000,
    expected_duration_days: 90,
    expected_return_min: 0.15,
    expected_return_base: 0.22,
    expected_return_max: 0.28,
    risk_summary: "نوسان ارز؛ تأخیر حمل و ترخیص",
    risk_details: null,
    mitigation_plan: "قرارداد فروش مرحله‌ای، بیمه حمل، پیگیری روزانه ترخیص",
    payment_instructions: null,
    destination_account_owner: null,
    destination_iban: null,
    destination_bank_name: null,
    starts_at: "2025-12-01T00:00:00Z",
    expected_ends_at: "2026-03-01T00:00:00Z",
    actual_ends_at: "2026-03-22T00:00:00Z",
    is_public: true,
    created_by: null,
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2026-03-22T00:00:00Z",
  },
];

const MOCK_FUNDING: Record<string, ProjectFunding> = {
  "b2000000-0000-4000-8000-000000000001": {
    totalVerifiedAmount: 65000000000,
    investorCount: 4,
    fundingPercent: 0.722,
  },
  "b2000000-0000-4000-8000-000000000002": {
    totalVerifiedAmount: 54000000000,
    investorCount: 5,
    fundingPercent: 0.36,
  },
  "b2000000-0000-4000-8000-000000000003": {
    totalVerifiedAmount: 4800000000,
    investorCount: 1,
    fundingPercent: 0.08,
  },
  "b2000000-0000-4000-8000-000000000004": {
    totalVerifiedAmount: 32000000000,
    investorCount: 6,
    fundingPercent: 0.711,
  },
};

const MOCK_RISK_ITEMS: Record<string, ProjectRiskItemRow[]> = {
  "b2000000-0000-4000-8000-000000000001": [
    {
      id: "r1",
      project_id: "b2000000-0000-4000-8000-000000000001",
      risk_type: "ریسک ارزی",
      description:
        "افزایش نرخ ارز در زمان خرید می‌تواند حاشیه پروژه را کاهش دهد.",
      mitigation: "قفل نرخ برای ۶۰٪ مبلغ خرید ارزی",
      sort_order: 1,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "r2",
      project_id: "b2000000-0000-4000-8000-000000000001",
      risk_type: "ریسک گمرکی",
      description: "ترخیص در بندر ممکن است بیش از ۱۰ روز کاری طول بکشد.",
      mitigation: "کارگزار گمرکی با سابقه وصول و پیگیری روزانه",
      sort_order: 2,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "r3",
      project_id: "b2000000-0000-4000-8000-000000000001",
      risk_type: "ریسک وصول",
      description: "یکی از خریداران داخلی ممکن است مهلت پرداخت را تمدید کند.",
      mitigation: "ضمانت‌نامه بانکی در قرارداد فروش",
      sort_order: 3,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000002": [
    {
      id: "r4",
      project_id: "b2000000-0000-4000-8000-000000000002",
      risk_type: "ریسک تولید",
      description:
        "تأخیر در دوخت یا کمبود نیروی ماهر می‌تواند زمان تحویل را جابه‌جا کند.",
      mitigation: "برنامه تولید هفتگی و بازرسی خط دوخت",
      sort_order: 1,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "r5",
      project_id: "b2000000-0000-4000-8000-000000000002",
      risk_type: "ریسک قیمت",
      description: "افزایش ناگهانی قیمت پارچه کجراه در بازار داخلی.",
      mitigation: "قرارداد خرید پارچه با قیمت ثابت دو هفته‌ای",
      sort_order: 2,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "r6",
      project_id: "b2000000-0000-4000-8000-000000000002",
      risk_type: "ریسک صادرات",
      description: "وصول ارزی از خریدار عراقی ممکن است با تأخیر همراه باشد.",
      mitigation: "پیش‌پرداخت ۲۵٪ در زمان امضای قرارداد",
      sort_order: 3,
      created_at: "2026-02-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000003": [
    {
      id: "r7",
      project_id: "b2000000-0000-4000-8000-000000000003",
      risk_type: "ریسک کیفی",
      description:
        "خرما باید رطوبت و درجه‌بندی مورد قبول بازرس صادراتی را داشته باشد.",
      mitigation: "آزمایش نمونه در آزمایشگاه همکار قبل از خرید انبوه",
      sort_order: 1,
      created_at: "2026-03-01T00:00:00Z",
    },
    {
      id: "r8",
      project_id: "b2000000-0000-4000-8000-000000000003",
      risk_type: "ریسک حمل",
      description: "تأخیر در رزرو کانتینر یا بارگیری در بندر شهید رجایی.",
      mitigation: "رزرو ظرفیت حمل دو هفته زودتر از برنامه",
      sort_order: 2,
      created_at: "2026-03-01T00:00:00Z",
    },
    {
      id: "r9",
      project_id: "b2000000-0000-4000-8000-000000000003",
      risk_type: "ریسک قراردادی",
      description: "خریدار اماراتی ممکن است شرایط تحویل را بازبینی کند.",
      mitigation: "قرارداد فروش با جریمه تأخیر روزانه",
      sort_order: 3,
      created_at: "2026-03-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000004": [
    {
      id: "r10",
      project_id: "b2000000-0000-4000-8000-000000000004",
      risk_type: "ریسک ارزی",
      description: "نوسان نرخ ارز بین زمان سفارش و زمان فروش داخلی.",
      mitigation: "قفل نرخ برای بخشی از خرید",
      sort_order: 1,
      created_at: "2025-11-15T00:00:00Z",
    },
    {
      id: "r11",
      project_id: "b2000000-0000-4000-8000-000000000004",
      risk_type: "ریسک گمرکی",
      description: "تأخیر ترخیص — در اجرا رخ داد و هزینه انبارداری افزایش یافت.",
      mitigation: "پیگیری روزانه با کارگزار (پس از وقوع)",
      sort_order: 2,
      created_at: "2025-11-15T00:00:00Z",
    },
  ],
};

const MOCK_MILESTONES: Record<string, ProjectMilestoneRow[]> = {
  "b2000000-0000-4000-8000-000000000001": [
    {
      id: "m1",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "تکمیل جذب سرمایه",
      description: "حداقل ۳ میلیارد تومان جذب و ثبت حسابداری تخصیص",
      planned_date: "2026-01-25",
      actual_date: "2026-01-22",
      status: "done",
      sort_order: 1,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "m2",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "ثبت سفارش خرید ارزی",
      description: "پرداخت ۴۰٪ پیش‌پرداخت به تأمین‌کننده چینی",
      planned_date: "2026-02-10",
      actual_date: "2026-02-08",
      status: "done",
      sort_order: 2,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "m3",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "حمل دریایی و ترخیص",
      description: "ورود محموله به انبار کرج — در حال پیگیری گمرک",
      planned_date: "2026-03-20",
      actual_date: null,
      status: "in_progress",
      sort_order: 3,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "m4",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "تحویل و وصول مطالبات",
      description: "فروش به دو خریدار و ثبت تسویه نهایی",
      planned_date: "2026-05-15",
      actual_date: null,
      status: "planned",
      sort_order: 4,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000002": [
    {
      id: "m5",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "جذب سرمایه",
      description: "رسیدن به حداقل ۶ میلیارد تومان — ۳۶٪ از سقف جذب‌شده",
      planned_date: "2026-03-20",
      actual_date: null,
      status: "in_progress",
      sort_order: 1,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "m6",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "خرید پارچه و ملزومات",
      description: "تحویل ۱۲ هزار متر پارچه کجراه به کارگاه",
      planned_date: "2026-04-05",
      actual_date: null,
      status: "planned",
      sort_order: 2,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "m7",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "تولید و کنترل کیفیت",
      description: "دوخت سفارش و بازرسی نمونه‌ای ۵٪",
      planned_date: "2026-05-20",
      actual_date: null,
      status: "planned",
      sort_order: 3,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "m8",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "صادرات و تسویه",
      description: "ارسال محموله به بغداد و ثبت نتیجه واقعی پروژه",
      planned_date: "2026-07-01",
      actual_date: null,
      status: "planned",
      sort_order: 4,
      created_at: "2026-02-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000003": [
    {
      id: "m9",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "شروع جذب مشارکت",
      description: "انتشار پروژه و پذیرش درخواست علاقه‌مندی",
      planned_date: "2026-03-15",
      actual_date: "2026-03-10",
      status: "done",
      sort_order: 1,
      created_at: "2026-03-01T00:00:00Z",
    },
    {
      id: "m10",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "جذب حداقل سرمایه",
      description: "تکمیل ۲ میلیارد تومان حداقل جذب",
      planned_date: "2026-04-10",
      actual_date: null,
      status: "in_progress",
      sort_order: 2,
      created_at: "2026-03-01T00:00:00Z",
    },
    {
      id: "m11",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "خرید و بسته‌بندی",
      description: "خرید ۸۰ تن از باغ‌داران سیرجان و بسته‌بندی ۱۰ کیلویی",
      planned_date: "2026-04-25",
      actual_date: null,
      status: "planned",
      sort_order: 3,
      created_at: "2026-03-01T00:00:00Z",
    },
    {
      id: "m12b",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "حمل و تحویل در دبی",
      description: "بارگیری کانتینر و تحویل به انبار خریدار",
      planned_date: "2026-05-20",
      actual_date: null,
      status: "planned",
      sort_order: 4,
      created_at: "2026-03-01T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000004": [
    {
      id: "m12",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "تکمیل جذب سرمایه",
      description: "جذب ۳.۲ میلیارد تومان از ۶ مشارکت‌کننده",
      planned_date: "2025-12-15",
      actual_date: "2025-12-12",
      status: "done",
      sort_order: 1,
      created_at: "2025-11-15T00:00:00Z",
    },
    {
      id: "m13",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "سفارش و حمل بین‌المللی",
      description: "ثبت سفارش در شنژن و بارگیری FOB",
      planned_date: "2026-01-20",
      actual_date: "2026-01-25",
      status: "done",
      sort_order: 2,
      created_at: "2025-11-15T00:00:00Z",
    },
    {
      id: "m14",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "ترخیص گمرکی",
      description: "ورود به انبار — ۲۱ روز تأخیر نسبت به برنامه",
      planned_date: "2026-02-10",
      actual_date: "2026-03-03",
      status: "done",
      sort_order: 3,
      created_at: "2025-11-15T00:00:00Z",
    },
    {
      id: "m15",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "فروش و تسویه نهایی",
      description: "تحویل به سه مونتاژکار و ثبت نتیجه واقعی پروژه",
      planned_date: "2026-03-01",
      actual_date: "2026-03-22",
      status: "done",
      sort_order: 4,
      created_at: "2025-11-15T00:00:00Z",
    },
  ],
};

const MOCK_DOCUMENTS: Record<string, ProjectDocumentRow[]> = {
  "b2000000-0000-4000-8000-000000000001": [
    {
      id: "d1",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "خلاصه قرارداد خرید و فروش (دو خریدار)",
      document_type: "contract",
      file_path: "/placeholder/contract-summary.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-01-05T00:00:00Z",
    },
    {
      id: "d2",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "برگه سناریوی بازده پیش‌بینی‌شده — پایه",
      document_type: "report",
      file_path: "/placeholder/return-scenario.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-01-05T00:00:00Z",
    },
    {
      id: "d1b",
      project_id: "b2000000-0000-4000-8000-000000000001",
      title: "برآورد هزینه حمل و ترخیص",
      document_type: "report",
      file_path: "/placeholder/logistics-cost.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-01-08T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000002": [
    {
      id: "d3",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "قرارداد صادرات به خریدار عراقی",
      document_type: "contract",
      file_path: "/placeholder/export-contract.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-02-05T00:00:00Z",
    },
    {
      id: "d4",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "بودجه تولید و سناریوی بازده",
      document_type: "report",
      file_path: "/placeholder/production-budget.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-02-05T00:00:00Z",
    },
    {
      id: "d4b",
      project_id: "b2000000-0000-4000-8000-000000000002",
      title: "نمونه مشخصات فنی لباس کار",
      document_type: "other",
      file_path: "/placeholder/spec-sheet.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-02-08T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000003": [
    {
      id: "d5",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "قرارداد فروش به توزیع‌کننده دبی",
      document_type: "contract",
      file_path: "/placeholder/uae-sales-contract.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-03-05T00:00:00Z",
    },
    {
      id: "d6",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "برآورد هزینه بسته‌بندی و حمل دریایی",
      document_type: "report",
      file_path: "/placeholder/logistics-estimate.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-03-05T00:00:00Z",
    },
    {
      id: "d6b",
      project_id: "b2000000-0000-4000-8000-000000000003",
      title: "گزارش نمونه‌گیری کیفی خرما",
      document_type: "report",
      file_path: "/placeholder/quality-sample.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-03-08T00:00:00Z",
    },
  ],
  "b2000000-0000-4000-8000-000000000004": [
    {
      id: "d7",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "گزارش تسویه نهایی و نتیجه واقعی پروژه",
      document_type: "report",
      file_path: "/placeholder/settlement-report.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-03-22T00:00:00Z",
    },
    {
      id: "d8",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "خلاصه قرارداد تأمین‌کننده (شنژن)",
      document_type: "contract",
      file_path: "/placeholder/supplier-contract.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2025-12-01T00:00:00Z",
    },
    {
      id: "d8b",
      project_id: "b2000000-0000-4000-8000-000000000004",
      title: "صورتجلسه تحویل به مونتاژکاران",
      document_type: "other",
      file_path: "/placeholder/delivery-minutes.placeholder",
      visibility: "public",
      uploaded_by: null,
      created_at: "2026-03-15T00:00:00Z",
    },
  ],
};

const MOCK_FINANCIAL_RESULTS: Record<string, ProjectFinancialResultRow> = {
  "b2000000-0000-4000-8000-000000000004": {
    id: "f1",
    project_id: "b2000000-0000-4000-8000-000000000004",
    total_verified_capital: 32000000000,
    total_revenue: 39680000000,
    total_costs: 36266666667,
    initial_fee_amount: 0,
    success_fee_rate: 0.1,
    success_fee_amount: 341333333,
    net_result_before_success_fee: 3413333333,
    distributable_result: 3072000000,
    expected_return_base: 0.22,
    variance_reason:
      "تأخیر ۲۱ روزه در ترخیص و افزایش هزینه انبارداری. سناریوی بازده پیش‌بینی‌شده ۲۲٪ بود؛ نتیجه واقعی پروژه ۹.۶٪ ثبت شد.",
    settlement_date: "2026-03-22",
    admin_notes: null,
    finalized_by: null,
    finalized_at: "2026-03-22T00:00:00Z",
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2026-03-22T00:00:00Z",
  },
};

const ACTIVE_STATUSES = [
  "open_for_interest",
  "funding_in_progress",
  "funding_completed",
  "in_execution",
] as const;

const CLOSED_STATUSES = ["closed_success", "closed_loss"] as const;

function defaultFunding(projectId: string, maxRaise: number): ProjectFunding {
  return (
    MOCK_FUNDING[projectId] ?? {
      totalVerifiedAmount: 0,
      investorCount: 0,
      fundingPercent: 0,
    }
  );
}

export function getMockProjectRowById(projectId: string): ProjectRow | null {
  return MOCK_PROJECTS.find((p) => p.id === projectId) ?? null;
}

export function getSeedMilestonesForProject(
  projectId: string
): ProjectMilestoneRow[] {
  return MOCK_MILESTONES[projectId] ?? [];
}

export function getSeedDocumentsForProject(
  projectId: string
): ProjectDocumentRow[] {
  return MOCK_DOCUMENTS[projectId] ?? [];
}

export function getAllSeedDocuments(): Array<{
  doc: ProjectDocumentRow;
  projectTitle: string;
}> {
  return MOCK_PROJECTS.flatMap((project) =>
    (MOCK_DOCUMENTS[project.id] ?? []).map((doc) => ({
      doc,
      projectTitle: project.title,
    }))
  );
}

export function getMockPublicProjects(): ProjectListItem[] {
  return MOCK_PROJECTS.filter(
    (p) => p.is_public && ACTIVE_STATUSES.includes(p.status as (typeof ACTIVE_STATUSES)[number])
  ).map((p) =>
    mapProjectRowToListItem(p, defaultFunding(p.id, Number(p.max_raise)))
  );
}

export function getMockProjectBySlug(slug: string): ProjectDetail | null {
  const project = MOCK_PROJECTS.find((p) => p.slug === slug && p.is_public);
  if (!project) return null;
  return mapToProjectDetail(
    project,
    defaultFunding(project.id, Number(project.max_raise)),
    MOCK_RISK_ITEMS[project.id] ?? [],
    MOCK_MILESTONES[project.id] ?? [],
    MOCK_DOCUMENTS[project.id] ?? []
  );
}

export function getMockClosedProjects(): ClosedProjectTransparency[] {
  return MOCK_PROJECTS.filter((p) =>
    CLOSED_STATUSES.includes(p.status as (typeof CLOSED_STATUSES)[number])
  )
    .map((p) => {
      const result = MOCK_FINANCIAL_RESULTS[p.id];
      if (!result) return null;
      return mapFinancialResultToTransparency(p, result);
    })
    .filter((x): x is ClosedProjectTransparency => x !== null);
}

export function getMockTransparencyStats(): TransparencyStats {
  const closed = getMockClosedProjects();
  const active = getMockPublicProjects();
  const totalCapital = closed.reduce((s, p) => s + p.totalVerifiedCapital, 0);
  const activeCapital = active.reduce(
    (s, p) => s + p.funding.totalVerifiedAmount,
    0
  );
  const avgDuration =
    closed.length > 0
      ? closed.reduce((s, p) => s + (p.actualDurationDays ?? 0), 0) / closed.length
      : 0;

  return {
    closedProjectsCount: closed.length,
    totalManagedCapital: totalCapital + activeCapital,
    averageDurationDays: Math.round(avgDuration),
    profitableCount: closed.filter((p) => (p.actualReturnRate ?? 0) > 0).length,
    lossCount: closed.filter((p) => (p.actualReturnRate ?? 0) < 0).length,
    delayedCount: closed.filter((p) =>
      p.varianceReason?.includes("تأخیر")
    ).length,
  };
}

export function getMockFeaturedProjects(limit = 3): ProjectListItem[] {
  return getMockPublicProjects().slice(0, limit);
}
