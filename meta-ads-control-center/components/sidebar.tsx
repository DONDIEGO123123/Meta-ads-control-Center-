"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Wallet, Megaphone, Layers, Image as ImageIcon,
  Coins, Zap, CalendarClock, FileBarChart, History, Bell, Settings,
  PanelRightClose, PanelRightOpen,
} from "lucide-react";

const items = [
  { href: "/", label: "דשבורד", icon: LayoutDashboard },
  { href: "/accounts", label: "חשבונות", icon: Wallet },
  { href: "/campaigns", label: "קמפיינים", icon: Megaphone },
  { href: "/adsets", label: "Ad Sets", icon: Layers },
  { href: "/ads", label: "מודעות", icon: ImageIcon },
  { href: "/budget", label: "ניהול תקציב", icon: Coins },
  { href: "/automation", label: "אוטומציה", icon: Zap },
  { href: "/scheduler", label: "תזמון", icon: CalendarClock },
  { href: "/reports", label: "דוחות", icon: FileBarChart },
  { href: "/activity", label: "יומן פעילות", icon: History },
  { href: "/alerts", label: "התראות", icon: Bell },
  { href: "/settings", label: "הגדרות", icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${open ? "w-64" : "w-[76px]"} shrink-0 bg-white/80 backdrop-blur
        border-l border-line transition-all duration-300 sticky top-0 h-screen p-3 flex flex-col`}
    >
      <div className="flex items-center justify-between px-2 h-14">
        {open && (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-fade shadow-lux" />
            <span className="font-bold text-[15px] tracking-tight">Control Center</span>
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-surface-muted text-ink-500"
          aria-label="toggle sidebar"
        >
          {open ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>

      <nav className="mt-3 flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors
                ${active
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-ink-700 hover:bg-surface-muted hover:text-ink-900"}`}
            >
              <Icon size={19} className={`shrink-0 ${active ? "text-brand-blue" : "text-ink-500"}`} />
              {open && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {open && (
        <div className="mt-auto px-3 py-3 text-[11px] text-ink-500">
          Meta Ads Control Center
        </div>
      )}
    </aside>
  );
}
