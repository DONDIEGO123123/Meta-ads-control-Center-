import { supabaseAdmin } from "@/lib/supabase/server";
import { metaGetAll } from "@/lib/meta/client";

type MetaAd = {
  id: string; name?: string; status?: string; effective_status?: string;
  campaign?: { name?: string };
};

export async function syncAds(onlyMetaAccountId?: string) {
  const db = supabaseAdmin();
  let q = db.from("ad_accounts").select("id,meta_account_id");
  if (onlyMetaAccountId) q = q.eq("meta_account_id", onlyMetaAccountId);
  const { data: accounts } = await q;
  const accs = (accounts ?? []) as any[];
  let count = 0;
  const errors: string[] = [];

  for (const acc of accs) {
    try {
      const ads = await metaGetAll<MetaAd>(`act_${acc.meta_account_id}/ads`, {
        fields: "name,status,effective_status,campaign{name}",
        effective_status: JSON.stringify(["ACTIVE", "PAUSED"]),
        limit: 200,
      });
      for (const ad of ads) {
        await db.from("ads").upsert(
          {
            account_id: acc.id,
            meta_ad_id: ad.id,
            name: ad.name ?? null,
            status: ad.status ?? null,
            effective_status: ad.effective_status ?? null,
            campaign_name: ad.campaign?.name ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "meta_ad_id" }
        );
        count++;
      }
    } catch (e: any) {
      errors.push(`${acc.meta_account_id}: ${e.message}`);
    }
  }
  return { count, errors, accountsProcessed: accs.length };
}
