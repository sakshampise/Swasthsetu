"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge, Progress, SectionTitle } from "@/components/ui";
import { DOCTORS0 } from "@/lib/data";

export default function Doctors() {
  const { t, T, user, centres } = useApp();
  const [centre, setCentre] = useState(user.centre || "wakad");
  const list = DOCTORS0.filter((d) => d.centre === centre);
  const c = centres.find((x) => x.id === centre);
  const attData = centres.map((x) => ({ name: x.name.replace(/PHC |CHC /, ""), att: x.att }));
  const stMap = { present: ["healthy", t.present, CheckCircle2], absent: ["critical", t.absent, XCircle], leave: ["low", t.onLeave, CalendarDays] };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {user.role === "admin" && (
          <select value={centre} onChange={(e) => setCentre(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${T.input}`}>
            {centres.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        )}
        <Badge kind={c.att < 60 ? "critical" : c.att < 80 ? "low" : "healthy"}>{t.attendance}: {c.att}%</Badge>
        <span className={`text-xs ${T.sub}`}>{c.docPresent}/{c.docTotal} {t.present.toLowerCase()} · {t.now}</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead><tr className={`text-[10px] font-bold uppercase tracking-wider ${T.tblHead}`}>
              <th className="px-4 py-3">Staff</th><th className="px-3 py-3">{t.shift}</th><th className="px-3 py-3">{t.status}</th><th className="px-3 py-3">30-day %</th></tr></thead>
            <tbody>
              {list.length ? list.map((d) => {
                const [kind, label, Icon] = stMap[d.status];
                return (
                  <tr key={d.id} className={`border-t border-slate-500/10 ${T.hover}`}>
                    <td className="px-4 py-3">
                      <p className={`font-semibold ${T.head}`}>{d.name}</p>
                      <p className={`text-[11px] ${T.sub}`}>{d.role}{d.irregular && <span className="ml-2 font-bold text-rose-500">⚑ {t.irregular}</span>}</p>
                    </td>
                    <td className={`px-3 py-3 ${T.sub}`}>{d.shift}</td>
                    <td className="px-3 py-3"><Badge kind={kind}><Icon size={11} /> {label}</Badge></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="w-16"><Progress pct={d.att} tone={d.att < 60 ? "bg-rose-500" : d.att < 80 ? "bg-amber-500" : "bg-emerald-500"} /></div><span className={`text-xs font-semibold ${d.att < 60 ? "text-rose-500" : T.sub}`}>{d.att}%</span></div></td>
                  </tr>
                );
              }) : <tr><td colSpan={4} className={`px-4 py-8 text-center text-sm ${T.sub}`}>Attendance roster syncs from biometric device — demo data loaded for PHC Wakad, Hadapsar & CHC Baner.</td></tr>}
            </tbody>
          </table>
        </Card>
        <Card className="p-4">
          <SectionTitle icon={BarChart3}>{t.attTrend}</SectionTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attData} layout="vertical" margin={{ left: 4, right: 8 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={84} tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={T.tip} cursor={{ fill: "transparent" }} />
                <Bar dataKey="att" radius={[0, 8, 8, 0]} barSize={12}>
                  {attData.map((d, i) => <Cell key={i} fill={d.att < 60 ? "#f43f5e" : d.att < 80 ? "#f59e0b" : "#10b981"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
