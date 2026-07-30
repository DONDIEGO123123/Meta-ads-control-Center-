"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true); setError(false);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) router.push("/");
    else setError(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-surface-soft">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-line shadow-card p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="p-3 rounded-2xl bg-brand-blue/10 text-brand-blue mb-3">
            <Lock size={22} />
          </span>
          <h1 className="text-[20px] font-bold">Control Center</h1>
          <p className="text-ink-500 text-[13px] mt-1">הזן סיסמה כדי להיכנס</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="סיסמה"
          className="w-full px-4 py-3 rounded-xl border border-line bg-surface-soft
            text-[15px] outline-none focus:border-brand-blue transition-colors"
        />
        {error && <p className="text-brand-red text-[13px] mt-2">סיסמה שגויה</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl bg-brand-blue text-white font-medium
            text-[15px] shadow-card hover:opacity-95 disabled:opacity-60 transition"
        >
          {loading ? "מתחבר…" : "כניסה"}
        </button>
      </div>
    </div>
  );
}
