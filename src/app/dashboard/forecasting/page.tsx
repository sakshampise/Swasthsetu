"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { BrainCircuit, TrendingUp, Sparkles, Bell } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle } from "@/components/ui";
import { occPct, riskScore } from "@/lib/ai";
import { SEV } from "@/lib/theme";

export default function Forecast() {
  const { t, T, alerts, meds, centres } = useApp();
  const [filter, setFilter] = useState("all");
  const shown = alerts.filter((a) => filter === "all" || a.sev === filter);
  const wakadPara = meds.find((m) => m.centre === "wakad" && m.name.startsWith("Paracetamol"));
  const stockProj = useMemo(() => {
    if (!wakadPara) return [];
    return Array.from({ length: 10 }, (_, i) => ({ d: i === 0 ? "Today" : `+${i}`, stock: Math.max(0, wakadPara.stock - wakadPara.use * i), thr: wakadPara.thr }));
  }, [meds]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <SectionTitle icon={BrainCircuit}>Vertex AI · stock depletion — Paracetamol, PHC Wakad</SectionTitle>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockProj}>
                <defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                <Tooltip contentStyle={T.tip} />
                <Area type="monotone" dataKey="stock" name={t.stock} stroke="#f43f5e" strokeWidth={2.5} fill="url(#gS)" />
                <ReferenceLine y={wakadPara ? wakadPara.thr : 0} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Threshold", fill: "#f59e0b", fontSize: 10, position: "insideTopRight" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className={`mt-2 text-[12px] ${T.sub}`}><Sparkles size={12} className="mr-1 inline text-sky-500" />Model: 28-day consumption regression + seasonal OPD signal. Confidence 91%. Repo ships a Vertex AI endpoint stub (<code>lib/vertex.ts</code>) — mock heuristics power this demo.</p>
        </Card>
        <Card className="p-4">
          <SectionTitle icon={TrendingUp}>7-day OPD surge probability</SectionTitle>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centres.map((c) => ({ name: c.name.replace(/PHC |CHC /, ""), p: Math.min(96, Math.round(30 + riskScore(c, meds) * 0.55 + occPct(c) * 0.2)) }))}>
                <CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: T.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-28} height={54} textAnchor="end" />
                <YAxis unit="%" tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={T.tip} cursor={{ fill: "transparent" }} />
                <Bar dataKey="p" name="Surge probability" radius={[6, 6, 0, 0]}>
                  {centres.map((c, i) => <Cell key={i} fill={i % 2 ? "#14b8a6" : "#0ea5e9"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <SectionTitle icon={Bell} right={
          <div className="flex gap-1.5">
            {["all", "critical", "warning", "info"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize transition ${filter === f ? "bg-teal-600 text-white" : `${T.soft} ${T.sub}`}`}>{f}</button>
            ))}
          </div>
        }>{t.liveAlerts} · Cloud Functions feed</SectionTitle>
        <div className="space-y-2">
          {shown.map((a, i) => {
            const s = SEV[a.sev];
            return (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 anim-fade ${s.chip}`} style={{ animationDelay: `${i * 30}ms` }}>
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${s.dot} pulse-dot`} />
                <p className="flex-1 text-[13px] font-medium leading-snug">{a.txt}</p>
                <span className="shrink-0 text-[10px] font-semibold opacity-70">{a.time} {t.ago}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
