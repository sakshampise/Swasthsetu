"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from "recharts";
import { BarChart3, Sun, Download } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle } from "@/components/ui";
import { daysLeft, occPct, riskScore } from "@/lib/ai";

export default function Reports() {
  const { t, T, meds, centres, showToast } = useApp();
  const risk = centres.map((c) => ({ name: c.name.replace(/PHC |CHC /, ""), score: riskScore(c, meds) })).sort((a, b) => b.score - a.score);
  const occ = centres.map((c) => ({ name: c.name.replace(/PHC |CHC /, ""), occ: occPct(c) }));
  const cover = centres.map((c) => { const my = meds.filter((m) => m.centre === c.id); return { name: c.name.replace(/PHC |CHC /, ""), days: my.length ? Math.round(my.reduce((s, m) => s + Math.min(60, daysLeft(m)), 0) / my.length) : 30 }; });
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({ d, opd: Math.round(1900 + 420 * sRand(i + 2)), em: Math.round(120 + 60 * sRand(i + 9)) }));
  const testPie = [{ name: t.availableTests, v: centres.reduce((s, c) => s + c.testsOk, 0) }, { name: t.unavailableTests, v: centres.reduce((s, c) => s + c.testsTotal - c.testsOk, 0) }];
  const ChartCard = ({ title, children }) => (<Card className="p-4"><SectionTitle icon={BarChart3}>{title}</SectionTitle><div className="h-56">{children}</div></Card>);
  const ax = { tick: { fill: T.axis, fontSize: 10 }, axisLine: false, tickLine: false };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => showToast("swasthsetu-report.csv exported")} className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold ${T.card} ${T.hover}`}><Download size={14} /> {t.exportCsv}</button>
        <button onClick={() => showToast("District PDF queued — check email")} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:brightness-110"><Download size={14} /> {t.exportPdf}</button>
        <span className={`ml-auto self-center text-[11px] ${T.sub}`}>Looker Studio-style board · auto-refresh 60s</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t.riskByCentre}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={risk}><CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...ax} interval={0} angle={-28} height={52} textAnchor="end" /><YAxis {...ax} width={32} domain={[0, 100]} />
              <Tooltip contentStyle={T.tip} cursor={{ fill: "transparent" }} />
              <Bar dataKey="score" name="AI risk" radius={[6, 6, 0, 0]}>{risk.map((r, i) => <Cell key={i} fill={r.score >= 70 ? "#f43f5e" : r.score >= 45 ? "#f59e0b" : "#10b981"} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t.stockTrend}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cover}><CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...ax} interval={0} angle={-28} height={52} textAnchor="end" /><YAxis {...ax} width={32} />
              <Tooltip contentStyle={T.tip} cursor={{ fill: "transparent" }} />
              <Bar dataKey="days" name="Avg days of stock" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t.weeklyOpd}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={week}>
              <defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" {...ax} /><YAxis {...ax} width={40} /><Tooltip contentStyle={T.tip} /><Legend />
              <Area type="monotone" dataKey="opd" name="OPD" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gW)" />
              <Area type="monotone" dataKey="em" name={t.emergencies} stroke="#f43f5e" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={`${t.bedOcc} · ${t.testAvail}`}>
          <div className="grid h-full grid-cols-2 gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occ} layout="vertical" margin={{ right: 6 }}>
                <XAxis type="number" hide domain={[0, 100]} /><YAxis type="category" dataKey="name" width={70} {...ax} />
                <Tooltip contentStyle={T.tip} cursor={{ fill: "transparent" }} />
                <Bar dataKey="occ" name={t.occupancy} radius={[0, 6, 6, 0]} barSize={9}>{occ.map((o, i) => <Cell key={i} fill={o.occ >= 88 ? "#f43f5e" : o.occ >= 70 ? "#f59e0b" : "#10b981"} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={testPie} dataKey="v" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={3}>
                  <Cell fill="#10b981" /><Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={T.tip} /><Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
