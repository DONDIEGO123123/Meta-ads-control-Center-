import PageHeader from "@/components/page-header";
import CampaignActions from "@/components/campaign-actions";
import { getCampaigns, type CampaignRow } from "@/lib/data/campaigns";

export const dynamic = "force-dynamic";

const money = (n: number | null, c?: string | null) =>
  n == null ? "—" : new Intl.NumberFormat("he-IL", {
    style: c ? "currency" : "decimal", currency: c || undefined, maximumFractionDigits: 0,
  }).format(n);

function StatusBadge({ status }: { status: string | null }) {
  const cls: Record<string, string> = {
    ACTIVE: "bg-brand-green/10 text-brand-green",
    PAUSED: "bg-ink-500/10 text-ink-500",
    ARCHIVED: "bg-ink-500/10 text-ink-500",
  };
  const label: Record<string, string> = { ACTIVE: "פעיל", PAUSED: "מושהה", ARCHIVED: "בארכיון" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${cls[status ?? ""] ?? "bg-ink-500/10 text-ink-500"}`}>
      {label[status ?? ""] ?? status ?? "—"}
    </span>
  );
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  const groups = new Map<string, CampaignRow[]>();
  for (const c of campaigns) {
    const key = c.accountName ?? "ללא חשבון";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="קמפיינים" subtitle={`${campaigns.length} קמפיינים · ${groups.size} חשבונות`} />

      {groups.size === 0 && (
        <div className="bg-white rounded-2xl border border-line shadow-card p-10 text-center text-ink-500">
          אין קמפיינים עדיין. הרץ סנכרון.
        </div>
      )}

      <div className="space-y-6">
        {[...groups.entries()].map(([account, rows]) => (
          <div key={account}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <h2 className="text-[16px] font-semibold">{account}</h2>
              <span className="text-[12px] text-ink-500">({rows.length})</span>
            </div>
            <div className="bg-white rounded-2xl border border-line shadow-card overflow-x-auto">
              <table className="w-full text-[14px] min-w-[560px]">
                <thead className="bg-surface-muted text-ink-500 text-[12px]">
                  <tr>
                    <th className="text-right font-medium px-4 py-3">קמפיין</th>
                    <th className="text-right font-medium px-4 py-3">סטטוס</th>
                    <th className="text-right font-medium px-4 py-3">תקציב יומי</th>
                    <th className="text-left font-medium px-4 py-3">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className="border-t border-line hover:bg-surface-soft transition-colors">
                      <td className="px-4 py-3 font-medium">{c.name ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">{money(c.dailyBudget, c.currency)}</td>
                      <td className="px-4 py-3">
                        <CampaignActions campaignId={c.metaCampaignId} status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
