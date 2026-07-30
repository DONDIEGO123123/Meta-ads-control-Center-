# Meta Ads Control Center

Private control center for managing multiple Meta Ads accounts.
Next.js 15 + TypeScript + Tailwind + Supabase, deployed on Vercel.

## Setup

1. **Supabase** — create a project, open the SQL Editor, and run
   `supabase/schema.sql` once.

2. **Environment variables** (Vercel → Settings → Environment Variables).
   See `.env.example`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `META_ACCESS_TOKEN`   (system-user token, starts with EAA…; needs ads_read, and ads_management for pause/budget)
   - `META_API_VERSION`    (e.g. v25.0)
   - `SYNC_SECRET`         (protects the sync endpoints)
   - `APP_PASSWORD`        (login password)
   - `AUTH_SECRET`         (long random string; signs the session cookie)

   Add all of them, then redeploy — env vars only take effect on a new deployment.

## Syncing data

Run these in the browser (replace with your domain + secret):

- Accounts + daily metrics:
  `/api/sync?secret=YOUR_SECRET`
- Campaigns for ONE account (avoids the 60s function timeout):
  `/api/sync-campaigns?secret=YOUR_SECRET&account=META_ACCOUNT_ID`
- Campaigns for all accounts (only if small enough):
  `/api/sync-campaigns?secret=YOUR_SECRET`

`META_ACCOUNT_ID` values are in the `ad_accounts.meta_account_id` column.

## Structure

- `app/` — pages (dashboard, accounts, campaigns, scheduler, activity, settings, …) and API routes
- `components/` — sidebar, cards, campaign actions, schedule form
- `lib/meta/` — Meta Graph API client, account sync, campaign sync, write actions
- `lib/data/` — Supabase read queries for the pages
- `lib/supabase/` — server (service-role) client
- `middleware.ts` — password gate
- `supabase/schema.sql` — database schema

## Not built yet

Ad Set / Ad hierarchy, budget UI, automation rules engine, Telegram alerts,
reports, and the scheduler execution engine (the scheduler currently saves and
lists pending actions but does not run them yet).
