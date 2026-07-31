import PageHeader from "@/components/page-header";
import SyncAccountsButton from "@/components/sync-accounts-button";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-line first:border-t-0">
      <span className="text-[14px] text-ink-700">{label}</span>
      <span className={`text-[13px] font-medium ${ok === undefined ? "text-ink-900" : ok ? "text-brand-green" : "text-brand-red"}`}>
        {value}
      </span>
    </div>
  );
}

export default async function SettingsPage() {
  const db = supabaseAdmin();
  const { data: last } = await db.from("sync_logs")
    .select("status,accounts_synced,finished_at")
    .order("finished_at", { ascending: false }).limit(1).maybeSingle();
  const { count: accountCount } = await db
    .from("ad_accounts").select("id", { count: "exact", head: true });

  const hasToken = !!process.env.META_ACCESS_TOKEN;
  const version = process.env.META_API_VERSION || "v25.0";

  return (
    <div className="p-6 md:p-8 max-w-[900px] mx-auto space-y-6">
      <PageHeader title="הגדרות" subtitle="חיבורים, חשבונות וסטטוס המערכת" />

      <div className="bg-white rounded-2xl border border-line shadow-card">
        <Row label="חיבור Meta" value={hasToken ? "מחובר" : "לא מחובר"} ok={hasToken} />
        <Row label="גרסת Graph API" value={version} />
        <Row label="חשבונות מחוברים" value={accountCount != null ? String(accountCount) : "—"} />
        <Row label="סנכרון אחרון" value={last?.finished_at ? new Date(last.finished_at).toLocaleString("he-IL") : "—"} />
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card p-5 space-y-4">
        <div>
          <div className="font-semibold text-[15px]">הוספת מנהלי מודעות</div>
          <p className="text-ink-500 text-[13px] mt-1 leading-relaxed">
            המערכת מושכת אוטומטית כל חשבון פרסום שהמשתמש המערכתי <span className="font-medium">ads-automation</span> משויך אליו.
            כדי להוסיף מנהל מודעות חדש: ב-Business Settings של Meta שייך את המשתמש המערכתי לחשבון הפרסום החדש
            (Ad Accounts → Assign), ואז לחץ כאן על "סנכרן חשבונות". החשבון החדש יופיע בדשבורד עם כל הנתונים.
          </p>
        </div>
        <SyncAccountsButton />
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card p-5">
        <div className="font-semibold text-[15px] mb-1">סנכרון אוטומטי</div>
        <p className="text-ink-500 text-[13px] leading-relaxed">
          חשבונות, קמפיינים ומודעות מתעדכנים אוטומטית מדי יום. פעולות מתוזמנות נבדקות ומורצות כל דקה.
          לרענון מיידי אפשר להשתמש בכפתור למעלה, או להריץ ידנית:
          <span dir="ltr" className="block mt-1 font-mono text-[12px] text-ink-700">/api/sync-campaigns?secret=…&account=…</span>
          <span dir="ltr" className="block font-mono text-[12px] text-ink-700">/api/sync-ads?secret=…&account=…</span>
        </p>
      </div>
    </div>
  );
}
