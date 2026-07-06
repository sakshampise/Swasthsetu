"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Progress } from "@/components/ui";
import { MEDS0 } from "@/lib/data";
import { Pill, Search, ShoppingBag } from "lucide-react";

/**
 * Pharmacy page. Provides a searchable list of medicines stocked at
 * the centre and allows dispensing (simulated by decrementing local
 * state). This demo illustrates how inventory and dispensing could
 * integrate; actual implementations should validate stock and log
 * transactions in the backend.
 */
export default function PHCPharmacyPage() {
  const { user, showToast } = useApp();
  const centreId = user?.centre;
  // Local copy of medicines for dispensing simulation
  const initial = useMemo(() => MEDS0.filter((m) => m.centre === centreId), [centreId]);
  const [meds, setMeds] = useState(initial);
  const [search, setSearch] = useState("");

  const handleDispense = (id: number) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, m.stock - 1) } : m))
    );
    showToast("Medicine dispensed (simulation)");
  };

  const filtered = meds.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={ShoppingBag}>Pharmacy</SectionTitle>
        <div className="mb-3 flex items-center gap-2">
          <Search size={16} className="text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine…"
            className="flex-1 rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
          />
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No medicines match your search.
          </p>
        )}
        <ul className="space-y-2">
          {filtered.map((m) => {
            const pct = Math.min(100, Math.round((m.stock / m.thr) * 100));
            const tone = pct < 50 ? "amber" : pct < 75 ? "info" : "healthy";
            return (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {m.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Stock: {m.stock}
                  </p>
                  <div className="mt-1 w-32">
                    <Progress pct={pct} tone={tone} />
                  </div>
                </div>
                <button
                  onClick={() => handleDispense(m.id)}
                  disabled={m.stock === 0}
                  className={`ml-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow transition ${
                    m.stock === 0
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                  }`}
                >
                  Dispense
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}