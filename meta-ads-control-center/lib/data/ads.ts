import { supabaseAdmin } from "@/lib/supabase/server";

export type AdRow = {
  id: string; metaAdId: string; name: string | null;
  status: string | null; campaignName: string | null; accountName: string | null;
};

export async function getAds(): Promise<AdRow[]> {
  const db = supabaseAdmin();
  const { data } = await db.from("ads")
    .select("id,meta_ad_id,name,status,campaign_name,ad_accounts(name)")
    .order("updated_at", { ascending: false }).limit(2000);
  const rows = (data ?? []) as any[];
  return rows.map((a) => ({
    id: a.id, metaAdId: a.meta_ad_id, name: a.name, status: a.status,
    campaignName: a.campaign_name, accountName: a.ad_accounts?.name ?? null,
  }));
}
