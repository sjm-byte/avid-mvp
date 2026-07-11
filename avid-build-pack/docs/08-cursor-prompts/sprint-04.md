# Sprint 04 Prompt - Receipts, Verification, Investments, Ledger

## هدف

ثبت رسید، تأیید پرداخت، ایجاد سرمایه‌گذاری و Ledger پیاده شود.

## Prompt برای Cursor

```text
Implement Sprint 4 for Avid.

Important: Avid does not hold money. There is no real wallet. Investors pay directly to the project destination account. The app only records receipts and ledger entries.

Build:
1. On approved investment request, show project payment instructions.
2. Investor can upload payment receipt and enter:
   - amount
   - paid_at
   - tracking_number
   - source_account_info
   - receipt file
3. Create payment_receipts table integration.
4. Admin receipts page /admin/receipts:
   - list pending receipts
   - view receipt detail
   - verify
   - reject with reason
5. On verify receipt:
   - update receipt status
   - update investment request status
   - create investment record
   - create ledger entries: payment_verified and capital_allocated
   - recalculate ownership_percent for project investments
   - create notification
6. Investor dashboard shows verified investments.
7. Create /dashboard/ledger for investor.
8. Create /admin/ledger for admin.

Do not implement real payment gateway.
Do not call it wallet in the UI. Use terms like دفتر مالی، گردش سرمایه، ثبت پرداخت.
```

## معیار پذیرش

- آپلود رسید کار کند.
- ادمین رسید را تأیید کند.
- پس از تأیید، investment ساخته شود.
- Ledger ساخته شود.
- سرمایه‌گذار پروژه را در داشبورد خود ببیند.
