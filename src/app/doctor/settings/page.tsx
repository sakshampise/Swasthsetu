"use client";

import React from "react";
import { Card, SectionTitle } from "@/components/ui";
import { useApp } from "@/context/AppProvider";
import { Sun, Moon, Languages, UserCircle } from "lucide-react";

/**
 * Settings page for doctors. Allows changing language and theme and
 * displays basic profile information. This is a simplified version
 * of the admin settings page tailored for individual practitioners.
 */
export default function DoctorSettingsPage() {
  const { lang, setLang, dark, setDark, user, showToast } = useApp();
  return (
    <div className="max-w-2xl space-y-4">
      {/* Language selection */}
      <Card className="p-5">
        <SectionTitle icon={Languages}>Language</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["en", "English", "A"],
            ["hi", "हिन्दी", "अ"],
            ["mr", "मराठी", "आ"],
          ].map(([k, name, glyph]) => (
            <button
              key={k}
              onClick={() => setLang(k as any)}
              className={`rounded-2xl border p-4 text-center transition ${
                lang === k
                  ? "border-teal-500 bg-teal-500/10"
                  : "bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
              }`}
            >
              <p className="font-display text-2xl font-bold text-teal-500">
                {glyph}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {name}
              </p>
            </button>
          ))}
        </div>
      </Card>
      {/* Theme selection */}
      <Card className="p-5">
        <SectionTitle icon={Sun}>Theme</SectionTitle>
        <div className="flex gap-2">
          {[false, true].map((v) => {
            const Icon = v ? Moon : Sun;
            const label = v ? "Dark" : "Light";
            return (
              <button
                key={label}
                onClick={() => setDark(v)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-semibold transition ${
                  dark === v
                    ? "border-teal-500 bg-teal-500/10 text-teal-600"
                    : "bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:bg-teal-500/5 dark:hover:bg-teal-500/10 text-slate-800 dark:text-slate-200"
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            );
          })}
        </div>
      </Card>
      {/* Profile information */}
      <Card className="p-5">
        <SectionTitle icon={UserCircle}>Profile</SectionTitle>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {user.name}
          </span>
          {" "}· Doctor · {user.email}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          You are logged in using a demo account. Authentication via
          Firebase/Supabase will be added later.
        </p>
        <button
          onClick={() => showToast("Settings saved")}
          className="mt-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110"
        >
          Save Changes
        </button>
      </Card>
    </div>
  );
}