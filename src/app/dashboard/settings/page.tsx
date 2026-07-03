"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState } from "react";
import { Sun, Moon, ShieldCheck, Bell, Languages, Globe2 } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const { t, T, lang, setLang, dark, setDark, user, showToast } = useApp();
  const [ch, setCh] = useState({ sms: true, email: true, push: true, whatsapp: false });
  return (
    <div className="max-w-2xl space-y-4">
      <Card className="p-5">
        <SectionTitle icon={Languages}>{t.language}</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {[["en", "English", "A"], ["hi", "हिन्दी", "अ"], ["mr", "मराठी", "आ"]].map(([k, name, g]) => (
            <button key={k} onClick={() => setLang(k)} className={`rounded-2xl border p-4 text-center transition ${lang === k ? "border-teal-500 bg-teal-500/10" : `${T.card} ${T.hover}`}`}>
              <p className="font-display text-2xl font-bold text-teal-500">{g}</p>
              <p className={`mt-1 text-sm font-semibold ${T.head}`}>{name}</p>
            </button>
          ))}
        </div>
        <p className={`mt-3 text-[11px] ${T.sub}`}><Globe2 size={11} className="mr-1 inline" />More languages via Google Cloud Translate API — stub in <code>lib/translate.ts</code>.</p>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={Sun}>{t.theme}</SectionTitle>
        <div className="flex gap-2">
          {[[false, t.light, Sun], [true, t.dark, Moon]].map(([v, label, Icon]) => (
            <button key={label} onClick={() => setDark(v)} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-semibold transition ${dark === v ? "border-teal-500 bg-teal-500/10 text-teal-500" : `${T.card} ${T.hover}`}`}><Icon size={15} /> {label}</button>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={Bell}>{t.notifications}</SectionTitle>
        <div className="space-y-2">
          {Object.entries({ sms: "SMS (critical stock-outs)", email: "Email digest (daily 8 AM)", push: "Push (all alerts)", whatsapp: "WhatsApp (district broadcast)" }).map(([k, label]) => (
            <button key={k} onClick={() => setCh({ ...ch, [k]: !ch[k] })} className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-medium ${T.card} ${T.hover}`}>
              <span className={T.head}>{label}</span>
              <span className={`relative h-5 w-9 rounded-full transition ${ch[k] ? "bg-teal-500" : "bg-slate-400/40"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${ch[k] ? "left-[18px]" : "left-0.5"}`} /></span>
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={ShieldCheck}>{t.profile}</SectionTitle>
        <p className={`text-sm ${T.sub}`}><b className={T.head}>{user.name}</b> · {t[user.role]} · {user.email}</p>
        <p className={`mt-1 text-[11px] ${T.sub}`}>Auth: mock session (Firebase Authentication ready — see <code>lib/firebase.ts</code>).</p>
        <button onClick={() => showToast(t.saved)} className="mt-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110">{t.save}</button>
      </Card>
    </div>
  );
}
