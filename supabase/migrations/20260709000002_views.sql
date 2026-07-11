-- Views for funding and portfolio summaries

create or replace view public.project_funding_summary as
select
  p.id as project_id,
  p.title,
  p.slug,
  p.status,
  p.min_raise,
  p.max_raise,
  coalesce(sum(i.verified_amount), 0) as total_verified_amount,
  count(i.id) as investor_count,
  case
    when p.max_raise > 0
    then coalesce(sum(i.verified_amount), 0) / p.max_raise
    else 0
  end as funding_percent
from public.projects p
left join public.investments i
  on i.project_id = p.id
  and i.status in ('active', 'settlement_pending', 'settled')
group by p.id;

create or replace view public.investor_portfolio_summary as
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
