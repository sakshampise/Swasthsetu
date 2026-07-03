-- SwasthSetu AI · Supabase/Postgres schema
-- Run in the Supabase SQL editor, then set NEXT_PUBLIC_USE_MOCK=false.

create table if not exists centres (
  id text primary key,            -- 'wakad'
  name text not null,             -- 'PHC Wakad'
  type text check (type in ('PHC','CHC')),
  area text,
  beds int, occupied int,
  opd int, emergency int,
  doc_total int, doc_present int, attendance int,
  tests_ok int, tests_total int
);

create table if not exists medicines (
  id bigint generated always as identity primary key,
  centre text references centres(id),
  name text not null, category text,
  stock int not null, daily_use int not null,
  threshold int not null, expiry date
);

create table if not exists footfall (
  id bigint generated always as identity primary key,
  centre text references centres(id),
  day date not null, opd int, emergency int
);

create table if not exists doctors (
  id bigint generated always as identity primary key,
  centre text references centres(id),
  name text, shift text, status text, attendance int, irregular boolean default false
);

create table if not exists lab_tests (
  id bigint generated always as identity primary key,
  centre text references centres(id),
  name text, machine_ok boolean, reagent_pct int, last_audit date
);

create table if not exists alerts (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  severity text check (severity in ('critical','warning','info')),
  centre text references centres(id),
  message text
);

create table if not exists transfers (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  medicine text, qty int,
  from_centre text references centres(id),
  to_centre text references centres(id),
  status text default 'suggested'   -- suggested | approved | completed
);

-- RLS: demo-open reads; tighten per-role before production.
alter table centres enable row level security;
alter table medicines enable row level security;
create policy "public read centres" on centres for select using (true);
create policy "public read medicines" on medicines for select using (true);
