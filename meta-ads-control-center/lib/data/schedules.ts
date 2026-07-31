import { supabaseAdmin } from "@/lib/supabase/server";

export type ScheduleRow = {
  id: string; metaCampaignId: string; campaignName: string | null;
  action: string; value: number | null; runAt: string;
  repeat: string; status: string; result: string | null;
};

export async function getSchedules(): Promise<ScheduleRow[]> {
  const db = supabaseAdmin();
  const { data } = await db.from("scheduled_actions")
    .select("id,meta_campaign_id,campaign_name,action,value,run_at,repeat,status,result")
    .order("run_at", { ascending: true }).limit(500);
  const rows = (data ?? []) as any[];
  return rows.map((r) => ({
    id: r.id, metaCampaignId: r.meta_campaign_id, campaignName: r.campaign_name,
    action: r.action, value: r.value, runAt: r.run_at, repeat: r.repeat ?? "none",
    status: r.status, result: r.result,
  }));
}
