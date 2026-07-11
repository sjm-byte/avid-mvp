-- Sprint 05: preliminary financial reports + richer project updates

alter table public.project_updates
  add column if not exists summary text,
  add column if not exists operational_status text not null default 'on_track'
    check (operational_status in ('on_track', 'delayed', 'at_risk', 'completed'));

create table if not exists public.project_financial_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  period_start date not null,
  period_end date not null,
  capital_allocated numeric(18,2) not null default 0,
  costs_recorded numeric(18,2) not null default 0,
  revenue_recorded numeric(18,2) not null default 0,
  estimated_current_result numeric(18,2) not null default 0,
  admin_notes text,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_financial_reports_project
  on public.project_financial_reports (project_id, published_at desc);

alter table public.project_financial_reports enable row level security;

create policy "financial_reports_select"
  on public.project_financial_reports for select
  using (
    public.is_admin_or_finance()
    or public.investor_has_project_access(project_id)
  );

create policy "financial_reports_admin_all"
  on public.project_financial_reports for all
  using (public.is_admin_or_finance());
