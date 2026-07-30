"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Campaign = { metaCampaignId: string; name: string | null; accountName: string | null };

export default function ScheduleForm({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [campaignId, setCampaignId] = useState("");
  const [action, setAction] = useState("pause");
  const [value, setValue] = useState("");
  const [runAt, setRunAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    if (!campaignId || !runAt) { setErr("בחר קמפיין ותאריך"); return; }
    setBusy(true);
    const chosen = campaigns.find((c) => c.metaCampaignId === campaignId);
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metaCampaignId: campaignId,
        campaignName: chosen?.name ?? null,
        action, value,
        runAt: new Date(runAt).toISOString(),
      }),
    });
    setBusy(false);
    if (res.ok) { setCampaignId(""); setRunAt(""); setValue(""); router.refresh(); }
    else setErr("שמירה נכשלה");
  }

  return (
    <div className="bg-white rounded-2xl border border-line shadow-card p-5 space-y-3 h-fit">
      <div className="font-semibold text-[15px]">תזמון פעולה חדשה</div>

      <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-line bg-surface-soft text-[14px]">
        <option value="">בחר קמפיין…</option>
        {campaigns.map((c) => (
          <option key={c.metaCampaignId} value={c.metaCampaignId}>
            {c.name ?? c.metaCampaignId}{c.accountName ? ` — ${c.accountName}` : ""}
          </option>
        ))}
      </select>

      <select value={action} onChange={(e) => setAction(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-line bg-surface-soft text-[14px]">
        <option value="pause">השהה</option>
        <option value="resume">הפעל</option>
        <option value="budget">שנה תקציב יומי</option>
      </select>

      {action === "budget" && (
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
          placeholder="תקציב יומי חדש"
          className="w-full px-3 py-2.5 rounded-xl border border-line bg-surface-soft text-[14px]" />
      )}

      <input type="datetime-local" value={runAt} onChange={(e) => setRunAt(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-line bg-surface-soft text-[14px]" />

      {err && <p className="text-brand-red text-[13px]">{err}</p>}

      <button onClick={submit} disabled={busy}
        className="w-full py-2.5 rounded-xl bg-brand-blue text-white font-medium text-[14px] disabled:opacity-60">
        {busy ? "שומר…" : "תזמן"}
      </button>
    </div>
  );
}
