-- ============================================================
-- КИБЕРРУБЕЖ: Supabase schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. users table (extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  xp integer not null default 0,
  rank text not null default 'Новичок',
  avatar_id integer not null default 1,
  created_at timestamptz not null default now()
);

-- 2. progress table
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  level_id integer not null,
  score integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, level_id)
);

-- 3. threat_reports table
create table public.threat_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  region text not null,
  threat_type text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.users enable row level security;
alter table public.progress enable row level security;
alter table public.threat_reports enable row level security;

-- users: anyone can read, users can update own row
create policy "Users are publicly readable"
  on public.users for select
  using (true);

create policy "Users can insert own row"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);

-- progress: users read/write own progress
create policy "Users read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- threat_reports: anyone can read, authenticated can insert
create policy "Threat reports are publicly readable"
  on public.threat_reports for select
  using (true);

create policy "Authenticated users can insert reports"
  on public.threat_reports for insert
  with check (auth.uid() is not null);

-- ============================================================
-- Trigger: auto-create user profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Indexes
-- ============================================================

create index idx_progress_user_id on public.progress(user_id);
create index idx_threat_reports_region on public.threat_reports(region);
