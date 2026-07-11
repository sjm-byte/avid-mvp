-- Sprint 06 step 1: settlement draft fields on project_financial_results

alter table public.project_financial_results
  add column if not exists settlement_date date,
  add column if not exists admin_notes text;
