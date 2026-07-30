import PageHeader from "@/components/page-header";
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

  const hasToken = !!process.env.META_ACCESS_TOKEN;
  const version = process.env.META_API_VERSION || "v25.0";

  return (
    <div className="p-6 md:p-8 max-w-[900px] mx-auto">
      <PageHeader title="הגדרות" subtitle="חיבורים וסטטוס המערכת" />
      <div className="bg-white rounded-2xl border border-line shadow-card">
        <Row label="חיבור Meta" value={hasToken ? "מחובר" : "לא מחובר"} ok={hasToken} />
        <Row label="גרסת Graph API" value={version} />
        <Row label="סנכרון אחרון" value={last?.finished_at ? new Date(last.finished_at).toLocaleString("he-IL") : "—"} />
        <Row label="חשבונות בסנכרון האחרון" value={last ? String(last.accounts_synced) : "—"} />
      </div>
    </div>
  );
}
