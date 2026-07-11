# 06 - API Spec: مشخصات API آوید

نسخه: `v0.1-mvp`

این سند API سطح محصول را تعریف می‌کند. اگر با Supabase مستقیم کار شود، بسیاری از عملیات از طریق client SDK انجام می‌شود؛ اما برای عملیات حساس مالی بهتر است Server Action یا API Route داشته باشیم.

## 1. اصول API

1. عملیات مالی حساس فقط از سمت سرور انجام شود.
2. ایجاد Ledger Entry مستقیم توسط کلاینت مجاز نیست.
3. تأیید رسید، ایجاد investment و ثبت ledger باید در یک transaction انجام شود.
4. محاسبه تسویه باید قابل بازبینی باشد و قبل از نهایی شدن Preview داشته باشد.

## 2. Auth

### POST /auth/sign-up

ورودی:

```json
{
  "full_name": "علی رضایی",
  "phone": "0912...",
  "email": "ali@example.com",
  "password": "..."
}
```

خروجی:

```json
{
  "user_id": "uuid",
  "profile_created": true
}
```

### POST /auth/sign-in

Supabase Auth.

## 3. Projects

### GET /projects

Query:

- status
- category
- is_public

خروجی:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "پروژه واردات مواد اولیه",
      "status": "funding_in_progress",
      "max_raise": 10000000000,
      "total_verified_amount": 7300000000,
      "funding_percent": 0.73,
      "expected_return_base": 0.22,
      "expected_duration_days": 120
    }
  ]
}
```

### GET /projects/:slug

خروجی کامل پروژه شامل:

- details
- milestones
- risk_items
- public_documents
- public_updates
- funding_summary

### POST /admin/projects

ایجاد پروژه. فقط admin.

### PATCH /admin/projects/:id

ویرایش پروژه. فقط admin.

### POST /admin/projects/:id/publish

تغییر وضعیت به public/open.

## 4. Investment Requests

### POST /projects/:id/investment-requests

ثبت درخواست مشارکت.

ورودی:

```json
{
  "requested_amount": 500000000,
  "risk_accepted": true,
  "contract_id": "uuid"
}
```

قوانین:

- کاربر باید وارد شده باشد.
- مبلغ باید >= حداقل مشارکت باشد.
- ریسک و قرارداد باید پذیرفته شده باشند.

خروجی:

```json
{
  "request_id": "uuid",
  "status": "submitted"
}
```

### GET /investor/investment-requests

لیست درخواست‌های سرمایه‌گذار.

### POST /admin/investment-requests/:id/approve

تأیید درخواست توسط ادمین.

ورودی:

```json
{
  "approved_amount": 500000000,
  "admin_note": "تأیید شد"
}
```

### POST /admin/investment-requests/:id/reject

ورودی:

```json
{
  "reason": "ظرفیت پروژه تکمیل شده است"
}
```

### POST /admin/investment-requests/:id/send-payment-instructions

وضعیت را به `payment_instructions_sent` تغییر می‌دهد و اعلان می‌سازد.

## 5. Receipts

### POST /investment-requests/:id/receipts

ثبت رسید توسط سرمایه‌گذار.

ورودی multipart/form-data:

- amount
- paid_at
- tracking_number
- source_account_info
- file

خروجی:

```json
{
  "receipt_id": "uuid",
  "status": "pending"
}
```

### GET /admin/receipts?status=pending

لیست رسیدها برای بررسی.

### POST /admin/receipts/:id/verify

تأیید رسید. عملیات transaction:

1. receipt.status = verified
2. investment_request.status = payment_verified
3. ایجاد investment
4. ایجاد ledger payment_verified
5. ایجاد ledger capital_allocated
6. محاسبه ownership_percent
7. اعلان سرمایه‌گذار

ورودی:

```json
{
  "verified_amount": 500000000,
  "note": "مبلغ مطابق رسید تأیید شد"
}
```

### POST /admin/receipts/:id/reject

ورودی:

```json
{
  "reason": "شماره پیگیری خوانا نیست"
}
```

## 6. Ledger

### GET /investor/ledger

فقط Ledger مربوط به کاربر.

Query:

- project_id
- entry_type
- from_date
- to_date

### GET /admin/ledger

ادمین همه Ledger را می‌بیند.

### POST /admin/ledger/manual-entry

برای ثبت هزینه، درآمد، کارمزد یا اصلاحیه.

ورودی:

```json
{
  "project_id": "uuid",
  "investor_id": null,
  "entry_type": "project_cost_recorded",
  "direction": "debit",
  "amount": 120000000,
  "description": "هزینه حمل",
  "reference_type": "project_document",
  "reference_id": "uuid"
}
```

## 7. Project Updates

### POST /admin/projects/:id/updates

ایجاد گزارش پروژه.

ورودی:

```json
{
  "title": "گزارش خرید مرحله اول",
  "body": "...",
  "update_type": "operational",
  "visibility": "investors_only",
  "published_at": "2026-07-09T12:00:00Z"
}
```

### GET /projects/:id/updates

برای سرمایه‌گذار فقط گزارش‌های مجاز.

## 8. Settlements

### POST /admin/projects/:id/calculate-settlements-preview

پیش‌نمایش تسویه بدون ثبت نهایی.

خروجی:

```json
{
  "project_id": "uuid",
  "total_verified_capital": 10000000000,
  "total_revenue": 12500000000,
  "total_costs": 300000000,
  "success_fee": 200000000,
  "distributable_result": 2000000000,
  "investors": [
    {
      "investor_id": "uuid",
      "principal": 200000000,
      "share_percent": 0.02,
      "profit_or_loss": 40000000,
      "total_due": 240000000
    }
  ]
}
```

### POST /admin/projects/:id/finalize-settlements

ثبت نهایی تسویه‌ها. فقط admin.

### POST /admin/settlements/:id/mark-paid

ثبت پرداخت تسویه.

ورودی:

```json
{
  "paid_amount": 240000000,
  "paid_at": "2026-07-09T12:00:00Z",
  "payment_tracking_number": "123456",
  "note": "پرداخت به حساب اعلامی سرمایه‌گذار"
}
```

## 9. Documents

### POST /admin/projects/:id/documents

آپلود سند پروژه.

### GET /projects/:id/documents

بر اساس visibility و نقش کاربر.

## 10. Dashboard

### GET /admin/dashboard

خروجی:

```json
{
  "total_verified_capital": 120000000000,
  "active_capital": 80000000000,
  "active_projects_count": 5,
  "active_investors_count": 80,
  "pending_receipts_count": 12,
  "pending_settlement_amount": 4000000000,
  "initial_fees_total": 1500000000,
  "success_fees_total": 700000000
}
```

### GET /investor/dashboard

خروجی:

```json
{
  "total_invested": 1000000000,
  "active_capital": 700000000,
  "realized_profit_or_loss": 120000000,
  "pending_settlement": 300000000,
  "projects": []
}
```

## 11. Error Codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `PROJECT_NOT_OPEN`
- `AMOUNT_BELOW_MINIMUM`
- `RISK_NOT_ACCEPTED`
- `CONTRACT_NOT_ACCEPTED`
- `REQUEST_NOT_APPROVABLE`
- `RECEIPT_ALREADY_VERIFIED`
- `LEDGER_ENTRY_IMMUTABLE`
- `SETTLEMENT_ALREADY_FINALIZED`

## 12. پیاده‌سازی مهم Transaction

برای `verify receipt`:

```text
begin transaction
  lock investment_request
  lock project
  update receipt
  update request
  insert investment
  recalculate ownership_percent for all investments of project
  insert ledger entries
  insert notification
  insert audit_log
commit
```
