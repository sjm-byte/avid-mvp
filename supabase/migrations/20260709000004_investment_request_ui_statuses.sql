-- Extend investment_requests status values for Sprint 03 UI flow
-- Maps alongside existing statuses; app layer normalizes display labels.

alter table public.investment_requests
  drop constraint if exists investment_requests_status_check;

alter table public.investment_requests
  add constraint investment_requests_status_check
  check (status in (
    'draft', 'risk_accepted', 'submitted',
    'under_review', 'approved_pending_payment',
    'approved_by_admin', 'payment_instructions_sent',
    'receipt_uploaded', 'payment_verified', 'allocated_to_project',
    'rejected', 'cancelled', 'cancelled_by_investor'
  ));
