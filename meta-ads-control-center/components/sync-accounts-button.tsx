"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";

export default function SyncAccountsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const j = await res.json();
      if (res.ok) { setMsg(`סונכרנו ${j.synced} חשבונות`); router.refresh(); }
      else setMsg("שגיאה: " + (j.error || res.status));
    } catch (e: any) {
      setMsg("שגיאה: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={run} disabled={busy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white
          font-medium text-[14px] disabled:opacity-60 hover:opacity-95 transition">
        {busy ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
        סנכרן חשבונות מ-Meta
      </button>
      {msg && <span className="text-[13px] text-ink-500">{msg}</span>}
    </div>
  );
}
