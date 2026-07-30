import { supabaseAdmin } from "@/lib/supabase/server";

export type Totals = {
  spend: number; revenue: number; roas: number; cpa: number; profit: number;
  activeCampaigns: number; activeAdsets: number; activeAds: number;
};

export type AccountRollup = {
  id: string; name: string; currency: string | null;
  status: string | null; businessName: string | null;
  spend: number; revenue: number; roas: number;
};

const DAYS = 30;

function sinceDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - (DAYS - 1));
  return d.toISOString().slice(0, 10);
}

export async function getDashboard() {
  const db = supabaseAdmin();
  const since = sinceDate();

  const { data: accountsData } = await db
    .from("ad_accounts")
    .select("id,name,currency,status,business_name");

  const { data: insightsData } = await db
    .from("account_insights")
    .select("account_id,spend,revenue,purchases,active_campaigns,active_adsets,active_ads")
    .gte("date", since);

  const accounts = (accountsData ?? []) as any[];
  const rows = (insightsData ?? []) as any[];

  const byAccount = new Map<string, { spend: number; revenue: number }>();
  const activeByAccount = new Map<string, { c: number; s: number; a: number }>();
  let spend = 0, revenue = 0, purchases = 0;

  for (const r of rows) {
    const s = Number(r.spend) || 0;
    const rev = Number(r.revenue) || 0;
    spend += s; revenue += rev; purchases += Number(r.purchases) || 0;

    const cur = byAccount.get(r.account_id) ?? { spend: 0, revenue: 0 };
    cur.spend += s; cur.revenue += rev;
    byAccount.set(r.account_id, cur);

    const act = activeByAccount.get(r.account_id) ?? { c: 0, s: 0, a: 0 };
    act.c = Math.max(act.c, Number(r.active_campaigns) || 0);
    act.s = Math.max(act.s, Number(r.active_adsets) || 0);
    act.a = Math.max(act.a, Number(r.active_ads) || 0);
    activeByAccount.set(r.account_id, act);
  }

  let activeCampaigns = 0, activeAdsets = 0, activeAds = 0;
  for (const v of activeByAccount.values()) {
    activeCampaigns += v.c; activeAdsets += v.s; activeAds += v.a;
  }

  const totals: Totals = {
    spend, revenue,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
    profit: revenue - spend,
    activeCampaigns, activeAdsets, activeAds,
  };

  const rollups: AccountRollup[] = accounts
    .map((a) => {
      const agg = byAccount.get(a.id) ?? { spend: 0, revenue: 0 };
      return {
        id: a.id, name: a.name, currency: a.currency,
        status: a.status, businessName: a.business_name,
        spend: agg.spend, revenue: agg.revenue,
        roas: agg.spend > 0 ? agg.revenue / agg.spend : 0,
      };
    })
    .sort((x, y) => y.spend - x.spend);

  return { totals, accounts: rollups };
}
