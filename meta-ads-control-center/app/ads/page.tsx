import PageHeader from "@/components/page-header";
import AdActions from "@/components/ad-actions";
import { getAds, type AdRow } from "@/lib/data/ads";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string | null }) {
  const cls: Record<string, string> = {
    ACTIVE: "bg-brand-green/10 text-brand-green",
    PAUSED: "bg-ink-500/10 text-ink-500",
  };
  const label: Record<string, string> = { ACTIVE: "פעיל", PAUSED: "מושהה" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${cls[status ?? ""] ?? "bg-ink-500/10 text-ink-500"}`}>
      {label[status ?? ""] ?? status ?? "—"}
    </span>
  );
}

export default async function AdsPage() {
  const ads = await getAds();

  const groups = new Map<string, AdRow[]>();
  for (const a of ads) {
    const key = a.accountName ?? "ללא חשבון";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="מודעות" subtitle={`${ads.length} מודעות · ${groups.size} חשבונות`} />

      {groups.size === 0 && (
        <div className="bg-white rounded-2xl border border-line shadow-card p-10 text-center text-ink-500">
          אין מודעות עדיין. הרץ סנכרון מודעות (הגדרות → משוך מודעות).
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
                    <th className="text-right font-medium px-4 py-3">מודעה</th>
                    <th className="text-right font-medium px-4 py-3">קמפיין</th>
                    <th className="text-right font-medium px-4 py-3">סטטוס</th>
                    <th className="text-left font-medium px-4 py-3">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-t border-line hover:bg-surface-soft transition-colors">
                      <td className="px-4 py-3 font-medium">{a.name ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-500">{a.campaignName ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3">
                        <AdActions adId={a.metaAdId} status={a.status} />
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
