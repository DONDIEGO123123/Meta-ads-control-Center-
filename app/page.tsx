import {
  DollarSign, TrendingUp, Target, Percent,
  PiggyBank, Megaphone, Layers, Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function MetricCard({
  label, value, icon: Icon, tone = "default",
}: {
  label: string; value: string; icon: LucideIcon;
  tone?: "default" | "green" | "blue";
}) {
  const toneMap = {
    default: "text-ink-900", green: "text-brand-green", blue: "text-brand-blue",
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

export default function Dashboard() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold tracking-tight">דשבורד</h1>
        <p className="text-ink-500 mt-1 text-[15px]">מבט-על על כל חשבונות הפרסום</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Spend" value="—" icon={DollarSign} />
        <MetricCard label="Total Revenue" value="—" icon={TrendingUp} tone="green" />
        <MetricCard label="ROAS" value="—" icon={Target} tone="blue" />
        <MetricCard label="CPA" value="—" icon={Percent} />
        <MetricCard label="Profit" value="—" icon={PiggyBank} tone="green" />
        <MetricCard label="קמפיינים פעילים" value="—" icon={Megaphone} />
        <MetricCard label="Ad Sets פעילים" value="—" icon={Layers} />
        <MetricCard label="מודעות פעילות" value="—" icon={ImageIcon} />
      </section>

      <section className="mt-8">
        <h2 className="text-[20px] font-semibold mb-3">חשבונות</h2>
        <div className="bg-white rounded-2xl border border-line shadow-card p-10
          text-center text-ink-500">
          אין עדיין נתונים להצגה. הפעל סנכרון כדי למשוך את החשבונות.
        </div>
      </section>
    </div>
  );
}
