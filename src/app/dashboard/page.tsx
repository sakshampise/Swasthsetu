"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BedDouble, Stethoscope, FlaskConical, AlertTriangle, TrendingUp, Building2, Bell, Siren } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge, Progress, Stat, SectionTitle } from "@/components/ui";
import { medStatus, occPct, riskScore, footfallSeries } from "@/lib/ai";
import { CENTRES } from "@/lib/data";
import { SEV } from "@/lib/theme";

export default function Dashboard() {
  const { t, T, user, meds, alerts, setPage, setFocusCentre } = useApp();
  const isAdmin = user.role === "admin";
  const scope = isAdmin ? CENTRES : CENTRES.filter((c) => c.id === user.centre);
  const critMeds = meds.filter((m) => medStatus(m) === "critical" && (isAdmin || m.centre === user.centre)).length;
  const beds = scope.reduce((s, c) => s + (c.beds - c.occupied), 0);
  const load = scope.reduce((s, c) => s + c.opd + c.emergency, 0);
  const att = Math.round(scope.reduce((s, c) => s + c.att, 0) / scope.length);
  const tests = Math.round((scope.reduce((s, c) => s + c.testsOk, 0) / scope.reduce((s, c) => s + c.testsTotal, 0)) * 100);
  const flagged = CENTRES.map((c) => ({ ...c, risk: riskScore(c, meds) })).filter((c) => c.risk >= 55).sort((a, b) => b.risk - a.risk);

  const district = useMemo(() => {
    const series = scope.map((c) => footfallSeries(c));
    return series[0].map((_, i) => ({
      d: series[0][i].d,
      opd: series.some((s) => s[i].opd != null) ? series.reduce((sum, s) => sum + (s[i].opd || 0), 0) : undefined,
      forecast: series.some((s) => s[i].forecast != null) ? series.reduce((sum, s) => sum + (s[i].forecast || 0), 0) : undefined,
    }));
  }, [user.centre]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {isAdmin && <Stat i={0} icon={Building2} label={t.totalCentres} value={CENTRES.length} sub="5 PHC · 5 CHC" tone="teal" />}
        <Stat i={1} icon={Siren} label={t.criticalAlerts} value={alerts.filter((a) => a.sev === "critical").length} sub={`${critMeds} ${t.medicines.toLowerCase()}`} tone="rose" />
        <Stat i={2} icon={BedDouble} label={t.availableBeds} value={beds} sub={`${scope.reduce((s, c) => s + c.beds, 0)} ${t.totalBeds.toLowerCase()}`} tone="sky" />
        <Stat i={3} icon={Users} label={t.patientLoad} value={load.toLocaleString()} sub={`${scope.reduce((s, c) => s + c.emergency, 0)} ${t.emergencies.toLowerCase()}`} tone="violet" />
        <Stat i={4} icon={Stethoscope} label={t.attendance} value={`${att}%`} sub={att < 75 ? "⚠ below target" : "on target"} tone={att < 75 ? "amber" : "emerald"} />
        <Stat i={5} icon={FlaskConical} label={t.testAvail} value={`${tests}%`} tone="teal" />
        {isAdmin && <Stat i={6} icon={AlertTriangle} label={t.intervention} value={flagged.length} sub={flagged[0]?.name} tone="amber" />}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-4 xl:col-span-2">
          <SectionTitle icon={TrendingUp}>{t.footfallTrend}</SectionTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={district}>
                <defs>
                  <linearGradient id="gOpd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} /><stop offset="100%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke={T.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={T.tip} />
                <Area type="monotone" dataKey="opd" name="OPD" stroke="#14b8a6" strokeWidth={2.5} fill="url(#gOpd)" />
                <Area type="monotone" dataKey="forecast" name="AI forecast" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" fill="url(#gFc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle icon={Bell} right={<button onClick={() => setPage("forecast")} className="text-[11px] font-bold text-teal-500 hover:underline">{t.forecast} →</button>}>{t.liveAlerts}</SectionTitle>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {alerts.slice(0, 7).map((a, i) => {
              const s = SEV[a.sev];
              return (
                <div key={i} className={`flex items-start gap-2.5 rounded-xl border p-2.5 ${s.chip}`}>
                  <s.Icon size={14} className="mt-0.5 shrink-0" />
                  <p className="text-[12px] font-medium leading-snug">{a.txt}</p>
                  <span className="ml-auto shrink-0 text-[10px] opacity-70">{a.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {isAdmin && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-4 xl:col-span-2">
            <SectionTitle icon={Building2}>{t.centresTable}</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[13px]">
                <thead><tr className={`text-[10px] font-bold uppercase tracking-wider ${T.tblHead}`}>
                  <th className="pb-2">Centre</th><th className="pb-2">{t.occupancy}</th><th className="pb-2">{t.attendance}</th><th className="pb-2">{t.patientLoad}</th><th className="pb-2">Risk</th><th /></tr></thead>
                <tbody>
                  {CENTRES.map((c) => {
                    const r = riskScore(c, meds);
                    return (
                      <tr key={c.id} className={`border-t border-slate-500/10 ${T.hover}`}>
                        <td className="py-2.5 pr-3"><p className={`font-semibold ${T.head}`}>{c.name}</p><p className={`text-[11px] ${T.sub}`}>{c.area}</p></td>
                        <td className="py-2.5 pr-3"><div className="flex items-center gap-2"><div className="w-16"><Progress pct={occPct(c)} /></div><span className={T.sub}>{occPct(c)}%</span></div></td>
                        <td className="py-2.5 pr-3"><Badge kind={c.att < 60 ? "critical" : c.att < 80 ? "low" : "healthy"}>{c.att}%</Badge></td>
                        <td className={`py-2.5 pr-3 ${T.sub}`}>{c.opd + c.emergency}</td>
                        <td className="py-2.5 pr-3"><Badge kind={r >= 70 ? "critical" : r >= 45 ? "low" : "healthy"}>{r}</Badge></td>
                        <td className="py-2.5"><button onClick={() => { setFocusCentre(c.id); setPage("medicines"); }} className="text-[11px] font-bold text-teal-500 hover:underline">{t.viewCentre}</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="p-4">
            <SectionTitle icon={AlertTriangle}>{t.interventionList}</SectionTitle>
            <div className="space-y-2.5">
              {flagged.map((c) => (
                <div key={c.id} className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-[13px] font-bold ${T.head}`}>{c.name}</p>
                    <Badge kind={c.risk >= 70 ? "critical" : "low"}>risk {c.risk}</Badge>
                  </div>
                  <p className={`mt-1 text-[11px] leading-snug ${T.sub}`}>
                    {occPct(c) >= 85 && `${occPct(c)}% ${t.occupancy.toLowerCase()} · `}
                    {c.att < 75 && `${t.attendance.toLowerCase()} ${c.att}% · `}
                    {meds.filter((m) => m.centre === c.id && medStatus(m) !== "healthy").length} stock issues
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
