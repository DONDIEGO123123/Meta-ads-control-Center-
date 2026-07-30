-- Meta Ads Control Center — full database schema
-- Run this once in the Supabase SQL Editor on a fresh project.

create extension if not exists pgcrypto;

-- ── Phase 1: accounts + daily metrics + logs ──────────────────────────
create table ad_accounts (
  id              uuid primary key default gen_random_uuid(),
  meta_account_id text not null unique,
  name            text not null,
  business_name   text,
  currency        text,
  timezone_name   text,
  status          text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table account_insights (
  id                uuid primary key default gen_random_uuid(),
  account_id        uuid not null references ad_accounts(id) on delete cascade,
  date              date not null,
  spend             numeric(14,2) default 0,
  revenue           numeric(14,2) default 0,
  roas              double precision default 0,
  cpa               numeric(14,2) default 0,
  cpc               numeric(14,2) default 0,
  cpm               numeric(14,2) default 0,
  ctr               double precision default 0,
  purchases         integer default 0,
  leads             integer default 0,
  frequency         double precision default 0,
  conversion_rate   double precision default 0,
  impressions       bigint default 0,
  clicks            bigint default 0,
  active_campaigns  integer default 0,
  active_adsets     integer default 0,
  active_ads        integer default 0,
  created_at        timestamptz default now(),
  unique (account_id, date)
);

create table sync_logs (
  id               uuid primary key default gen_random_uuid(),
  type             text not null,
  status           text not null,
  accounts_synced  integer default 0,
  message          text,
  started_at       timestamptz default now(),
  finished_at      timestamptz
);

create table activity_log (
  id           uuid primary key default gen_random_uuid(),
  actor        text default 'system',
  action       text not null,
  target_type  text,
  target_id    text,
  old_value    jsonb,
  new_value    jsonb,
  reason       text,
  created_at   timestamptz default now()
);

create table app_settings (
  key         text primary key,
  value       jsonb,
  updated_at  timestamptz default now()
);

-- ── Campaign control layer ────────────────────────────────────────────
create table campaigns (
  id               uuid primary key default gen_random_uuid(),
  account_id       uuid not null references ad_accounts(id) on delete cascade,
  meta_campaign_id text not null unique,
  name             text,
  status           text,
  effective_status text,
  objective        text,
  daily_budget     numeric(14,2),
  lifetime_budget  numeric(14,2),
  updated_at       timestamptz default now()
);

-- ── Scheduler ─────────────────────────────────────────────────────────
create table scheduled_actions (
  id               uuid primary key default gen_random_uuid(),
  target_type      text not null default 'campaign',
  meta_campaign_id text not null,
  campaign_name    text,
  action           text not null,
  value            numeric(14,2),
  run_at           timestamptz not null,
  status           text not null default 'pending',
  result           text,
  created_at       timestamptz default now(),
  executed_at      timestamptz
);

-- ── RLS (server uses the service-role key, which bypasses RLS) ─────────
alter table ad_accounts       enable row level security;
alter table account_insights  enable row level security;
alter table sync_logs         enable row level security;
alter table activity_log      enable row level security;
alter table app_settings      enable row level security;
alter table campaigns         enable row level security;
alter table scheduled_actions enable row level security;

-- ── Indexes ───────────────────────────────────────────────────────────
create index on account_insights (date);
create index on account_insights (account_id, date);
create index on activity_log (created_at);
create index on campaigns (account_id);
create index on scheduled_actions (status, run_at);
