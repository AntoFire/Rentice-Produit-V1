-- Rentice — schéma initial (Semaine 0)
-- À coller dans l'éditeur SQL du projet Supabase (SQL Editor > New query).
-- Source : docs/00-configuration-stack.md

create table students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  school text,
  level text,
  target_sectors text[],
  target_cities text[],
  cv_url text,
  created_at timestamptz default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  token text unique not null,
  state text not null default 'targeting',
  contract_type text,
  unipile_account_id text,
  interviews_count int default 0,
  created_at timestamptz default now(),
  sent_at timestamptz
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  siret text unique,
  name text not null,
  naf text,
  city text,
  size_band text,
  source text,
  first_seen_at timestamptz default now()
);

create table targets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id),
  company_id uuid references companies(id),
  contact_name text,
  contact_role text,
  contact_email text,
  rationale text not null,
  source text not null,
  status text not null default 'proposed'
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  target_id uuid references targets(id),
  step int not null check (step in (0,1,2)),
  subject text,
  body text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  reply_snippet text
);

create table scheduled_sends (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  due_at timestamptz not null,
  attempts int default 0,
  last_error text,
  done_at timestamptz
);
