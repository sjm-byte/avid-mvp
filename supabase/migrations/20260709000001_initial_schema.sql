-- Avid MVP initial schema
-- Money does NOT flow through Avid; ledger is accounting/display only.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  role text not null default 'investor'
    check (role in ('investor', 'admin', 'finance_manager')),
  national_id text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- investor_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.investor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  birth_date date,
  address text,
  bank_account_owner text,
  iban text,
  bank_name text,
  kyc_status text not null default 'not_started'
    check (kyc_status in ('not_started', 'pending', 'approved', 'rejected')),
  risk_disclosure_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- ---------------------------------------------------------------------------
-- capital_seekers
-- ---------------------------------------------------------------------------
create table if not exists public.capital_seekers (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  brand_name text,
  national_id text,
  registration_number text,
  contact_person text,
  phone text,
  email text,
  address text,
  description text,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  capital_seeker_id uuid references public.capital_seekers(id),
  title text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  category text,
  project_type text,
  status text not null default 'draft' check (status in (
    'draft', 'under_review', 'open_for_interest', 'funding_in_progress',
    'funding_completed', 'in_execution', 'delayed', 'settlement_in_progress',
    'closed_success', 'closed_loss', 'cancelled'
  )),
  min_raise numeric(18,2) not null default 0,
  max_raise numeric(18,2) not null default 0,
  min_investment numeric(18,2) not null default 0,
  expected_duration_days integer,
  expected_return_min numeric(8,4),
  expected_return_base numeric(8,4),
  expected_return_max numeric(8,4),
  risk_summary text,
  risk_details text,
  mitigation_plan text,
  payment_instructions text,
  destination_account_owner text,
  destination_iban text,
  destination_bank_name text,
  starts_at date,
  expected_ends_at date,
  actual_ends_at date,
  is_public boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  planned_date date,
  actual_date date,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'done', 'delayed', 'cancelled')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_documents
-- ---------------------------------------------------------------------------
create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  document_type text not null
    check (document_type in ('contract', 'invoice', 'report', 'image', 'video', 'audit', 'other')),
  file_path text not null,
  visibility text not null default 'admin_only'
    check (visibility in ('public', 'investors_only', 'admin_only')),
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_risk_items
-- ---------------------------------------------------------------------------
create table if not exists public.project_risk_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  risk_type text not null,
  description text not null,
  mitigation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- investment_requests
-- ---------------------------------------------------------------------------
create table if not exists public.investment_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  requested_amount numeric(18,2) not null check (requested_amount > 0),
  approved_amount numeric(18,2),
  status text not null default 'submitted' check (status in (
    'draft', 'risk_accepted', 'submitted', 'approved_by_admin',
    'payment_instructions_sent', 'receipt_uploaded', 'payment_verified',
    'allocated_to_project', 'rejected', 'cancelled_by_investor'
  )),
  risk_accepted_at timestamptz,
  contract_version_id uuid,
  admin_note text,
  investor_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- payment_receipts
-- ---------------------------------------------------------------------------
create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  investment_request_id uuid not null references public.investment_requests(id),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  amount numeric(18,2) not null check (amount > 0),
  paid_at timestamptz,
  source_account_info text,
  destination_account_owner text,
  destination_iban text,
  tracking_number text,
  file_path text,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- investments
-- ---------------------------------------------------------------------------
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  investment_request_id uuid references public.investment_requests(id),
  verified_amount numeric(18,2) not null check (verified_amount > 0),
  ownership_percent numeric(12,8),
  status text not null default 'active'
    check (status in ('active', 'settlement_pending', 'settled', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ledger_entries (accounting record only — no wallet)
-- ---------------------------------------------------------------------------
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  investor_id uuid references public.profiles(id),
  investment_id uuid references public.investments(id),
  entry_type text not null check (entry_type in (
    'investment_commitment', 'payment_receipt_uploaded', 'payment_verified',
    'capital_allocated', 'project_cost_recorded', 'project_revenue_recorded',
    'initial_fee_recorded', 'success_fee_recorded', 'profit_calculated',
    'loss_calculated', 'settlement_due', 'settlement_paid', 'adjustment'
  )),
  direction text not null check (direction in ('debit', 'credit', 'memo')),
  amount numeric(18,2) not null default 0,
  currency text not null default 'IRR',
  description text,
  reference_type text,
  reference_id uuid,
  status text not null default 'posted' check (status in ('draft', 'posted', 'voided')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_updates
-- ---------------------------------------------------------------------------
create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  body text not null,
  update_type text not null default 'general'
    check (update_type in ('general', 'financial', 'operational', 'delay', 'risk', 'settlement')),
  visibility text not null default 'investors_only'
    check (visibility in ('public', 'investors_only', 'admin_only')),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_financial_results
-- ---------------------------------------------------------------------------
create table if not exists public.project_financial_results (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id),
  total_verified_capital numeric(18,2) not null default 0,
  total_revenue numeric(18,2) not null default 0,
  total_costs numeric(18,2) not null default 0,
  initial_fee_amount numeric(18,2) not null default 0,
  success_fee_rate numeric(8,4) not null default 0,
  success_fee_amount numeric(18,2) not null default 0,
  net_result_before_success_fee numeric(18,2) not null default 0,
  distributable_result numeric(18,2) not null default 0,
  expected_return_base numeric(8,4),
  variance_reason text,
  finalized_by uuid references public.profiles(id),
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- settlements
-- ---------------------------------------------------------------------------
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  investment_id uuid not null references public.investments(id),
  principal_amount numeric(18,2) not null default 0,
  profit_or_loss_amount numeric(18,2) not null default 0,
  total_due_amount numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  status text not null default 'calculated'
    check (status in ('calculated', 'partially_paid', 'paid', 'disputed', 'cancelled')),
  paid_at timestamptz,
  payment_tracking_number text,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contracts
-- ---------------------------------------------------------------------------
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  title text not null,
  version text not null,
  body text not null,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contract_acceptances
-- ---------------------------------------------------------------------------
create table if not exists public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id),
  project_id uuid references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  title text not null,
  body text,
  notification_type text not null default 'general',
  related_type text,
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_is_public on public.projects(is_public);
create index if not exists idx_investments_project on public.investments(project_id);
create index if not exists idx_investments_investor on public.investments(investor_id);
create index if not exists idx_ledger_project on public.ledger_entries(project_id);
create index if not exists idx_ledger_investor on public.ledger_entries(investor_id);
