"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Activity, Pill, Users, BedDouble, Stethoscope, FlaskConical, BrainCircuit,
  ArrowRightLeft, BarChart3, Settings, LogOut, Sun, Moon, Bell, Menu,
} from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Logo, LangPicker, Toast } from "@/components/ui";
import { CENTRES } from "@/lib/data";

export const NAV = [
  { key: "dashboard", href: "/dashboard", icon: Activity, roles: ["admin", "manager", "doctor"] },
  { key: "medicines", href: "/dashboard/medicines", icon: Pill, roles: ["admin", "manager", "doctor"] },
  { key: "footfall", href: "/dashboard/footfall", icon: Users, roles: ["admin", "manager", "doctor"] },
  { key: "beds", href: "/dashboard/beds", icon: BedDouble, roles: ["admin", "manager", "doctor"] },
  { key: "doctors", href: "/dashboard/doctors", icon: Stethoscope, roles: ["admin", "manager"] },
  { key: "labs", href: "/dashboard/labs", icon: FlaskConical, roles: ["admin", "manager", "doctor"] },
  { key: "forecast", href: "/dashboard/forecasting", icon: BrainCircuit, roles: ["admin", "manager"] },
  { key: "redistribution", href: "/dashboard/redistribution", icon: ArrowRightLeft, roles: ["admin", "manager"] },
  { key: "reports", href: "/dashboard/reports", icon: BarChart3, roles: ["admin"] },
  { key: "settings", href: "/dashboard/settings", icon: Settings, roles: ["admin", "manager", "doctor"] },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { t, T, user, page, logout, dark, setDark, alerts, setPage } = useApp();
  const [open, setOpen] = useState(false);
  const items = NAV.filter((n) => n.roles.includes(user.role));
  const crit = alerts.filter((a: any) => a.sev === "critical").length;

  const Side = (
    <div className={`flex h-full w-60 flex-col border-r ${T.nav} backdrop-blur-xl`}>
      <div className="px-5 py-5"><Logo /></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {items.map((n) => {
          const active = page === n.key;
          return (
            <Link key={n.key} href={n.href} onClick={() => setOpen(false)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition ${active ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-600/25" : `${T.sub} ${T.hover}`}`}>
              <n.icon size={16} /> <span className="truncate">{t[n.key]}</span>
              {n.key === "forecast" && crit > 0 && <span className={`ml-auto rounded-full px-1.5 text-[10px] font-bold ${active ? "bg-white/25 text-white" : "bg-rose-500 text-white"}`}>{crit}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-inherit p-3">
        <div className={`flex items-center gap-2.5 rounded-xl p-2 ${T.soft}`}>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 text-xs font-bold text-white">{user.name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}</div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-xs font-bold ${T.head}`}>{user.name}</p>
            <p className={`truncate text-[10px] ${T.sub}`}>{t[user.role]}</p>
          </div>
          <button onClick={logout} title={t.logout} className={`${T.sub} hover:text-rose-500`}><LogOut size={15} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${T.app} font-body overflow-hidden`}>
      <div className="grad-mesh pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed -top-40 right-0 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-[130px]" />
      <aside className="hidden lg:block">{Side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">{Side}</div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex items-center gap-3 border-b px-4 py-3 sm:px-6 ${T.nav} backdrop-blur-xl`}>
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div className="min-w-0">
            <h1 className={`truncate font-display text-base font-bold sm:text-lg ${T.head}`}>{t[page]}</h1>
            <p className={`hidden text-[11px] sm:block ${T.sub}`}>{user.centre ? CENTRES.find((c) => c.id === user.centre)?.name : "Pune District · 10 centres"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPage("forecast")} className={`relative rounded-full border p-2 ${T.card}`}>
              <Bell size={15} />
              {crit > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{crit}</span>}
            </button>
            <LangPicker compact />
            <button onClick={() => setDark(!dark)} className={`rounded-full border p-2 ${T.card}`}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      <Toast />
    </div>
  );
}
