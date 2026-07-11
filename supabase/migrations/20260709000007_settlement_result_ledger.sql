-- Sprint 06: settlement_result ledger entry type

alter table public.ledger_entries
  drop constraint if exists ledger_entries_entry_type_check;

alter table public.ledger_entries
  add constraint ledger_entries_entry_type_check check (entry_type in (
    'investment_commitment', 'payment_receipt_uploaded', 'payment_verified',
    'capital_allocated', 'project_cost_recorded', 'project_revenue_recorded',
    'initial_fee_recorded', 'success_fee_recorded', 'profit_calculated',
    'loss_calculated', 'settlement_due', 'settlement_paid', 'settlement_result',
    'adjustment'
  ));
