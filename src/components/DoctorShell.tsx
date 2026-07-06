"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Users,
  Stethoscope,
  Calendar,
  BrainCircuit,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Logo, LangPicker, Toast } from "@/components/ui";

// Navigation configuration for the doctor portal.
const NAV_ITEMS = [
  { key: "dashboard", href: "/doctor", icon: Activity, label: "Dashboard" },
  { key: "patients", href: "/doctor/patients", icon: Users, label: "Patient Queue" },
  { key: "consultation", href: "/doctor/consultation", icon: Stethoscope, label: "Consultation" },
  { key: "schedule", href: "/doctor/schedule", icon: Calendar, label: "Schedule" },
  { key: "assistant", href: "/doctor/assistant", icon: BrainCircuit, label: "AI Assistant" },
  { key: "settings", href: "/doctor/settings", icon: Settings, label: "Settings" },
];

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const { user, dark, setDark, logout } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeKey = NAV_ITEMS.find((n) => pathname === n.href)?.key;

  const Side = (
    <div className="flex h-full w-60 flex-col border-r bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="px-5 py-5"><Logo /></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map((n) => {
          const active = activeKey === n.key;
          return (
            <Link key={n.key} href={n.href} onClick={() => setOpen(false)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition ${
                active ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-600/25"
                       : "text-slate-600 dark:text-slate-300 hover:bg-teal-500/10 dark:hover:bg-teal-500/10"
              }`}>
              <n.icon size={16} />
              <span className="truncate">{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-inherit p-3">
        <div className="flex items-center gap-2.5 rounded-xl p-2 bg-white/50 dark:bg-slate-800/50">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 text-xs font-bold text-white">
            {user?.name?.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Doctor</p>
          </div>
          <button onClick={logout} title="Log out" className="text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-500">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 font-body overflow-hidden">
      <aside className="hidden lg:block">{Side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">{Side}</div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-white/70 dark:bg-slate-900/70 px-4 py-3 sm:px-6 backdrop-blur-xl">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold sm:text-lg text-slate-800 dark:text-slate-200">
              {NAV_ITEMS.find((n) => n.key === activeKey)?.label || "Doctor Portal"}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LangPicker compact />
            <button onClick={() => setDark(!dark)} className="rounded-full border p-2 border-teal-500/30 bg-teal-500/5">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      <Toast />
    </div>
  );
}