-- LeadDesk schema for Supabase (Postgres + Auth + RLS)
-- Run in Supabase SQL Editor, then create an admin user in Authentication.
-- IMPORTANT: disable public sign-up in Supabase Auth settings (only create admin users manually).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 254),
  company text check (company is null or char_length(company) <= 200),
  service text not null check (char_length(service) <= 100),
  problem_description text not null check (char_length(problem_description) <= 5000),
  ai_summary text check (ai_summary is null or char_length(ai_summary) <= 2000),
  ai_tags text[],
  status text not null default 'new' check (status in ('new', 'scheduled', 'archived'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_email_idx on public.leads (email);

create or replace function public.set_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_leads_updated_at();

alter table public.leads enable row level security;

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
  on public.leads
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);
