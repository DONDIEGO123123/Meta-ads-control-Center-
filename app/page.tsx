import {
  DollarSign, TrendingUp, Target, Percent,
  PiggyBank, Megaphone, Layers, Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDashboard } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

const fmtNum = (n: number) =>
  n.toLocaleString("he-IL", { maximumFractionDigits: 0 });

const fmtMoney = (n: number, cur?: string | null) =>
  new Intl.NumberFormat("he-IL", {
    style: cur ? "currency" : "decimal",
    currency: cur || undefined,
    maximumFractionDigits: 0,
  }).format(n);

function MetricCard({
  label, value, icon: Icon, tone = "default",
}: {
  label: string; value: string; icon: LucideIcon;
  tone?: "default" | "green" | "blue" | "red";
}) {
  const toneMap = {
    default: "text-ink-900", green: "text-brand-green",
    blue: "text-brand-blue", red: "text-brand-red",
  } as const;
  return (
    <div className="bg-white rounded-2xl border border-line shadow-card p-5
      hover:shadow-cardHover transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-500">{label}</span>
        <span className="p-2 rounded-lg bg-surface-muted text-ink-500">
          <Icon size={16} />
        </span>
      </div>
      <div className={`mt-3 text-[28px] font-bold tracking-tight ${toneMap[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string | null }) {
  const active = status === "1";
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-500">
      <span className={`w-2 h-2 rounded-full ${active ? "bg-brand-green" : "bg-ink-500/40"}`} />
      {active ? "פעיל" : "מושהה"}
    </span>
  );
}

export default async function Dashboard() {
  const { totals, accounts } = await getDashboard();

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold tracking-tight">דשבורד</h1>
        <p className="text-ink-500 mt-1 text-[15px]">
          מבט-על על כל חשבונות הפרסום · 30 הימים האחרונים
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Spend" value={fmtNum(totals.spend)} icon={DollarSign} />
        <MetricCard label="Total Revenue" value={fmtNum(totals.revenue)} icon={TrendingUp} tone="green" />
        <MetricCard label="ROAS" value={totals.roas.toFixed(2)} icon={Target} tone="blue" />
        <MetricCard label="CPA" value={fmtNum(totals.cpa)} icon={Percent} />
        <MetricCard label="Profit" value={fmtNum(totals.profit)} icon={PiggyBank}
          tone={totals.profit >= 0 ? "green" : "red"} />
        <MetricCard label="קמפיינים פעילים" value={fmtNum(totals.activeCampaigns)} icon={Megaphone} />
        <MetricCard label="Ad Sets פעילים" value={fmtNum(totals.activeAdsets)} icon={Layers} />
        <MetricCard label="מודעות פעילות" value={fmtNum(totals.activeAds)} icon={ImageIcon} />
      </section>

      <section className="mt-8">
        <h2 className="text-[20px] font-semibold mb-3">חשבונות</h2>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line shadow-card p-10
            text-center text-ink-500">
            אין עדיין נתונים להצגה. הפעל סנכרון כדי למשוך את החשבונות.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {accounts.map((a) => (
              <div key={a.id}
                className="bg-white rounded-2xl border border-line shadow-card p-5
                  hover:shadow-cardHover transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[15px] truncate">{a.name}</div>
                    {a.businessName && (
                      <div className="text-[12px] text-ink-500 truncate">{a.businessName}</div>
                    )}
                  </div>
                  <StatusDot status={a.status} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-ink-500">Spend</div>
                    <div className="text-[14px] font-semibold">{fmtMoney(a.spend, a.currency)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-ink-500">Revenue</div>
                    <div className="text-[14px] font-semibold text-brand-green">{fmtMoney(a.revenue, a.currency)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-ink-500">ROAS</div>
                    <div className="text-[14px] font-semibold text-brand-blue">{a.roas.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
