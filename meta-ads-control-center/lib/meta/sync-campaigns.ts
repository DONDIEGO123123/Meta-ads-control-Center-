import { supabaseAdmin } from "@/lib/supabase/server";
import { metaGetAll } from "@/lib/meta/client";

type MetaCampaign = {
  id: string; name?: string; status?: string; effective_status?: string;
  objective?: string; daily_budget?: string; lifetime_budget?: string;
};
const minorToMajor = (v?: string) => (v ? Number(v) / 100 : null);

export async function syncCampaigns(onlyMetaAccountId?: string) {
  const db = supabaseAdmin();
  let q = db.from("ad_accounts").select("id,meta_account_id");
  if (onlyMetaAccountId) q = q.eq("meta_account_id", onlyMetaAccountId);
  const { data: accounts } = await q;
  const accs = (accounts ?? []) as any[];
  let count = 0;
  const errors: string[] = [];

  for (const acc of accs) {
    try {
      const campaigns = await metaGetAll<MetaCampaign>(`act_${acc.meta_account_id}/campaigns`, {
        fields: "name,status,effective_status,objective,daily_budget,lifetime_budget",
        effective_status: JSON.stringify(["ACTIVE", "PAUSED"]),
        limit: 200,
      });
      for (const c of campaigns) {
        await db.from("campaigns").upsert(
          {
            account_id: acc.id,
            meta_campaign_id: c.id,
            name: c.name ?? null,
            status: c.status ?? null,
            effective_status: c.effective_status ?? null,
            objective: c.objective ?? null,
            daily_budget: minorToMajor(c.daily_budget),
            lifetime_budget: minorToMajor(c.lifetime_budget),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "meta_campaign_id" }
        );
        count++;
      }
    } catch (e: any) {
      errors.push(`${acc.meta_account_id}: ${e.message}`);
    }
  }
  return { count, errors, accountsProcessed: accs.length };
}
