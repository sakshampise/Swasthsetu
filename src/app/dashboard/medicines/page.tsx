"use client";
// @ts-nocheck — hackathon build: logic mirrors the live preview 1:1.
import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Badge } from "@/components/ui";
import { daysLeft, medStatus, buildTransfers } from "@/lib/ai";

export default function Medicines() {
  const { t, T, user, meds, setMeds, showToast, focusCentre, setFocusCentre, centres } = useApp();
  const isAdmin = user.role === "admin";
  const [centre, setCentre] = useState(focusCentre || user.centre || "wakad");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null);
  useEffect(() => () => setFocusCentre(null), []);
  const list = meds.filter((m) => m.centre === centre && m.name.toLowerCase().includes(q.toLowerCase()));
  const transfers = useMemo(() => buildTransfers(meds).filter((r) => r.to === centre), [meds, centre]);
  const cn = (id) => centres.find((c) => c.id === id)?.name || id;

  const save = (form) => {
    if (form.id) setMeds((p) => p.map((m) => (m.id === form.id ? { ...m, ...form, stock: +form.stock, use: +form.use, thr: +form.thr } : m)));
    else setMeds((p) => [...p, { ...form, id: Date.now(), centre, stock: +form.stock, use: +form.use, thr: +form.thr, cat: form.cat || "General" }]);
    setModal(null); showToast(t.saved);
  };
  const approve = (r) => {
    setMeds((p) => p.map((m) => (m.id === r.fromId ? { ...m, stock: m.stock - r.qty } : m.id === r.toId ? { ...m, stock: m.stock + r.qty } : m)));
    showToast(`${t.approved}: ${r.qty} × ${r.med}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {isAdmin && (
          <select value={centre} onChange={(e) => setCentre(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${T.input}`}>
            {centres.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <div className={`flex flex-1 min-w-[180px] items-center gap-2 rounded-xl border px-3 py-2 ${T.input}`}>
          <Search size={14} className="opacity-50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchMeds} className="w-full bg-transparent text-sm outline-none" />
        </div>
        {user.role !== "doctor" && (
          <button onClick={() => setModal({})} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:brightness-110">
            <Plus size={15} /> {t.addMedicine}
          </button>
        )}
      </div>

      {transfers.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-sky-500/25 bg-sky-500/8 p-3.5 anim-fade">
          <div className="rounded-xl bg-sky-500/15 p-2 text-sky-500"><Sparkles size={16} /></div>
          <p className={`flex-1 min-w-[220px] text-[13px] font-medium ${T.head}`}>
            <span className="font-bold text-sky-500">{t.aiSuggestion}:</span> {t.transferUnits} <b>{r.qty} × {r.med}</b> {t.from} {cn(r.from)} ({daysLeft(meds.find((m) => m.id === r.fromId))}d {t.surplusAt}) → {cn(r.to)}
          </p>
          {user.role !== "doctor" && <button onClick={() => approve(r)} className="rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-white hover:brightness-110">{t.approve}</button>}
        </div>
      ))}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead><tr className={`text-[10px] font-bold uppercase tracking-wider ${T.tblHead}`}>
              <th className="px-4 py-3">Medicine</th><th className="px-3 py-3">{t.stock}</th><th className="px-3 py-3">{t.dailyUse}</th><th className="px-3 py-3">{t.expiry}</th><th className="px-3 py-3">AI forecast</th><th className="px-3 py-3">{t.status}</th><th /></tr></thead>
            <tbody>
              {list.map((m) => {
                const d = daysLeft(m); const st = medStatus(m);
                return (
                  <tr key={m.id} className={`border-t border-slate-500/10 ${T.hover}`}>
                    <td className="px-4 py-3"><p className={`font-semibold ${T.head}`}>{m.name}</p><p className={`text-[11px] ${T.sub}`}>{m.cat} · thr {m.thr}</p></td>
                    <td className={`px-3 py-3 font-semibold ${T.head}`}>{m.stock.toLocaleString()}</td>
                    <td className={`px-3 py-3 ${T.sub}`}>{m.use}{t.perDay}</td>
                    <td className={`px-3 py-3 ${new Date(m.exp) < new Date("2026-09-01") ? "font-semibold text-amber-500" : T.sub}`}>{m.exp}</td>
                    <td className="px-3 py-3"><span className={`text-[12px] font-semibold ${d <= 3 ? "text-rose-500" : d <= 7 ? "text-amber-500" : "text-emerald-500"}`}>{d >= 999 ? "—" : `${t.runsOutIn} ${d}d`}</span></td>
                    <td className="px-3 py-3"><Badge kind={st}>{t[st]}</Badge></td>
                    <td className="px-3 py-3">{user.role !== "doctor" && <button onClick={() => setModal(m)} className="text-[11px] font-bold text-teal-500 hover:underline">Edit</button>}</td>
                  </tr>
                );
              })}
              {!list.length && <tr><td colSpan={7} className={`px-4 py-8 text-center text-sm ${T.sub}`}>No medicines match. Add one to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && <MedModal init={modal} onSave={save} onClose={() => setModal(null)} />}
    </div>
  );
}

function MedModal({ init, onSave, onClose }) {
  const { t, T } = useApp();
  const [f, setF] = useState({ name: init.name || "", cat: init.cat || "", stock: init.stock ?? "", use: init.use ?? "", thr: init.thr ?? "", exp: init.exp || "2027-01-01", id: init.id });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fields = [["name", "Medicine"], ["cat", "Category"], ["stock", t.stock], ["use", t.dailyUse + " (units)"], ["thr", "Threshold"], ["exp", t.expiry]];
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-md p-6 anim-fade" onClick={undefined}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className={`font-display text-base font-bold ${T.head}`}>{init.id ? "Edit medicine" : t.addMedicine}</h3>
            <button onClick={onClose} className={T.sub}><X size={17} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(([k, label]) => (
              <div key={k} className={k === "name" ? "col-span-2" : ""}>
                <label className={`text-[10px] font-bold uppercase tracking-wider ${T.sub}`}>{label}</label>
                <input type={k === "exp" ? "date" : ["stock", "use", "thr"].includes(k) ? "number" : "text"} value={f[k]} onChange={set(k)} className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-teal-500 ${T.input}`} />
              </div>
            ))}
          </div>
          <button onClick={() => f.name && onSave(f)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-2.5 font-semibold text-white shadow-lg hover:brightness-110">{t.save}</button>
        </div>
      </Card>
    </div>
  );
}
