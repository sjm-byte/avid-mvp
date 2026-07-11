-- Sprint 05 step 2: update statuses, financial report visibility

alter table public.project_updates
  drop constraint if exists project_updates_operational_status_check;

update public.project_updates
set operational_status = 'normal'
where operational_status = 'on_track';

update public.project_updates
set operational_status = 'important'
where operational_status = 'at_risk';

update public.project_updates
set operational_status = 'resolved'
where operational_status = 'completed';

alter table public.project_updates
  add constraint project_updates_operational_status_check
  check (operational_status in ('normal', 'important', 'delayed', 'resolved'));

alter table public.project_financial_reports
  add column if not exists visibility text not null default 'investors_only'
    check (visibility in ('public', 'investors_only'));

drop policy if exists "financial_reports_select" on public.project_financial_reports;

create policy "financial_reports_select"
  on public.project_financial_reports for select
  using (
    visibility = 'public'
    or public.is_admin_or_finance()
    or (
      visibility = 'investors_only'
      and public.investor_has_project_access(project_id)
    )
  );
