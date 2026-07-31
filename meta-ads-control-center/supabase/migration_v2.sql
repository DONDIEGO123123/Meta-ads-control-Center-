-- Migration v2 — run on an EXISTING database (already has v1 tables).
-- Adds recurring-schedule support and the ads table for ad-level on/off.

alter table scheduled_actions
  add column if not exists repeat text not null default 'none';

create table if not exists ads (
  id               uuid primary key default gen_random_uuid(),
  account_id       uuid not null references ad_accounts(id) on delete cascade,
  meta_ad_id       text not null unique,
  name             text,
  status           text,
  effective_status text,
  campaign_name    text,
  updated_at       timestamptz default now()
);

alter table ads enable row level security;
create index if not exists ads_account_id_idx on ads (account_id);
