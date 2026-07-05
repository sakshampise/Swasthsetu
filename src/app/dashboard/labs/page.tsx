"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge, Progress } from "@/components/ui";
import { TESTS0 } from "@/lib/data";

export default function Labs() {
  const { t, T, user, centres } = useApp();
  const [centre, setCentre] = useState(user.centre || "wakad");
  const list = TESTS0.filter((x) => x.centre === centre);
  const c = centres.find((x) => x.id === centre);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {user.role === "admin" && (
          <select aria-label="Health centre" value={centre} onChange={(e) => setCentre(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${T.input}`}>
            {centres.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        )}
        <Badge kind="healthy">{t.availableTests}: {c.testsOk}</Badge>
        <Badge kind="critical">{t.unavailableTests}: {c.testsTotal - c.testsOk}</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.length ? list.map((x, i) => (
          <Card key={x.id} className="p-4 anim-fade" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-center justify-between">
              <p className={`font-display text-sm font-bold ${T.head}`}>{x.name}</p>
              <Badge kind={x.avail ? "healthy" : "critical"}>{x.avail ? t.availableTests : t.unavailableTests}</Badge>
            </div>
            <div className={`mt-3 grid grid-cols-3 gap-2 text-[11px] ${T.sub}`}>
              <div><p className="font-bold uppercase tracking-wider text-[9px]">{t.machine}</p><p className={`mt-0.5 font-semibold ${x.machine.includes("Down") ? "text-rose-500" : x.machine.includes("due") ? "text-amber-500" : "text-emerald-500"}`}>{x.machine}</p></div>
              <div><p className="font-bold uppercase tracking-wider text-[9px]">{t.reagent}</p><div className="mt-1.5"><Progress pct={x.reagent} tone={x.reagent < 20 ? "bg-rose-500" : x.reagent < 45 ? "bg-amber-500" : "bg-emerald-500"} /></div><p className="mt-0.5">{x.reagent}%</p></div>
              <div><p className="font-bold uppercase tracking-wider text-[9px]">{t.audits}</p><p className="mt-0.5 font-semibold">{x.last} {t.ago}</p></div>
            </div>
            {!x.avail && <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/8 p-2 text-[11px] font-medium text-amber-600"><Sparkles size={11} className="mr-1 inline" />{t.aiSuggestion}: {x.reagent < 20 ? "reorder reagents — 4-day lead time via district store" : "raise service ticket; route samples to nearest CHC meanwhile"}</p>}
          </Card>
        )) : <Card className={`p-8 text-center text-sm md:col-span-2 ${T.sub}`}>Lab audits sync nightly — demo data loaded for PHC Wakad, Hadapsar, CHC Baner & Shivajinagar.</Card>}
      </div>
    </div>
  );
}
