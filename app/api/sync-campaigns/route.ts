import { supabaseAdmin } from "@/lib/supabase/server";

export type CampaignRow = {
  id: string; metaCampaignId: string; name: string | null;
  status: string | null; objective: string | null;
  dailyBudget: number | null; accountName: string | null; currency: string | null;
};

export async function getCampaigns(): Promise<CampaignRow[]> {
  const db = supabaseAdmin();
  const { data } = await db.from("campaigns")
    .select("id,meta_campaign_id,name,status,objective,daily_budget,ad_accounts(name,currency)")
    .order("updated_at", { ascending: false }).limit(1000);
  const rows = (data ?? []) as any[];
  return rows.map((c) => ({
    id: c.id, metaCampaignId: c.meta_campaign_id, name: c.name,
    status: c.status, objective: c.objective, dailyBudget: c.daily_budget,
    accountName: c.ad_accounts?.name ?? null, currency: c.ad_accounts?.currency ?? null,
  }));
}
