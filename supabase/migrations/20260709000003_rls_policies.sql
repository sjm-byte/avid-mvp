-- Row Level Security policies for Avid MVP

-- Helper: check if current user is admin or finance_manager
create or replace function public.is_admin_or_finance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'finance_manager')
  );
$$;

-- Helper: check if investor has verified investment in project
create or replace function public.investor_has_project_access(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.investments
    where project_id = p_project_id
      and investor_id = auth.uid()
      and status in ('active', 'settlement_pending', 'settled')
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin_or_finance());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- investor_profiles
-- ---------------------------------------------------------------------------
alter table public.investor_profiles enable row level security;

create policy "investor_profiles_select_own"
  on public.investor_profiles for select
  using (user_id = auth.uid() or public.is_admin_or_finance());

create policy "investor_profiles_update_own"
  on public.investor_profiles for update
  using (user_id = auth.uid() or public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- capital_seekers (admin only for write; public read for active)
-- ---------------------------------------------------------------------------
alter table public.capital_seekers enable row level security;

create policy "capital_seekers_select"
  on public.capital_seekers for select
  using (status = 'active' or public.is_admin_or_finance());

create policy "capital_seekers_admin_all"
  on public.capital_seekers for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

create policy "projects_select_public"
  on public.projects for select
  using (
    is_public = true
    or public.is_admin_or_finance()
    or public.investor_has_project_access(id)
  );

create policy "projects_admin_all"
  on public.projects for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- project_milestones
-- ---------------------------------------------------------------------------
alter table public.project_milestones enable row level security;

create policy "milestones_select"
  on public.project_milestones for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.is_public = true or public.is_admin_or_finance() or public.investor_has_project_access(p.id))
    )
  );

create policy "milestones_admin_all"
  on public.project_milestones for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- project_documents
-- ---------------------------------------------------------------------------
alter table public.project_documents enable row level security;

create policy "documents_select"
  on public.project_documents for select
  using (
    visibility = 'public'
    or public.is_admin_or_finance()
    or (
      visibility = 'investors_only'
      and public.investor_has_project_access(project_id)
    )
  );

create policy "documents_admin_all"
  on public.project_documents for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- project_risk_items
-- ---------------------------------------------------------------------------
alter table public.project_risk_items enable row level security;

create policy "risk_items_select"
  on public.project_risk_items for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.is_public = true or public.is_admin_or_finance() or public.investor_has_project_access(p.id))
    )
  );

create policy "risk_items_admin_all"
  on public.project_risk_items for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- investment_requests
-- ---------------------------------------------------------------------------
alter table public.investment_requests enable row level security;

create policy "investment_requests_select_own"
  on public.investment_requests for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "investment_requests_insert_own"
  on public.investment_requests for insert
  with check (investor_id = auth.uid());

create policy "investment_requests_update_admin"
  on public.investment_requests for update
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- payment_receipts
-- ---------------------------------------------------------------------------
alter table public.payment_receipts enable row level security;

create policy "receipts_select_own"
  on public.payment_receipts for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "receipts_insert_own"
  on public.payment_receipts for insert
  with check (investor_id = auth.uid());

create policy "receipts_update_admin"
  on public.payment_receipts for update
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- investments
-- ---------------------------------------------------------------------------
alter table public.investments enable row level security;

create policy "investments_select_own"
  on public.investments for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "investments_admin_all"
  on public.investments for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- ledger_entries (read-only for investors; no client writes)
-- ---------------------------------------------------------------------------
alter table public.ledger_entries enable row level security;

create policy "ledger_select_own"
  on public.ledger_entries for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "ledger_admin_insert"
  on public.ledger_entries for insert
  with check (public.is_admin_or_finance());

create policy "ledger_admin_update"
  on public.ledger_entries for update
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- project_updates
-- ---------------------------------------------------------------------------
alter table public.project_updates enable row level security;

create policy "updates_select"
  on public.project_updates for select
  using (
    visibility = 'public'
    or public.is_admin_or_finance()
    or (
      visibility = 'investors_only'
      and public.investor_has_project_access(project_id)
    )
  );

create policy "updates_admin_all"
  on public.project_updates for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- project_financial_results
-- ---------------------------------------------------------------------------
alter table public.project_financial_results enable row level security;

create policy "financial_results_select"
  on public.project_financial_results for select
  using (
    public.is_admin_or_finance()
    or public.investor_has_project_access(project_id)
    or exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.status in ('closed_success', 'closed_loss')
        and p.is_public = true
    )
  );

create policy "financial_results_admin_all"
  on public.project_financial_results for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- settlements
-- ---------------------------------------------------------------------------
alter table public.settlements enable row level security;

create policy "settlements_select_own"
  on public.settlements for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "settlements_admin_all"
  on public.settlements for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- contracts
-- ---------------------------------------------------------------------------
alter table public.contracts enable row level security;

create policy "contracts_select"
  on public.contracts for select
  using (
    public.is_admin_or_finance()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.is_public = true
    )
  );

create policy "contracts_admin_all"
  on public.contracts for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- contract_acceptances
-- ---------------------------------------------------------------------------
alter table public.contract_acceptances enable row level security;

create policy "acceptances_select_own"
  on public.contract_acceptances for select
  using (investor_id = auth.uid() or public.is_admin_or_finance());

create policy "acceptances_insert_own"
  on public.contract_acceptances for insert
  with check (investor_id = auth.uid());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid() or public.is_admin_or_finance());

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = auth.uid() or public.is_admin_or_finance());

create policy "notifications_admin_insert"
  on public.notifications for insert
  with check (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- audit_logs (admin only)
-- ---------------------------------------------------------------------------
alter table public.audit_logs enable row level security;

create policy "audit_logs_admin"
  on public.audit_logs for all
  using (public.is_admin_or_finance());

-- ---------------------------------------------------------------------------
-- views: grant select to authenticated and anon for public data
-- ---------------------------------------------------------------------------
grant select on public.project_funding_summary to anon, authenticated;
grant select on public.investor_portfolio_summary to authenticated;
