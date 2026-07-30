import PageHeader from "@/components/page-header";
import ScheduleForm from "@/components/schedule-form";
import { getSchedules } from "@/lib/data/schedules";
import { getCampaigns } from "@/lib/data/campaigns";

export const dynamic = "force-dynamic";

const actionLabel: Record<string, string> = { pause: "השהה", resume: "הפעל", budget: "שינוי תקציב" };
const statusLabel: Record<string, string> = { pending: "ממתין", done: "בוצע", error: "שגיאה" };

export default async function SchedulerPage() {
  const [schedules, campaigns] = await Promise.all([getSchedules(), getCampaigns()]);
  return (
    <div className="p-6 md:p-8 max-w-[1100px] mx-auto">
      <PageHeader title="תזמון" subtitle="פעולות שירוצו אוטומטית בזמן שתקבע" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-x-auto">
          <table className="w-full text-[14px] min-w-[520px]">
            <thead className="bg-surface-muted text-ink-500 text-[12px]">
              <tr>
                <th className="text-right font-medium px-4 py-3">קמפיין</th>
                <th className="text-right font-medium px-4 py-3">פעולה</th>
                <th className="text-right font-medium px-4 py-3">מתי</th>
                <th className="text-right font-medium px-4 py-3">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{s.campaignName ?? s.metaCampaignId}</td>
                  <td className="px-4 py-3">{actionLabel[s.action] ?? s.action}{s.value ? ` (${s.value})` : ""}</td>
                  <td className="px-4 py-3 text-ink-500">{new Date(s.runAt).toLocaleString("he-IL")}</td>
                  <td className="px-4 py-3">{statusLabel[s.status] ?? s.status}</td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-ink-500">אין פעולות מתוזמנות עדיין.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <ScheduleForm campaigns={campaigns} />
      </div>
    </div>
  );
}
