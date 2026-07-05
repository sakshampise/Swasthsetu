"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, BrainCircuit, TrendingUp, Clock, Siren, Zap } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Stat, SectionTitle } from "@/components/ui";
import { footfallSeries } from "@/lib/ai";

export default function Footfall() {
  const { t, T, user, centres } = useApp();
  const [centre, setCentre] = useState(user.centre || "pimpri");
  const c = centres.find((x) => x.id === centre);
  const data = useMemo(() => footfallSeries(c), [centre]);
  const peak = Math.max(...data.filter((d) => d.forecast).map((d) => d.forecast));
  const loadPct = Math.min(100, Math.round(((c.opd + c.emergency) / (c.beds * 6)) * 100));
  return (
    <div className="space-y-4">
      {user.role === "admin" ? (
        <select aria-label="Health centre" value={centre} onChange={(e) => setCentre(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${T.input}`}>
          {centres.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      ) : <p className={`text-sm font-semibold ${T.head}`}>{t.myCentre}: {c.name}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat i={0} icon={Users} label={t.opdToday} value={c.opd} tone="teal" />
        <Stat i={1} icon={Siren} label={t.emergencies} value={c.emergency} tone="rose" />
        <Stat i={2} icon={Clock} label={t.queueLoad} value={`${loadPct}%`} sub={loadPct >= 75 ? "High" : loadPct >= 45 ? "Moderate" : "Normal"} tone={loadPct >= 75 ? "amber" : "emerald"} />
        <Stat i={3} icon={BrainCircuit} label={t.next7} value={`~${peak}`} sub="peak day" tone="violet" />
      </div>

      {peak > c.opd * 1.08 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-600 anim-fade">
          <Zap size={17} /><p className="text-[13px] font-semibold">{t.peakWarning}: ~{peak} OPD (+{Math.round((peak / c.opd - 1) * 100)}%) — pre-position staff & fast-moving medicines.</p>
        </div>
      )}

      <Card className="p-4">
        <SectionTitle icon={TrendingUp}>{c.name} — {t.footfallTrend}</SectionTitle>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={T.tip} /><Legend />
              <Line type="monotone" dataKey="opd" name="OPD" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="em" name={t.emergencies} stroke="#f43f5e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="forecast" name="AI forecast" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
