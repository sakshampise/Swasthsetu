"use client";
import React, { useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppProvider";

export const Card = ({ children, className = "", style }: any) => {
  const { T } = useApp();
  return <div style={style} className={`min-w-0 rounded-2xl border backdrop-blur-xl ${T.card} ${className}`}>{children}</div>;
};

export const Badge = ({ kind, children }: any) => {
  const map: any = {
    critical: "bg-rose-500/12 text-rose-500 border-rose-500/25",
    low: "bg-amber-500/12 text-amber-600 border-amber-500/25",
    healthy: "bg-emerald-500/12 text-emerald-600 border-emerald-500/25",
    info: "bg-sky-500/12 text-sky-600 border-sky-500/25",
    neutral: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[kind] || map.neutral}`}>{children}</span>;
};

export const Progress = ({ pct, tone }: any) => (
  <div className="h-2 w-full rounded-full bg-slate-400/15 overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-700 ${tone || (pct >= 88 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500")}`} style={{ width: `${Math.min(100, pct)}%` }} />
  </div>
);

export const Stat = ({ icon: Icon, label, value, sub, tone = "teal", i = 0 }: any) => {
  const { T } = useApp();
  const tones: any = {
    teal: "from-teal-500 to-emerald-500", rose: "from-rose-500 to-orange-500",
    sky: "from-sky-500 to-cyan-500", amber: "from-amber-500 to-orange-400",
    violet: "from-violet-500 to-fuchsia-500", emerald: "from-emerald-500 to-lime-500",
  };
  return (
    <Card className="p-4 animate-fade" style={{ animationDelay: `${i * 60}ms` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${T.sub}`}>{label}</p>
          <p className={`mt-1 font-display text-2xl font-bold ${T.head}`}>{value}</p>
          {sub && <p className={`mt-0.5 text-xs ${T.sub}`}>{sub}</p>}
        </div>
        <div className={`shrink-0 rounded-xl bg-gradient-to-br ${tones[tone]} p-2.5 text-white shadow-lg`}><Icon size={18} /></div>
      </div>
    </Card>
  );
};

export const SectionTitle = ({ icon: Icon, children, right }: any) => {
  const { T } = useApp();
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h3 className={`flex items-center gap-2 font-display text-sm font-bold ${T.head}`}>
        {Icon && <Icon size={16} className="text-teal-500" />}{children}
      </h3>
      {right}
    </div>
  );
};

export const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 animate-fade">
      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/95 px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur">
        <CheckCircle2 size={16} /> {toast}
      </div>
    </div>
  );
};

export const Logo = ({ small }: any) => {
  const { T } = useApp();
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-600/30"><Activity size={18} /></div>
      {!small && (
        <div className="leading-tight">
          <p className={`font-display text-[15px] font-extrabold tracking-tight ${T.head}`}>SwasthSetu <span className="text-teal-500">AI</span></p>
          <p className={`text-[10px] font-medium ${T.sub}`}>स्वास्थ्य सेतु · आरोग्य सेतू</p>
        </div>
      )}
    </div>
  );
};

export const LangPicker = ({ compact }: any) => {
  const { lang, setLang } = useApp();
  return (
    <div className={`flex rounded-full border border-teal-500/20 bg-teal-500/5 p-0.5 ${compact ? "text-[11px]" : "text-xs"}`}>
      {[["en", "EN"], ["hi", "हि"], ["mr", "मर"]].map(([k, l]) => (
        <button key={k} onClick={() => setLang(k)} className={`rounded-full px-2.5 py-1 font-bold transition ${lang === k ? "bg-teal-600 text-white shadow" : "text-teal-600 hover:bg-teal-500/10"}`}>{l}</button>
      ))}
    </div>
  );
};
