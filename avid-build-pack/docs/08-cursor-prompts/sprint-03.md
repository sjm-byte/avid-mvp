# Sprint 03 Prompt - Investment Request and Risk Acceptance

## هدف

سرمایه‌گذار بتواند برای یک پروژه درخواست مشارکت ثبت کند، با پذیرش ریسک و قرارداد.

## Prompt برای Cursor

```text
Implement Sprint 3 for Avid.

Build the investment request flow.

Database tables needed:
- investment_requests
- contracts
- contract_acceptances
- notifications

UI:
1. On project detail page, the CTA opens an investment request modal for logged-in investors.
2. If user is not logged in, redirect to login.
3. Modal steps:
   - Enter requested amount
   - Show project risk disclosure
   - Checkbox: I understand profit is not guaranteed
   - Show contract/terms text
   - Checkbox: I accept project terms
   - Submit
4. Create /dashboard/investment-requests page for investor.
5. Create /admin/investment-requests page for admin.
6. Admin can approve or reject a request.
7. After approval, admin can mark payment instructions as sent.

Rules:
- User cannot submit request below project min_investment.
- User cannot submit without risk acceptance and contract acceptance.
- No payment upload yet.
- No wallet.

All text Persian RTL.
```

## معیار پذیرش

- درخواست مشارکت ثبت شود.
- ادمین آن را ببیند.
- ادمین تأیید/رد کند.
- سرمایه‌گذار وضعیت درخواست را ببیند.
