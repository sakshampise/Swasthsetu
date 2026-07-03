"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React from "react";
import { Users, BedDouble, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge, Progress, Stat } from "@/components/ui";
import { occPct } from "@/lib/ai";

export default function Beds() {
  const { t, T, user, centres } = useApp();
  const scope = user.role === "admin" ? centres : centres.filter((c) => c.id === user.centre);
  const nearest = (c) => centres.filter((x) => x.id !== c.id && occPct(x) < 70).sort((a, b) => occPct(a) - occPct(b))[0];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat i={0} icon={BedDouble} label={t.totalBeds} value={scope.reduce((s, c) => s + c.beds, 0)} tone="teal" />
        <Stat i={1} icon={Users} label={t.occupied} value={scope.reduce((s, c) => s + c.occupied, 0)} tone="amber" />
        <Stat i={2} icon={CheckCircle2} label={t.available} value={scope.reduce((s, c) => s + (c.beds - c.occupied), 0)} tone="emerald" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {scope.map((c, i) => {
          const pct = occPct(c); const ref = pct >= 85 ? nearest(c) : null;
          return (
            <Card key={c.id} className="p-4 anim-fade" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center justify-between">
                <div><p className={`font-display text-sm font-bold ${T.head}`}>{c.name}</p><p className={`text-[11px] ${T.sub}`}>{c.area} · {c.beds} {t.beds_s}</p></div>
                <Badge kind={pct >= 88 ? "critical" : pct >= 70 ? "low" : "healthy"}>{pct}% {t.occupancy.toLowerCase()}</Badge>
              </div>
              <div className="mt-3"><Progress pct={pct} /></div>
              <div className={`mt-2 flex justify-between text-[11px] ${T.sub}`}>
                <span>{c.occupied} {t.occupied.toLowerCase()}</span><span className="font-semibold text-emerald-500">{c.beds - c.occupied} {t.available.toLowerCase()}</span>
              </div>
              {ref && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/8 p-2.5 text-[12px] font-medium text-rose-500">
                  <ArrowRightLeft size={13} className="shrink-0" /> {t.referral} <b>{ref.name}</b> ({ref.beds - ref.occupied} {t.available.toLowerCase()})
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
