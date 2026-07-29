import PageHeader from "@/components/page-header";
import { getDashboard } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

const money = (n: number, c?: string | null) =>
  new Intl.NumberFormat("he-IL", {
    style: c ? "currency" : "decimal", currency: c || undefined,
    maximumFractionDigits: 0,
  }).format(n);

export default async function AccountsPage() {
  const { accounts } = await getDashboard();
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="חשבונות" subtitle={`${accounts.length} חשבונות מחוברים`} />
      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-surface-muted text-ink-500 text-[12px]">
            <tr>
              <th className="text-right font-medium px-4 py-3">חשבון</th>
              <th className="text-right font-medium px-4 py-3">סטטוס</th>
              <th className="text-right font-medium px-4 py-3">Spend</th>
              <th className="text-right font-medium px-4 py-3">Revenue</th>
              <th className="text-right font-medium px-4 py-3">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="border-t border-line hover:bg-surface-soft transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.name}</div>
                  {a.businessName && <div className="text-[12px] text-ink-500">{a.businessName}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${a.status === "1" ? "bg-brand-green" : "bg-ink-500/40"}`} />
                    {a.status === "1" ? "פעיל" : "מושהה"}
                  </span>
                </td>
                <td className="px-4 py-3">{money(a.spend, a.currency)}</td>
                <td className="px-4 py-3 text-brand-green">{money(a.revenue, a.currency)}</td>
                <td className="px-4 py-3 text-brand-blue font-semibold">{a.roas.toFixed(2)}</td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-500">אין חשבונות עדיין. הרץ סנכרון.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
