"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, PackageCheck } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge } from "@/components/ui";
import { daysLeft, buildTransfers } from "@/lib/ai";

export default function Redistribution() {
  const { t, T, meds, setMeds, centres, showToast, user } = useApp();
  const [done, setDone] = useState([]);
  const recs = useMemo(() => buildTransfers(meds), [meds]);
  const cn = (id) => centres.find((c) => c.id === id)?.name || id;
  const approve = (r) => {
    setMeds((p) => p.map((m) => (m.id === r.fromId ? { ...m, stock: m.stock - r.qty } : m.id === r.toId ? { ...m, stock: m.stock + r.qty } : m)));
    setDone((d) => [...d, r.id]); showToast(`${t.approved}: ${r.qty} × ${r.med}`);
  };
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className={`text-[13px] leading-relaxed ${T.sub}`}><Sparkles size={13} className="mr-1 inline text-teal-500" />The AI matches centres with <b className="text-rose-500">&lt;7 days</b> of stock to nearby centres holding <b className="text-emerald-500">25+ days</b>, then sizes a 10-day transfer that never drops the donor below safety stock. Approvals write a transfer order (mock <code>transfers</code> table in Supabase schema).</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {recs.map((r, i) => {
          const fm = meds.find((m) => m.id === r.fromId); const tm = meds.find((m) => m.id === r.toId);
          const ok = done.includes(r.id) || daysLeft(tm) > 7;
          return (
            <Card key={r.id} className="p-5 anim-fade" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <p className={`font-display text-sm font-bold ${T.head}`}>{r.med}</p>
                <Badge kind={ok ? "healthy" : "info"}>{ok ? t.approved : `${t.transferUnits} ${r.qty}u`}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t.from}</p>
                  <p className={`text-[13px] font-bold ${T.head}`}>{cn(r.from)}</p>
                  <p className={`text-[11px] ${T.sub}`}>{fm.stock.toLocaleString()}u · {daysLeft(fm)}d cover</p>
                </div>
                <div className="grid place-items-center">
                  <div className={`rounded-full p-2 text-white shadow-lg ${ok ? "bg-emerald-500" : "bg-gradient-to-r from-teal-600 to-sky-500"}`}>{ok ? <PackageCheck size={16} /> : <ArrowRight size={16} />}</div>
                  <p className="mt-1 text-[10px] font-bold text-teal-500">{r.qty}u</p>
                </div>
                <div className="flex-1 rounded-xl border border-rose-500/25 bg-rose-500/8 p-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">{t.to}</p>
                  <p className={`text-[13px] font-bold ${T.head}`}>{cn(r.to)}</p>
                  <p className={`text-[11px] ${T.sub}`}>{tm.stock.toLocaleString()}u · {daysLeft(tm)}d cover</p>
                </div>
              </div>
              {!ok && user.role !== "doctor" && (
                <button onClick={() => approve(r)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:brightness-110">{t.approve}</button>
              )}
            </Card>
          );
        })}
        {!recs.length && <Card className={`p-10 text-center text-sm lg:col-span-2 ${T.sub}`}><PackageCheck size={28} className="mx-auto mb-2 text-emerald-500" />All centres hold 7+ days of stock. No transfers needed right now.</Card>}
      </div>
    </div>
  );
}
