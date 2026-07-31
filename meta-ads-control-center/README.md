# Meta Ads Control Center

Private control center for managing multiple Meta Ads accounts.
Next.js 15 + TypeScript + Tailwind + Supabase, deployed on Vercel (Pro).

## Setup

1. **Supabase**
   - New project → SQL Editor → run `supabase/schema.sql` (fresh DB).
   - If your DB already exists from an earlier version, run `supabase/migration_v2.sql`
     instead (adds the `repeat` column + the `ads` table).

2. **Environment variables** (Vercel → Settings → Environment Variables). See `.env.example`:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `META_ACCESS_TOKEN` (system-user token, starts with EAA…; needs `ads_read` + `ads_management`)
   - `META_API_VERSION` (e.g. v25.0)
   - `SYNC_SECRET` (guards the sync endpoints)
   - `APP_PASSWORD`, `AUTH_SECRET` (login gate)
   - `CRON_SECRET` (**required for the scheduler** — Vercel sends it as a Bearer token to cron routes)

   Add all of them, then redeploy — env vars only take effect on a new deployment.

## Automation (Vercel Cron)

`vercel.json` defines two crons (Pro plan):
- `/api/cron/run-scheduled` — every minute; runs due scheduled actions (incl. recurring).
- `/api/cron/daily-sync` — 05:00 daily; refreshes accounts, campaigns and ads.

## Adding an ad account (ad manager)

Assign the `ads-automation` system user to the new ad account in Meta Business Settings,
then open **Settings → סנכרן חשבונות מ-Meta**. The account appears automatically.

## Manual sync (optional)

- Accounts + metrics: `/api/sync?secret=SECRET`
- Campaigns (one account): `/api/sync-campaigns?secret=SECRET&account=META_ACCOUNT_ID`
- Ads (one account): `/api/sync-ads?secret=SECRET&account=META_ACCOUNT_ID`

## Structure

- `app/` — pages + API routes (incl. `api/cron/*`, `api/admin/sync`)
- `components/` — sidebar, cards, campaign/ad actions, schedule form, sync button
- `lib/meta/` — Graph API client, account/campaign/ad sync, write actions
- `lib/scheduler/run.ts` — scheduled-action execution engine (one-off + recurring)
- `lib/data/` — Supabase read queries
- `supabase/` — `schema.sql` (fresh) + `migration_v2.sql` (existing DB)

## Built
Dashboard (Hebrew), accounts, campaigns (grouped by account, pause/resume/budget),
ads (pause/resume), scheduler (one-off + daily/weekly/monthly, auto-executed),
activity log, settings, login gate, auto daily sync.

## Not built yet
Ad Sets level, budget UI, automation rules engine (IF/THEN), reports, Telegram alerts.
