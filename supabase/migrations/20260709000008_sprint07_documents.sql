-- Sprint 07 step 1: document center types and metadata

alter table public.project_documents
  drop constraint if exists project_documents_document_type_check;

alter table public.project_documents
  add constraint project_documents_document_type_check check (document_type in (
    'contract', 'invoice', 'report', 'image', 'video', 'audit', 'other',
    'project_document', 'investor_contract', 'avid_executor_contract',
    'risk_disclosure', 'financial_report', 'receipt', 'settlement'
  ));

alter table public.project_documents
  add column if not exists document_date date,
  add column if not exists notes text,
  add column if not exists investor_id uuid references public.profiles(id);
