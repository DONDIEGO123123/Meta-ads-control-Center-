import { NextResponse } from "next/server";
import { runSync } from "@/lib/meta/sync";
import { syncCampaigns } from "@/lib/meta/sync-campaigns";
import { syncAds } from "@/lib/meta/sync-ads";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = new URL(req.url).searchParams.get("secret");
  const ok =
    (!!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) ||
    (!!process.env.SYNC_SECRET && secret === process.env.SYNC_SECRET);
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const out: Record<string, any> = {};
  try { out.accounts = await runSync(); } catch (e: any) { out.accountsError = e.message; }
  try { out.campaigns = await syncCampaigns(); } catch (e: any) { out.campaignsError = e.message; }
  try { out.ads = await syncAds(); } catch (e: any) { out.adsError = e.message; }
  return NextResponse.json({ ok: true, ...out });
}
