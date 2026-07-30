"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Loader2 } from "lucide-react";

export default function CampaignActions({
  campaignId, status,
}: { campaignId: string; status: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<null | "pause" | "resume">(null);
  const isActive = status === "ACTIVE";

  async function run(action: "pause" | "resume") {
    setBusy(true);
    try {
      const res = await fetch("/api/campaigns/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, campaignId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert("הפעולה נכשלה: " + (j.error || res.status));
      } else router.refresh();
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-[12px] text-ink-500">בטוח?</span>
        <button onClick={() => run(confirming)} disabled={busy}
          className="px-2.5 py-1 rounded-lg bg-brand-blue text-white text-[12px] font-medium disabled:opacity-60">
          {busy ? <Loader2 size={13} className="animate-spin" /> : "כן"}
        </button>
        <button onClick={() => setConfirming(null)} disabled={busy}
          className="px-2.5 py-1 rounded-lg border border-line text-[12px]">לא</button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      {isActive ? (
        <button onClick={() => setConfirming("pause")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line
            text-ink-700 hover:bg-surface-muted text-[13px] font-medium transition-colors">
          <Pause size={14} /> השהה
        </button>
      ) : (
        <button onClick={() => setConfirming("resume")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-brand-green/10 text-brand-green hover:bg-brand-green/15 text-[13px] font-medium transition-colors">
          <Play size={14} /> הפעל
        </button>
      )}
    </div>
  );
}
