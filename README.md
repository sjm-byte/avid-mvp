# آوید MVP

پلتفرم فارسی مدیریت مشارکت پروژه‌ای — نسخه `v0.1-mvp`

## پیش‌نیازها

- Node.js 18+
- npm یا pnpm

## راه‌اندازی

```bash
npm install
cp .env.local.example .env.local
# مقادیر Supabase را در .env.local تنظیم کنید
npm run dev
```

سپس [http://localhost:3000](http://localhost:3000) را باز کنید.

## ورود آزمایشی (Demo)

در صفحه [`/login`](http://localhost:3000/login) از دکمه‌های **ورود آزمایشی — سرمایه‌گذار** یا **ورود آزمایشی — مدیر** استفاده کنید.

- داده‌ها در کوکی مرورگر ذخیره می‌شوند (بدون Supabase الزامی نیست)
- پول واقعی جابه‌جا نمی‌شود؛ آوید درگاه پرداخت نیست
- پس از ورود، کارت «مسیر نمایشی پیشنهادی» در داشبورد راهنمای گام‌به‌گام است

### چک‌لیست مسیر نمایشی — سرمایه‌گذار

1. [ ] ورود آزمایشی سرمایه‌گذار از `/login`
2. [ ] مشاهده پروژه‌های باز در `/projects`
3. [ ] باز کردن جزئیات پروژه (مثلاً `/projects/food-import-raw-materials`)
4. [ ] ثبت درخواست مشارکت با پذیرش ریسک
5. [ ] پیگیری در `/dashboard/investments`
6. [ ] مشاهده ثبت حسابداری در `/dashboard/ledger`
7. [ ] مرور اسناد در `/dashboard/documents`

### چک‌لیست مسیر نمایشی — مدیر

1. [ ] خروج و ورود آزمایشی مدیر از `/login`
2. [ ] بررسی درخواست‌ها در `/admin/requests` (تأیید / رد)
3. [ ] بررسی رسیدها در `/admin/receipts`
4. [ ] مشاهده ثبت حسابداری در `/admin/ledger`
5. [ ] ثبت گزارش پروژه در `/admin/reports`
6. [ ] تسویه و ثبت پرداخت دستی در `/admin/settlements`

### جریان کامل (دو نقش)

1. سرمایه‌گذار: ثبت درخواست → بارگذاری رسید (در صورت تأیید)
2. مدیر: تأیید درخواست → تأیید رسید → تخصیص و ثبت حسابداری
3. مدیر: تسویه نهایی → سرمایه‌گذار نتیجه را در `/dashboard/investments` می‌بیند

## ساختار

- `src/app/(public)` — صفحات عمومی (لندینگ، پروژه‌ها، FAQ و ...)
- `src/app/(dashboard)` — پنل سرمایه‌گذار
- `src/app/(admin)` — پنل مدیریت
- `avid-build-pack/` — مستندات محصول و پرامپت‌های اسپرینت

## اسپرینت ۰۱ (تکمیل‌شده)

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- فارسی RTL
- Supabase Auth (آماده اتصال)
- Layout عمومی، پنل سرمایه‌گذار و پنل ادمین
- صفحات login/signup
- داشبوردهای placeholder

## اسپرینت ۰۲ (تکمیل‌شده)

- مایگریشن‌های Supabase (جداول اصلی + RLS + Viewها)
- TypeScript types و query helpers با fallback به mock
- ۳ پروژه فعال + ۱ پروژه خاتمه‌یافته (seed)
- ویترین عمومی: لیست پروژه‌ها، جزئیات `/projects/[slug]`، شفافیت
- کامپوننت‌های ProjectCard، FundingProgressBar، ReturnScenarioCard و ...

### اجرای مایگریشن Supabase

```bash
# با Supabase CLI
supabase db push
# یا اجرای seed پس از مایگریشن
psql $DATABASE_URL -f supabase/seed.sql
```

بدون Supabase، اپ از داده mock در `src/lib/data/mock/seed-projects.ts` استفاده می‌کند.

## اسپرینت ۰۳ (تکمیل‌شده)

- فرم درخواست مشارکت روی صفحه جزئیات پروژه
- پذیرش ریسک، عدم تضمین سود، و تأیید اطلاعات واریز جداگانه
- ذخیره درخواست در Supabase یا mock (cookie) بدون تخصیص خودکار
- داشبورد سرمایه‌گذار: درخواست‌ها، تخصیص‌ها، وضعیت پروژه‌ها، خلاصه Ledger
- پنل ادمین: بررسی و تأیید/رد درخواست‌ها
- وضعیت‌ها: submitted، under_review، approved_pending_payment، rejected، cancelled

## اسپرینت بعدی

مستندات در `avid-build-pack/docs/08-cursor-prompts/sprint-02.md`
