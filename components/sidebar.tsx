"use client";

import { useState } from "react";
import Link from "next/link";
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
  return (
    <aside
      className={`${open ? "w-64" : "w-[76px]"} shrink-0 bg-white border-l border-line
        transition-all duration-300 sticky top-0 h-screen p-3 flex flex-col`}
    >
      <div className="flex items-center justify-between px-2 h-12">
        {open && <span className="font-bold text-[15px]">Control Center</span>}
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-surface-muted text-ink-500"
          aria-label="toggle sidebar"
        >
          {open ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700
              hover:bg-surface-muted hover:text-ink-900 transition-colors"
          >
            <Icon size={19} className="shrink-0 text-ink-500" />
            {open && <span className="text-[14px] font-medium">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
