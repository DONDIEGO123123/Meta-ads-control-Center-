import type { LucideIcon } from "lucide-react";

export default function ComingSoon({
  icon: Icon, note,
}: { icon: LucideIcon; note: string }) {
  return (
    <div className="bg-white rounded-2xl border border-line shadow-card p-12
      flex flex-col items-center text-center">
      <span className="p-3 rounded-2xl bg-surface-muted text-ink-500 mb-4">
        <Icon size={24} />
      </span>
      <div className="font-semibold text-[16px] mb-1">בהקמה</div>
      <p className="text-ink-500 text-[14px] max-w-md">{note}</p>
    </div>
  );
}
