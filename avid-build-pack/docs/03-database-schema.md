# 03 - Database Schema: طراحی پایگاه داده آوید

نسخه: `v0.1-mvp`
پایگاه داده پیشنهادی: PostgreSQL روی Supabase

## 1. اصول طراحی داده

1. Ledger منبع حقیقت مالی است.
2. حذف فیزیکی برای داده‌های مالی ممنوع است.
3. هر پروژه مستقل است.
4. هر درخواست مشارکت، رسید، تخصیص، گزارش و تسویه باید به پروژه وصل باشد.
5. وضعیت‌ها باید enum یا check constraint داشته باشند.
6. برای اسناد و رسیدها از Supabase Storage استفاده شود و فقط مسیر فایل در دیتابیس ذخیره شود.

## 2. جداول اصلی

### 2.1 profiles

اطلاعات پایه کاربرها. به `auth.users` در Supabase وصل می‌شود.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  role text not null default 'investor' check (role in ('investor', 'admin', 'finance_manager')),
  national_id text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.2 investor_profiles

```sql
create table public.investor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  birth_date date,
  address text,
  bank_account_owner text,
  iban text,
  bank_name text,
  kyc_status text not null default 'not_started' check (kyc_status in ('not_started', 'pending', 'approved', 'rejected')),
  risk_disclosure_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);
```

### 2.3 capital_seekers

مجری/سرمایه‌پذیر پروژه.

```sql
create table public.capital_seekers (
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
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.4 projects

```sql
create table public.projects (
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
```

### 2.5 project_milestones

```sql
create table public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  planned_date date,
  actual_date date,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'done', 'delayed', 'cancelled')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

### 2.6 project_documents

```sql
create table public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  document_type text not null check (document_type in ('contract', 'invoice', 'report', 'image', 'video', 'audit', 'other')),
  file_path text not null,
  visibility text not null default 'admin_only' check (visibility in ('public', 'investors_only', 'admin_only')),
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

### 2.7 project_risk_items

```sql
create table public.project_risk_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  risk_type text not null,
  description text not null,
  mitigation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

### 2.8 investment_requests

```sql
create table public.investment_requests (
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
```

### 2.9 payment_receipts

```sql
create table public.payment_receipts (
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
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);
```

### 2.10 investments

سرمایه‌گذاری قطعی پس از تأیید رسید.

```sql
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  investment_request_id uuid references public.investment_requests(id),
  verified_amount numeric(18,2) not null check (verified_amount > 0),
  ownership_percent numeric(12,8),
  status text not null default 'active' check (status in ('active', 'settlement_pending', 'settled', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.11 ledger_entries

```sql
create table public.ledger_entries (
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
```

### 2.12 project_updates

```sql
create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  body text not null,
  update_type text not null default 'general' check (update_type in ('general', 'financial', 'operational', 'delay', 'risk', 'settlement')),
  visibility text not null default 'investors_only' check (visibility in ('public', 'investors_only', 'admin_only')),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.13 project_financial_results

```sql
create table public.project_financial_results (
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
  finalized_by uuid references public.profiles(id),
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.14 settlements

```sql
create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  investment_id uuid not null references public.investments(id),
  principal_amount numeric(18,2) not null default 0,
  profit_or_loss_amount numeric(18,2) not null default 0,
  total_due_amount numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  status text not null default 'calculated' check (status in ('calculated', 'partially_paid', 'paid', 'disputed', 'cancelled')),
  paid_at timestamptz,
  payment_tracking_number text,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.15 contracts

```sql
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  title text not null,
  version text not null,
  body text not null,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

### 2.16 contract_acceptances

```sql
create table public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id),
  project_id uuid references public.projects(id),
  investor_id uuid not null references public.profiles(id),
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);
```

### 2.17 notifications

```sql
create table public.notifications (
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
```

### 2.18 audit_logs

```sql
create table public.audit_logs (
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
```

## 3. Viewهای پیشنهادی

### 3.1 project_funding_summary

```sql
create view public.project_funding_summary as
select
  p.id as project_id,
  p.title,
  p.status,
  p.min_raise,
  p.max_raise,
  coalesce(sum(i.verified_amount), 0) as total_verified_amount,
  count(i.id) as investor_count,
  case when p.max_raise > 0 then coalesce(sum(i.verified_amount), 0) / p.max_raise else 0 end as funding_percent
from public.projects p
left join public.investments i on i.project_id = p.id and i.status in ('active','settlement_pending','settled')
group by p.id;
```

### 3.2 investor_portfolio_summary

```sql
create view public.investor_portfolio_summary as
select
  i.investor_id,
  count(distinct i.project_id) as project_count,
  coalesce(sum(i.verified_amount), 0) as total_invested,
  coalesce(sum(s.profit_or_loss_amount), 0) as realized_profit_or_loss,
  coalesce(sum(s.total_due_amount), 0) as total_due,
  coalesce(sum(s.paid_amount), 0) as total_paid
from public.investments i
left join public.settlements s on s.investment_id = i.id
group by i.investor_id;
```

## 4. RLS پیشنهادی

در MVP می‌توان RLS ساده داشت:

- کاربران فقط پروفایل خود را ببینند.
- سرمایه‌گذار فقط investment، receipt، settlement، notification و contract_acceptance خود را ببیند.
- سرمایه‌گذار فقط project_updates عمومی یا مربوط به پروژه‌هایی که در آن سرمایه‌گذاری تأییدشده دارد را ببیند.
- ادمین همه چیز را ببیند.

## 5. Seed Data پیشنهادی

سه پروژه نمونه:

1. واردات مواد اولیه غذایی - ریسک متوسط - مدت ۴ ماه - سود پایه ۱۸٪
2. تأمین سرمایه در گردش تولیدی پوشاک - ریسک متوسط رو به بالا - مدت ۶ ماه - سود پایه ۲۴٪
3. خرید و فروش تجهیزات صنعتی - ریسک بالا - مدت ۳ ماه - سود پایه ۳۰٪

سه سرمایه‌گذار نمونه:

1. علی رضایی - ۲۰۰ میلیون تومان
2. نازنین محمدی - ۵۰ میلیون تومان
3. شرکت نمونه پارس - ۱ میلیارد تومان

## 6. نکته پیاده‌سازی

در Sprintهای اول لازم نیست همه جدول‌ها کامل UI داشته باشند. اما اسکیمای اصلی از ابتدا درست طراحی شود تا بعداً مهاجرت سنگین لازم نباشد.
