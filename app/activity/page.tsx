import PageHeader from "@/components/page-header";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const db = supabaseAdmin();
  const { data } = await db.from("activity_log")
    .select("id,action,target_type,reason,created_at")
    .order("created_at", { ascending: false }).limit(100);
  const rows = (data ?? []) as any[];
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="יומן פעילות" subtitle="כל פעולה שבוצעה במערכת" />
      <div className="bg-white rounded-2xl border border-line shadow-card divide-y divide-line">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-ink-500">עוד לא בוצעו פעולות.</div>
        ) : rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-5 py-3.5">
            <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">
                {r.action}{r.target_type ? ` · ${r.target_type}` : ""}
              </div>
              {r.reason && <div className="text-[12px] text-ink-500 truncate">{r.reason}</div>}
            </div>
            <div className="text-[12px] text-ink-500 shrink-0">
              {new Date(r.created_at).toLocaleString("he-IL")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
