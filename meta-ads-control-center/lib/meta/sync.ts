import { supabaseAdmin } from "@/lib/supabase/server";
import { metaGetAll } from "@/lib/meta/client";

type Row = { action_type: string; value: string };
type Insight = {
  date_start: string;
  spend?: string; impressions?: string; clicks?: string;
  ctr?: string; cpc?: string; cpm?: string; frequency?: string;
  actions?: Row[]; action_values?: Row[]; purchase_roas?: Row[];
};

const num = (v?: string) => (v ? parseFloat(v) : 0);
const pick = (arr: Row[] | undefined, types: string[]) => {
  const hit = arr?.find((a) => types.includes(a.action_type));
  return hit ? parseFloat(hit.value) : 0;
};

export async function runSync(days = 30) {
  const db = supabaseAdmin();
  const started = new Date().toISOString();
  let synced = 0;
  const errors: string[] = [];

  const accounts = await metaGetAll<any>("me/adaccounts", {
    fields: "account_id,name,currency,timezone_name,account_status,business{name}",
    limit: 200,
  });

  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  for (const acc of accounts) {
    try {
      const { data: accRow } = await db
        .from("ad_accounts")
        .upsert(
          {
            meta_account_id: acc.account_id,
            name: acc.name,
            currency: acc.currency,
            timezone_name: acc.timezone_name,
            business_name: acc.business?.name ?? null,
            status: String(acc.account_status ?? ""),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "meta_account_id" }
        )
        .select("id")
        .single();
      if (!accRow) throw new Error("account upsert failed");

      const insights = await metaGetAll<Insight>(`act_${acc.account_id}/insights`, {
        level: "account",
        fields:
          "spend,impressions,clicks,ctr,cpc,cpm,frequency,actions,action_values,purchase_roas",
        time_range: JSON.stringify({ since: fmt(since), until: fmt(until) }),
        time_increment: 1,
        limit: 500,
      });

      for (const i of insights) {
        const spend = num(i.spend);
        const revenue = pick(i.action_values, ["omni_purchase", "purchase"]);
        const purchases = pick(i.actions, ["omni_purchase", "purchase"]);
        const leads = pick(i.actions, ["lead", "offsite_conversion.fb_pixel_lead"]);
        const clicks = num(i.clicks);
        const roas =
          pick(i.purchase_roas, ["omni_purchase", "purchase"]) ||
          (spend > 0 ? revenue / spend : 0);

        await db.from("account_insights").upsert(
          {
            account_id: accRow.id,
            date: i.date_start,
            spend, revenue, roas,
            cpa: purchases > 0 ? spend / purchases : 0,
            cpc: num(i.cpc), cpm: num(i.cpm), ctr: num(i.ctr),
            purchases, leads,
            frequency: num(i.frequency),
            conversion_rate: clicks > 0 ? purchases / clicks : 0,
            impressions: parseInt(i.impressions || "0", 10),
            clicks: Math.round(clicks),
          },
          { onConflict: "account_id,date" }
        );
      }
      synced++;
    } catch (e: any) {
      errors.push(`${acc.account_id}: ${e.message}`);
    }
  }

  await db.from("sync_logs").insert({
    type: "manual",
    status: errors.length === 0 ? "success" : synced > 0 ? "partial" : "error",
    accounts_synced: synced,
    message: errors.length ? errors.join(" | ").slice(0, 1000) : null,
    started_at: started,
    finished_at: new Date().toISOString(),
  });

  return { synced, errors };
}
