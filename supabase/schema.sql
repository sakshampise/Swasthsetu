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

-- -----------------------------------------------------------------------
-- Extended schema for SwasthSetu AI platform.
-- New tables for users, patients, doctors, staff, appointments,
-- medical records, prescriptions, lab reports, notifications,
-- health metrics and emergency requests.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  password_hash text,
  role text check (role in ('patient','doctor','staff','admin')),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists patients (
  id uuid primary key references users(id) on delete cascade,
  dob date,
  gender text,
  blood_type text,
  address text,
  allergies text[],
  vaccinations text[],
  emergency_contacts jsonb,
  created_at timestamptz default now()
);

create table if not exists doctors_ext (
  id uuid primary key references users(id) on delete cascade,
  licence_number text,
  department text,
  centre text references centres(id),
  availability jsonb,
  created_at timestamptz default now()
);

create table if not exists staff (
  id uuid primary key references users(id) on delete cascade,
  centre text references centres(id),
  role text,
  created_at timestamptz default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  doctor_id uuid references doctors_ext(id) on delete cascade,
  centre text references centres(id),
  scheduled_at timestamptz not null,
  status text check (status in ('booked','accepted','completed','cancelled')) default 'booked',
  notes text,
  created_at timestamptz default now()
);

create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete cascade,
  diagnosis text,
  prescriptions jsonb,
  created_at timestamptz default now()
);

create table if not exists lab_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete cascade,
  report_url text,
  summary text,
  created_at timestamptz default now()
);

create table if not exists prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  doctor_id uuid references doctors_ext(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete cascade,
  medication jsonb,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text,
  body text,
  seen boolean default false,
  created_at timestamptz default now()
);

create table if not exists health_metrics (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  timestamp timestamptz not null,
  type text check (type in ('bp','weight','sugar','pulse','temperature')),
  value numeric,
  created_at timestamptz default now()
);

create table if not exists emergency_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  centre text references centres(id),
  ambulance_assigned boolean default false,
  status text check (status in ('pending','dispatched','resolved')) default 'pending',
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------
-- Real authentication support (Supabase Auth)
-- Run this after enabling Email provider in Supabase Authentication.

create table if not exists auth_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text not null,
  role text check (role in ('patient','doctor','staff','manager','admin')) not null default 'patient',
  centre text references centres(id),
  phone text,
  dob date,
  gender text,
  blood_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists access_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  requested_role text check (requested_role in ('doctor','staff','manager','admin')) not null,
  hospital_name text,
  licence_number text,
  department text,
  message text,
  status text check (status in ('pending','approved','rejected')) not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table auth_profiles enable row level security;
alter table access_applications enable row level security;

-- Users can read their own profile.
drop policy if exists "users can read own profile" on auth_profiles;
create policy "users can read own profile" on auth_profiles
  for select using (auth.uid() = id);

-- Users can update limited fields on their own profile.
drop policy if exists "users can update own profile" on auth_profiles;
create policy "users can update own profile" on auth_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- The app can create a profile immediately after signup when email confirmation is off.
drop policy if exists "users can insert own profile" on auth_profiles;
create policy "users can insert own profile" on auth_profiles
  for insert with check (auth.uid() = id);

-- Anyone can submit a professional access application.
drop policy if exists "public can submit applications" on access_applications;
create policy "public can submit applications" on access_applications
  for insert with check (true);

-- District admins can view all access applications.
drop policy if exists "admins can read applications" on access_applications;
create policy "admins can read applications" on access_applications
  for select using (
    exists (
      select 1 from auth_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Function to automatically create patient profile from Supabase Auth metadata.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.auth_profiles (id, email, full_name, role, phone, dob, gender, blood_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'patient'),
    new.raw_user_meta_data->>'phone',
    nullif(new.raw_user_meta_data->>'dob', '')::date,
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'blood_type'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    phone = excluded.phone,
    dob = excluded.dob,
    gender = excluded.gender,
    blood_type = excluded.blood_type,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
