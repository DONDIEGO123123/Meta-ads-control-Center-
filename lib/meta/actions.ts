import { supabaseAdmin } from "@/lib/supabase/server";
import { metaPost } from "@/lib/meta/client";

async function log(action: string, campaignId: string, oldV: any, newV: any) {
  const db = supabaseAdmin();
  await db.from("activity_log").insert({
    actor: "user", action, target_type: "campaign", target_id: campaignId,
    old_value: oldV, new_value: newV, reason: "manual action from dashboard",
  });
}

export async function setCampaignStatus(id: string, status: "ACTIVE" | "PAUSED") {
  const db = supabaseAdmin();
  const { data: before } = await db.from("campaigns")
    .select("status").eq("meta_campaign_id", id).maybeSingle();
  await metaPost(id, { status });
  await db.from("campaigns")
    .update({ status, updated_at: new Date().toISOString() }).eq("meta_campaign_id", id);
  await log(status === "PAUSED" ? "pause" : "resume", id, { status: before?.status ?? null }, { status });
}

export async function setCampaignBudget(id: string, dailyMajor: number) {
  const db = supabaseAdmin();
  const { data: before } = await db.from("campaigns")
    .select("daily_budget").eq("meta_campaign_id", id).maybeSingle();
  await metaPost(id, { daily_budget: Math.round(dailyMajor * 100) });
  await db.from("campaigns")
    .update({ daily_budget: dailyMajor, updated_at: new Date().toISOString() }).eq("meta_campaign_id", id);
  await log("budget_change", id, { daily_budget: before?.daily_budget ?? null }, { daily_budget: dailyMajor });
}
