# Sprint 06 Prompt - Final Result, Settlement, Transparency

## هدف

بستن پروژه، محاسبه سود/زیان واقعی، تسویه و صفحه شفافیت پیاده شود.

## Prompt برای Cursor

```text
Implement Sprint 6 for Avid.

Build final project financial result and settlement module.

Admin flow:
1. Admin opens project settlement page.
2. Admin enters:
   - total_revenue
   - total_costs
   - initial_fee_amount
   - success_fee_rate
3. System calculates:
   - total_verified_capital
   - net_result_before_success_fee
   - success_fee_amount only if profit is positive
   - distributable_result
   - each investor ownership percentage
   - each investor profit_or_loss_amount
   - each investor total_due_amount
4. Show preview table.
5. Admin finalizes settlements.
6. Create project_financial_results record.
7. Create settlements for each investment.
8. Create ledger entries: profit_calculated or loss_calculated, settlement_due.
9. Admin can mark settlement as paid manually with amount, date and tracking number.
10. Create ledger entry settlement_paid.

Investor:
- /dashboard/settlements
- project detail shows final result when finalized.

Public transparency:
- /transparency shows closed projects with expected vs actual return, expected vs actual duration, reason for difference and final report.

Rules:
- Profit is not guaranteed.
- Success fee applies only to realized positive profit.
- Settlement cannot be finalized twice.
- Paid amount cannot exceed total due.
```

## معیار پذیرش

- پروژه با سود یا زیان بسته شود.
- سهم سرمایه‌گذار درست محاسبه شود.
- تسویه پرداخت‌شده ثبت شود.
- پروژه خاتمه‌یافته در صفحه شفافیت نمایش داده شود.
